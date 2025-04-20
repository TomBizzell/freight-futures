
import { ethers } from 'ethers';
import FreightPredictorABI from '../contracts/FreightPredictorABI.json';

const CONTRACT_ADDRESS = "0x123...";
const CHAIN_ID = "0x1";

type PredictionSide = 'yes' | 'no';

export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await switchToCorrectChain();
    return accounts[0];
  } catch (error) {
    console.error("Failed to connect to wallet:", error);
    return null;
  }
};

export const isWalletConnected = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) return null;
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Failed to check wallet connection:", error);
    return null;
  }
};

const switchToCorrectChain = async (): Promise<boolean> => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID }],
    });
    return true;
  } catch (error) {
    console.error("Failed to switch network:", error);
    return false;
  }
};

const getContractInstance = () => {
  if (!window.ethereum) return null;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, FreightPredictorABI, signer);
};

export const makePrediction = async (side: PredictionSide, amount: number): Promise<boolean> => {
  try {
    const contract = getContractInstance();
    if (!contract) return false;
    const tx = await contract.bet(side === 'yes', {
      value: ethers.utils.parseEther(amount.toString())
    });
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Failed to make prediction:", error);
    return false;
  }
};

export const getMarketStats = async () => {
  try {
    const contract = getContractInstance();
    if (!contract) return null;
    const stats = await contract.stats();
    return {
      yesPredictions: ethers.utils.formatEther(stats[0]),
      noPredictions: ethers.utils.formatEther(stats[1]),
      yesPercentage: stats[2].toNumber(),
      noPercentage: stats[3].toNumber()
    };
  } catch (error) {
    console.error("Failed to get market stats:", error);
    return null;
  }
};
