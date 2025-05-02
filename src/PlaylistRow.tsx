import { ChevronRight } from "lucide-react";
import { Playlist } from "./types/playlist";

export default function PlaylistRow({ playlist }: { playlist: Playlist }) {
  return (
    <div
      key={playlist.id}
      className="flex gap-6 items-center justify-between hover:bg-accent p-2 rounded-md w-full"
    >
      <div className="flex gap-2 items-center">
        <img
          src={playlist.images[0].url}
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-sm shrink-0"
        />
        <div>
          <p className="font-medium line-clamp-1">{playlist.name}</p>

          <p className="text-sm line-clamp-1 text-muted-foreground ">
            {playlist.owner.display_name}
          </p>
        </div>
      </div>
      <ChevronRight size={20} />
    </div>
  );
}
