import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { request } from "../axios/axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { useRecoilState } from "recoil";
import { feedPostAtom } from "../atoms/feedPostAtom";
import { singlePostAtom } from "../atoms/singlePost";
export default function Welcome({ idPost }) {
  const [comment, setComment] = useState();
  const [commentFeed, setCommentFeed] = useRecoilState(feedPostAtom);
  const [loading, setLoading] = useState(false);
  const [singlePost, setSingle] = useRecoilState(singlePostAtom);
  async function createComment() {
    setLoading(true);
    const response = await request.post(`/api/posts/repliy/${idPost}`, {
      text: comment,
    });
    if (response.data.message === "comment created successfully") {
      const updateReplies = commentFeed.map((e) => {
        if (e?._id === idPost) {
          return { ...e, replias: [...e.replias, response?.data?.data] };
        }
        return e;
      });
      setCommentFeed(updateReplies);
      const updateSingle = {
        ...singlePost,
        replias: [...singlePost.replias, response?.data?.data],
      };
      setSingle(updateSingle);
      setComment("");
    }
    setLoading(false);
  }

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"5"}
        my={2}
      >
        <Flex gap={2} alignItems={"center"} w={"full"}>
          <Text>👋</Text>
          <input
            placeholder="Create Comment"
            style={{
              width: comment ? "100%" : "80%",
              padding: "5px",
              outline: "none",
              backgroundColor:"transparent"
            }}
            value={comment || ""}
            onChange={(e) => setComment(e.target.value)}
          />
        </Flex>
        {comment && (
          <Button isLoading={loading}>
            {" "}
            <AddIcon onClick={createComment} />
          </Button>
        )}
      </Flex>
      <hr />
    </>
  );
}
Welcome.propTypes = {
  idPost: PropTypes.string,
};
