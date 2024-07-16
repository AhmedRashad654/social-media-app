import { Text, Button, VStack } from "@chakra-ui/react";
import Header from "./Header";
import { request } from "../axios/axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useShowToast from "../Hooks/Toast";
import { userAtom } from "../atoms/userAtom";
import { feedPostAtom } from "../atoms/feedPostAtom";
import { checkComing, pagenationPage ,pagenationCheck} from "../atoms/pagenationAtom";

export default function FreezeAccount() {
  const toast = useShowToast();
  const [, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [, setCheckCom] = useRecoilState(checkComing);
  const [, setPage] = useRecoilState(pagenationPage);
  const [ , setFeed ] = useRecoilState( feedPostAtom );
   const [, setCheck] = useRecoilState(pagenationCheck);
  async function handleFreeze() {
    if (!window.confirm("Are You Sure Want To Freeze Account")) return;
    try {
      const response = await request.put(`/api/users/freeze`);
      if (response?.data?.message === "Account Freezed") {
        await request
          .post("/api/users/logout")
          .then((result) => {
            if (result?.data?.message === "success logout") {
              toast("success Account Freezed", "success");
              localStorage.removeItem("user");
              setUser("");
              navigate("/");
              setFeed([]);
              setPage(1);
              setCheckCom( false );
               setCheck(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Header />
      <VStack alignItems={"self-start"}>
        <Text fontWeight={"bold"}>Freeze Your Account</Text>
        <Text>You can unfreeze your account anytime by logging in </Text>
        <Button
          fontSize={"14px"}
          backgroundColor={"pink"}
          color={"black"}
          h={8}
          _hover={{ background: "pink" }}
          onClick={handleFreeze}
        >
          Freeze
        </Button>
      </VStack>
    </>
  );
}
