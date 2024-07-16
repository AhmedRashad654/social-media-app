import { IoCheckmarkDone } from "react-icons/io5";
import { Avatar, Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { selectConverstion } from "../../atoms/converstionAtom";
import { userAtom } from "../../atoms/userAtom";
import { url } from "../../axios/axios";
import OpacityMessage from "./OpacityMessage";
export default function Messages({ message, loading }) {
  const [select] = useRecoilState(selectConverstion);
  const [user] = useRecoilState(userAtom);
  return (
    <>
      {loading && <OpacityMessage />}
      <VStack w={"full"}>
        {message &&
          message.map((e, i) => (
            <Flex
              gap={1}
              key={i}
              justifyContent={e?.sender === user?._id ? "end" : "start"}
              flexDirection={e?.sender === user?._id ? "row" : "row-reverse"}
              w={"full"}
            >
              {e?.text !== "" && (
                <>
                  {" "}
                  <Flex
                    bg={"#9fc69f"}
                    pt={1}
                    px={2}
                    borderRadius={5}
                    alignItems={"center"}
                    gap={1}
                  >
                    {" "}
                    <Text marginTop={-2}>{e?.text}</Text>
                    <IoCheckmarkDone
                      w={"10px"}
                      color={e?.seen === true ? "#6666c7" : ""}
                      className={e?.sender !== user?._id ? "hidden" : ""}
                    />
                  </Flex>
                </>
              )}
              {e?.img !== "" && (
                <Box position={"relative"}>
                  {" "}
                  <Image src={`${url}/${e?.img}`} w={100} cursor={"pointer"} />
                  <Box position={"absolute"} right={1} bottom={1}>
                    <IoCheckmarkDone
                      w={"10px"}
                      color={e?.seen === true ? "#6666c7" : ""}
                      className={e?.sender !== user?._id ? "hidden" : ""}
                    />
                  </Box>
                </Box>
              )}
              <Avatar
                name={
                  e?.sender === user?._id ? user?.username : select?.username
                }
                src={
                  e?.sender === user?._id
                    ? `${url}/${user?.profile_pic}`
                    : `${url}/${select?.profile_pic}`
                }
                size={"sm"}
              />
            </Flex>
          ))}
      </VStack>
    </>
  );
}
Messages.propTypes = {
  message: PropTypes.array,
  loading: PropTypes.bool,
};
