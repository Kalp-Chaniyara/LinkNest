import React from "react";
import LinkManager from "@/components/LinkManager";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-linkify">
      {/* Top Navigation Bar */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Linkify</h1>
              <span className="text-white/60">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white/80 text-sm hidden md:flex items-center gap-2">
                <User className="h-4 w-4" />
                Welcome, {user?.name || "User"}!
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="pt-4">
        <LinkManager />
      </div>
    </div>
  );
};

export default Dashboard;
