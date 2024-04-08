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
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Collections } from "@/types/collections";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";

const auth = getAuth(firebase);
const storage = getStorage(firebase);
const db = getFirestore(firebase);

export const getRoom = async (id: string) => {
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
    return {
      status: STATUS_RESPONSE.SUCCESS,
      data: roomSnap.data() as Room,
    };
  } catch (error) {
    console.error(error);
    return {
      status: STATUS_RESPONSE.ERROR,
      message: error || ERROR_MESSAGE.GET_FAILED,
    };
  }
};

export const getRooms = async () => {
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
    const roomsRef = collection(db, Collections.ROOMS);
    const roomsQuery = query(roomsRef, where("createdBy", "==", user.uid));
    const roomsSnap = await getDocs(roomsQuery);
    return {
      status: STATUS_RESPONSE.SUCCESS,
      data: roomsSnap.docs.map((doc) => doc.data()) as Room[],
    };
  } catch (error) {
    console.error(error);
    return {
      status: STATUS_RESPONSE.ERROR,
      message: error || ERROR_MESSAGE.GET_FAILED,
    };
  }
};

export const createRoom = async (
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
      const storageRef = ref(storage, `rooms/${room.id}/background-cover.jpg`);
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
    room = { ...room, ...getUserCreatedInfo(user) };
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

export const updateRoom = async (
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
      room.backgroundCover = await getDownloadURL(storageRef);
    }
    // Add user created info
    room = { ...room, ...getUserUpdatedInfo(user) };
    console.log(room);
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
