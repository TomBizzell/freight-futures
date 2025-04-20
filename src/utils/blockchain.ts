import { ethers } from 'ethers';
import FreightPredictorABI from '../contracts/FreightPredictorABI.json';

const CONTRACT_ADDRESS = "0x123...";
const CHAIN_ID = "0x1";

type PredictionSide = 'yes' | 'no';

export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) throw new Error("No wallet");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await switchChain();
    return accounts[0];
  } catch (error) {
    console.error("Wallet error:", error);
    return null;
  }
};

export const isWalletConnected = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) return null;
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Check error:", error);
    return null;
  }
};

const switchChain = async (): Promise<boolean> => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID }],
    });
    return true;
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
};

const getContract = () => {
  if (!window.ethereum) return null;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FreightPredictorABI, signer);
};

export const makePrediction = async (side: PredictionSide): Promise<boolean> => {
  try {
    const contract = getContract();
    if (!contract) return false;
    
    // For demonstration, just log the attempt
    console.log(`Would vote ${side}`);
    return true;
  } catch (error) {
    console.error("Vote error:", error);
    return false;
  }
};

export const getMarketStats = async () => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    // For demonstration, return mock data
    return {
      yesPredictions: "100",
      noPredictions: "50",
      yesPercentage: 67,
      noPercentage: 33
    };
  } catch (error) {
    console.error("Stats error:", error);
    return null;
  }
};

export const getUserBets = async (address: string) => {
  try {
    // For demonstration, return mock data
    return {
      yesPredictions: "10",
      noPredictions: "0"
    };
  } catch (error) {
    console.error("User bets error:", error);
    return null;
  }
};
