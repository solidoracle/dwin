import { ChakraProvider, theme } from "@chakra-ui/react";
import { Pages } from "./pages";
import { WalletProvider } from "./WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";

export const App = () => {
  return (
    <WalletProvider>
      <ChakraProvider theme={theme}>
        <Pages />
      </ChakraProvider>
    </WalletProvider>
  );
};
