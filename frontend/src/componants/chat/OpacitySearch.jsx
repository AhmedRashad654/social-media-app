import { Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function OpacitySearch({ w1, w2 }) {
  return (
    <Flex gap={"2"} marginBottom={2}>
      <SkeletonCircle size={"10"} />
      <VStack alignItems={"self-start"} justifyContent={"center"}>
        <Skeleton h={"10px"} w={w1} />
        <Skeleton h={"10px"} w={w2} />
      </VStack>
    </Flex>
  );
}
OpacitySearch.propTypes = {
  w1: PropTypes.string,
  w2: PropTypes.string,
};
