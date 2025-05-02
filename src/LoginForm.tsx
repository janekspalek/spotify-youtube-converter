import { Button } from "./components/ui/button";
import { loginWithSpotify } from "./lib/api";

export default function LoginForm() {
  return (
    <div className="flex justify-center p-6 border-t">
      <Button onClick={loginWithSpotify} className="flex-1">
        Login with Spotify
      </Button>
    </div>
  );
}
