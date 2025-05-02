import { useQuery } from "@tanstack/react-query";
import PlaylistRow from "./PlaylistRow";
import { Playlist } from "./types/playlist";
import { Link, useOutletContext } from "react-router";
import { fetchPlaylists } from "./lib/api";
import LoadingRow from "./LoadingRow";

export default function PlaylistsPage() {
  const { token } = useOutletContext<{ token: string }>();
  const { data: playlists, isLoading: playlistsLoading } = useQuery<Playlist[]>(
    {
      queryKey: ["playlists"],
      queryFn: () => fetchPlaylists(token!),
      enabled: !!token,
    }
  );

  return (
    <div className="p-2 md:p-4 border-t flex flex-col w-full">
      {playlistsLoading ? (
        <div className="p-2 flex flex-col gap-4">
          <LoadingRow />
          <LoadingRow />
          <LoadingRow />
        </div>
      ) : (
        <div>
          <h2 className="p-2 font-medium">My saved playlists</h2>
          {playlists?.map((playlist: Playlist) => (
            <Link to={playlist.id}>
              <PlaylistRow playlist={playlist} key={playlist.id} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
