import {
  Text,
  Flex,
  VStack,
  Button,
  UnorderedList,
  ListItem,
  HStack,
  NumberInput,
  NumberInputField,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useState } from "react";
import { useLoadProposals } from "../hooks/useLoadProposal";

export function BettingCard(proposal: any, index: any) {
  const [open, setOpen] = useState(false);
  const [betAmount, setBetAmount] = useState("0");
  const { signer, getDwinContractInstance, fetchAllProposals } =
    useLoadProposals();

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  const voteOnProposal = async (proposalId: number, _vote: any) => {
    try {
      const dwinContract = getDwinContractInstance(signer);
      let vote = _vote === "YAY" ? 0 : 1;
      const txn = await dwinContract.voteOnProposal(proposalId, vote);
      await txn.wait();
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
    }
  };

  const betOnProposal = async (
    proposalId: any,
    _vote: any,
    _amount: string
  ) => {
    try {
      const dwinContract = getDwinContractInstance(signer);

      let vote = _vote === "YAY" ? 0 : 1;
      const txn = await dwinContract.makeBet(proposalId, vote, {
        value: ethers.utils.parseEther(_amount),
      });
      await txn.wait();
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
    }
  };

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
                    totalNetBets:{" "}
                    {proposal.proposal.totalNetBets?.map((bet: number) => bet)}
                  </ListItem>
                  <ListItem>outcome: {proposal.proposal.outcome}</ListItem>
                </UnorderedList>
              </VStack>
            </Flex>
            <Flex p="15px" w="100%" justifyContent={"space-between"}>
              <VStack align={"left"} flex="1">
                <Text fontSize="m">BET AMOUT</Text>
                <InputGroup>
                  <NumberInput
                    min={0}
                    onChange={(
                      valueAsString: string,
                      valueAsNumber: number
                    ) => {
                      setBetAmount(valueAsString);
                    }}
                  >
                    <NumberInputField />
                    <InputRightElement>ETH</InputRightElement>
                  </NumberInput>
                </InputGroup>
                <HStack>
                  <Button
                    w="75px"
                    backgroundColor="#AC54FF"
                    fontSize="xs"
                    h="20px"
                    onClick={() =>
                      betOnProposal(
                        proposal.proposal.proposalId,
                        "YAY",
                        betAmount
                      )
                    }
                  >
                    BET ON YES
                  </Button>
                  <Button
                    w="75px"
                    backgroundColor="#AC54FF"
                    fontSize="xs"
                    h="20px"
                    onClick={() =>
                      betOnProposal(
                        proposal.proposal.proposalId,
                        "NAY",
                        betAmount
                      )
                    }
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
                  onClick={() =>
                    voteOnProposal(proposal.proposal.proposalId, "YAY")
                  }
                >
                  VOTE YES
                </Button>
                <Button
                  w="75px"
                  backgroundColor="#AC54FF"
                  fontSize="xs"
                  h="20px"
                  onClick={() =>
                    voteOnProposal(proposal.proposal.proposalId, "NAY")
                  }
                >
                  VOTE NO
                </Button>
              </VStack>
            </Flex>
            <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
              EXECUTE
            </Button>
            <Button w="75px" backgroundColor="#AC54FF" fontSize="xs" h="20px">
              WITHDRAW
            </Button>
          </>
        )}
      </VStack>
    </Flex>
  );
}
