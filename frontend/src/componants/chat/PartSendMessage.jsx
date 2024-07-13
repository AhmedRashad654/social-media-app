import { Box, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FaRegImage } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import PropTypes from "prop-types";
import { request } from "../../axios/axios";
import { useRecoilState } from "recoil";
import {
  converstionArray,
  selectConverstion,
} from "../../atoms/converstionAtom";
export default function PartSendMessage({ setMessage }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [select, setSelect] = useRecoilState(selectConverstion);
  const [converstion, setConversetion] = useRecoilState(converstionArray);
  async function handleSendMessage() {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("recipiedId", select.userId);
    formData.append("img", image);

    try {
      const response = await request.post(`/api/chat`, formData);
      setMessage((prev) => [...prev, response.data]);
      setConversetion((prevConversetion) =>
        prevConversetion.map((e) => {
          if (e._id === response.data.converstionId) {
            return {
              ...e,
              lastMessage: {
                text: response.data?.text,
                sender: response.data?.sender,
              },
            };
          }
          return e;
        })
      );
      if (select.converstionId === 123) {
        setConversetion((prev) => [
          {
            _id: response.data.converstionId,
            practictions: [
              {
                _id: select.userId,
                username: select.username,
                profile_pic: select.profile_pic,
              },
            ],
            lastMessage: {
              text: response?.data?.text,
              sender: response?.data?.sender,
            },
          },
          ...prev,
        ]);
        setSelect({
          converstionId: response?.data?.converstionId,
          userId: select.userId,
          username: select.username,
          profile_pic: select.profile_pic,
        });
      }
      setText("");
      setImage("");
    } catch (error) {
      console.log(error);
    }
  }
  console.log(converstion);
  return (
    <Flex h={"9%"} gap={2} alignItems={"center"} w={"full"}>
      <Box width={"95%"} position={"relative"}>
        <Input
          placeholder="Type a message"
          onChange={(e) => setText(e.target.value)}
          value={text || ""}
        />
        <Box
          position={"absolute"}
          right={2}
          top={"30%"}
          cursor={"pointer"}
          onClick={handleSendMessage}
          zIndex={5}
          display={text === "" && image === "" ? "none" : "block"}
        >
          <MdSend />
        </Box>
      </Box>
      <label htmlFor="imageMessage">
        <FaRegImage w={"20px"} cursor={"pointer"} />
      </label>
      <Input
        type="file"
        hidden
        id="imageMessage"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </Flex>
  );
}
PartSendMessage.propTypes = {
  setMessage: PropTypes.func,
};
