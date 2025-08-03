// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react";
// import loginBg from "@/assets/login-bg.jpg";

// export const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     confirmPassword: ""
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log("Form submitted:", formData);
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-background">
//       {/* Background Image with Overlay */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: `url(${loginBg})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-secondary opacity-80" />
      
//       {/* Floating Orbs */}
//       <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500" />

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           {/* Logo/Brand */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 shadow-glow-primary">
//               <Sparkles className="w-8 h-8 text-primary-foreground" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
//               Welcome Back
//             </h1>
//             <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
//           </div>

//           {/* Login/Signup Card */}
//           <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-glow-card">
//             <CardHeader className="space-y-1">
//               <Tabs defaultValue="login" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2 bg-muted/50">
//                   <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
//                     Sign In
//                   </TabsTrigger>
//                   <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
//                     Sign Up
//                   </TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="login" className="mt-6">
//                   <CardTitle className="text-2xl text-center">Sign In</CardTitle>
//                   <CardDescription className="text-center">
//                     Enter your credentials to access your account
//                   </CardDescription>
//                 </TabsContent>
                
//                 <TabsContent value="signup" className="mt-6">
//                   <CardTitle className="text-2xl text-center">Create Account</CardTitle>
//                   <CardDescription className="text-center">
//                     Join us today and start your journey
//                   </CardDescription>
//                 </TabsContent>
//               </Tabs>
//             </CardHeader>
            
//             <CardContent>
//               <Tabs defaultValue="login" className="w-full">
//                 <TabsContent value="login">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email</Label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="email"
//                           name="email"
//                           type="email"
//                           placeholder="Enter your email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="password">Password</Label>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="password"
//                           name="password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Enter your password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
//                         >
//                           {showPassword ? <EyeOff /> : <Eye />}
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center justify-between">
//                       <div className="text-sm">
//                         <a href="#" className="text-primary hover:text-primary/80 transition-colors">
//                           Forgot password?
//                         </a>
//                       </div>
//                     </div>
                    
//                     <Button 
//                       type="submit" 
//                       className="w-full"
//                       variant="default"
//                       size="lg"
//                     >
//                       Sign In
//                     </Button>
//                   </form>
//                 </TabsContent>
                
//                 <TabsContent value="signup">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Full Name</Label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="name"
//                           name="name"
//                           type="text"
//                           placeholder="Enter your full name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="signup-email">Email</Label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="signup-email"
//                           name="email"
//                           type="email"
//                           placeholder="Enter your email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="signup-password">Password</Label>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="signup-password"
//                           name="password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Create a password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
//                         >
//                           {showPassword ? <EyeOff /> : <Eye />}
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="confirm-password">Confirm Password</Label>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           id="confirm-password"
//                           name="confirmPassword"
//                           type="password"
//                           placeholder="Confirm your password"
//                           value={formData.confirmPassword}
//                           onChange={handleInputChange}
//                           className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
//                           required
//                         />
//                       </div>
//                     </div>
                    
//                     <Button 
//                       type="submit" 
//                       className="w-full"
//                       variant="default"
//                       size="lg"
//                     >
//                       Create Account
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
              
//               {/* Divider */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-border/50" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
//                 </div>
//               </div>
              
//               {/* Social Login Placeholder */}
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant="secondary" className="h-11">
//                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   Google
//                 </Button>
//                 <Button variant="secondary" className="h-11">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                   </svg>
//                   Facebook
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* Footer */}
//           <div className="text-center mt-8 text-sm text-muted-foreground">
//             <p>
//               By continuing, you agree to our{" "}
//               <a href="#" className="text-primary hover:text-primary/80 transition-colors underline">
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a href="#" className="text-primary hover:text-primary/80 transition-colors underline">
//                 Privacy Policy
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;