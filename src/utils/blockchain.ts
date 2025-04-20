
import { ethers } from 'ethers';
import FreightPredictorABI from '../contracts/FreightPredictorABI.json';

// Constants
const CONTRACT_ADDRESS = "0x123..."; // Replace with actual deployed contract address
const CHAIN_ID = "0x1"; // Ethereum Mainnet, change as needed

// Type definitions
type PredictionSide = 'yes' | 'no';

// Connect to MetaMask wallet
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check if we're on the right network
    await switchToCorrectChain();
    
    return accounts[0];
  } catch (error) {
    console.error("Failed to connect to wallet:", error);
    return null;
  }
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      return null;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Failed to check wallet connection:", error);
    return null;
  }
};

// Switch to the correct blockchain network
export const switchToCorrectChain = async (): Promise<boolean> => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID }],
    });
    return true;
  } catch (error: any) {
    console.error("Failed to switch network:", error);
    return false;
  }
};

// Get contract instance
export const getContractInstance = () => {
  if (!window.ethereum) return null;
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FreightPredictorABI, signer);
};

// Make a prediction (bet)
export const makePrediction = async (side: PredictionSide, amount: number): Promise<boolean> => {
  try {
    const contract = getContractInstance();
    if (!contract) return false;
    
    const amountInWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.makePrediction(side === 'yes', {
      value: amountInWei
    });
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Failed to make prediction:", error);
    return false;
  }
};

// Get market stats
export const getMarketStats = async () => {
  try {
    const contract = getContractInstance();
    if (!contract) return null;
    
    const stats = await contract.getMarketStats();
    return {
      yesPredictions: ethers.utils.formatEther(stats._yesPredictions),
      noPredictions: ethers.utils.formatEther(stats._noPredictions),
      yesPercentage: stats._yesPercentage.toNumber(),
      noPercentage: stats._noPercentage.toNumber()
    };
  } catch (error) {
    console.error("Failed to get market stats:", error);
    return null;
  }
};

// Get user predictions
export const getUserPredictions = async (address: string) => {
  try {
    const contract = getContractInstance();
    if (!contract) return null;
    
    const predictions = await contract.getUserPredictions(address);
    return {
      yesPredictions: ethers.utils.formatEther(predictions.yesAmount),
      noPredictions: ethers.utils.formatEther(predictions.noAmount)
    };
  } catch (error) {
    console.error("Failed to get user predictions:", error);
    return null;
  }
};

// Claim rewards
export const claimRewards = async (): Promise<boolean> => {
  try {
    const contract = getContractInstance();
    if (!contract) return false;
    
    const tx = await contract.claimReward();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Failed to claim rewards:", error);
    return false;
  }
};
