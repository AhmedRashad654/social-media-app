import { useToast } from "@chakra-ui/react";

export default function useShowToast() {
  const toast = useToast();
  const showToast = (title, status, description) => {
    toast({
      title,
      status,
      description,
      duratin: 3000,
      isClosable: true,
    });
  };
  return showToast;
}
