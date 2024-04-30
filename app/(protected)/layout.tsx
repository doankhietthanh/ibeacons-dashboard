"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingFullPage from "@/components/loading-full-page";
import ErrorFullPage from "@/components/error-full-page";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import DesktopNav from "@/components/navbar/desktop-nav";
import {
  BlocksIcon,
  LayoutDashboardIcon,
  NetworkIcon,
  Settings2Icon,
  SettingsIcon,
  TagsIcon,
} from "lucide-react";
import MobileNavbar from "@/components/navbar/mobile-nav";
import { redirect } from "next/navigation";
import { SIGN_IN_PAGE } from "@/routes";

const auth = getAuth(firebase);

export interface NavbarItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const routers: NavbarItemProps[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: <BlocksIcon />,
  },
  {
    title: "Stations",
    href: "/stations",
    icon: <NetworkIcon />,
  },
  {
    title: "Tags",
    href: "/tags",
    icon: <TagsIcon />,
  },
  {
    title: "Devices",
    href: "/devices",
    icon: <Settings2Icon />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return <LoadingFullPage />;
  }

  if (error) {
    return <ErrorFullPage error={error.message} />;
  }

  if (!user) {
    redirect(SIGN_IN_PAGE);
  }

  return (
    <div>
      <div className="hidden md:block">
        <DesktopNav routes={routers} />
      </div>
      <div className="container mb-16 md:mb-0">{children}</div>
      <div className="block md:hidden">
        <MobileNavbar routes={routers} />
      </div>
    </div>
  );
}
