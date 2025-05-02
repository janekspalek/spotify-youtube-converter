import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserRow from "./UserRow";
import { fetchProfile, fetchToken } from "./lib/api";
import { Outlet, useNavigate } from "react-router";
import LoginForm from "./LoginForm";
import { User } from "./types/user";
import Header from "./Header";
import LoadingRow from "./LoadingRow";

export default function AppLayout() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !localStorage.getItem("access_token")) {
      fetchToken(code).then((token) => {
        if (token) {
          setToken(token);
          window.history.replaceState({}, document.title, "/");
        }
      });
    } else {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(token!),
    enabled: !!token,
  });

  useEffect(() => {
    if (token && window.location.pathname === "/") {
      navigate("/playlists");
    }
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <div className="flex justify-center px-4 py-10 md:px-10 md:py-20">
      <div className="flex flex-col justify-center border rounded-lg">
        <Header />
        {!token ? (
          <LoginForm />
        ) : (
          <div>
            <div className="w-full md:w-[500px]">
              <Outlet context={{ token }} />
            </div>
            <div className="p-4 md:p-6 border-t">
              {profileLoading && profile ? (
                <div className="p-2 flex flex-col gap-4">
                  <LoadingRow />
                </div>
              ) : profile ? (
                <UserRow profile={profile} logout={logout} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
