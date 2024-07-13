import { Avatar, Flex, Image, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import check from "../../public/verified.png";
import { url } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { deletePost } from "../helpers/api";
import useShowToast from "../Hooks/Toast";
import { feedPostAtom } from "../atoms/feedPostAtom";
import { useNavigate } from "react-router-dom";
import Welcome from "../ui/Welcome";
import Comments from "./Comments";
import { singlePostAtom } from "../atoms/singlePost";
export default function PostDetails() {
  const [user] = useRecoilState(userAtom);
  const [singlePost] = useRecoilState(singlePostAtom);
  const [, setFeedPost] = useRecoilState(feedPostAtom);
  const toast = useShowToast();
  async function handleDelete(id) {
    try {
      const result = await deletePost(id);
      if (result?.data?.message === "post deleted successfully") {
        toast("post deleted successfully", "success");
        setFeedPost((Del) => Del.filter((e) => e?._id !== id));
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
    navigate(`/${singlePost?.userId?.username}`);
  }
  return (
    <Flex gap={3} mb={10} py={5}>
      <Flex flexDirection={"column"} w={"full"} gap={2}>
        <Flex gap={2} alignItems={"center"}>
          <Avatar
            src={`${url}/${singlePost?.userId?.profile_pic}`}
            name={singlePost?.userId?.username}
            size={"md"}
            onClick={goingProfile}
          />
          <Flex
            justifyContent={"space-between"}
            w={"full"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} gap={2}>
              <Text fontWeight={"bold"} onClick={goingProfile}>
                {singlePost?.userId?.username}
              </Text>
              <Image src={check} alt="verived" w={4} h={4} />
            </Flex>
            <Flex alignItems={"center"} gap={3}>
              <Text color={"gray.light"} fontSize={"sm"}>
                {singlePost?.createdAt?.slice(0, 10)}
              </Text>
              {singlePost?.userId?._id === user?._id && (
                <DeleteIcon
                  onClick={() => handleDelete(singlePost?._id)}
                  cursor={"pointer"}
                />
              )}
            </Flex>
          </Flex>
        </Flex>

        {singlePost?.text && (
          <Text fontSize={"xs"} marginBottom={2}>
            {singlePost?.text}
          </Text>
        )}
        {singlePost?.img && (
          <Flex w={"full"}>
            <Image
              src={`${url}/${singlePost?.img}`}
              alt="posts"
              borderRadius={"5px"}
              border={"1px solid gray"}
              w={"full"}
            />
          </Flex>
        )}
        <hr />
        <Welcome idPost={singlePost?._id} />
        {singlePost?.replias?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))}
      </Flex>
    </Flex>
  );
}
PostDetails.propTypes = {
  singlePost: PropTypes.object,
};
