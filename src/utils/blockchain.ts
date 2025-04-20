
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

export const makePrediction = async (side: PredictionSide, amount: number): Promise<boolean> => {
  try {
    const contract = getContract();
    if (!contract) return false;
    const tx = await contract.bet(side === 'yes', {
      value: ethers.utils.parseEther(amount.toString())
    });
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Bet error:", error);
    return false;
  }
};

export const getMarketStats = async () => {
  try {
    const contract = getContract();
    if (!contract) return null;
    const stats = await contract.stats();
    return {
      yesPredictions: ethers.utils.formatEther(stats[0]),
      noPredictions: ethers.utils.formatEther(stats[1]),
      yesPercentage: stats[2].toNumber(),
      noPercentage: stats[3].toNumber()
    };
  } catch (error) {
    console.error("Stats error:", error);
    return null;
  }
};

export const getUserBets = async (address: string) => {
  try {
    const contract = getContract();
    if (!contract) return null;
    
    const betAmount = await contract.bets(address);
    const betSide = await contract.sides(address);
    
    return {
      yesPredictions: betSide ? ethers.utils.formatEther(betAmount) : "0",
      noPredictions: !betSide ? ethers.utils.formatEther(betAmount) : "0"
    };
  } catch (error) {
    console.error("User bets error:", error);
    return null;
  }
};

export const claimWinnings = async (): Promise<boolean> => {
  try {
    const contract = getContract();
    if (!contract) return false;
    const tx = await contract.claim();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Claim error:", error);
    return false;
  }
};
