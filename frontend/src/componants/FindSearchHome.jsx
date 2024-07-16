import { Avatar, Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import verified from "../../public/verified.png";
import PropTypes from "prop-types";
import { url } from "../axios/axios";
export default function FindSearchHome({ e }) {
  const navigate = useNavigate();

  return (
    <Flex
      gap={"2"}
      cursor={"pointer"}
      marginBottom={3}
      onClick={() => navigate(`/${e?.username}`)}
    >
      <Box position={"relative"}>
        <Avatar
          name={e?.username}
          w={10}
          h={10}
          src={`${url}/${e?.profile_pic}`}
        />
      </Box>

      <VStack alignItems={"self-start"} justifyContent={"center"} gap={"-5"}>
        <Flex alignItems={"center"} gap={1}>
          <Text fontSize={"13px"}>{e?.username}</Text>

          <Image src={verified} w={"15px"} h={"15px"} />
        </Flex>
      </VStack>
    </Flex>
  );
}
FindSearchHome.propTypes = {
  e: PropTypes.object,
  onlineUser: PropTypes.array,
};
