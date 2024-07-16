import { Box, Text, Input } from "@chakra-ui/react";
import SuggestUser from "./SuggestUser";
import { useCallback, useEffect, useState } from "react";
import { request } from "../axios/axios";
import OpacitySearch from "./chat/OpacitySearch";
import FindSearchHome from "./FindSearchHome";

export default function SuggestedUsers() {
  const [valueSearch, setValueSearch] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const [suggest, setSuggest] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const response = await request.get(`/api/users/search/${valueSearch}`);
      setResultSearch(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [valueSearch]);

  useEffect(() => {
    if (valueSearch) {
      handleSearch();
    }
  }, [handleSearch, valueSearch]);

  useEffect(() => {
    async function getAllSuggests() {
      try {
        setLoading(true);
        const response = await request.get("/api/users/suggest");
        setSuggest(response?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getAllSuggests();
  }, []);
  return (
    <Box flex={25} marginTop={5}>
      <Text fontWeight={"bold"} my={3}>
        Suggested Users
      </Text>
      <Input
        placeholder="search for a user"
        onChange={(e) => setValueSearch(e.target.value)}
        marginBottom={2}
      />
      {loading &&
        [1, 2, 3].map((e, i) => (
          <OpacitySearch key={i} w1={"100px"} w2={"120px"} />
        ))}
      {!loading && valueSearch === "" && (
        <Box marginTop={2}>
          {suggest
            .filter((e) => e?.freeze !== true)
            .map((suggest, i) => (
              <SuggestUser key={i} suggest={suggest} />
            ))}
        </Box>
      )}
      {!loading &&
        valueSearch !== "" &&
        resultSearch
          ?.filter((e) => e?.freeze !== true)
          .map((e, i) => <FindSearchHome e={e} key={i} />)}
      {!loading && valueSearch !== "" && resultSearch?.length === 0 && (
        <Text fontSize={"sm"} marginLeft={"8"} marginTop={"5"}>
          Not Found User
        </Text>
      )}
    </Box>
  );
}
