 import { useState } from "react";
 import { Link, useLocation } from "react-router-dom";
 import { motion } from "framer-motion";
 import {
   Brain,
   LayoutDashboard,
   MessageSquare,
   ListTodo,
   BarChart3,
   User,
   Settings,
   LogOut,
   ChevronLeft,
   ChevronRight,
   Moon,
   Sun,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useAuth } from "@/hooks/useAuth";
 import { cn } from "@/lib/utils";
 
 interface DashboardSidebarProps {
   isDarkMode: boolean;
   setIsDarkMode: (value: boolean) => void;
 }
 
 const navItems = [
   { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
   { icon: MessageSquare, label: "Agent Chat", path: "/dashboard/chat" },
   { icon: ListTodo, label: "Tasks", path: "/dashboard/tasks" },
   { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
   { icon: User, label: "Profile", path: "/dashboard/profile" },
 ];
 
 export function DashboardSidebar({ isDarkMode, setIsDarkMode }: DashboardSidebarProps) {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const location = useLocation();
   const { signOut } = useAuth();
 
   return (
     <motion.aside
       initial={false}
       animate={{ width: isCollapsed ? 80 : 280 }}
       transition={{ duration: 0.2 }}
       className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40"
     >
       {/* Logo */}
       <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
         <Link to="/dashboard" className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
             <Brain className="w-6 h-6 text-primary-foreground" />
           </div>
           {!isCollapsed && (
             <motion.span
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-lg font-bold text-sidebar-foreground"
             >
               BizBrain AI
             </motion.span>
           )}
         </Link>
         <Button
           variant="ghost"
           size="icon"
           onClick={() => setIsCollapsed(!isCollapsed)}
           className="shrink-0"
         >
           {isCollapsed ? (
             <ChevronRight className="w-4 h-4" />
           ) : (
             <ChevronLeft className="w-4 h-4" />
           )}
         </Button>
       </div>
 
       {/* Navigation */}
       <nav className="flex-1 p-4 space-y-2">
         {navItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.path}
               to={item.path}
               className={cn(
                 "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                 isActive
                   ? "bg-sidebar-primary text-sidebar-primary-foreground"
                   : "text-sidebar-foreground hover:bg-sidebar-accent"
               )}
             >
               <item.icon className="w-5 h-5 shrink-0" />
               {!isCollapsed && (
                 <motion.span
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="font-medium"
                 >
                   {item.label}
                 </motion.span>
               )}
             </Link>
           );
         })}
       </nav>
 
       {/* Bottom section */}
       <div className="p-4 border-t border-sidebar-border space-y-2">
         {/* Dark mode toggle */}
         <button
           onClick={() => setIsDarkMode(!isDarkMode)}
           className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground hover:bg-sidebar-accent transition-all"
         >
           {isDarkMode ? (
             <Sun className="w-5 h-5 shrink-0" />
           ) : (
             <Moon className="w-5 h-5 shrink-0" />
           )}
           {!isCollapsed && (
             <span className="font-medium">
               {isDarkMode ? "Light Mode" : "Dark Mode"}
             </span>
           )}
         </button>
 
         {/* Logout */}
         <button
           onClick={signOut}
           className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
         >
           <LogOut className="w-5 h-5 shrink-0" />
           {!isCollapsed && <span className="font-medium">Logout</span>}
         </button>
       </div>
     </motion.aside>
   );
 }