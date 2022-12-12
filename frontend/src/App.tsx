import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Grid,
  theme,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { Card, CardBody } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  chain as chainList,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chainList.mainnet, chainList.goerli, chainList.hardhat, chainList.polygon],
  [
    infuraProvider({
      apiKey: process.env.REACT_APP_INFURA_API_KEY,
      priority: 0,
    }),
    publicProvider({ priority: 1 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <ConnectButton />
          <Box textAlign="center" fontSize="xl">
            <Grid minH="60%" p={7}>
              <Card>
                <CardHeader>
                  <Heading size="md">Client Report</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Summary
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        View a summary of all your clients over the last month.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Overview
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        Check out the overview of your clients.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Analysis
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        See a detailed analysis of all your business clients.
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </Grid>
          </Box>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
