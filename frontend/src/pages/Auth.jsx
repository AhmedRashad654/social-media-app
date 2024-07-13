import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";
import Register from "../componants/Register";
import Login from "../componants/Login";
import { Navigate } from "react-router-dom";
import { userAtom } from "../atoms/userAtom";
import Header from "../componants/Header";
export default function Auth() {
  const [auth, setAuth] = useRecoilState(authAtom);
  // eslint-disable-next-line no-unused-vars
  const [user,_] = useRecoilState(userAtom);
  if (user) {
    return <Navigate to={"/"} />;
  }
  
  return (
    <div>
      <Header/>
      {auth === "login" ? (
        <Login setAuth={setAuth} />
      ) : (
        <Register setAuth={setAuth} />
      )}
    </div>
  );
}
