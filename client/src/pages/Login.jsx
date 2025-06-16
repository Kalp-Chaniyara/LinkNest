// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../store/Slices/userSlice";
// import toast from "react-hot-toast";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const isLoading = useSelector((state)=>{
//     return state.user.isLoading;
//   });

//   const isLogin = useSelector((state)=>{
//     return state.user.isLogin
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // console.log("Input change:", name, value); // Debug log
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const result = await dispatch(login(formData)).unwrap();
//       if (result.success) {
//         toast.success(result.message);
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to login");
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:3000/api/auth/google";
//   };

//   useEffect(()=>{
//     if(isLogin){
//       navigate("/dashboard")
//     }
//   },[isLogin,navigate]);

//   return (
//     <div className="min-h-screen bg-gradient-linkify flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-6">
//         {/* Back to Home */}
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="text-white hover:bg-white/10 mb-4"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Button>

//         {/* Logo */}
//         <div className="text-center animate-fade-in">
//           <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
//             Linkify
//           </h1>
//           <p className="text-white/80">Welcome back! Sign in to your account</p>
//         </div>

//         {/* Login Form */}
//         <Card className="glass border-white/40 bg-white/95 animate-fade-in">
//           <CardHeader className="text-center pb-4">
//             <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
//               <LogIn className="h-6 w-6 text-linkify-600" />
//               Sign In
//             </CardTitle>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-semibold text-slate-700"
//                 >
//                   Email Address
//                 </Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className={`bg-white/90 border-white/40 ${errors.email ? "border-red-300" : ""}`}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label
//                     htmlFor="password"
//                     className="text-sm font-semibold text-slate-700"
//                   >
//                     Password
//                   </Label>
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-linkify-600 hover:text-linkify-700"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className={`bg-white/90 border-white/40 pr-10 ${errors.password ? "border-red-300" : ""}`}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-slate-500" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-slate-500" />
//                     )}
//                   </Button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                 )}
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center space-x-2 text-slate-600">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-linkify-600 focus:ring-linkify-500"
//                   />
//                   <span>Remember me</span>
//                 </label>
//               </div>

//               <Button
//                 type="submit"
//                 variant="gradient"
//                 size="lg"
//                 className="w-full"
//                 disabled={isLoading || !formData.email || !formData.password}
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
//                     Signing In...
//                   </>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>

//               <div className="relative my-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 size="lg"
//                 className="w-full"
//                 onClick={handleGoogleLogin}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Sign in with Google
//               </Button>
//             </form>

//             {/* Sign Up Link */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-slate-600">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-linkify-600 hover:text-linkify-700 font-semibold"
//                 >
//                   Create one now
//                 </button>
//               </p>
//             </div>

//             {/* Demo Credentials */}
//             <Card className="border-white/20 bg-white/10 animate-fade-in">
//               <CardContent className="p-4 text-center">
//                 <p className="text-white/80 text-sm mb-2">
//                   <strong>Demo Credentials:</strong>
//                 </p>
//                 <p className="text-white/70 text-xs">
//                   Email: demo@linkify.com | Password: demo123
//                 </p>
//               </CardContent>
//             </Card>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React from 'react'

function Login() {
  return (
    <div>Login</div>
  )
}

export default Login