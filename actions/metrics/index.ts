import RoomAction from "@/actions/rooms";

const MetricsAction = {
  getTotalRooms: async () => {
    const rooms = await RoomAction.getRooms();
    if (rooms.status === "success") {
      return rooms.data?.length || 0;
    }
    return 0;
  },

  getTotalDevices: async () => {
    return 0;
  },
};

export default MetricsAction;
