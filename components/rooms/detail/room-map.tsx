import { RoomAction } from "@/actions/rooms";
import DataTable from "@/components/data-table";
import { locate } from "@/lib/beacon";
import firebase from "@/lib/firebase";
import { Room } from "@/types/room";
import { TagPosition } from "@/types/tags";
import { getDatabase, onValue, ref, set } from "@firebase/database";
import { useEffect, useState } from "react";
import { Circle, Group, Image, Layer, Stage, Text } from "react-konva";
import useImage from "use-image";
import { columns as tagsColumns } from "./tags-position-colums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [txPower, setTxPower] = useState(-60);
  const [nRange, setNRange] = useState(3);

  // Calculate the width and height of the map to fit the div id "room-map"
  useEffect(() => {
    const roomMapDom = document.getElementById("room-map");
    const width = room.width;
    const height = room.height;
    const aspectRatio = width / height;

    const maxWidth = window.innerWidth - 32 * 2;
    const maxHeight = window.innerHeight - 226;

    const screenWidth = roomMapDom?.clientWidth || 0;
    const screenHeight = roomMapDom?.clientHeight || 0;

    if (aspectRatio > 1) {
      const newWidth = screenWidth > maxWidth ? maxWidth : screenWidth;
      const newHeight = newWidth / aspectRatio;
      if (newHeight > maxHeight) {
        setHeightMap(maxHeight);
        setWithMap(maxHeight * aspectRatio);
      } else {
        setHeightMap(newHeight);
        setWithMap(newWidth);
      }
    } else {
      const newHeight = screenHeight > maxHeight ? maxHeight : screenHeight;
      const newWidth = newHeight * aspectRatio;
      if (newWidth > maxWidth) {
        setWithMap(maxWidth);
        setHeightMap(maxWidth / aspectRatio);
      } else {
        setWithMap(newWidth);
        setHeightMap(newHeight);
      }
    }
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
    setTimeout(() => {
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
    }, 500);
  }, [room.id]);

  // Set pxMeter from withMap and heightMap
  useEffect(() => {
    setPxMeter(withMap / room.width);
  }, [room.width, withMap]);

  return (
    <div className="flex w-full flex-col gap-10">
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
                      if (Math.round(e.target.x()) < 0) {
                        newStations[i].x = 0;
                      } else if (Math.round(e.target.x()) > withMap) {
                        newStations[i].x = withMap;
                      } else {
                        newStations[i].x = Math.round(e.target.x());
                      }
                      if (Math.round(e.target.y()) < 0) {
                        newStations[i].y = 0;
                      } else if (Math.round(e.target.y()) > heightMap) {
                        newStations[i].y = heightMap;
                      } else {
                        newStations[i].y = Math.round(e.target.y());
                      }
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
              const tagPosition = locate(
                tag.stations,
                stationsRaw,
                pxMeter,
                txPower,
                nRange,
              );
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
      <div className="flex w-full flex-row gap-10 md:flex-col">
        <div className="flex w-full flex-col gap-10 md:flex-row">
          <div className="flex w-1/4 items-center justify-center gap-3">
            <Label>TX Power</Label>
            <Input
              type="number"
              value={txPower}
              onChange={(e) => {
                setTxPower(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="flex w-1/4 items-center justify-center gap-3">
            <Label>N Range</Label>
            <Input
              type="number"
              min={2}
              max={4}
              value={nRange}
              onChange={(e) => {
                setNRange(parseInt(e.target.value));
              }}
            />
          </div>
        </div>
        <DataTable
          columns={tagsColumns}
          data={
            tags.map((tag) => {
              return {
                ...tag,
                raw: stations,
              };
            }) as TagPosition[]
          }
        />
      </div>
    </div>
  );
};

export default RoomMap;
