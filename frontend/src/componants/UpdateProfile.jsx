/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  useColorMode,
  Flex,
  Box,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { request } from "../axios/axios";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function UpdateProfile() {
  const toast = useToast();
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useRecoilState(userAtom);
  const [imgReader, setImgReader] = useState();
  const { colorMode } = useColorMode();
  const [imgSend, setImgSend] = useState();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (user) {
      setValue("name", user?.name);
      setValue("username", user?.username);
      setValue("bio", user?.bio);
      setValue("email", user?.email);
    }
  }, [setValue, user]);
  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("username", data?.username);
    formData.append("email", data?.email);
    formData.append("bio", data?.bio);
    formData.append("password", data?.password);
    if (imgSend) {
      formData.append("profile_pic", imgSend);
    }

    try {
      await request
        .patch(`/api/users/${user._id}`, formData)
        .then((result) => {
          if (result?.data?.message === "user updated successfully") {
            toast({
              title: result?.data?.message,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            localStorage.setItem("user", JSON.stringify(result?.data?.data));
            setUser(JSON.parse(localStorage.getItem("user")));
          }
        })
        .catch((error) => {
          toast({
            title: "error",
            description: error?.response?.data?.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      toast({
        title: "error",
        description: error.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  ////////handleChangeImage/////////
  function handleChangeImage(e) {
    const file = e.target.files[0];
    setImgSend(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        setImgReader(e.target.result);
      };
    }
  }
  return (
    <>
      <Header />
      <Flex flexDirection={"column"} gap={3}>
        <Box textAlign={"center"} fontWeight={"bold"} fontSize={30}>
          Update Profile
        </Box>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="forms"
          style={{
            backgroundColor: `${colorMode === "dark" ? "#1e1e1e" : ""}`,
          }}
        >
          <Flex mb={4} justifyContent={"space-between"} alignItems={"center"}>
            <Avatar
              src={
                imgReader
                  ? imgReader
                  : `http://localhost:5000/${user?.profile_pic}`
              }
            />
            <FormControl w={"fit"} mt={3}>
              <FormLabel
                bg={"gray.light"}
                px={"2"}
                py={"1"}
                rounded={"5"}
                cursor={"pointer"}
                htmlFor="avatar"
              >
                Change Image
              </FormLabel>
              <Input
                type="file"
                display={"none"}
                id="avatar"
                onChange={handleChangeImage}
              />
            </FormControl>
          </Flex>

          <FormControl isInvalid={errors.username} mb={4}>
            <FormLabel mb={3}>username</FormLabel>
            <Input
              placeholder="username"
              {...register("username", {
                required: "username is required",
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.name} mb={4}>
            <FormLabel mb={3}>name</FormLabel>
            <Input
              placeholder="name"
              {...register("name", {
                required: "name is required",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.bio} mb={4}>
            <FormLabel mb={3}>bio</FormLabel>
            <Input
              placeholder="bio"
              {...register("bio", {
                required: "bio is required",
              })}
            />
            <FormErrorMessage>
              {errors.bio && errors.bio.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email} mb={4}>
            <FormLabel mb={3}>email</FormLabel>
            <Input
              type="email"
              placeholder="email"
              {...register("email", {
                required: "email is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} mb={4}>
            <FormLabel mb={3}>Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
          </FormControl>

          <Button
            mt={3}
            w={"full"}
            bg={"gray.light"}
            type="submit"
            isLoading={isSubmitting}
          >
            Update
          </Button>
        </form>
      </Flex>
    </>
  );
}
