import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, localhost } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, localhost],
    transports: {
      // RPC URL for each chain
      [localhost.id]: http('http://localhost:8545'),
      //   [mainnet.id]: http(
      //     `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      //   ),
    },

    // Required API Keys
    walletConnectProjectId: '2d1f62454c3db12347ca0966d7f05da5',

    // Required App Info
    appName: 'yideng',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
