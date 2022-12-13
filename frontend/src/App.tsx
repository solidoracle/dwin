import { ChakraProvider } from "@chakra-ui/react";
import { Pages } from "./pages";
import { WalletProvider } from "./WalletProvider";
import { theme } from "./theme";
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
