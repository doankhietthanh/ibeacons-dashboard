import { RoomAction } from "@/actions/rooms";
import { DeviceAction } from "@/actions/devices";
import { StationAction } from "@/actions/stations";
import { TagAction } from "@/actions/tags";

export class MetricsAction {
  getTotalRooms = async () => {
    const roomAction = new RoomAction();
    const rooms = await roomAction.getRooms();
    if (rooms.status === "success") {
      return rooms.data?.length || 0;
    }
    return 0;
  };

  getTotalStations = async () => {
    const stationAction = new StationAction();
    const stations = await stationAction.getStations();
    if (stations.status === "success") {
      return stations.data?.length || 0;
    }
    return 0;
  };

  getTotalTags = async () => {
    const tagAction = new TagAction();
    const tags = await tagAction.getTags();
    if (tags.status === "success") {
      return tags.data?.length || 0;
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
