import { DeviceType } from "@/types/devices";
import {
  AirVentIcon,
  CableIcon,
  FanIcon,
  LightbulbIcon,
  TvIcon,
} from "lucide-react";
import React from "react";

export const DeviceTypes = [
  {
    type: DeviceType.LIGHT,
    name: "Light",
    icon: <LightbulbIcon />,
  },
  {
    type: DeviceType.FAN,
    name: "Fan",
    icon: <FanIcon />,
  },
  {
    type: DeviceType.CABLE,
    name: "Cable",
    icon: <CableIcon />,
  },
  {
    type: DeviceType.AIR_CONDITIONER,
    name: "Air conditioner",
    icon: <AirVentIcon />,
  },
  {
    type: DeviceType.TV,
    name: "TV",
    icon: <TvIcon />,
  },
];
