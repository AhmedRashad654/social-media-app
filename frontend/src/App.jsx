import { useRecoilState } from "recoil";
import { userAtom } from "./atoms/userAtom";
import { Navigate } from "react-router-dom";
import UserPost from "./componants/UserPost";
import Header from "./componants/Header";
import { request } from "./axios/axios";
import { useEffect} from "react";
import { Text } from "@chakra-ui/react";
import { feedPostAtom } from "./atoms/feedPostAtom";

export default function App() {
  const [ user, ] = useRecoilState( userAtom );
  const [feedPost, setFeedPost] = useRecoilState(feedPostAtom);
  useEffect( () => {
      async function getFeedPost() {
        const response = await request.get(`api/posts/feed`);
        setFeedPost( response?.data?.data );       
      }
    if (user) {
      getFeedPost();
    }
  }, [setFeedPost, user]);
  if (!user) {
    return <Navigate to={"/auth"} />;
  }
  
  return (
    <>
      <Header />
      {feedPost && feedPost.length === 0 && (
        <Text>Follow Some People To Show Posts</Text>
      )}
      {feedPost &&
        feedPost?.length > 0 &&
        feedPost.map((post, index) => (
          <UserPost post={post} key={index}  />
        ))}
    </>
  );
}
