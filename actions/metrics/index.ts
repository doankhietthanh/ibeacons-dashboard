import { RoomAction } from "@/actions/rooms";
import { DeviceAction } from "@/actions/devices";

export class MetricsAction {
  getTotalRooms = async () => {
    const roomAction = new RoomAction();
    const rooms = await roomAction.getRooms();
    if (rooms.status === "success") {
      return rooms.data?.length || 0;
    }
    return 0;
  };

  getTotalDevices = async () => {
    const deviceAction = new DeviceAction();
    const devices = await deviceAction.getDevices();
    if (devices.status === "success") {
      return devices.data?.length || 0;
    }
    return 0;
  };
}
