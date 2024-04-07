export interface Room {
  id: string;
  name: string;
  description?: string;
  backgroundCover?: string;
  members?: string[];

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
