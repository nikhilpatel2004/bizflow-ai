 import { useState, useEffect } from "react";
 import { useNavigate, useSearchParams, Link } from "react-router-dom";
 import { motion } from "framer-motion";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { z } from "zod";
 import { Brain, ArrowLeft, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 
 const loginSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
 });
 
 const signupSchema = z.object({
   fullName: z.string().min(2, "Name must be at least 2 characters"),
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   confirmPassword: z.string(),
 }).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords don't match",
   path: ["confirmPassword"],
 });
 
 type LoginFormData = z.infer<typeof loginSchema>;
 type SignupFormData = z.infer<typeof signupSchema>;
 
 export default function Auth() {
   const [searchParams] = useSearchParams();
   const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   const { signIn, signUp, user } = useAuth();
   const { toast } = useToast();
 
   useEffect(() => {
     if (user) {
       navigate("/dashboard");
     }
   }, [user, navigate]);
 
   const loginForm = useForm<LoginFormData>({
     resolver: zodResolver(loginSchema),
     defaultValues: {
       email: "",
       password: "",
     },
   });
 
   const signupForm = useForm<SignupFormData>({
     resolver: zodResolver(signupSchema),
     defaultValues: {
       fullName: "",
       email: "",
       password: "",
       confirmPassword: "",
     },
   });
 
   const handleLogin = async (data: LoginFormData) => {
     setIsLoading(true);
     const { error } = await signIn(data.email, data.password);
     setIsLoading(false);
 
     if (error) {
       toast({
         title: "Login failed",
         description: error.message,
         variant: "destructive",
       });
     } else {
       toast({
         title: "Welcome back!",
         description: "You have successfully logged in.",
       });
       navigate("/dashboard");
     }
   };
 
   const handleSignup = async (data: SignupFormData) => {
     setIsLoading(true);
     const { error } = await signUp(data.email, data.password, data.fullName);
     setIsLoading(false);
 
     if (error) {
       toast({
         title: "Signup failed",
         description: error.message,
         variant: "destructive",
       });
     } else {
       toast({
         title: "Account created!",
         description: "Please check your email to verify your account.",
       });
     }
   };
 
   return (
     <div className="min-h-screen flex">
       {/* Left side - Form */}
       <div className="flex-1 flex items-center justify-center p-8">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md"
         >
           <Link
             to="/"
             className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
           >
             <ArrowLeft className="w-4 h-4" />
             Back to home
           </Link>
 
           <div className="flex items-center gap-3 mb-8">
             <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
               <Brain className="w-7 h-7 text-primary-foreground" />
             </div>
             <div>
               <h1 className="text-2xl font-bold">BizBrain AI</h1>
               <p className="text-muted-foreground text-sm">
                 {isSignup ? "Create your account" : "Welcome back"}
               </p>
             </div>
           </div>
 
           {isSignup ? (
             <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="fullName">Full Name</Label>
                 <Input
                   id="fullName"
                   placeholder="John Doe"
                   {...signupForm.register("fullName")}
                 />
                 {signupForm.formState.errors.fullName && (
                   <p className="text-sm text-destructive">
                     {signupForm.formState.errors.fullName.message}
                   </p>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="john@example.com"
                   {...signupForm.register("email")}
                 />
                 {signupForm.formState.errors.email && (
                   <p className="text-sm text-destructive">
                     {signupForm.formState.errors.email.message}
                   </p>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   {...signupForm.register("password")}
                 />
                 {signupForm.formState.errors.password && (
                   <p className="text-sm text-destructive">
                     {signupForm.formState.errors.password.message}
                   </p>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <Input
                   id="confirmPassword"
                   type="password"
                   placeholder="••••••••"
                   {...signupForm.register("confirmPassword")}
                 />
                 {signupForm.formState.errors.confirmPassword && (
                   <p className="text-sm text-destructive">
                     {signupForm.formState.errors.confirmPassword.message}
                   </p>
                 )}
               </div>
 
               <Button
                 type="submit"
                 className="w-full gradient-primary border-0"
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Creating account...
                   </>
                 ) : (
                   "Create Account"
                 )}
               </Button>
             </form>
           ) : (
             <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="john@example.com"
                   {...loginForm.register("email")}
                 />
                 {loginForm.formState.errors.email && (
                   <p className="text-sm text-destructive">
                     {loginForm.formState.errors.email.message}
                   </p>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   {...loginForm.register("password")}
                 />
                 {loginForm.formState.errors.password && (
                   <p className="text-sm text-destructive">
                     {loginForm.formState.errors.password.message}
                   </p>
                 )}
               </div>
 
               <Button
                 type="submit"
                 className="w-full gradient-primary border-0"
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Signing in...
                   </>
                 ) : (
                   "Sign In"
                 )}
               </Button>
             </form>
           )}
 
           <p className="text-center text-muted-foreground mt-6">
             {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
             <button
               type="button"
               onClick={() => setIsSignup(!isSignup)}
               className="text-primary hover:underline font-medium"
             >
               {isSignup ? "Sign in" : "Sign up"}
             </button>
           </p>
         </motion.div>
       </div>
 
       {/* Right side - Branding */}
       <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="relative z-10 text-center text-white max-w-md"
         >
           <h2 className="text-4xl font-bold mb-6">
             Empower Your Business with AI
           </h2>
           <p className="text-lg text-white/80 mb-8">
             Join thousands of businesses using BizBrain AI to automate tasks, 
             create content, and make data-driven decisions.
           </p>
           <div className="grid grid-cols-2 gap-4 text-left">
             <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
               <p className="text-2xl font-bold">4</p>
               <p className="text-sm text-white/70">Specialized AI Agents</p>
             </div>
             <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
               <p className="text-2xl font-bold">24/7</p>
               <p className="text-sm text-white/70">AI Availability</p>
             </div>
             <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
               <p className="text-2xl font-bold">10x</p>
               <p className="text-sm text-white/70">Faster Results</p>
             </div>
             <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
               <p className="text-2xl font-bold">100%</p>
               <p className="text-sm text-white/70">Business Focus</p>
             </div>
           </div>
         </motion.div>
       </div>
     </div>
   );
 }