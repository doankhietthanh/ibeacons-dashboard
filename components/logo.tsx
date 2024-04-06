import Link from "next/link";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center justify-center space-x-2 md:mr-6 md:justify-start"
    >
      <Icons.twitter className="h-6 w-6" />
      <span className="hidden font-bold sm:inline-block">
        {siteConfig.name}
      </span>
    </Link>
  );
};

export default Logo;
