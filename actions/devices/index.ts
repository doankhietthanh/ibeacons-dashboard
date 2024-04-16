import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";
import { Device, DeviceCreate, DeviceUpdate } from "@/types/devices";
import { RoomAction } from "@/actions/rooms";
import { getUserCreatedInfo, getUserUpdatedInfo } from "@/common/user";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { Collections } from "@/types/collections";
import { convertUndefinedToNull } from "@/common";
import { Room } from "@/types/room";

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export class DeviceAction {
  private readonly roomAction = new RoomAction();

  getDevices = async () => {
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
      const rooms = await this.roomAction.getRooms();
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
  };

  getDevice = async (id: string) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Get device
      const deviceDoc = doc(db, Collections.DEVICES, id);
      const deviceSnap = await getDoc(deviceDoc);
      if (!deviceSnap.exists()) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.GET_FAILED,
        };
      }
      const device = deviceSnap.data() as Device;
      // Check if user has permission in room
      if (device.room) {
        const room = await this.roomAction.getRoom(device.room as string);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update device with room info
        device.room = room.data;
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: device,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };

  createDevice = async (device: DeviceCreate) => {
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
        room = await this.roomAction.getRoom(device.room);
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
        await this.roomAction.updateRoom(room.data?.id, {
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
  };

  updateDevice = async (id: string, device: DeviceUpdate) => {
    try {
      // Get device
      const deviceDb = await this.getDevice(id);
      if (deviceDb.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: deviceDb.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (deviceDb.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Check user has permission in room
      let room;
      if (device.room) {
        room = await this.roomAction.getRoom(device.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user update info
      device = {
        ...convertUndefinedToNull(device),
        ...getUserUpdatedInfo(user),
      };
      // Update device
      await updateDoc(doc(db, Collections.DEVICES, id), {
        ...device,
      });
      // Update devices in room
      if (room?.data) {
        // Update device in room
        await this.roomAction.updateRoom(room.data?.id, {
          ...room.data,
          devices: room.data?.devices?.map((device) =>
            device.id === id ? { ...device, ...device } : device,
          ),
        });
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.UPDATED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.UPDATED_FAILED,
      };
    }
  };

  deleteDevice = async (id: string) => {
    try {
      // Get device
      const device = await this.getDevice(id);
      if (device.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: device.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (device.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Delete device
      await deleteDoc(doc(db, Collections.DEVICES, id));
      // Update devices in room
      if (device.data?.room) {
        const roomId = (device.data.room as Room).id;
        const room = await this.roomAction.getRoom(roomId);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update device in room
        if (room.data) {
          await this.roomAction.updateRoom(room.data?.id, {
            ...room.data,
            devices: room.data?.devices?.filter((device) => device.id !== id),
          });
        }
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.DELETED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.DELETED_FAILED,
      };
    }
  };
}
