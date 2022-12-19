import { Text, Button, Container, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function WalletDisconnectPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Container>
      <Heading pb={2}>
        {!isConnected ? "No Wallet Detected" : "Unsupported Network"}
      </Heading>
      <Text align="center">
        {!isConnected
          ? "Please connect to your web3 wallet to access this dapp."
          : "Please connect to a supported network."}
      </Text>
      {!isConnected ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : (
        <Text align="center" variant="bold">
          Supported Networks
        </Text>
      )}
    </Container>
  );
}
