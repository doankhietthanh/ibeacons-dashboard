import { Room, RoomUpdate } from "@/types/room";
import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { getUserCreatedInfo, getUserUpdatedInfo } from "@/common/user";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Collections } from "@/types/collections";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";
import { MemberRole, MemberStatus } from "@/types/user";
import { convertUndefinedToNull } from "@/common";
import { StationAction } from "@/actions/stations";
import { TagAction } from "@/actions/tags";
import { getDatabase, ref as rtDbRef, remove } from "@firebase/database";

const auth = getAuth(firebase);
const storage = getStorage(firebase);
const db = getFirestore(firebase);
const rtDb = getDatabase(firebase);

export class RoomAction {
  getRoom = async (id: string) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Get room
      const roomDoc = doc(db, Collections.ROOMS, id);
      const roomSnap = await getDoc(roomDoc);
      if (!roomSnap.exists()) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.GET_FAILED,
        };
      }
      // Check if user has permission in room
      const room = roomSnap.data() as Room;
      const member = room.members?.find(
        (member) => member.email === user.email,
      );
      if (!member) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: room,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };

  getRooms = async () => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Get rooms
      let rooms: Room[];
      const roomsRef = collection(db, Collections.ROOMS);
      // Get rooms where user is a host
      const roomsQuery = query(
        roomsRef,
        where("members", "array-contains", {
          email: user.email,
          status: MemberStatus.ACTIVE,
          role: MemberRole.HOST,
        }),
      );
      const roomsSnap = await getDocs(roomsQuery);
      rooms = roomsSnap.docs.map((doc) => doc.data()) as Room[];
      // Get rooms where user is a member
      const roomsQuery2 = query(
        roomsRef,
        where("members", "array-contains", {
          email: user.email,
          status: MemberStatus.ACTIVE,
          role: MemberRole.MEMBER,
        }),
      );
      const roomsSnap2 = await getDocs(roomsQuery2);
      rooms = rooms.concat(roomsSnap2.docs.map((doc) => doc.data()) as Room[]);
      // Return rooms
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: rooms,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };

  createRoom = async (
    room: Room,
    backgroundCover?: File | null,
    map?: File | null,
  ) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.SUCCESS,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Upload background cover
      if (backgroundCover) {
        const storageRef = ref(
          storage,
          `rooms/${room.id}/background-cover.jpg`,
        );
        await uploadBytes(storageRef, backgroundCover, {
          contentType: "image/jpeg",
        });
        room.backgroundCover = await getDownloadURL(storageRef);
      }
      // Upload room map
      if (map) {
        const storageRef = ref(storage, `rooms/${room.id}/map.jpg`);
        await uploadBytes(storageRef, map, {
          contentType: "image/jpeg",
        });
        room.map = await getDownloadURL(storageRef);
      }
      // Add user created info
      room = {
        members: [
          {
            email: user.email || "admin",
            role: MemberRole.HOST,
            status: MemberStatus.ACTIVE,
          },
        ],
        ...convertUndefinedToNull(room),
        ...getUserCreatedInfo(user),
      };
      // Create room
      await setDoc(doc(db, Collections.ROOMS, room.id), room);
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.CREATED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        success: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.CREATED_FAILED,
      };
    }
  };

  updateRoom = async (
    id: string,
    room: RoomUpdate,
    backgroundCover?: File | null,
  ) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.SUCCESS,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Upload background cover
      if (backgroundCover) {
        const storageRef = ref(storage, `rooms/${id}/background-cover.jpg`);
        await uploadBytes(storageRef, backgroundCover, {
          contentType: "image/jpeg",
        });
        console.log("Upload image");
        room.backgroundCover = await getDownloadURL(storageRef);
      }
      // Add user update info
      room = { ...convertUndefinedToNull(room), ...getUserUpdatedInfo(user) };
      // Update room
      await updateDoc(doc(db, Collections.ROOMS, id), { ...room });
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.UPDATED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        success: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.UPDATED_FAILED,
      };
    }
  };

  deleteRoom = async (id: string) => {
    try {
      // Get room
      const room = await this.getRoom(id);
      if (room.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: room.message,
        };
      }
      // Delete stations
      room.data?.stations?.map(async (station) => {
        const stationAction = new StationAction();
        await stationAction.deleteStation(station.id);
      });
      // Delete tags
      room.data?.tags?.map(async (tag) => {
        const tagAction = new TagAction();
        await tagAction.deleteTag(tag.id);
      });
      // Delete room
      await deleteDoc(doc(db, Collections.ROOMS, id));
      // Delete room in real-time database
      await remove(rtDbRef(rtDb, `rooms/${id}`));
      // Return success
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: SUCCESS_MESSAGE.DELETED_SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        success: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.DELETED_FAILED,
      };
    }
  };

  joinRoom = async (roomId: string, email: string) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      // Check current user is not the same as the email
      if (!user || user.email !== email) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: "Invalid email",
        };
      }
      // Get room
      const roomDoc = doc(db, Collections.ROOMS, roomId);
      const roomSnap = await getDoc(roomDoc);
      if (!roomSnap.exists()) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.GET_FAILED,
        };
      }
      // Update room
      const room = roomSnap.data() as Room;
      room.members?.map((member) => {
        if (member.email === email) {
          member.status = MemberStatus.ACTIVE;
        }
      });
      await updateDoc(roomDoc, { ...room });
      return {
        status: STATUS_RESPONSE.SUCCESS,
        message: "Joined room successfully!",
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.UPDATED_FAILED,
      };
    }
  };
}
