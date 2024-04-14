import { Room } from "@/types/room";

export enum DeviceType {
  LIGHT = "light",
  FAN = "fan",
  AIR_CONDITIONER = "air_conditioner",
  TV = "tv",
  CABLE = "cable",
}

export interface DeviceCreate {
  id: string;
  name: string;
  description?: string;
  type: DeviceType;
  room?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Device {
  id: string;
  name: string;
  description?: string;
  type: DeviceType;
  room?: Room | string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
