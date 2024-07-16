import { createBrowserRouter } from "react-router-dom";
import UserPage from "../pages/UserPage";
import App from "../App";
import PostPage from "../pages/PostPage";
import Auth from "../pages/Auth";
import UpdateProfile from "../componants/UpdateProfile";
import PageChat from "../pages/PageChat";
import FreezeAccount from "../componants/FreezeAccount";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/updateProfile",
    element: <UpdateProfile />,
  },
  {
    path: "/:username",
    element: <UserPage />,
  },
  {
    path: "/:username/post/:pid",
    element: <PostPage />,
  },
  {
    path: "/chatpage",
    element: <PageChat />,
  },
  {
    path: "/freeze",
    element: <FreezeAccount />,
  },
]);
