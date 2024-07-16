import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { url } from "../axios/axios";

export default function SuggestUser({ suggest }) {
  const navigate = useNavigate();
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      marginBottom={3}
    >
      <Flex gap={3} alignItems={"center"}>
        <Avatar
          name={suggest?.username}
          src={`${url}/${suggest?.profile_pic}`}
          w={10}
          h={10}
        />
        <Flex flexDirection={"column"} marginTop={"-5px"}>
          <Text fontWeight={"medium"}>{suggest?.username}</Text>
          <Text color={"gray"} fontSize={"12"}>
            {suggest?.name}
          </Text>
        </Flex>
      </Flex>
      <Button
        fontSize={"14px"}
        padding={3}
        h={8}
        background={"#6e8bcf"}
        _hover={{ background: "#4069c9" }}
        onClick={() => navigate(`/${suggest?.username}`)}
        cursor={"pointer"}
      >
        Visit
      </Button>
    </Flex>
  );
}
SuggestUser.propTypes = {
  suggest: PropTypes.object,
};
