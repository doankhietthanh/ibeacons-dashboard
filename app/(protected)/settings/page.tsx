import { Separator } from "@/components/ui/separator";
import GeneralSettingsForm from "@/components/settings/general-form";

const SettingsPage = async () => {
  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Manage font family, color theme, and other appearance settings.
        </p>
      </div>
      <Separator className="hidden md:block" />
      <GeneralSettingsForm />
    </div>
  );
};

export default SettingsPage;
