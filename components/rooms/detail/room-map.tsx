import React, { useEffect, useState } from "react";
import { Circle, Group, Image, Layer, Stage, Text } from "react-konva";
import { Room } from "@/types/room";
import useImage from "use-image";
import { getDatabase, onValue, ref, set } from "@firebase/database";
import { RoomAction } from "@/actions/rooms";
import firebase from "@/lib/firebase";
import { locate } from "@/lib/beacon";

const database = getDatabase(firebase);

const MapBackground = ({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
}) => {
  const [image] = useImage(url);
  return (
    <Image image={image} alt="map-background" width={width} height={height} />
  );
};

const RoomMap = ({ room }: { room: Room }) => {
  const [withMap, setWithMap] = useState(room.width);
  const [heightMap, setHeightMap] = useState(room.height);

  const [stations, setStations] = useState<any[]>([]);
  const [stationsRaw, setStationsRaw] = useState<any>({});
  const [tags, setTags] = useState<any[]>([]);
  const [pxMeter, setPxMeter] = useState(0);

  // Calculate the width and height of the map to fit the div id "room-map"
  useEffect(() => {
    const roomMapDom = document.getElementById("room-map");
    const width = room.width;
    const height = room.height;
    const screenWidth = roomMapDom?.clientWidth || 0;
    const screenHeight = roomMapDom?.clientHeight || 0;
    const aspectRatio = width / height;
    if (aspectRatio > 1) {
      setWithMap(screenWidth);
      setHeightMap(screenWidth / aspectRatio);
    } else {
      setWithMap(screenHeight * aspectRatio);
      setHeightMap(screenHeight);
    }
    setPxMeter(screenWidth / width);
  }, [room.map, room.width, room.height]);

  // Get stations by room id from Realtime Database
  useEffect(() => {
    const roomAction = new RoomAction();
    // Check if user has permission to access the room
    roomAction.getRoom(room.id).then();
    onValue(ref(database, "rooms/" + room.id + "/stations"), (snapshot) => {
      // return new data of stations just get position
      const data = snapshot.val();
      if (data) {
        setStationsRaw(data);
        const stations = Object.keys(data).map((key) => {
          return {
            id: key,
            name: snapshot.val()[key].name || "",
            x: snapshot.val()[key].position?.x || 0,
            y: snapshot.val()[key].position?.y || 0,
          };
        });
        setStations(stations);
      }
    });
  }, [room.id]);

  useEffect(() => {
    onValue(ref(database, "rooms/" + room.id + "/tags"), (snapshot) => {
      // return new data of stations just get position
      const data = snapshot.val();
      if (data) {
        const tags = Object.keys(data).map((key) => {
          return {
            id: key,
            name: snapshot.val()[key].name || "",
            stations: snapshot.val()[key].stations || [],
          };
        });
        setTags(tags);
      }
    });
  }, []);

  return (
    <div
      className="flex h-[calc(100vh-226px)] w-full flex-col items-center justify-center"
      id="room-map"
    >
      <Stage width={withMap} height={heightMap}>
        <Layer>
          <MapBackground
            url={room.map as string}
            width={withMap}
            height={heightMap}
          />
          {stations.map((station: any, i: any) => {
            return (
              <Group key={i}>
                <Circle
                  x={station.x}
                  y={station.y}
                  radius={15}
                  fill="green"
                  draggable
                  onDragEnd={async (e) => {
                    const newStations = stations.slice();
                    newStations[i].x = Math.round(e.target.x());
                    newStations[i].y = Math.round(e.target.y());
                    // Update station position in Realtime Database
                    await set(
                      ref(
                        database,
                        "rooms/" +
                          room.id +
                          "/stations/" +
                          station.id +
                          "/position",
                      ),
                      {
                        x: Math.round(e.target.x()),
                        y: Math.round(e.target.y()),
                      },
                    );
                    setStations(newStations);
                  }}
                />
                <Text
                  x={station.x + 10}
                  y={station.y - 10}
                  text={`(${station.x}, ${station.y})`}
                />
                <Text
                  x={station.x + 10}
                  y={station.y - 30}
                  text={`${station.name}`}
                />
              </Group>
            );
          })}
          {tags.map((tag: any, i: any) => {
            if (!tag.stations || tag.stations.length < 3) return;
            if (Object.keys(stationsRaw).length < 3) return;
            const tagPosition = locate(tag.stations, stationsRaw, pxMeter);
            return (
              <Group key={i}>
                <Circle
                  x={tagPosition.x}
                  y={tagPosition.y}
                  radius={10}
                  fill="red"
                />
                <Text
                  x={tagPosition.x + 10}
                  y={tagPosition.y - 10}
                  text={`(${tagPosition.x}, ${tagPosition.y})`}
                />
                <Text
                  x={tagPosition.x + 10}
                  y={tagPosition.y - 30}
                  text={`${tag.name}`}
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default RoomMap;
