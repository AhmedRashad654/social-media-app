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
  useToast,
} from "@chakra-ui/react";
import { request } from "../axios/axios";
export default function Register({ setAuth }) {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await request
        .post("/api/users/register", data)
        .then((result) => {
          if (result?.data?.message === "user Created Successfully") {
            toast({
              title: result?.data?.message,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            localStorage.setItem("user", JSON.stringify(result?.data));
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

  return (
    <Flex flexDirection={"column"} gap={3}>
      <Box textAlign={"center"} fontWeight={"bold"} fontSize={30}>
        Register
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
          Register
        </Button>

        <FormControl mx={"auto"} my={5} textAlign={"center"}>
          <FormHelperText color={colorMode === "dark" ? "white" : "black"}>
            Already have Account?{" "}
            <span
              onClick={() => setAuth("login")}
              style={{ color: "#8686d4", cursor: "pointer" }}
            >
              Login
            </span>
          </FormHelperText>
        </FormControl>
      </form>
    </Flex>
  );
}
