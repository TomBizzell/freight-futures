
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet, isWalletConnected, getMarketStats, getUserPredictions } from '../utils/blockchain';
import { useToast } from '@/hooks/use-toast';

type BlockchainContextType = {
  account: string | null;
  connecting: boolean;
  marketStats: {
    yesPredictions: string;
    noPredictions: string;
    yesPercentage: number;
    noPercentage: number;
  } | null;
  userStats: {
    yesPredictions: string;
    noPredictions: string;
  } | null;
  connectToWallet: () => Promise<void>;
  refreshMarketStats: () => Promise<void>;
};

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [marketStats, setMarketStats] = useState(null);
  const [userStats, setUserStats] = useState(null);

  // Check wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      const connectedAccount = await isWalletConnected();
      if (connectedAccount) {
        setAccount(connectedAccount);
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Get market stats when account changes
  useEffect(() => {
    if (account) {
      refreshMarketStats();
    }
  }, [account]);

  const connectToWallet = async () => {
    try {
      setConnecting(true);
      const connectedAccount = await connectWallet();
      
      if (connectedAccount) {
        setAccount(connectedAccount);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${connectedAccount.substring(0, 6)}...${connectedAccount.substring(38)}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to your wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const refreshMarketStats = async () => {
    try {
      const stats = await getMarketStats();
      setMarketStats(stats);
      
      if (account) {
        const userPredictions = await getUserPredictions(account);
        setUserStats(userPredictions);
      }
    } catch (error) {
      console.error("Failed to refresh market stats:", error);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        account,
        connecting,
        marketStats,
        userStats,
        connectToWallet,
        refreshMarketStats,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
