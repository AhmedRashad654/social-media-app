import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";
import Register from "../componants/Register";
import Login from "../componants/Login";
import { Navigate } from "react-router-dom";
import { userAtom } from "../atoms/userAtom";
import Header from "../componants/Header";
export default function Auth() {
  const [auth, setAuth] = useRecoilState(authAtom);

  const [user] = useRecoilState(userAtom);
  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Header w={"full"} />
      {auth === "login" ? (
        <Login setAuth={setAuth} />
      ) : (
        <Register setAuth={setAuth} />
      )}
    </>
  );
}
