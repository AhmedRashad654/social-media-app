import { Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";

export default function OpacityMessage() {
  return (
    <Flex flexDirection={"column"} justifyContent={"flex-end"} h={"full"} marginTop={-5}>
      <Flex gap={"2"} justifyContent={"start"}>
        <SkeletonCircle size={"10"} />
        <VStack alignItems={"self-start"} justifyContent={"center"}>
          <Skeleton h={"10px"} w={"150px"} />
          <Skeleton h={"10px"} w={"140px"} />
        </VStack>
      </Flex>
      <Flex gap={"2"} justifyContent={"end"}>
        <VStack alignItems={"self-end"} justifyContent={"center"}>
          <Skeleton h={"10px"} w={"150px"} />
          <Skeleton h={"10px"} w={"140px"} />
        </VStack>
        <SkeletonCircle size={"10"} />
      </Flex>
      <Flex gap={"2"} justifyContent={"start"}>
        <SkeletonCircle size={"10"} />
        <VStack alignItems={"self-start"} justifyContent={"center"}>
          <Skeleton h={"10px"} w={"150px"} />
          <Skeleton h={"10px"} w={"140px"} />
        </VStack>
      </Flex>
      <Flex gap={"2"} justifyContent={"end"}>
        <VStack alignItems={"self-end"} justifyContent={"center"}>
          <Skeleton h={"10px"} w={"150px"} />
          <Skeleton h={"10px"} w={"140px"} />
        </VStack>
        <SkeletonCircle size={"10"} />
      </Flex>
      <Flex gap={"2"} justifyContent={"start"}>
        <SkeletonCircle size={"10"} />
        <VStack alignItems={"self-start"} justifyContent={"center"}>
          <Skeleton h={"10px"} w={"150px"} />
          <Skeleton h={"10px"} w={"140px"} />
        </VStack>
      </Flex>
    </Flex>
  );
}
