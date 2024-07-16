import { Flex, Text, VStack, Box } from "@chakra-ui/react";
import Header from "../componants/Header";
import YourConverstion from "../componants/chat/YourConverstion";
import { useLocation } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketContext";
import { converstionArray, selectConverstion } from "../atoms/converstionAtom";
import Chating from "../componants/chat/Chating";
export default function PageChat() {
  const location = useLocation();
  const pathname = location.pathname;
  const [conversetion, setConversetion] = useRecoilState(converstionArray);
  const { socketValue } = useContext(SocketContext);
  const [select] = useRecoilState(selectConverstion);
  const [message, setMessage] = useState([]);
  ////////////////////////////
  useEffect(() => {
    const handleMessage = (msg) => {
      if (select?.converstionId === msg.converstionId) {
        setMessage((prev) => [...prev, msg]);
      }
      const findConversetion = conversetion.find(
        (e) => e._id === msg.converstionId
      );
      if (findConversetion) {
        setConversetion((prevConversetion) =>
          prevConversetion.map((e) => {
            if (e._id === msg.converstionId) {
              return {
                ...e,
                lastMessage: {
                  text: msg?.text,
                  sender: msg?.sender,
                  img: msg?.img,
                },
              };
            }
            return e;
          })
        );
      }
      if (!findConversetion) {
        setConversetion((prev) => [
          {
            _id: msg.converstionId,
            lastMessage: {
              text: msg.text,
              sender: msg?.sender,
              img: msg?.img,
            },
            practictions: [
              {
                _id: msg?.sender,
                username: msg?.username,
                profile_pic: msg?.profile_pic,
              },
            ],
          },
          ...prev,
        ]);
      }
    };
    socketValue?.on("new message", handleMessage);

    return () => {
      socketValue?.off("new message", handleMessage);
    };
  }, [conversetion, select?.converstionId, setConversetion, socketValue]);
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      gap={3}
      transform={"translatex(-50%)"}
      w={{
        base: "90%",
        md: "60%",
      }}
    >
      <Header />
      <Flex gap={3}>
        <div className={`${pathname !== "/chatpage" && "hiddSidebar"}`}>
          <YourConverstion />
        </div>

        {select === null && (
          <VStack
            display={{
              base: "none",
              lg: "flex",
            }}
            gap={"3"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"full"}
          >
            <FaRocketchat size={45} />
            <Text>Select Some People To Start Speaking</Text>
          </VStack>
        )}
        {select !== null && (
          <Chating message={message} setMessage={setMessage} />
        )}
      </Flex>
    </Box>
  );
}
