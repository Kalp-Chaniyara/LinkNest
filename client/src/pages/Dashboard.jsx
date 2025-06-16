import React, { useEffect } from "react";
import LinkManager from "@/components/LinkManager";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { logout, checkAuth } from "../store/Slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.user.loading);

  // useEffect(() => {
  //   // Check authentication status only once when component mounts
  //   if (!user) {
  //     dispatch(checkAuth());
  //   }
  // }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-linkify flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login due to useEffect
  }

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
                Welcome, {user.fullName}
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
