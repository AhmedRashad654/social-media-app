/* eslint-disable react-hooks/exhaustive-deps */
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms/userAtom";
import { Navigate } from "react-router-dom";
import UserPost from "./componants/UserPost";
import Header from "./componants/Header";
import { request } from "./axios/axios";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { feedPostAtom } from "./atoms/feedPostAtom";
import SuggestedUsers from "./componants/SuggestedUsers";
import {
  pagenationCheck,
  checkComing,
  pagenationPage,
} from "./atoms/pagenationAtom";
export default function App() {
  const [user] = useRecoilState(userAtom);
  const [feedPost, setFeedPost] = useRecoilState(feedPostAtom);
  const [checkCom, setCheckCom] = useRecoilState(checkComing);
  const [page, setPage] = useRecoilState(pagenationPage);
  const [check, setCheck] = useRecoilState(pagenationCheck);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (feedPost?.length > 0) {
      setCheckCom(true);
    }
  }, [feedPost?.length]);
  useEffect(() => {
    async function getFeedPost() {
      setLoading(true);
      const response = await request.get(`/api/posts/feed/${page}/5`);
      setLoading(false);

      setCheck(response?.data?.hasNextPage);
      if (feedPost?.length > 0) {
        setFeedPost((prev) => [...prev, ...response.data.data]);
      } else {
        setFeedPost(response.data.data);
      }
    }
    if (user && checkCom === false) {
      getFeedPost();
    }
  }, [page, setFeedPost, user]);
  if (!user) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      gap={3}
      transform={"translatex(-50%)"}
      w={{
        base: "90%",
        md: "60%",
        smm: "60%",
      }}
    >
      <Header />
      <Flex gap={10} alignItems={"self-start"}>
        <Box flex={70}>
          {feedPost && feedPost.length === 0 && (
            <Text>Follow Some People To Show Posts</Text>
          )}
          {feedPost &&
            feedPost?.length > 0 &&
            feedPost.map((post, index) => <UserPost post={post} key={index} />)}
        </Box>
        <Box flex={30} display={{ base: "none", smm: "block" }}>
          <SuggestedUsers />
        </Box>
      </Flex>

      {check === true && (
        <Flex justifyContent={"center"} marginY={5}>
          <Button
            onClick={() => {
              setCheckCom(false);
              setPage((prev) => prev + 1);
            }}
            isLoading={loading}
          >
            See More
          </Button>
        </Flex>
      )}
    </Box>
  );
}
