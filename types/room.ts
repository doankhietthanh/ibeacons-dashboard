import { Member } from "@/types/user";
import { Device } from "@/types/devices";

export interface Room {
  id: string;
  name: string;
  description?: string;
  backgroundCover?: string;
  members?: Member[];

  map?: string;
  width?: number;
  height?: number;
  stations?: string[];
  devices?: Device[];

  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomUpdate {
  name?: string;
  description?: string;
  backgroundCover?: string;
  members?: Member[];

  // map?: string;
  // width?: number;
  // height?: number;
  stations?: string[];
  devices?: Device[];

  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
