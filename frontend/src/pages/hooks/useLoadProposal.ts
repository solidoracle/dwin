import { useCallback, useEffect, useMemo, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import { DWIN_ABI, DWIN_CONTRACT_ADDRESS } from "../../constants";
import { Contract } from "ethers";
import { AnyPtrRecord } from "dns";

/**
 * Loads proposals from the dwin contract
 */
export function useLoadProposals() {
  const { data: signer } = useSigner();

  const [proposals, setProposals] = useState([]);
  const provider = useProvider();
  const [numProposals, setNumProposals] = useState(0);

  const getDwinContractInstance = (providerOrSigner: any) => {
    return new Contract(DWIN_CONTRACT_ADDRESS, DWIN_ABI, providerOrSigner);
  };

  const getNumProposals = useCallback(async () => {
    try {
      const contract = getDwinContractInstance(provider);
      const numProposals: number = await contract.numProposals();
      setNumProposals(numProposals);
    } catch (error) {
      console.error(error);
    }
  }, [provider]);

  const fetchAllProposals = useCallback(async () => {
    await getNumProposals();

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

    try {
      const proposals: any = [];
      console.log("standing fetchAllProposals loop");
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }

      setProposals(proposals.reverse());
      console.log("proposals set");
      console.log(proposals);
    } catch (error) {
      console.error(error);
    }
  }, [getNumProposals, numProposals, provider]);

  const createProposal = async (description: string) => {
    try {
      //   const signer = await getProviderOrSigner(true);
      const dwinContract = getDwinContractInstance(signer);
      const txn = await dwinContract.openMarket(description);
      // setLoading(true);
      await txn.wait();
      await getNumProposals();

      // setLoading(false);
      console.log("proposals", dwinContract.proposals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    proposals.length === 0 && fetchAllProposals();
  }, [fetchAllProposals, proposals.length]);

  return {
    proposals,
    fetchAllProposals,
    getNumProposals,
    createProposal,
  };
}
