// @ts-ignore
import trilat from "trilat";

export const locate = (beacon: any, stations: any, px_meter: number) => {
  // ITAG -70 ... -94
  // Samsung -73 ... -95

  // RSSI = TxPower - 10 * n * lg(d)
  // n = 2...4
  // d = 10^(TxPower - RSSI) / (10 * n))

  const calculateDistance = (rssi: number) => {
    const P = -69;
    const n = 3;
    const d = Math.pow(10, (P - rssi) / (10 * n)); //(n ranges from 2 to 4)
    return d * px_meter;
  };

  const keysSorted = Object.keys(beacon).sort((a, b) => {
    return beacon[a].rssi - beacon[b].rssi;
  });
  keysSorted.reverse();

  const input = [
    //      X     Y     R
    [
      parseInt(stations[keysSorted[0]].x, 10),
      parseInt(stations[keysSorted[0]].y, 10),
      calculateDistance(beacon[keysSorted[0]].rssi),
    ],
    [
      parseInt(stations[keysSorted[1]].x, 10),
      parseInt(stations[keysSorted[1]].y, 10),
      calculateDistance(beacon[keysSorted[1]].rssi),
    ],
    [
      parseInt(stations[keysSorted[2]].x, 10),
      parseInt(stations[keysSorted[2]].y, 10),
      calculateDistance(beacon[keysSorted[2]].rssi),
    ],
  ];

  const output = trilat(input);
  return {
    x: parseInt(output[0], 10),
    y: parseInt(output[1], 10),
  };
};
