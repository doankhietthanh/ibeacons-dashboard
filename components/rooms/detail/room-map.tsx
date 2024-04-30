import React, { useEffect, useState } from "react";
import { Circle, Group, Image, Layer, Line, Stage, Text } from "react-konva";
import { Room } from "@/types/room";
import useImage from "use-image";
import { getDatabase, onValue, ref, set } from "@firebase/database";
import { RoomAction } from "@/actions/rooms";
import firebase from "@/lib/firebase";

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
  const [lines, setLines] = useState<any>([]);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const [withMap, setWithMap] = useState(room.width);
  const [heightMap, setHeightMap] = useState(room.height);

  const [stations, setStations] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const handleMouseDown = () => {
    const newPoints = lines.slice();
    if (newPoints.length > 0) {
      newPoints[lines.length - 1].points = newPoints[
        lines.length - 1
      ].points.concat([currentX, currentY]);
      setLines(newPoints);
    } else {
      setLines([...lines, { points: [currentX, currentY] }]);
    }
  };

  const handleXChange = (e: any) => {
    setCurrentX(parseInt(e.target.value));
  };

  const handleYChange = (e: any) => {
    setCurrentY(parseInt(e.target.value));
  };

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
      console.log(screenWidth / aspectRatio);
    } else {
      setWithMap(screenHeight * aspectRatio);
      setHeightMap(screenHeight);
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
        const stations = Object.keys(data).map((key) => {
          return {
            id: key,
            x: snapshot.val()[key].position.x,
            y: snapshot.val()[key].position.y,
          };
        });
        setStations(stations);
      }
    });
  }, [room.id]);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      id="room-map"
    >
      <div>
        <label>X:</label>
        <input type="number" value={currentX} onChange={handleXChange} />
        <label>Y:</label>
        <input type="number" value={currentY} onChange={handleYChange} />
        <button onClick={handleMouseDown}>Add Pin</button>
      </div>
      <Stage width={withMap} height={heightMap}>
        <Layer>
          <MapBackground url={room.map} width={withMap} height={heightMap} />
          {stations.map((station: any, i: any) => {
            return (
              <Group key={i}>
                <Circle
                  x={station.x}
                  y={station.y}
                  radius={20}
                  fill="green"
                  draggable
                  onDragEnd={async (e) => {
                    const newStations = stations.slice();
                    newStations[i].x = e.target.x();
                    newStations[i].y = e.target.y();
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
                        x: e.target.x(),
                        y: e.target.y(),
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
                  text={`(${station.id})`}
                />
              </Group>
            );
          })}
          {lines.map((line: any, i: any) => {
            return (
              <Line
                key={i}
                points={line.points}
                stroke="red"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            );
          })}
          <Group>
            <Circle x={currentX} y={currentY} radius={5} fill="blue" />
            <Text
              x={currentX + 10}
              y={currentY - 10}
              text={`(${currentX}, ${currentY})`}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default RoomMap;
