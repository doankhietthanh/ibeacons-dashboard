import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";
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
import { Station, StationCreate, StationUpdate } from "@/types/stations";
import { Room } from "@/types/room";
import { getDatabase, ref, set } from "@firebase/database";

const auth = getAuth(firebase);
const db = getFirestore(firebase);
const rtDb = getDatabase(firebase);

export class StationAction {
  private readonly roomAction = new RoomAction();

  getStations = async () => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      let stations: Station[] = [];
      // get stations has no room and createdBy is user
      const stationQueryNoRoom = query(
        collection(db, Collections.STATIONS),
        where("room", "==", null),
        where("createdBy", "==", user.uid),
      );
      const stationNoRoomSnap = await getDocs(stationQueryNoRoom);
      stationNoRoomSnap.forEach((doc) => {
        stations.push(doc.data() as Station);
      });
      // get stations has room
      const rooms = await this.roomAction.getRooms();
      if (rooms.status === STATUS_RESPONSE.SUCCESS) {
        rooms.data?.forEach((room) => {
          room.stations?.forEach((station) => {
            stations.push({ ...station, room: room });
          });
        });
      }

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

  async getStation(id: string) {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Get station
      const stationDoc = doc(db, Collections.STATIONS, id);
      const stationSnap = await getDoc(stationDoc);
      if (!stationSnap.exists()) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.GET_FAILED,
        };
      }
      const station = stationSnap.data() as Station;
      // Check if user has permission in room
      if (station.room) {
        const room = await this.roomAction.getRoom(station.room as string);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update station with room info
        station.room = room.data;
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: station,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  }

  createStation = async (station: StationCreate) => {
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
      if (station.room) {
        room = await this.roomAction.getRoom(station.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user created info
      station = {
        ...convertUndefinedToNull(station),
        ...getUserCreatedInfo(user),
      };
      // Create room
      await setDoc(doc(db, Collections.STATIONS, station.id), station);
      // Update stations in room
      if (room?.data) {
        // Update station in room
        await this.roomAction.updateRoom(room.data?.id, {
          ...room.data,
          stations: [
            ...(room.data.stations ? (room.data?.stations as Station[]) : []),
            station,
          ],
        });
      }
      // Set station to real-time database
      await set(ref(rtDb, `rooms/${room?.data?.id}/stations/${station.id}`), {
        name: station.name,
        description: station.description,
        position: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
        },
      });
      await set(ref(rtDb, `stations/${station.id}`), {
        room: room?.data?.id,
      });
      // Return success
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

  updateStation = async (id: string, station: StationUpdate) => {
    try {
      // Get station
      const stationDb = await this.getStation(id);
      if (stationDb.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: stationDb.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (stationDb.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Check user has permission in room
      let room;
      if (station.room) {
        room = await this.roomAction.getRoom(station.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user update info
      station = {
        ...convertUndefinedToNull(station),
        ...getUserUpdatedInfo(user),
      };
      // Update station
      await updateDoc(doc(db, Collections.STATIONS, id), {
        ...station,
      });
      // Update stations in room
      if (room?.data) {
        // Update station in room
        await this.roomAction.updateRoom(room.data?.id, {
          ...room.data,
          stations: room.data?.stations?.map((_station) =>
            _station.id === id ? { ..._station, ...station } : _station,
          ),
        });
      }
      // Set room to real-time database
      await set(ref(rtDb, `rooms/${room?.data?.id}/stations/${id}`), {
        name: station.name,
        description: station.description,
      });
      // Return success
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

  deleteStation = async (id: string) => {
    try {
      // Get station
      const station = await this.getStation(id);
      if (station.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: station.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (station.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Delete station
      await deleteDoc(doc(db, Collections.STATIONS, id));
      // Update stations in room
      if (station.data?.room) {
        const roomId = (station.data.room as Room).id;
        const room = await this.roomAction.getRoom(roomId);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update station in room
        if (room.data) {
          await this.roomAction.updateRoom(room.data?.id, {
            ...room.data,
            stations: room.data?.stations?.filter(
              (_station) => _station.id !== id,
            ),
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
