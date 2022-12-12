import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  chain as chainList,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";

export function WalletProvider({ children }: { children: React.ReactNode }) {
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
    appName: "Sarcophagus v2",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        appInfo={{
          appName: "DWIN",
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
