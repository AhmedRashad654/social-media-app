import { Box } from "@chakra-ui/react";
import Header from "../componants/Header";
import { request } from "../axios/axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import PostDetails from "../componants/PostDetails";
import { useRecoilState } from "recoil";
import { singlePostAtom } from "../atoms/singlePost";
import useShowToast from "../Hooks/Toast";
export default function PostPage() {
  const { pid } = useParams();
  const [, setSingle] = useRecoilState(singlePostAtom);
  const toast = useShowToast();
  useEffect(() => {
    async function getSinglePost() {
      try {
        const response = await request.get(`/api/posts/single/${pid}`);
        setSingle(response?.data?.data);
      } catch (error) {
        toast(error?.response?.data?.error, "error");
      }
    }
    getSinglePost();
  }, [pid, setSingle, toast]);
  return (
    <Box>
      <Header />
      <PostDetails />
    </Box>
  );
}
