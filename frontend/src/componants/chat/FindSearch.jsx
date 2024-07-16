import { Avatar, Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { url } from "../../axios/axios";

import verified from "../../../public/verified.png";
import PropTypes from "prop-types";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
import { userAtom } from "../../atoms/userAtom";
export default function FindSearch({ e, onlineUser }) {

  const [, setSelect] = useRecoilState(selectConverstion);
  const [conver] = useRecoilState(converstionArray);

  const user = useRecoilValue(userAtom);
  const isOnline = Array.isArray(onlineUser) && onlineUser.includes(e?._id);
  return (
    <Flex
      justifyContent={"center"}
      gap={"2"}
      cursor={"pointer"}
      onClick={() => {
        if (e?._id === user?._id) {
          return alert("cannot send message to self");
        }

        conver.map((conv) => {
          const findConv = conv.practictions[0]?._id === e?._id;
          if (findConv) {
            setSelect({
              converstionId: conv?._id,
              userId: e?._id,
              username: e?.username,
              profile_pic: e?.profile_pic,
            });
          }
          if (!findConv) {
            setSelect({
              converstionId: 123,
              userId: e?._id,
              username: e?.username,
              profile_pic: e?.profile_pic,
            });
          }
        });
        if (conver.length === 0) {
          setSelect({
            converstionId: 123,
            userId: e?._id,
            username: e?.username,
            profile_pic: e?.profile_pic,
          });
        }
      }}
    >
      <Box position={"relative"}>
        <Avatar
          name={e?.username}
          size={"sm"}
          src={`${url}/${e?.profile_pic}`}
        />
        {isOnline && (
          <Box
            position={"absolute"}
            right={"-2px"}
            top={4}
            w={2}
            h={2}
            borderRadius={"50%"}
            background={"green"}
          ></Box>
        )}
      </Box>

      <VStack alignItems={"self-start"} justifyContent={"center"} gap={"-5"}>
        <Flex alignItems={"center"} gap={1}>
          <Text fontSize={"12px"}>{e?.username}</Text>

          <Image src={verified} w={"15px"} h={"15px"} />
        </Flex>
      </VStack>
    </Flex>
  );
}
FindSearch.propTypes = {
  e: PropTypes.object,
  onlineUser: PropTypes.array,
};
