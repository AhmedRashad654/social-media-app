import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { FaSquareInstagram } from "react-icons/fa6";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import useShowToast from "../Hooks/Toast";
import { request, url } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  checkComing,
  pagenationCheck,
  pagenationPage,
} from "../atoms/pagenationAtom";
import { feedPostAtom } from "../atoms/feedPostAtom";
export default function UserHeader({ user }) {
  const [userLogin] = useRecoilState(userAtom);
  const following = user?.followers.includes(userLogin?._id);
  const navigate = useNavigate();
  const toast = useShowToast();
  const [, setCheckCom] = useRecoilState(checkComing);
  const [, setPage] = useRecoilState(pagenationPage);
  const [, setFeed] = useRecoilState(feedPostAtom);
  const [, setCheck] = useRecoilState(pagenationCheck);
  /////////copyLink///////////
  function handleCopy() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast("Link copied", "success");
    });
  }
  ////////handle Follow///////////
  const [loadingFollow, setLoadingFollow] = useState(false);
  async function handleFollow() {
    if (!userLogin) return toast("please Login");

    setLoadingFollow(true);
    const response = await request.post(`/api/users/follow/${user?._id}`);
    if (
      response.data.message === "unfollowed successfully" ||
      response.data.message === "followed successfully"
    ) {
      if (following) {
        user.followers.pop();
        toast(` unFollowed ${user?.username} successfully`, "success");
      } else {
        user.followers.push(userLogin?._id);
        toast(` Followed ${user?.username} successfully`, "success");
      }
      setFeed([]);
      setPage(1);
      setCheckCom(false);
      setCheck(false);
    }

    setLoadingFollow(false);
  }
  return (
    <>
      <VStack gap={5} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"} alignItems={"center"}>
          <Box>
            <Text fontWeight={"bold"} fontSize={"2xl"}>
              {user?.username}
            </Text>
            <Flex gap={"5px"} alignItems={"center"}>
              <Text fontSize={"sm"}>{user?.name}</Text>
              <Text
                fontSize={"sm"}
                bg={"gray.dark"}
                p={1}
                color={"gray.light"}
                borderRadius={5}
              >
                threades.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name={user?.username}
              src={`${url}/${user?.profile_pic}`}
              size={{
                base: "sm",
                md: "lg",
                lg: "xl",
              }}
            />
          </Box>
        </Flex>

        <Text fontSize={"sm"} marginTop={-5}>
          {user?.bio}
        </Text>
        {userLogin?._id === user?._id && (
          <Button onClick={() => navigate("/updateProfile")}>
            update Profile
          </Button>
        )}
        {userLogin?._id !== user?._id && (
          <Button onClick={handleFollow} isLoading={loadingFollow}>
            {following ? "unFollow" : "Follow"}
          </Button>
        )}
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
          <Flex
            gap={1}
            alignItems={"center"}
            fontSize={"sm"}
            color={"gray.light"}
          >
            <Text>{user?.followers?.length} followers</Text>
            <Text w={1} h={1} borderRadius={"full"} bg={"gray"}></Text>
            <Text>instagram.com</Text>
          </Flex>
          <Flex>
            <FaSquareInstagram size={35} className="icon-custom" />
            <Menu>
              <MenuButton className="icon-custom">
                <HiOutlineDotsCircleHorizontal size={27} />
              </MenuButton>
              <MenuList p={0}>
                <MenuItem fontSize={"sm"} onClick={handleCopy}>
                  copy Link
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        <Flex w={"full"}>
          <Flex
            flex={1}
            pb={3}
            borderBottom={"1.5px solid white"}
            justifyContent={"center"}
            cursor={"pointer"}
          >
            {" "}
            <Text>Thread</Text>
          </Flex>
          <Flex
            flex={1}
            pb={3}
            borderBottom={"1px solid gray"}
            justifyContent={"center"}
            cursor={"pointer"}
            color={"gray.light"}
          >
            <Text>Relipes</Text>
          </Flex>
        </Flex>
      </VStack>
    </>
  );
}
UserHeader.propTypes = {
  user: PropTypes.object,
};
