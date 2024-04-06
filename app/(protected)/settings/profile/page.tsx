"use client";

import { Separator } from "@/components/ui/separator";
import ProfileForm from "@/components/settings/profile-form";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(firebase);

const ProfilePage = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className="hidden md:block" />
      <ProfileForm user={user} />
    </div>
  );
};

export default ProfilePage;
