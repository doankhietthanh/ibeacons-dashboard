import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { NavbarItemProps } from "@/app/(protected)/layout";
import UserNav from "@/components/navbar/user-nav";

const DesktopNavbar = ({ routes }: { routes: NavbarItemProps[] }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-4 flex items-center gap-4 text-sm lg:gap-6">
          {routes.map((route) => (
            <NavbarItem
              key={route.href}
              title={route.title}
              href={route.href}
            />
          ))}
        </nav>
        <div className="ml-auto">
          <UserNav />
        </div>
      </div>
    </header>
  );
};

const NavbarItem = ({ title, href, icon, ...props }: NavbarItemProps) => {
  const pathname = usePathname();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "transition-colors hover:text-primary/80",
        isActive ? "text-primary" : "text-foreground/60",
      )}
    >
      {title}
    </Link>
  );
};

export default DesktopNavbar;
