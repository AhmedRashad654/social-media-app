import { Avatar, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { url } from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import verified from "../../../public/verified.png";
import PropTypes from "prop-types";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
import { userAtom } from "../../atoms/userAtom";
export default function FindSearch({ e }) {
  const navigate = useNavigate();
  const [, setSelect] = useRecoilState(selectConverstion);
  const [conver] = useRecoilState(converstionArray);

  const user = useRecoilValue(userAtom);
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

        navigate(`/chatpage/containerMessage`);
      }}
    >
      <Avatar name={e?.username} size={"sm"} src={`${url}/${e?.profile_pic}`} />
      <VStack alignItems={"self-start"} justifyContent={"center"} gap={"-5"}>
        <Flex alignItems={"center"} gap={1}>
          <Text fontSize={"12px"}>{e?.username}</Text>
          <Image src={verified} w={"15px"} h={"15px"} />
        </Flex>
        <Flex gap={1}>
          <CheckIcon w={"10px"} color={"gray.light"} />
          <Text fontSize={"10px"}>Hey</Text>
        </Flex>
      </VStack>
    </Flex>
  );
}
FindSearch.propTypes = {
  e: PropTypes.object,
};
