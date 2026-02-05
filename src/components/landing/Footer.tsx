 import { Link } from "react-router-dom";
 import { Brain } from "lucide-react";
 
 export function Footer() {
   return (
     <footer className="border-t border-border/50 py-12 bg-muted/30">
       <div className="container mx-auto px-4">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <Link to="/" className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
               <Brain className="w-6 h-6 text-primary-foreground" />
             </div>
             <span className="text-xl font-bold">BizBrain AI</span>
           </Link>
           
           <div className="flex items-center gap-6 text-sm text-muted-foreground">
             <a href="#features" className="hover:text-foreground transition-colors">
               Features
             </a>
             <a href="#agents" className="hover:text-foreground transition-colors">
               AI Agents
             </a>
             <a href="#benefits" className="hover:text-foreground transition-colors">
               Benefits
             </a>
           </div>
           
           <p className="text-sm text-muted-foreground">
             © {new Date().getFullYear()} BizBrain AI. All rights reserved.
           </p>
         </div>
       </div>
     </footer>
   );
 }