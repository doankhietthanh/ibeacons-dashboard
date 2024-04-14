import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";
import { Device, DeviceCreate } from "@/types/devices";
import RoomAction from "@/actions/rooms";
import { getUserCreatedInfo } from "@/common/user";
import { collection, getDocs, query, setDoc, where } from "@firebase/firestore";
import { Collections } from "@/types/collections";
import { convertUndefinedToNull } from "@/common";

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export const DeviceAction = {
  getDevices: async () => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      let devices: Device[] = [];
      // get devices has no room and createdBy is user
      const deviceQueryNoRoom = query(
        collection(db, Collections.DEVICES),
        where("room", "==", null),
        where("createdBy", "==", user.uid),
      );
      const deviceNoRoomSnap = await getDocs(deviceQueryNoRoom);
      deviceNoRoomSnap.forEach((doc) => {
        devices.push(doc.data() as Device);
      });
      // get devices has room
      const rooms = await RoomAction.getRooms();
      if (rooms.status === STATUS_RESPONSE.SUCCESS) {
        rooms.data?.forEach((room) => {
          room.devices?.forEach((device) => {
            devices.push({ ...device, room: room });
          });
        });
      }

      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: devices,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  },
  createDevice: async (device: DeviceCreate) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.SUCCESS,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Check user has permission in room
      let room;
      if (device.room) {
        room = await RoomAction.getRoom(device.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user created info
      device = {
        ...convertUndefinedToNull(device),
        ...getUserCreatedInfo(user),
      };
      // Create room
      await setDoc(doc(db, Collections.DEVICES, device.id), device);
      // Update devices in room
      if (room?.data) {
        // Update device in room
        await RoomAction.updateRoom(room.data?.id, {
          ...room.data,
          devices: [...(room.data.devices as []), device],
        });
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.CREATED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.CREATED_FAILED,
      };
    }
  },
};
