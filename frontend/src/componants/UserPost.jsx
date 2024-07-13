import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import check from "../../public/verified.png";
import { url } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { deletePost } from "../helpers/api";
import useShowToast from "../Hooks/Toast";
import { feedPostAtom } from "../atoms/feedPostAtom";
import Actions from "./Actions";
import { Link, useNavigate } from "react-router-dom";
import { specialPost } from "../atoms/SpecialPost";
export default function UserPost({ post, special }) {
  const [user] = useRecoilState(userAtom);
  const [, setFeedPost] = useRecoilState(feedPostAtom);
  const [, setSpecial] = useRecoilState(specialPost);

  const toast = useShowToast();
  async function handleDelete(e, id) {
    e.preventDefault();
    try {
      const result = await deletePost(id);
      if (result?.data?.message === "post deleted successfully") {
        toast("post deleted successfully", "success");
        setFeedPost((Del) => Del.filter((e) => e?._id !== id));
        setSpecial((Del) => Del.filter((e) => e?._id !== id));
      }
    } catch (error) {
      toast(error?.response?.data?.error, "error");
      console.log(error);
    }
  }
  ////////goingProfile/////////
  const navigate = useNavigate();
  function goingProfile(e) {
    e.preventDefault();
    navigate(`/${content?.userId?.username}`);
  }
  /////////////////////
  const content = post || special;
  return (
    <Link to={`/${content?.userId?.username}/post/${content?._id}`}>
      <Flex gap={3} mb={10} py={5}>
        <Flex flexDirection={"column"} gap={1} alignItems={"center"}>
          <Avatar
            src={`${url}/${content?.userId?.profile_pic}`}
            name={content?.userId?.username}
            size={"md"}
            onClick={goingProfile}
          />
          <Box w="1px" h={"100%"} bg="gray.light" my={2}></Box>
          <Box position={"relative"}>
            {content?.replias?.length === 0 && <Box>🥱</Box>}
            {content?.replias?.length === 1 && (
              <Avatar
                name={content?.replias[0]?.username}
                src={`${url}/${content?.replias[0]?.profile_pic}`}
                size={"2xs"}
                position={"absolute"}
                right={-2}
                top={0}
              />
            )}
            {content?.replias?.length === 2 && (
              <>
                <Avatar
                  name={content?.replias[0]?.username}
                  src={`${url}/${content?.replias[0]?.profile_pic}`}
                  size={"2xs"}
                  position={"absolute"}
                  right={0}
                  top={0}
                />
                <Avatar
                  name={content?.replias[1]?.username}
                  src={`${url}/${content?.replias[1]?.profile_pic}`}
                  size={"2xs"}
                  position={"absolute"}
                  right={"-20px"}
                  top={0}
                />
              </>
            )}
            {content?.replias?.length >= 3 && (
              <>
                <Avatar
                  name={content?.replias[0]?.username}
                  src={`${url}/${content?.replias[0]?.profile_pic}`}
                  size={"2xs"}
                  position={"absolute"}
                  right={'4px'}
                  top={0}
                />
                <Avatar
                  name={content?.replias[1]?.username}
                  src={`${url}/${content?.replias[1]?.profile_pic}`}
                  size={"2xs"}
                  position={"absolute"}
                  right={"-20px"}
                  top={0}
                />
                <Avatar
                  name={content?.replias[2]?.username}
                  src={`${url}/${content?.replias[2]?.profile_pic}`}
                  size={"2xs"}
                  position={"absolute"}
                  right={'-5px'}
                  top={6}
                />
              </>
            )}
          </Box>
        </Flex>
        <Flex flexDirection={"column"} w={"full"} gap={2}>
          <Flex
            justifyContent={"space-between"}
            w={"full"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} gap={2}>
              <Text fontWeight={"bold"} onClick={goingProfile}>
                {content?.userId?.username}
              </Text>
              <Image src={check} alt="verived" w={4} h={4} />
            </Flex>
            <Flex alignItems={"center"} gap={3}>
              <Text color={"gray.light"} fontSize={"sm"}>
                {content?.createdAt?.slice(0, 10)}
              </Text>
              {content?.userId?._id === user?._id && (
                <DeleteIcon
                  onClick={(e) => handleDelete(e, content?._id)}
                  cursor={"pointer"}
                />
              )}
            </Flex>
          </Flex>
          {content?.text && (
            <Text fontSize={"xs"} marginBottom={2}>
              {content?.text}
            </Text>
          )}
          {content?.img && (
            <Flex w={"full"}>
              <Image
                src={`${url}/${content?.img}`}
                alt="posts"
                borderRadius={"5px"}
                border={"1px solid gray"}
                w={"full"}
              />
            </Flex>
          )}

          <Flex>
            <Actions post={post} special={special} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}
UserPost.propTypes = {
  post: PropTypes.object,
  setFeedPost: PropTypes.array,
  special: PropTypes.object,
};
