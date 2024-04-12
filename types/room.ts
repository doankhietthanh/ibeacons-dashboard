import { Member } from "@/types/user";

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
  devices?: string[];

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
  devices?: string[];

  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
