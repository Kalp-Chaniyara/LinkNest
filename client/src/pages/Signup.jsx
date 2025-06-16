import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/dashboard");
    }
  }, [isLogin, navigate]);

  return (
    <div className="min-h-screen bg-gradient-linkify flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Main Content */}
        <div className="glass border-white/40 bg-white/95 rounded-2xl shadow-xl p-8 space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="../../public/Logo.png"
                alt="Logo"
                className="h-16 w-16 animate-float"
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome to Linkify
            </h2>
            <p className="text-slate-600">
              Your personal link management solution
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-linkify-500 transition-all duration-200 shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="h-5 w-5"
              />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-linkify-600 hover:text-linkify-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;