import React from "react";

import { Separator } from "@/components/ui/separator";
import SettingsNav from "@/components/settings/settings-nav";
import LogoutConfirmDialog from "@/components/auth/logout-confirm-dialog";

const sidebarNavItems = [
  {
    title: "General",
    href: "/settings",
  },
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "About",
    href: "/about",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <>
      <div className="block space-y-6 py-5 md:container md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage general and profile settings.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SettingsNav items={sidebarNavItems} />
            <LogoutConfirmDialog />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SettingsLayout;
