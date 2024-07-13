import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import verived from "../../../public/verified.png";
import Messages from "./Messages";
import { useContext, useEffect, useRef } from "react";
import { request, url } from "../../axios/axios";
import { useRecoilState } from "recoil";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
import { useState } from "react";

import PartSendMessage from "./PartSendMessage";
import { SocketContext } from "../../context/socketContext";
export default function Chating() {
  const [select] = useRecoilState(selectConverstion);
  const [, setConversetion] = useRecoilState(converstionArray);
  const { socketValue } = useContext(SocketContext);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    setMessage([]);
    async function getMessages() {
      setLoading(true);
      const response = await request.get(`/api/chat/${select.converstionId}`);
      setMessage(response?.data);
      setLoading(false);
    }
    if (select.converstionId !== 123) {
      getMessages();
    }
  }, [select]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
  useEffect(() => {
    const handleMessage = (msg) => {
      setMessage((prev) => [...prev, msg]);
      setConversetion((prevConversetion) =>
        prevConversetion.map((e) => {
          if (e._id === msg.converstionId) {
            return {
              ...e,
              lastMessage: {
                text: msg?.text,
                sender: msg?.sender,
              },
            };
          }
          return e;
        })
      );
    };
    socketValue?.on("new message", handleMessage);

    return () => {
      socketValue?.off("new message", handleMessage);
    };
  }, [setConversetion, socketValue]);
  return (
    <VStack
      w={"100%"}
      bg={"gray.dark"}
      h={"60vh"}
      overflowY={"auto"}
      marginTop={"10px"}
      borderRadius={"5"}
      alignItems={"self-start"}
      p={2}
      paddingBottom={3}
    >
      <Flex gap={2} h={"9%"}>
        <Avatar
          name={select?.username}
          src={`${url}/${select?.profile_pic}`}
          size={"sm"}
        />
        <Flex alignItems={"center"} gap={"1px"}>
          <Text>{select?.username}</Text>
          <Image src={verived} w={"15"} h={"15"} />
        </Flex>
      </Flex>
      <Divider />
      <Box h={"90%"} overflow={"auto"} w={"full"} pr={2} pb={2}>
        <Messages message={message} loading={loading} />
        <div ref={messagesEndRef} />
      </Box>
      <PartSendMessage setMessage={setMessage} />
    </VStack>
  );
}
