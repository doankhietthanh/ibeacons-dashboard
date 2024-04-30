import { Member } from "@/types/user";
import { Device } from "@/types/devices";
import { Station } from "@/types/stations";
import { Tag } from "@/types/tags";

export interface Room {
  id: string;
  name: string;
  description?: string;
  backgroundCover?: string;
  members?: Member[];

  map: string;
  width: number;
  height: number;
  stations?: Station[];
  tags?: Tag[];
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
  stations?: Station[];
  devices?: Device[];
  tags?: Tag[];

  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
