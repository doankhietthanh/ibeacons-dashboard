import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarItemProps } from "@/app/(protected)/layout";

const MobileNavbar = ({ routes }: { routes: NavbarItemProps[] }) => {
  return (
    <nav className="fixed bottom-5 left-0 flex h-16 w-full items-center justify-center gap-5">
      <div className="flex items-center justify-center gap-5 rounded-xl bg-secondary px-8 py-3">
        {routes.map((route) => (
          <NavbarItem
            key={route.href}
            title={route.title}
            href={route.href}
            icon={route.icon}
          />
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;

const NavbarItem = ({ title, href, icon, ...props }: NavbarItemProps) => {
  const pathname = usePathname();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <Link {...props} className="text-primary" href={href}>
      <Button variant={isActive ? "default" : "secondary"} size={"icon"}>
        {icon}
      </Button>
    </Link>
  );
};
