
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet, isWalletConnected, getMarketStats, getUserBets } from '../utils/blockchain';
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

  useEffect(() => {
    const check = async () => {
      const conn = await isWalletConnected();
      if (conn) setAccount(conn);
    };
    check();
  }, []);

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

  useEffect(() => {
    if (account) {
      refreshMarketStats();
    }
  }, [account]);

  const connectToWallet = async () => {
    try {
      setConnecting(true);
      const conn = await connectWallet();
      
      if (conn) {
        setAccount(conn);
        toast({
          title: "Connected",
          description: `Wallet ${conn.substring(0, 6)}...${conn.substring(38)}`,
        });
      } else {
        toast({
          title: "Failed",
          description: "Could not connect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connect error:", error);
      toast({
        title: "Error",
        description: "Connection error",
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
        const bets = await getUserBets(account);
        setUserStats(bets);
      }
    } catch (error) {
      console.error("Stats error:", error);
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
    throw new Error('useBlockchain must be used within BlockchainProvider');
  }
  return context;
};
