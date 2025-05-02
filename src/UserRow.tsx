import { LogOutIcon } from "lucide-react";
import { User } from "./types/user";
import { Button } from "./components/ui/button";

export default function UserRow({
  profile,
  logout,
}: {
  profile: User;
  logout: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          src={profile.images[0].url}
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-sm shrink-0"
        />
        <div>
          <p className="font-medium line-clamp-1">{profile.display_name}</p>
          <p className="text-muted-foreground text-sm line-clamp-1">
            {profile.email}
          </p>
        </div>
      </div>
      <Button variant={"outline"} onClick={logout}>
        <LogOutIcon />
        Logout
      </Button>
    </div>
  );
}
