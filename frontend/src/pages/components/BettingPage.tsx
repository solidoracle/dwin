import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Contract } from "ethers";
import { useSigner, useProvider } from "wagmi";
import { DWIN_ABI, DWIN_CONTRACT_ADDRESS } from "../../constants";

export function BettingPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [numProposals, setNumProposals] = useState(0);
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDescription(value);
  }

  const getProviderOrSigner = async (needSigner: boolean) => {
    if (chain?.id !== 5) {
      window.alert("Please switch to the Goerly network!");
      throw new Error("Please switch to the Goerly network");
    }
    if (needSigner) {
      return signer;
    }
    return provider;
  };

  const getDwinContractInstance = (providerOrSigner: any) => {
    return new Contract(DWIN_CONTRACT_ADDRESS, DWIN_ABI, providerOrSigner);
  };

  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const dwinContract = getDwinContractInstance(signer);
      const txn = await dwinContract.openMarket(description);
      setLoading(true);
      await txn.wait();
      await getNumProposals();

      setLoading(false);
      console.log("proposals", dwinContract.proposals);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumProposals = async () => {
    try {
      const contract = getDwinContractInstance(provider);
      const numProposals: number = await contract.numProposals();
      setNumProposals(numProposals);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProposalById = async (id: number) => {
    try {
      const daoContract = getDwinContractInstance(provider);
      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        description: proposal.description,
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        outcome: proposal.outcome.toString(),
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals: any = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  function renderViewProposals() {
    if (loading) {
      return <Text>Loading... Waiting for transaction...</Text>;
    } else if (proposals.length === 0) {
      return <Text>No proposals have been created</Text>;
    } else {
      return (
        <Flex>
          {proposals.map((proposal: any, index: number) => (
            <Flex key={index}>
              <HStack>
                <Text>Proposal ID: {proposal.id}</Text>
                <Text>Proposal Description: {proposal.description}</Text>
              </HStack>
            </Flex>
          ))}
        </Flex>
      );
    }
  }

  return (
    <Flex p={"10%"} w={"50%"}>
      <VStack
        align="left"
        minWidth={{ xl: "600px", lg: "450px" }}
        w="100%"
        mb="200px"
      >
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
            onClick={createProposal}
          >
            Create
          </Button>
          <Button
            w={"20%"}
            minW={"80px"}
            borderRadius={"7px"}
            bgGradient="linear-gradient(35deg, rgba(11,10,81,1) 0%, rgba(172,84,255,1) 100%)
            "
            onClick={fetchAllProposals}
          >
            Fetch Proposals
          </Button>
          {renderViewProposals()}
        </VStack>
      </VStack>
    </Flex>
  );
}
