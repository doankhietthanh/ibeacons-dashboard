import firebase from "@/lib/firebase";
import { getDatabase, onValue, ref } from "@firebase/database";
import { ERROR_MESSAGE, STATUS_RESPONSE } from "@/constants";
import { RoomAction } from "@/actions/rooms";

const database = getDatabase(firebase);

export class RealtimeRoomAction {
  getStaions = async (roomId: string) => {
    try {
      let stations: any[] = [];
      await this.checkPermission(roomId);
      const starCountRef = ref(database, "rooms/" + roomId + "/stations");
      onValue(starCountRef, (snapshot) => {
        stations = snapshot.val();
      });
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: stations,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };

  private checkPermission = async (id: string) => {
    try {
      const roomAction = new RoomAction();
      return await roomAction.getRoom(id);
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };
}
