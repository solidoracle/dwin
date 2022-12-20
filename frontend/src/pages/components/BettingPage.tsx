import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { BettingCard } from "./BettingCard";
import { useLoadProposals } from "../hooks/useLoadProposal";
import { WalletDisconnectPage } from "./WalletDisconnectPage";

export function BettingPage() {
  const { proposals, fetchAllProposals, createProposal } = useLoadProposals();
  const [description, setDescription] = useState("");
  const { isConnected } = useAccount();

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDescription(value);
  }

  return (
    <Flex p={"10%"} w={"50%"}>
      {isConnected ? (
        <VStack align="left" minWidth={{ xl: "600px", lg: "450px" }} w="100%">
          <Heading>Open Betting Market</Heading>

          <VStack align="left" spacing={8} mt={6}>
            <FormControl>
              <FormLabel>Proposal Description</FormLabel>
              <Input
                onChange={handleDescriptionChange}
                autoFocus
                value={description}
                focusBorderColor="#AC54FF"
              />
            </FormControl>
            <Button
              w={"20%"}
              minW={"80px"}
              borderRadius={"7px"}
              bgGradient="linear-gradient(35deg, rgba(11,10,81,1) 0%, rgba(172,84,255,1) 100%)
            "
              onClick={() => createProposal(description)}
            >
              Create
            </Button>
            <Button
              w={"20%"}
              minW={"160px"}
              borderRadius={"7px"}
              bgGradient="linear-gradient(35deg, rgba(11,10,81,1) 0%, rgba(172,84,255,1) 100%)
            "
              onClick={fetchAllProposals}
            >
              Fetch Proposals
            </Button>

            {proposals.map((proposal: any, index: number) => (
              <BettingCard proposal={proposal} index={index} />
            ))}
          </VStack>
        </VStack>
      ) : (
        <WalletDisconnectPage />
      )}
    </Flex>
  );
}
