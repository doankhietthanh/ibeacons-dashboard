import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
    title: string;
    href: string;
}

const BackButton = ({ title, href }: BackButtonProps) => {
    return (
        <Button variant="link" size="sm">
            <Link className="bg-background px-2 text-muted-foreground" href={href}>
                {title}
            </Link>
        </Button>
    );
};

export default BackButton;