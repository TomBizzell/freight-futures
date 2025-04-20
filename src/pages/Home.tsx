import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
const Home = () => {
  return <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="wave-bg absolute inset-0 z-0"></div>
        <div className="container relative z-10 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-ocean-800">Trade</span> the Future of{" "}
                <span className="text-freight-600">Freight Prices</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                Take positions on global shipping rates using blockchain technology. 
                Speculate on container prices from Shanghai to San Francisco and earn rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/market">
                    Enter Market <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative animate-slide-up">
                <div className="glass-card rounded-xl p-6">
                  <div className="p-6 rounded-lg ocean-gradient text-white mb-4">
                    <h3 className="text-xl font-semibold mb-1">Current Market:</h3>
                    <p className="text-sm opacity-90 mb-4">Shanghai to San Francisco</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Will Aug price exceed 130% of May?</p>
                        <p className="text-xs opacity-80">Resolution: Sep 1, 2025</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">68¢</div>
                        <div className="text-xs opacity-80">Current Price</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 rounded-md bg-bet-yes bg-opacity-10 p-3 text-center">
                      <p className="text-sm font-medium text-bet-yes mb-1">YES</p>
                      <p className="text-xs text-muted-foreground">68% chance</p>
                    </div>
                    <div className="flex-1 rounded-md bg-bet-no bg-opacity-10 p-3 text-center">
                      <p className="text-sm font-medium text-bet-no mb-1">NO</p>
                      <p className="text-xs text-muted-foreground">32% chance</p>
                    </div>
                  </div>
                  
                  <Button className="w-full">Place Your Bet</Button>
                </div>
                
                <div className="absolute -bottom-4 -right-4 z-[-1] w-full h-full bg-gradient-to-br from-freight-300 to-ocean-300 rounded-xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Freight Slot Speculator makes it easy to participate in prediction 
              markets for freight shipping prices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full ocean-gradient flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Market</h3>
              <p className="text-muted-foreground">
                Browse available shipping routes and select a market to speculate on future prices.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full ocean-gradient flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Bet</h3>
              <p className="text-muted-foreground">
                Predict whether prices will go up or down and place your bet with cryptocurrency.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full ocean-gradient flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim Rewards</h3>
              <p className="text-muted-foreground">
                When the market resolves, collect your rewards if your prediction was correct.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="ocean-gradient text-white rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start speculating?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join the platform today and start predicting the future of global freight prices.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/market">
                  Enter Market <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>;
};
export default Home;