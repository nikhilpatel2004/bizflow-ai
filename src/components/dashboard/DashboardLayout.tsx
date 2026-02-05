 import { useState, useEffect } from "react";
 import { Outlet, useNavigate } from "react-router-dom";
 import { DashboardSidebar } from "./DashboardSidebar";
 import { useAuth } from "@/hooks/useAuth";
 import { Loader2 } from "lucide-react";
 
 export function DashboardLayout() {
   const [isDarkMode, setIsDarkMode] = useState(false);
   const { user, loading } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     // Check for saved dark mode preference
     const savedDarkMode = localStorage.getItem("darkMode") === "true";
     setIsDarkMode(savedDarkMode);
     if (savedDarkMode) {
       document.documentElement.classList.add("dark");
     }
   }, []);
 
   useEffect(() => {
     if (isDarkMode) {
       document.documentElement.classList.add("dark");
       localStorage.setItem("darkMode", "true");
     } else {
       document.documentElement.classList.remove("dark");
       localStorage.setItem("darkMode", "false");
     }
   }, [isDarkMode]);
 
   useEffect(() => {
     if (!loading && !user) {
       navigate("/auth");
     }
   }, [user, loading, navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   return (
     <div className="min-h-screen bg-background">
       <DashboardSidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
       <main className="ml-20 lg:ml-[280px] transition-all duration-200">
         <div className="p-6 lg:p-8">
           <Outlet />
         </div>
       </main>
     </div>
   );
 }