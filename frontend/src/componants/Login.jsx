/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  useColorMode,
  FormHelperText,
  Flex,
  Box,
} from "@chakra-ui/react";
import { request } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import useShowToast from "../Hooks/Toast";
export default function Login({ setAuth }) {
  const toast = useShowToast();
  const { colorMode } = useColorMode();

  const [_, setUser] = useRecoilState(userAtom);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  async function onSubmit(data) {
    try {
      await request
        .post("/api/users/login", data)
        .then((result) => {
          if (result?.data?._id) {
            toast("success Login", "success");

            localStorage.setItem("user", JSON.stringify(result?.data));
            setUser(result?.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast(error?.response?.data?.error, "error");
        });
    } catch (error) {
      toast({
        title: "error",
        description: error?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Flex flexDirection={"column"} gap={3}>
      <Box textAlign={"center"} fontWeight={"bold"} fontSize={30}>
        Login
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="forms"
        style={{
          backgroundColor: `${colorMode === "dark" ? "#1e1e1e" : ""}`,
        }}
      >
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
        <FormControl isInvalid={errors.password} mb={4}>
          <FormLabel mb={3}>Password</FormLabel>
          <Input
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          mt={3}
          w={"full"}
          bg={"gray.light"}
          type="submit"
          isLoading={isSubmitting}
        >
          Login
        </Button>

        <FormControl mx={"auto"} my={5} textAlign={"center"}>
          <FormHelperText color={colorMode === "dark" ? "white" : "black"}>
            No hava an account?{" "}
            <span
              onClick={() => setAuth("register")}
              style={{ color: "#8686d4", cursor: "pointer" }}
            >
              Sign up
            </span>
          </FormHelperText>
        </FormControl>
      </form>
    </Flex>
  );
}
