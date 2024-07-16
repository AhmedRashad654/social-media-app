import { IoCheckmarkDone } from "react-icons/io5";
import {
  Avatar,
  Flex,
  Image,
  Input,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import verified from "../../../public/verified.png";
import { useCallback, useContext, useEffect, useState } from "react";
import { request, url } from "../../axios/axios";
import { useRecoilState } from "recoil";
import { FaImage } from "react-icons/fa";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
import FindSearch from "./FindSearch";
import OpacitySearch from "./OpacitySearch";
import { userAtom } from "../../atoms/userAtom";
import { SocketContext } from "../../context/socketContext";
export default function YourConverstion() {

  const [valueSearch, setValueSearch] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const [converstion, setConverstion] = useRecoilState(converstionArray);
  const { onlineUser } = useContext(SocketContext);
  const [, setSelect] = useRecoilState(selectConverstion);
  const [loading, setLoading] = useState(false);
  const [user] = useRecoilState(userAtom);
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await request.get(`/api/users/search/${valueSearch}`);
      setResultSearch(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [valueSearch]);

  useEffect(() => {
    if (valueSearch) {
      handleSearch();
    }
  }, [handleSearch, valueSearch]);
  useEffect(() => {
    async function getAllConversetion() {
      try {
        const response = await request.get("/api/chat/converstions");
        setConverstion(response?.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllConversetion();
  }, [setConverstion]);

  return (
    <VStack w={"100%"} alignItems={"self-start"}>
      <Text>Your Converstion</Text>
      <Flex gap={1}>
        <Input
          placeholder="search for a user"
          onChange={(e) => setValueSearch(e.target.value)}
        />
      </Flex>
      <VStack gap={2} alignItems={"self-start"}>
        {loading &&
          [1, 2, 3].map((e, i) => (
            <OpacitySearch key={i} w1={"80px"} w2={"90px"} />
          ))}
        {!loading &&
          valueSearch === "" &&
          converstion.map((e, i) => (
            <Flex
              key={i}
              gap={"2"}
              cursor={"pointer"}
              onClick={() => {
                setSelect({
                  converstionId: e?._id,
                  userId: e?.practictions[0]?._id,
                  username: e?.practictions[0]?.username,
                  profile_pic: e?.practictions[0]?.profile_pic,
                });
              }}
            >
              <Box position={"relative"}>
                <Avatar
                  name={e?.practictions[0]?.username}
                  src={`${url}/${e?.practictions[0]?.profile_pic}`}
                  size={"sm"}
                />
                {Array.isArray(onlineUser) &&
                  onlineUser?.includes(e?.practictions[0]?._id) && (
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

              <VStack
                alignItems={"self-start"}
                justifyContent={"center"}
                gap={"-5"}
              >
                <Flex alignItems={"center"} gap={1}>
                  <Text fontSize={"12px"}>{e?.practictions[0]?.username}</Text>
                  <Image src={verified} w={"15px"} h={"15px"} />
                </Flex>
                <Flex gap={1}>
                  {e?.lastMessage?.sender === user?._id && (
                    <IoCheckmarkDone
                      w={"10px"}
                      color={e?.lastMessage?.seen === true ? "#6666c7" : ""}
                    />
                  )}
                  {e?.lastMessage?.text !== "" && (
                    <Text fontSize={"10px"}>
                      {e?.lastMessage?.text?.length > 10
                        ? e?.lastMessage?.text?.slice(0, 10) + "..."
                        : e?.lastMessage?.text}
                    </Text>
                  )}
                  {e?.lastMessage?.img && e?.lastMessage?.img !== "" && (
                    <FaImage size={10} />
                  )}
                </Flex>
              </VStack>
            </Flex>
          ))}
        {!loading &&
          valueSearch !== "" &&
          resultSearch
            ?.filter((e) => e?.freeze !== true)
            .map((e, i) => (
              <FindSearch e={e} key={i} onlineUser={onlineUser} />
            ))}
        {!loading && valueSearch !== "" && resultSearch?.length === 0 && (
          <Text fontSize={"sm"} marginLeft={"8"} marginTop={"5"}>
            Not Found User
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
