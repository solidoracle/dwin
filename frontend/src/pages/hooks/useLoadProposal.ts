import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { DWIN_ABI, DWIN_CONTRACT_ADDRESS } from "../../constants";
import { Contract } from "ethers";

/**
 * Loads proposals from the dwin contract
 */
export function useLoadProposals() {
  const { isConnected } = useAccount();
  const [proposals, setProposals] = useState([]);
  const provider = useProvider();
  const [numProposals, setNumProposals] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!isConnected) return;

        const getDwinContractInstance = (providerOrSigner: any) => {
          return new Contract(
            DWIN_CONTRACT_ADDRESS,
            DWIN_ABI,
            providerOrSigner
          );
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
          await getNumProposals();

          try {
            const proposals: any = [];
            console.log("standing fetchAllProposals loop");
            for (let i = 0; i < numProposals; i++) {
              const proposal = await fetchProposalById(i);
              proposals.push(proposal);
            }

            setProposals(proposals);
            console.log("proposals set");
            console.log(proposals);

            return proposals;
          } catch (error) {
            console.error(error);
          }
        };
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [isConnected, numProposals, provider]);

  return {
    proposals,
    loading,
  };
}
