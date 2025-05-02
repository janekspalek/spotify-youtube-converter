import { Song } from "@/types/song";

const scope =
  "playlist-read-private playlist-read-collaborative user-read-email";
const clientId = "69570d46baf848b6b0e64a6f27412083";
const redirectUri = "https://spotify-youtube-converter.onrender.com";

const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const loginWithSpotify = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export async function fetchToken(code: string): Promise<string | null> {
  const codeVerifier = localStorage.getItem("code_verifier");
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier || "",
    }),
  };

  const res = await fetch("https://accounts.spotify.com/api/token", payload);
  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  }

  console.error("Token fetch failed:", data);
  return null;
}

export const fetchProfile = async (token: string) => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/";
    return [];
  }

  return res.json();
};

export const fetchPlaylists = async (token: string) => {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/";
    return [];
  }

  const data = await res.json();
  return data.items;
};

export async function fetchPlaylistTracks(
  id: string,
  token: string
): Promise<Song[]> {
  const allTracks: Song[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist tracks");
    }

    const data = await response.json();

    allTracks.push(...data.items);

    if (data.items.length < limit) {
      break;
    }

    offset += limit;
  }

  console.log(allTracks);

  return allTracks;
}

export async function fetchPlaylist(id: string, token: string) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function findYoutubeUrl(query: string): Promise<string | null> {
  const invidiousInstances = [
    "https://invidious.snopyta.org",
    "https://invidious.tiekoetter.com",
    "https://invidious.privacydev.net",
  ];

  for (const instance of invidiousInstances) {
    try {
      const res = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return `https://www.youtube.com/watch?v=${data[0].videoId}`;
      }
    } catch (e) {
      console.warn(`Failed to search on ${instance}`, e);
    }
  }

  return null;
}
