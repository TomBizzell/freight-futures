
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChartLine,
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { useBlockchain } from "@/context/BlockchainContext";
import { makePrediction } from "@/utils/blockchain";

// Define Market component
const Market = () => {
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState<number>(0.01);
  const [sliderValue, setSliderValue] = useState<number[]>([0.01]);
  const [betSide, setBetSide] = useState<"yes" | "no" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    account, 
    connecting, 
    connectToWallet, 
    marketStats, 
    userStats,
    refreshMarketStats 
  } = useBlockchain();
  
  const marketData = {
    id: "sf-shanghai-aug-2025",
    title: "Will Shanghai to San Francisco shipping price in August 2025 exceed 130% of May 2025?",
    description: "This market will resolve YES if the average container shipping price from Shanghai to San Francisco in August 2025 exceeds 130% of the average price in May 2025.",
    resolves: "September 1, 2025",
    // Use market stats if available, otherwise use default values
    yesPrice: marketStats ? marketStats.yesPercentage / 100 : 0.68,
    noPrice: marketStats ? marketStats.noPercentage / 100 : 0.32,
    volume: marketStats ? 
      (parseFloat(marketStats.yesPredictions) + parseFloat(marketStats.noPredictions)).toFixed(2) : 
      "0.00"
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (account) {
        refreshMarketStats();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [account, refreshMarketStats]);
  
  const handleBet = (side: "yes" | "no") => {
    setBetSide(side);
    toast({
      title: `You selected ${side.toUpperCase()}`,
      description: `You're betting ${betAmount} ETH on ${side.toUpperCase()}`
    });
  };
  
  const handlePlaceBet = async () => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }
    
    if (!betSide) {
      toast({
        title: "Error",
        description: "Please select YES or NO first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await makePrediction(betSide, betAmount);
      
      if (success) {
        toast({
          title: "Bet Placed!",
          description: `You bet ${betAmount} ETH on ${betSide.toUpperCase()}`
        });
        
        // Refresh market stats after bet
        await refreshMarketStats();
      } else {
        toast({
          title: "Transaction Failed",
          description: "Failed to place bet. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Error",
        description: "An error occurred while placing your bet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    setBetAmount(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBetAmount(value);
    setSliderValue([value]);
  };
  
  const calculatePotentialProfit = () => {
    if (!betSide) return 0;
    
    const price = betSide === "yes" ? marketData.yesPrice : marketData.noPrice;
    return betAmount * (1 / price - 1);
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Market</h1>
          <p className="text-muted-foreground">
            Predict the future of freight prices and earn rewards
          </p>
        </div>
        
        {!account && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-4">
                <Wallet className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect your wallet to start making predictions and earn rewards
                </p>
                <Button onClick={connectToWallet} disabled={connecting}>
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center bg-accent/50 px-3 py-1 rounded-full text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Resolves {marketData.resolves}</span>
                  </div>
                  <div className="flex items-center bg-accent/50 px-3 py-1 rounded-full text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>Volume: {marketData.volume} ETH</span>
                  </div>
                </div>
                <CardTitle>{marketData.title}</CardTitle>
                <CardDescription>
                  {marketData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current probability</p>
                      <p className="text-4xl font-bold">{(marketData.yesPrice * 100).toFixed(0)}%</p>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <div className="h-12 w-20 bg-bet-yes bg-opacity-10 rounded-md flex flex-col items-center justify-center">
                        <p className="text-xs text-muted-foreground">YES</p>
                        <p className="text-sm font-bold text-bet-yes">{marketData.yesPrice.toFixed(2)}</p>
                      </div>
                      <div className="h-12 w-20 bg-bet-no bg-opacity-10 rounded-md flex flex-col items-center justify-center">
                        <p className="text-xs text-muted-foreground">NO</p>
                        <p className="text-sm font-bold text-bet-no">{marketData.noPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-bet-yes to-bet-yes/70"
                      style={{ width: `${marketData.yesPrice * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-0 right-0 h-full bg-gradient-to-l from-bet-no to-bet-no/70"
                      style={{ width: `${marketData.noPrice * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {account && userStats && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Predictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground mb-1">YES Predictions</p>
                        <p className="text-lg font-semibold">{parseFloat(userStats.yesPredictions).toFixed(4)} ETH</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground mb-1">NO Predictions</p>
                        <p className="text-lg font-semibold">{parseFloat(userStats.noPredictions).toFixed(4)} ETH</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Market Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">Market Liquidity</p>
                      <p className="text-lg font-semibold">{marketData.volume} ETH</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                      <p className="text-lg font-semibold">{(parseFloat(marketData.volume) * 0.15).toFixed(2)} ETH</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Chart</h3>
                  <div className="bg-muted/50 h-64 rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ChartLine className="h-8 w-8 mb-2" />
                      <p className="text-sm">Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bet</CardTitle>
                <CardDescription>
                  Select YES if you think the price will exceed 130%, or NO if you think it won't.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button 
                    className="h-20"
                    variant={betSide === "yes" ? "default" : "outline"}
                    onClick={() => handleBet("yes")}
                    disabled={!account || isSubmitting}
                  >
                    <div className="flex flex-col items-center">
                      <ArrowUp className="h-5 w-5 mb-1" />
                      <span className="font-bold">YES</span>
                      <span className="text-xs">{marketData.yesPrice.toFixed(2)}</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-20"
                    variant={betSide === "no" ? "default" : "outline"}
                    onClick={() => handleBet("no")}
                    disabled={!account || isSubmitting}
                  >
                    <div className="flex flex-col items-center">
                      <ArrowDown className="h-5 w-5 mb-1" />
                      <span className="font-bold">NO</span>
                      <span className="text-xs">{marketData.noPrice.toFixed(2)}</span>
                    </div>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount to bet (ETH)</label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <Input 
                        type="number" 
                        value={betAmount}
                        onChange={handleInputChange}
                        className="flex-1"
                        disabled={!account || isSubmitting}
                        min={0.001}
                        step={0.001}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Slider
                      value={sliderValue}
                      max={1}
                      step={0.01}
                      onValueChange={handleSliderChange}
                      disabled={!account || isSubmitting}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.00</span>
                      <span>0.25</span>
                      <span>0.50</span>
                      <span>0.75</span>
                      <span>1.00</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Potential profit</span>
                      <span className="font-medium">{calculatePotentialProfit().toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total return if correct</span>
                      <span className="font-medium">{(betAmount + calculatePotentialProfit()).toFixed(4)} ETH</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePlaceBet}
                  disabled={!account || !betSide || betAmount <= 0 || isSubmitting}
                >
                  {!account ? "Connect Wallet" : isSubmitting ? "Processing..." : "Place Bet"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Market;
