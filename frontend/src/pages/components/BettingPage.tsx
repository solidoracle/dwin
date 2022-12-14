import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Img,
  Input,
  Link,
  ListItem,
  NumberInput,
  Stack,
  Text,
  Tooltip,
  UnorderedList,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Contract } from "ethers";
import { useSigner, useProvider } from "wagmi";
import { DWIN_ABI, DWIN_CONTRACT_ADDRESS } from "../../constants";
import { BsArrowUpRight, BsHeartFill, BsHeart } from "react-icons/bs";
import { BettingCard } from "./BettingCard";

export function BettingPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [numProposals, setNumProposals] = useState(0);
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();

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
    console.log("getNumProposals start");
    await getNumProposals();
    console.log("getNumProposals end");

    try {
      const proposals: any = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      console.log(proposals);

      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      console.log("connect wallet");
    }
  }, [isConnected]);

  function renderViewProposals() {
    if (loading) {
      return <Text>Loading... Waiting for transaction...</Text>;
    } else if (proposals.length === 0) {
      return <Text>No proposals have been created</Text>;
    } else {
      return (
        <Box>
          {proposals.map((proposal: any, index: number) => (
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
  }

  return (
    <Flex p={"10%"} w={"50%"}>
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
            onClick={createProposal}
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
          <BettingCard proposals={proposals} />
          {/* {renderViewProposals()} */}
        </VStack>
      </VStack>
    </Flex>
  );
}
