import { Button, Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal }) => {
        const connected = account;

        return (
          <Flex>
            {!connected ? (
              <Button variant="ghost" onClick={openConnectModal}>
                <Text>Connect Wallet</Text>
              </Button>
            ) : (
              <Flex>
                <Button
                  variant="ghost"
                  onClick={openAccountModal}
                  px={5}
                  bgGradient="linear-gradient(180deg, rgba(255, 255, 255, 0.044) 0%, rgba(255, 255, 255, 0.158) 100%)"
                >
                  <Text>{account.displayName}</Text>
                </Button>
              </Flex>
            )}
          </Flex>
        );
      }}
    </ConnectButton.Custom>
  );
}
