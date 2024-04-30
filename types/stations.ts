import { Room } from "@/types/room";
import { Device } from "@/types/devices";

export interface StationCreate {
  id: string;
  name: string;
  description?: string;
  room: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StationUpdate {
  room: string;
  name?: string;
  description?: string;
  devices?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Station {
  id: string;
  name: string;
  description?: string;
  room?: Room | string;
  devices?: Device[] | string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
