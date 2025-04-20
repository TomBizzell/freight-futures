
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded freight-gradient flex items-center justify-center">
              <span className="font-bold text-white">FS</span>
            </div>
            <span className="font-bold text-lg hidden md:block">Freight Slot Speculator</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/market" className="text-sm font-medium hover:text-primary">
            Market
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm">Connect Wallet</Button>
        </div>
        
        <button 
          className="flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col gap-4 mt-2">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/market" 
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Market
            </Link>
            <Link 
              to="/dashboard" 
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Button variant="outline" size="sm" className="w-full">Connect Wallet</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
