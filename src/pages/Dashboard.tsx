
import { DollarSign, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";

const Dashboard = () => {
  // Mock data for the user's bets
  const activeBets = [
    {
      id: "bet-1",
      market: "Shanghai to San Francisco - August 2025",
      position: "yes",
      amount: 200,
      potentialProfit: 94.12,
      date: "2025-04-15",
      currentPrice: 0.68
    },
    {
      id: "bet-2",
      market: "Rotterdam to New York - June 2025",
      position: "no",
      amount: 150,
      potentialProfit: 300,
      date: "2025-04-10",
      currentPrice: 0.33
    }
  ];
  
  const pastBets = [
    {
      id: "bet-3",
      market: "Shanghai to Los Angeles - January 2025",
      position: "yes",
      amount: 100,
      profit: 47.06,
      date: "2025-01-05",
      outcome: "won"
    },
    {
      id: "bet-4",
      market: "Shanghai to San Francisco - December 2024",
      position: "no",
      amount: 300,
      profit: -300,
      date: "2024-12-20",
      outcome: "lost"
    }
  ];
  
  // Calculate total stats
  const totalInvested = activeBets.reduce((total, bet) => total + bet.amount, 0);
  const potentialProfit = activeBets.reduce((total, bet) => total + bet.potentialProfit, 0);
  const lifetimeProfit = pastBets.reduce((total, bet) => total + bet.profit, 0);
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your bets and monitor your performance
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Bets</p>
                  <p className="text-2xl font-bold">{activeBets.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">${totalInvested}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Potential Profit</p>
                  <p className="text-2xl font-bold">${potentialProfit.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-bet-yes/20 flex items-center justify-center">
                  <ArrowUp className="h-5 w-5 text-bet-yes" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lifetime Profit</p>
                  <p className={`text-2xl font-bold ${lifetimeProfit >= 0 ? 'text-bet-yes' : 'text-bet-no'}`}>
                    ${lifetimeProfit.toFixed(2)}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full ${lifetimeProfit >= 0 ? 'bg-bet-yes/20' : 'bg-bet-no/20'} flex items-center justify-center`}>
                  {lifetimeProfit >= 0 ? (
                    <ArrowUp className="h-5 w-5 text-bet-yes" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-bet-no" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bets Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Bets</CardTitle>
            <CardDescription>
              View and manage your current and past predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Bets</TabsTrigger>
                <TabsTrigger value="history">Betting History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Market</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Current Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Potential Profit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBets.map((bet) => (
                          <tr key={bet.id} className="border-t">
                            <td className="px-4 py-3 text-sm">{bet.market}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                bet.position === 'yes' ? 'bg-bet-yes/10 text-bet-yes' : 'bg-bet-no/10 text-bet-no'
                              }`}>
                                {bet.position === 'yes' ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {bet.position.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">${bet.amount}</td>
                            <td className="px-4 py-3 text-sm">{bet.currentPrice.toFixed(2)}¢</td>
                            <td className="px-4 py-3 text-sm font-medium text-bet-yes">
                              +${bet.potentialProfit.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">{bet.date}</td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="outline" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Market</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Outcome</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Profit/Loss</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastBets.map((bet) => (
                          <tr key={bet.id} className="border-t">
                            <td className="px-4 py-3 text-sm">{bet.market}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                bet.position === 'yes' ? 'bg-bet-yes/10 text-bet-yes' : 'bg-bet-no/10 text-bet-no'
                              }`}>
                                {bet.position === 'yes' ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {bet.position.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">${bet.amount}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                bet.outcome === 'won' ? 'bg-bet-yes/10 text-bet-yes' : 'bg-bet-no/10 text-bet-no'
                              }`}>
                                {bet.outcome === 'won' ? 'WON' : 'LOST'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              <span className={bet.profit >= 0 ? 'text-bet-yes' : 'text-bet-no'}>
                                {bet.profit >= 0 ? '+' : ''}{bet.profit.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{bet.date}</td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="outline" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Connect Wallet CTA */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold">Connect your wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Polkadot wallet to start placing real bets and earning rewards
                </p>
              </div>
              <Button>Connect Wallet</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
