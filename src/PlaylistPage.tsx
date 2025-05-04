import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router";
import { Song } from "./types/song";
import SongRow from "./SongRow";
import { Button } from "./components/ui/button";
import { fetchPlaylist, fetchPlaylistTracks, findYoutubeUrl } from "./lib/api";
import { Playlist } from "./types/playlist";
import LoadingRow from "./LoadingRow";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

export default function PlaylistPage() {
  const { token } = useOutletContext<{ token: string }>();
  const { id } = useParams<string>();
  const [urls, setUrls] = useState<{ [key: string]: string | null }>({});
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: songs, isLoading: songsLoading } = useQuery<Song[]>({
    queryKey: ["songs", id],
    queryFn: () => fetchPlaylistTracks(id!, token),
    enabled: !!token && !!id,
  });

  const { data: playlist, isLoading: playlistLoading } = useQuery<Playlist>({
    queryKey: ["playlist", id],
    queryFn: () => fetchPlaylist(id!, token),
    enabled: !!token && !!id,
  });

  const handleConvertAll = async () => {
    setLoadingUrls(true);
    const newUrls: { [key: string]: string | null } = {};
    const totalSongs = songs?.length || 0;

    for (let i = 0; i < totalSongs; i++) {
      const song = songs![i];
      const query = `${song.track.artists[0].name} - ${song.track.name}`;
      const url = await findYoutubeUrl(query);
      newUrls[song.track.id] = url;

      setProgress(((i + 1) / totalSongs) * 100);
    }

    setUrls(newUrls);
    setLoadingUrls(false);
  };

  const handleCopyAll = async () => {
    const allUrls = Object.values(urls)
      .filter((url) => url !== null)
      .join("\n\n");

    if (allUrls) {
      await navigator.clipboard.writeText(allUrls);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.log("No URLs to copy");
    }
  };

  return (
    <div className="border-t flex flex-col w-full">
      <div className="p-2 md:p-4 pb-0">
        <Link to={"/playlists"}>
          <Button variant={"link"} className="text-muted-foreground">
            <ArrowLeft />
            Back
          </Button>
        </Link>
      </div>
      <div className="px-4 md:px-6 pb-4 md:pb-6 flex justify-between items-center gap-6 border-b">
        {playlistLoading ? (
          <LoadingRow />
        ) : (
          <div className="flex gap-2 items-center">
            <img
              src={playlist?.images[0].url}
              className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-sm shrink-0"
            />
            <div>
              <h2 className="font-medium line-clamp-1">{playlist?.name}</h2>
              <p className="text-sm line-clamp-1 text-muted-foreground">
                {playlist?.owner.display_name}
              </p>
            </div>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleConvertAll}>
              Convert all <ArrowRight />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[500px] md:max-h-[900px] overflow-auto">
            <DialogTitle>{playlist?.name}</DialogTitle>
            {loadingUrls ? (
              <div className="w-full">
                <div className="bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {Math.round(progress)} % loaded
                </p>
              </div>
            ) : urls ? (
              <div className="flex flex-col gap-6">
                {Object.keys(urls).map((songId) => {
                  const url = urls[songId];
                  return (
                    <div key={songId}>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {url}
                        </a>
                      ) : (
                        <p>No URL found for this song.</p>
                      )}
                    </div>
                  );
                })}
                <Button onClick={handleCopyAll} size="sm">
                  <Copy size={16} className="mr-2" />
                  {copied ? "Copied all!" : "Copy all URLs"}
                </Button>
              </div>
            ) : (
              <p>No results found.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-2 md:p-4">
        {songsLoading ? (
          <div className="p-2 flex flex-col gap-4">
            <LoadingRow />
            <LoadingRow />
            <LoadingRow />
          </div>
        ) : songs ? (
          songs.map((song) => <SongRow song={song} />)
        ) : (
          <div>No playlist found</div>
        )}
      </div>
    </div>
  );
}
