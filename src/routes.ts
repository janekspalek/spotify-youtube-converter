import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";
import PlaylistsPage from "./PlaylistsPage";
import PlaylistPage from "./PlaylistPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "playlists",
        children: [
          { index: true, Component: PlaylistsPage },
          { path: ":id", Component: PlaylistPage },
        ],
      },
    ],
  },
]);
