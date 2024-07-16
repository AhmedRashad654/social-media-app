import { useCallback, useEffect, useState } from "react";
import UserHeader from "../componants/UserHeader";
import UserPost from "../componants/UserPost";
import { request } from "../axios/axios";
import { useParams } from "react-router-dom";
import Header from "../componants/Header";
import { useRecoilState } from "recoil";
import { specialPost } from "../atoms/SpecialPost";
import CreatePost from "../componants/CreatePost";
export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [success, setSuccess] = useState(false);
  const [specialPostValue, setSpecialPostValue] = useRecoilState(specialPost);

  const getProfile = useCallback(async () => {
    try {
      const response = await request.get(`/api/users/profile/${username}`);
      if (response.data.message === "fetch successfully") {
        if (response?.data?.data?.freeze === true)
          return alert("user Not found");
        setSuccess(true);
        setUser(response?.data?.data);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }, [username]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);
  ///////////////////getSpecialPost/////////////
  useEffect(() => {
    async function getSpecialPost() {
      const response = await request.get(`/api/posts/special/${username}`);
      setSpecialPostValue(response?.data);
    }
    getSpecialPost();
  }, [setSpecialPostValue, username]);
  return (
    <>
      <Header />
      {success && (
        <>
          <UserHeader user={user} />
          {specialPostValue.map((special, index) => (
            <UserPost special={special} key={index} />
          ))}
          <CreatePost />
        </>
      )}
    </>
  );
}
