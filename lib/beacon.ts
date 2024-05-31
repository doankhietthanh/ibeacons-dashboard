// @ts-ignore
import trilat from "trilat";

export const locate = (
  beacon: any,
  stations: any,
  px_meter: number,
  tx_power: number,
  n_range: number,
) => {
  // ITAG -70 ... -94
  // Samsung -73 ... -95

  // RSSI = TxPower - 10 * n * lg(d)
  // n = 2...4
  // d = 10^(TxPower - RSSI) / (10 * n))

  const calculateDistance = (rssi: number, txPower: number) => {
    const P = txPower || tx_power;
    const n = n_range || 3;
    const d = Math.pow(10, (P - rssi) / (10 * n)); //(n ranges from 2 to 4)
    return d * px_meter;
  };

  const keysSorted = Object.keys(beacon).sort((a, b) => {
    console.log(beacon[a].rssi, beacon[b].rssi);
    return beacon[a].rssi - beacon[b].rssi;
  });
  keysSorted.reverse();

  //return if keysSorted has length less than 3
  if (keysSorted.length < 3) {
    return {
      x: 0,
      y: 0,
    };
  }

  const input = [
    //      X     Y     R
    [
      parseInt(stations[keysSorted[0]].position.x, 10),
      parseInt(stations[keysSorted[0]].position.y, 10),
      calculateDistance(
        beacon[keysSorted[0]].rssi,
        beacon[keysSorted[0]].txPower,
      ),
    ],
    [
      parseInt(stations[keysSorted[1]].position.x, 10),
      parseInt(stations[keysSorted[1]].position.y, 10),
      calculateDistance(
        beacon[keysSorted[1]].rssi,
        beacon[keysSorted[1]].txPower,
      ),
    ],
    [
      parseInt(stations[keysSorted[2]].position.x, 10),
      parseInt(stations[keysSorted[2]].position.y, 10),
      calculateDistance(
        beacon[keysSorted[2]].rssi,
        beacon[keysSorted[2]].txPower,
      ),
    ],
  ];
  const output = trilat(input);
  return {
    x: parseInt(output[0], 10),
    y: parseInt(output[1], 10),
  };
};
