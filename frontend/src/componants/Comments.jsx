import { Avatar, Flex, Text, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
export default function Comments({ comment }) {
  return (
    <>
      <Flex gap={"2"} alignItems={"center"}>
        <Flex>
          <Avatar
            name={comment?.username}
            src={`http://localhost:5000/${comment?.profile_pic}`}
            w={{ lg: "35px", base: "35px" }}
            h={{ lg: "35px", base: "35px" }}
          />
        </Flex>
        <VStack marginTop={4} gap={1} alignItems={"self-start"}>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {comment?.username}
          </Text>
          <Text fontSize={12}>{comment?.text}</Text>
        </VStack>
      </Flex>
      <hr style={{ marginTop: "5px" }} />
    </>
  );
}
Comments.propTypes = {
  comment: PropTypes.object,
};
