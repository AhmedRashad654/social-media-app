import { Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import { RiAccountCircleLine } from "react-icons/ri";
import logoLight from "../../public/light-logo.svg";
import logoDark from "../../public/dark-logo.svg";
import { MdLogout } from "react-icons/md";
import { request } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "../Hooks/Toast";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";
export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useShowToast();
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  async function handleLogout() {
    await request
      .post("/api/users/logout")
      .then((result) => {
        if (result?.data?.message === "success logout") {
          toast(result?.data?.message, "success");
          localStorage.removeItem("user");
          setUser("");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        marginTop={6}
        marginBottom={8}
        alignItems={"center"}
        position={"relative"}
      >
        <FaHome size={30} cursor={"pointer"} onClick={() => navigate("/")} />
        <Image
          src={colorMode === "dark" ? logoLight : logoDark}
          alt="logo"
          width={30}
          onClick={toggleColorMode}
        />
        <RiAccountCircleLine
          size={30}
          cursor={"pointer"}
          onClick={() => navigate(`/${user?.username}`)}
        />
        {user ? (
          <FaRocketchat
            size={30}
            cursor={"pointer"}
            style={{ marginRight: "55px" }}
            onClick={() => navigate("/chatpage")}
          />
        ) : (
          ""
        )}

        {user ? (
          <Button
            onClick={handleLogout}
            position={"absolute"}
            top={0}
            right={0}
          >
            <MdLogout />
          </Button>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
}
