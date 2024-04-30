import { Room } from "@/types/room";

export interface TagCreate {
  id: string;
  macAddress: string;
  name: string;
  description?: string;
  room: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TagUpdate {
  room: string;
  name?: string;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tag {
  id: string;
  macAddress: string;
  name: string;
  description?: string;
  room?: Room | string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
