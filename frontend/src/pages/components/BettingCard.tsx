import {
  Text,
  Flex,
  VStack,
  Button,
  UnorderedList,
  ListItem,
  Input,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

export function BettingCard(proposals: any) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  function renderViewProposals() {
    return (
      <Box>
        {proposals.proposals.map((proposal: any, index: number) => (
          <Flex
            border="1px"
            borderColor="white"
            h="80px"
            minWidth={{ xl: "600px", lg: "450px" }}
            backgroundColor="#282734"
            borderRadius={"5px"}
            mt="15px"
          >
            <Flex p="15px" w="100%" justifyContent={"space-between"}>
              <VStack align={"left"} flex="1">
                <Text fontSize="xs">Proposal for DWin DAO</Text>
                <Text fontSize="16px" as="b">
                  [DW-321] {proposal.description}{" "}
                </Text>
              </VStack>
              <VStack>
                <Button w="75px" backgroundColor="#AC54FF" fontSize="xs">
                  Open
                </Button>
                <Text fontSize="xs" color="#ABAFB3">
                  2 min left{" "}
                </Text>
              </VStack>
            </Flex>
          </Flex>
        ))}
      </Box>
    );
  }

  function cardDetails() {
    return (
      <Box>
        <Flex p="15px" w="100%" justifyContent={"space-between"}>
          <VStack align={"left"} flex="1">
            <Text fontSize="xs">Proposal Details</Text>
            <UnorderedList pl="15px">
              <ListItem>id</ListItem>
              <ListItem>description</ListItem>
              <ListItem>deadline</ListItem>
              <ListItem>yayVotes</ListItem>
              <ListItem>yayVotes</ListItem>
              <ListItem>nayVotes</ListItem>
              <ListItem>totalNetBets</ListItem>
              <ListItem>outcome</ListItem>
            </UnorderedList>
          </VStack>
        </Flex>
        <Flex p="15px" w="100%" justifyContent={"space-between"}>
          <VStack align={"left"} flex="1">
            <Text fontSize="m">BET</Text>
            <Input w="50%" />
            <HStack>
              <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
                BET YES
              </Button>
              <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
                BET NO
              </Button>
            </HStack>
          </VStack>
          <VStack>
            <Text fontSize="m">VOTE</Text>

            <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
              VOTE YES
            </Button>
            <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
              VOTE NO
            </Button>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <VStack>
      <Flex
        border="1px"
        borderColor="white"
        minWidth={{ xl: "600px", lg: "450px" }}
        backgroundColor="#282734"
        borderRadius={"5px"}
        flexDirection="column"
        justifyContent={"center"}
      >
        <Flex p="15px" w="100%" justifyContent={"space-between"}>
          <VStack align={"left"} flex="1">
            <Text fontSize="xs">Proposal for DWin DAO</Text>
            <Text fontSize="16px" as="b">
              [DW-321] Migrate from v1 to v2{" "}
            </Text>
          </VStack>
          <VStack>
            <Button
              w="75px"
              backgroundColor="#AC54FF"
              fontSize="xs"
              h="20px"
              onClick={toggleOpen}
            >
              Open
            </Button>
            <Text fontSize="xs" color="#ABAFB3">
              2 min left{" "}
            </Text>
          </VStack>
        </Flex>

        {open && cardDetails()}
      </Flex>
      {renderViewProposals()}
    </VStack>
  );
}
