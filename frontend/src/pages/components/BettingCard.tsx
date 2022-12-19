import {
  Text,
  Flex,
  VStack,
  Button,
  UnorderedList,
  ListItem,
  Input,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

export function BettingCard(proposal: any, index: any) {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  return (
    <Flex
      border="1px"
      borderColor="white"
      h="max"
      minWidth={{ xl: "600px", lg: "450px" }}
      backgroundColor="#282734"
      borderRadius={"5px"}
      mt="15px"
      zIndex={index}
    >
      <VStack w="100%">
        <Flex p="15px" w="100%" justifyContent={"space-between"}>
          <VStack align={"left"} flex="1">
            <Text fontSize="xs">Proposal for DWin DAO</Text>
            <Text fontSize="16px" as="b">
              [DW-321] {proposal.proposal.description}{" "}
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
        {open && (
          <>
            <Flex p="15px" w="100%" justifyContent={"space-between"}>
              <VStack align={"left"} flex="1">
                <Text fontSize="xs">Proposal Details</Text>
                <UnorderedList pl="15px">
                  <ListItem>id: {proposal.proposal.proposalId}</ListItem>
                  <ListItem>
                    description: {proposal.proposal.description}
                  </ListItem>
                  <ListItem>
                    deadline: {proposal.proposal.deadline.toString()}
                  </ListItem>
                  <ListItem>yayVotes: {proposal.proposal.yayVotes}</ListItem>
                  <ListItem>nayVotes: {proposal.proposal.nayVotes}</ListItem>
                  <ListItem>
                    totalNetBets: {proposal.proposal.totalNetBets}
                  </ListItem>
                  <ListItem>outcome: {proposal.proposal.outcome}</ListItem>
                </UnorderedList>
              </VStack>
            </Flex>
            <Flex p="15px" w="100%" justifyContent={"space-between"}>
              <VStack align={"left"} flex="1">
                <Text fontSize="m">BET AMOUT</Text>
                <Input w="50%" />
                <HStack>
                  <Button
                    w="75px"
                    backgroundColor="#AC54FF"
                    fontSize="xs"
                    h="20px"
                  >
                    BET ON YES
                  </Button>
                  <Button
                    w="75px"
                    backgroundColor="#AC54FF"
                    fontSize="xs"
                    h="20px"
                  >
                    BET ON NO
                  </Button>
                </HStack>
              </VStack>
              <VStack>
                <Text fontSize="m">VOTE</Text>

                <Button
                  w="75px"
                  backgroundColor="#AC54FF"
                  fontSize="xs"
                  h="20px"
                >
                  VOTE YES
                </Button>
                <Button
                  w="75px"
                  backgroundColor="#AC54FF"
                  fontSize="xs"
                  h="20px"
                >
                  VOTE NO
                </Button>
              </VStack>
            </Flex>
            <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
              EXECUTE
            </Button>
          </>
        )}
      </VStack>
    </Flex>
  );
}
