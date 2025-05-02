import { ArrowRight } from "lucide-react";
import spotifyLogo from "./assets/spotify.svg";
import youtubeLogo from "./assets/youtube.svg";

export default function Header() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center text-balance">
        Spotify to YouTube Playlist Converter
      </h1>
      <div className="flex gap-3 md:gap-5 items-center justify-center">
        <img src={spotifyLogo} className="w-[40px] md:w-[50px]" />
        <ArrowRight />
        <img src={youtubeLogo} className="w-[40px] md:w-[50px]" />
      </div>
    </div>
  );
}
