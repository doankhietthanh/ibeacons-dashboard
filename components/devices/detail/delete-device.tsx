import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { BACK_TO_DEVICES_PAGE } from "@/routes";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { Device } from "@/types/devices";
import { DeviceAction } from "@/actions/devices";

const auth = getAuth(firebase);

const DeleteDevice = ({ device }: { device: Device }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  // check permission if user is created the device
  const user = auth.currentUser;
  const userCreatedDevice = device.createdBy;

  if (!user || user?.uid !== userCreatedDevice) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access Denied</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p>You are not authorized to delete this device.</p>
        </div>
      </DialogContent>
    );
  }

  const onSubmit = async () => {
    startTransition(async () => {
      const deviceAction = new DeviceAction();
      const result = await deviceAction.deleteDevice(device.id);
      toast({
        title: result.status === "success" ? "Device deleted" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_DEVICES);
        router.push(BACK_TO_DEVICES_PAGE);
      }
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you delete device?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the device
          and all its data.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button
          disabled={isPending}
          onClick={() => onSubmit()}
          variant="destructive"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteDevice;
