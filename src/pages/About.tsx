
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-6">About Freight Slot Speculator</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Freight Slot Speculator is a decentralized prediction market platform built on Polkadot, 
                focused exclusively on global shipping freight rates.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg mb-10">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="mb-4">
                  We aim to create a transparent, accessible market where industry experts, traders, 
                  and shipping enthusiasts can speculate on future freight rates while contributing 
                  to more accurate price discovery in the shipping industry.
                </p>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">How Our Platform Works</h2>
              <p className="mb-4">
                Freight Slot Speculator uses blockchain technology to create prediction markets for shipping routes. 
                Users can take positions on whether freight rates will rise or fall, and earn rewards if their 
                predictions are correct.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="mr-2 h-6 w-6 rounded-full freight-gradient flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <span><strong className="text-freight-600">Decentralized Markets</strong> - All markets operate using smart contracts on Polkadot, ensuring transparency and eliminating the need for traditional intermediaries.</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-6 w-6 rounded-full freight-gradient flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <span><strong className="text-freight-600">Focused Markets</strong> - We specialize exclusively in freight shipping routes, providing specific markets for major global shipping lanes.</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-6 w-6 rounded-full freight-gradient flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span><strong className="text-freight-600">Market Resolution</strong> - Markets are resolved based on reliable industry data sources, ensuring fair and accurate outcomes for all participants.</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 h-6 w-6 rounded-full freight-gradient flex items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <span><strong className="text-freight-600">Low Fees</strong> - Our platform charges minimal fees, allowing users to maximize their potential returns.</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Market Resolution</h3>
              <p className="mb-6">
                For our initial Shanghai to San Francisco market, we will use data from the Shanghai 
                Containerized Freight Index (SCFI) and Freightos Baltic Index (FBX) to determine 
                the average shipping rates for the specified months. The market will resolve on 
                September 1, 2025, when the official August data is available.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Built on Polkadot</h2>
              <p className="mb-6">
                Our platform is built on Polkadot's blockchain technology, chosen for its:
              </p>
              <ul className="space-y-2 mb-8">
                <li>Scalability and low transaction fees</li>
                <li>Cross-chain interoperability</li>
                <li>Strong security model</li>
                <li>Environmental sustainability compared to other blockchain networks</li>
              </ul>
              
              <div className="bg-ocean-50 border border-ocean-200 p-6 rounded-lg mb-10">
                <h2 className="text-2xl font-semibold mb-4">Future Development</h2>
                <p className="mb-4">
                  We're currently in development of our first market. Future plans include:
                </p>
                <ul className="space-y-1 mb-4">
                  <li>Expanding to additional shipping routes and regions</li>
                  <li>Creating markets for shorter and longer time horizons</li>
                  <li>Introducing additional market types beyond simple yes/no outcomes</li>
                  <li>Developing a mobile app for on-the-go betting</li>
                </ul>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Ready to start predicting?</h3>
                <Button asChild>
                  <Link to="/market">
                    Enter Market <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
