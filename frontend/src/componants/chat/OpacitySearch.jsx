import { Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";


export default function OpacitySearch() {
  return (
    <Flex justifyContent={"center"} gap={"2"}>
      <SkeletonCircle size={"10"} />
      <VStack alignItems={"self-start"} justifyContent={"center"}>
        <Skeleton h={"10px"} w={"80px"} />
        <Skeleton h={"10px"} w={"90px"} />
      </VStack>
    </Flex>
  );
}
