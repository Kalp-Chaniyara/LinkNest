import React, { useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/Slices/userSlice";

const ProtectedRoute = ({ children }) => {
  // const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, loading, user } = useSelector((state) => state.user);

  // useEffect(()=>{
  //   console.log("Is login and is loading ", isLogin," ",loading, user)
  // })

  useEffect(() => {
    // console.log('ProtectedRoute mounted, checking auth...');
    dispatch(checkAuth())
      .unwrap()
      .then(() => {
        // console.log('Auth check successful');
      })
      .catch((error) => {
        // console.error('Auth check failed:', error);
      });
  }, [dispatch]);

  // console.log('Current auth state:', { isLogin, loading, user });

  if (loading) {
    // console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-linkify flex items-center justify-center">
        <Card className="glass border-white/40 bg-white/95">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-linkify-600 border-t-transparent rounded-full" />
            <p className="text-slate-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLogin || !user) {
    // console.log('Showing auth required state');
    return (
      <div className="min-h-screen bg-gradient-linkify flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/40 bg-white/95">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-6 text-linkify-600" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-slate-600 mb-6">
              Please sign in to access your link dashboard and start organizing
              your links.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/signup")}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="w-full text-slate-600"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;
