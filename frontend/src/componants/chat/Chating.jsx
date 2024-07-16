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
import PropTypes from "prop-types";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
import { useState } from "react";
import PartSendMessage from "./PartSendMessage";
import { SocketContext } from "../../context/socketContext";
import { userAtom } from "../../atoms/userAtom";

export default function Chating({ message, setMessage }) {
  const [select] = useRecoilState(selectConverstion);
  const [user] = useRecoilState(userAtom);
  const [, setConversetion] = useRecoilState(converstionArray);
  const { socketValue } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessage = message[message.length - 1]?.sender !== user?._id;

  useEffect(() => {
    setMessage([]);
    async function getMessages() {
      setLoading(true);
      const response = await request.get(`/api/chat/${select.converstionId}`);
      setMessage(response?.data);
      setLoading(false);
    }
    if (select && select?.converstionId !== 123 && select !== null) {
      getMessages();
    }
  }, [select, setMessage]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  useEffect(() => {
    if (lastMessage && message?.length > 0) {
      socketValue?.emit("needSeenMessage", {
        conversetionId: select.converstionId,
        userId: select.userId,
      });
    }
  }, [
    lastMessage,
    message?.length,
    select.conversetionId,
    select.converstionId,
    select.userId,
    socketValue,
  ]);
  useEffect(() => {
    const handleSeenMessage = async ({ conversetionId }) => {
      setMessage((prev) =>
        prev.map((e) => (e?.seen === false ? { ...e, seen: true } : e))
      );
      setConversetion((prev) =>
        prev.map((e) => {
          if (e?._id === conversetionId) {
            return {
              ...e,
              lastMessage: {
                ...e.lastMessage,
                seen: true,
              },
            };
          }
          return e;
        })
      );
    };

    socketValue?.on("okSeenMessage", handleSeenMessage);
    return () => {
      socketValue?.off("okSeenMessage", handleSeenMessage);
    };
  }, [setConversetion, setMessage, socketValue]);

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
Chating.propTypes = {
  message: PropTypes.array,
  setMessage: PropTypes.func,
};
