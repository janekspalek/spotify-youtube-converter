import { ChevronRight, Copy } from "lucide-react";
import { Song } from "./types/song";
import { findYoutubeUrl } from "./lib/api";
import { Button } from "./components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

export default function SongRow({ song }: { song: Song }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const query = `${song.track.artists[0].name} - ${song.track.name}`;
    const result = await findYoutubeUrl(query);
    setUrl(result);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      key={song.track.id}
      className="flex gap-6 items-center justify-between hover:bg-accent p-2 rounded-md w-full"
    >
      <div className="flex gap-2 items-center">
        {song.track.album.images?.[0]?.url ? (
          <img
            src={song.track.album.images[0].url}
            alt={song.track.name}
            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-cover rounded-sm shrink-0"
          />
        ) : (
          <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-gray-200 rounded-sm shrink-0 flex items-center justify-center text-xs text-white">
            🎵
          </div>
        )}
        <div>
          <p className="font-medium line-clamp-1">{song.track.name}</p>
          <p className="text-sm line-clamp-1 text-muted-foreground ">
            {song.track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={handleClick} disabled={loading} variant="outline">
            <ChevronRight size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{song.track.name}</DialogTitle>
          {loading ? (
            <div className="bg-gray-200 animate-pulse w-[150px] md:w-[200px] h-[1rem] rounded-xs"></div>
          ) : url ? (
            <div className="flex flex-col gap-6">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {url}
              </a>
              <Button onClick={handleCopy} size="sm">
                <Copy size={16} className="mr-2" />
                {copied ? "Copied!" : "Copy URL"}
              </Button>
            </div>
          ) : (
            <p>No result found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
