import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ERROR_MESSAGE, STATUS_RESPONSE, SUCCESS_MESSAGE } from "@/constants";
import { RoomAction } from "@/actions/rooms";
import { getUserCreatedInfo, getUserUpdatedInfo } from "@/common/user";
import { deleteDoc, setDoc, updateDoc } from "@firebase/firestore";
import { Collections } from "@/types/collections";
import { convertUndefinedToNull } from "@/common";
import { Room } from "@/types/room";
import { Tag, TagCreate, TagUpdate } from "@/types/tags";
import { getDatabase, ref, set } from "@firebase/database";

const auth = getAuth(firebase);
const db = getFirestore(firebase);
const rtDb = getDatabase(firebase);

export class TagAction {
  private readonly roomAction = new RoomAction();

  getTags = async () => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      let tags: Tag[] = [];
      // get tags has room
      const rooms = await this.roomAction.getRooms();
      if (rooms.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: rooms.message,
        };
      }
      rooms.data?.forEach((room) => {
        room.tags?.forEach((tag) => {
          tags.push({ ...tag, room: room });
        });
      });

      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: tags,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  };

  async getTag(id: string) {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.USER_NOT_FOUND,
        };
      }
      // Get tag
      const tagDoc = doc(db, Collections.TAGS, id);
      const tagSnap = await getDoc(tagDoc);
      if (!tagSnap.exists()) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.GET_FAILED,
        };
      }
      const tag = tagSnap.data() as Tag;
      // Check if user has permission in room
      if (tag.room) {
        const room = await this.roomAction.getRoom(tag.room as string);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update tag with room info
        tag.room = room.data;
      }
      return {
        status: STATUS_RESPONSE.SUCCESS,
        data: tag,
      };
    } catch (error) {
      console.error(error);
      return {
        status: STATUS_RESPONSE.ERROR,
        message: error || ERROR_MESSAGE.GET_FAILED,
      };
    }
  }

  createTag = async (tag: TagCreate) => {
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
      if (tag.room) {
        room = await this.roomAction.getRoom(tag.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user created info
      tag = {
        ...convertUndefinedToNull(tag),
        ...getUserCreatedInfo(user),
      };
      // Create room
      await setDoc(doc(db, Collections.TAGS, tag.id), tag);
      // Update tags in room
      if (room?.data) {
        // Update tag in room
        await this.roomAction.updateRoom(room.data?.id, {
          ...room.data,
          tags: [...(room.data.tags ? (room.data?.tags as Tag[]) : []), tag],
        });
      }
      // Set tag in realtime database
      await set(ref(rtDb, `rooms/${room?.data?.id}/tags/${tag.id}`), {
        name: tag.name,
        description: tag.description,
        macAddress: tag.macAddress,
      });
      await set(ref(rtDb, `tags/${tag.macAddress}`), {
        room: room?.data?.id,
        id: tag.id,
      });
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

  updateTag = async (id: string, tag: TagUpdate) => {
    try {
      // Get tag
      const tagDb = await this.getTag(id);
      if (tagDb.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: tagDb.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (tagDb.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Check user has permission in room
      let room;
      if (tag.room) {
        room = await this.roomAction.getRoom(tag.room);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
      }
      // Add user update info
      tag = {
        ...convertUndefinedToNull(tag),
        ...getUserUpdatedInfo(user),
      };
      // Update tag
      await updateDoc(doc(db, Collections.TAGS, id), {
        ...tag,
      });
      // Update tags in room
      if (room?.data) {
        // Update tag in room
        await this.roomAction.updateRoom(room.data?.id, {
          ...room.data,
          tags: room.data?.tags?.map((_tag) =>
            _tag.id === id ? { ..._tag, ...tag } : _tag,
          ),
        });
      }
      // Set tag in realtime database
      await set(ref(rtDb, `rooms/${room?.data?.id}/tags/${id}`), {
        name: tag.name,
        description: tag.description,
      });
      // Update tags in room
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

  deleteTag = async (id: string) => {
    try {
      // Get tag
      const tag = await this.getTag(id);
      if (tag.status === STATUS_RESPONSE.ERROR) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: tag.message,
        };
      }
      // Check if user has permission in room
      const user = auth.currentUser;
      if (tag.data?.createdBy !== user?.uid) {
        return {
          status: STATUS_RESPONSE.ERROR,
          message: ERROR_MESSAGE.PERMISSION_DENIED,
        };
      }
      // Delete tag
      await deleteDoc(doc(db, Collections.TAGS, id));
      // Update tags in room
      if (tag.data?.room) {
        const roomId = (tag.data.room as Room).id;
        const room = await this.roomAction.getRoom(roomId);
        if (room.status === STATUS_RESPONSE.ERROR) {
          return {
            status: STATUS_RESPONSE.ERROR,
            message: room.message,
          };
        }
        // Update tag in room
        if (room.data) {
          await this.roomAction.updateRoom(room.data?.id, {
            ...room.data,
            tags: room.data?.tags?.filter((_tag) => _tag.id !== id),
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
