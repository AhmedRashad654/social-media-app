import { Flex, Text, VStack } from "@chakra-ui/react";
import Header from "../componants/Header";
import YourConverstion from "../componants/chat/YourConverstion";
import { Outlet, useLocation } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";
export default function PageChat() {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <>
      <Header />
      <Flex
        position={"absolute"}
        left={"50%"}
        gap={3}
        transform={"translatex(-50%)"}
        w={{
          base: "90%",
          md: "55%",
        } }
        minH={"300px"}
      >
        <div className={`${pathname !== "/chatpage" && "hiddSidebar"}`}>
          <YourConverstion />
        </div>

        {pathname === "/chatpage" && (
          <VStack
            display={{
              base: "none",
              lg: "flex",
            } }
            gap={"3"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"full"}
          >
            <FaRocketchat size={45} />
            <Text>Select Some People To Start Speaking</Text>
          </VStack>
        )}

        <Outlet />
      </Flex>
    </>
  );
}
