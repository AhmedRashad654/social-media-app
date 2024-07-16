import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Input,
  Box,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import useShowToast from "../Hooks/Toast";
import { request } from "../axios/axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { specialPost } from "../atoms/SpecialPost";

export default function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState();
  const [imgUpload, setImageUpload] = useState();
  const [imgReader, setImageReader] = useState();
  const [isLoading, setIsLoading] = useState();
  const [, setSpecialPostAdd] = useRecoilState(specialPost);

  const toast = useShowToast();
  function handleChangeImage(e) {
    const file = e.target.files[0];
    setImageUpload(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        setImageReader(e.target.result);
      };
    }
  }
  //////////handleText////////
  function handleText(e) {
    const char = e.target.value;
    if (char.length < 500) {
      setText(char);
    } else {
      toast("length text must be not greater about 500", "warning");
    }
  }
  //////////create Post/////////
  async function createPost() {
    if (text || imgUpload) {
      const formData = new FormData();
      if (text) {
        formData.append("text", text);
      }
      if (imgUpload) {
        formData.append("img", imgUpload);
      }

      try {
        setIsLoading(true);
        const response = await request.post(`/api/posts/`, formData);
        if (response?.data?.message === "create post successfully") {
          toast("create post successfully", "success");
        }

        setSpecialPostAdd((posts) => [response?.data?.data, ...posts]);
        onClose();
        setText("");
        setImageUpload("");
        setImageReader("");
        setIsLoading(false);
      } catch (error) {
        toast(error?.response?.data?.message, "error");
        setIsLoading(false);
      }
    } else {
      toast("text or img is required");
    }
  }

  ///////create user////////
  const [user] = useRecoilState(userAtom);
  if (!user) return;
  return (
    <>
      <Button
        onClick={onOpen}
        position={"fixed"}
        right={{
          lg: "15%",
          md: "5%",
          base: "3%",
        }}
        bottom={"10%"}
      >
        {" "}
        <AddIcon />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setImageReader("");
          setImageUpload("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea onChange={handleText} value={text}></Textarea>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Box>
                <label htmlFor="image">
                  <FaImage style={{ marginTop: "10px", cursor: "pointer" }} />
                </label>
                <Input
                  type="file"
                  id="image"
                  hidden
                  onChange={handleChangeImage}
                />
              </Box>
              {imgReader && (
                <Box>
                  <DeleteIcon
                    onClick={() => {
                      setImageReader("");
                      setImageUpload("");
                    }}
                    cursor={"pointer"}
                  />
                </Box>
              )}
            </Flex>
            {imgReader && <Image src={imgReader} alt="post" mt={3} />}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={createPost}
              isLoading={isLoading}
              loadingText={"isLoading"}
            >
              Add Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
