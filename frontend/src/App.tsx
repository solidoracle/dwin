import { ChakraProvider, theme } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Pages } from "./pages";
import { WalletProvider } from "./WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";

export const App = () => {
  return (
    <WalletProvider>
      <ChakraProvider theme={theme}>
        <ConnectButton />
        <Pages />
      </ChakraProvider>
    </WalletProvider>
  );
};
