import { Flex, Text, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { request } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useEffect, useState } from "react";
import { feedPostAtom } from "../atoms/feedPostAtom";
import { specialPost } from "../atoms/SpecialPost";
export default function Actions({ post, special }) {
  const [user] = useRecoilState(userAtom);
  const [likes, setLikes] = useRecoilState(feedPostAtom);
  const [liked, setLiked] = useState(false);
  const [spe, setSpe] = useRecoilState(specialPost);
  const content = post || special;
  useEffect(() => {
    if (content?.likes?.includes(user?._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [content, user]);
  async function likeAndUnLike(e) {
    e.preventDefault();
    const response = await request.post(`/api/posts/like/${content._id}`);
    if (response?.data?.message === "liked successfully") {
      const updateLikes = likes.map((e) => {
        if (e?._id === content?._id) {
          return { ...e, likes: [...e.likes, user._id] };
        }
        return e;
      });

      setLikes(updateLikes);
      const updateLikesSpecial = spe.map((e) => {
        if (e?._id === content?._id) {
          return { ...e, likes: [...e.likes, user._id] };
        }
        return e;
      });
      setSpe(updateLikesSpecial);
      setLiked(true);
    } else if (response?.data?.message === "unliked successfully") {
      const udateLikes = likes.map((e) => {
        if (e?._id === content?._id) {
          return { ...e, likes: e.likes.filter((e) => e !== user._id) };
        }
        return e;
      });
      setLikes(udateLikes);
      const udateLikesSpecial = spe.map((e) => {
        if (e?._id === content?._id) {
          return { ...e, likes: e.likes.filter((e) => e !== user._id) };
        }
        return e;
      });
      setSpe(udateLikesSpecial);
      setLiked(false);
    }
  }

  return (
    <VStack alignItems={"self-start"}>
      <Flex gap={3} marginTop={2}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={likeAndUnLike}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </Flex>
      <Flex gap={1} fontSize={"sm"} textColor={"gray.light"}>
        <Text>{content?.replias?.length} replies</Text>
        <Text marginTop={-1}>.</Text>
        <Text>{content?.likes?.length} likes</Text>
      </Flex>
    </VStack>
  );
}
Actions.propTypes = {
  postId: PropTypes.string,
  post: PropTypes.object,
  special: PropTypes.object,
};
