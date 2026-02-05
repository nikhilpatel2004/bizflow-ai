 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Brain, Menu, X } from "lucide-react";
 
 export function Navbar() {
   const [isOpen, setIsOpen] = useState(false);
 
   return (
     <motion.header
       initial={{ y: -20, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.5 }}
       className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
     >
       <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
         <Link to="/" className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
             <Brain className="w-6 h-6 text-primary-foreground" />
           </div>
           <span className="text-xl font-bold">BizBrain AI</span>
         </Link>
 
         {/* Desktop Navigation */}
         <div className="hidden md:flex items-center gap-8">
           <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
             Features
           </a>
           <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors">
             AI Agents
           </a>
           <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
             Benefits
           </a>
         </div>
 
         <div className="hidden md:flex items-center gap-3">
           <Button variant="ghost" asChild>
             <Link to="/auth">Log in</Link>
           </Button>
           <Button asChild className="gradient-primary border-0">
             <Link to="/auth?mode=signup">Get Started</Link>
           </Button>
         </div>
 
         {/* Mobile Menu Button */}
         <button
           className="md:hidden p-2"
           onClick={() => setIsOpen(!isOpen)}
           aria-label="Toggle menu"
         >
           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
         </button>
       </nav>
 
       {/* Mobile Navigation */}
       {isOpen && (
         <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: "auto" }}
           exit={{ opacity: 0, height: 0 }}
           className="md:hidden border-t border-border/50 bg-background"
         >
           <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
             <a
               href="#features"
               className="text-muted-foreground hover:text-foreground transition-colors py-2"
               onClick={() => setIsOpen(false)}
             >
               Features
             </a>
             <a
               href="#agents"
               className="text-muted-foreground hover:text-foreground transition-colors py-2"
               onClick={() => setIsOpen(false)}
             >
               AI Agents
             </a>
             <a
               href="#benefits"
               className="text-muted-foreground hover:text-foreground transition-colors py-2"
               onClick={() => setIsOpen(false)}
             >
               Benefits
             </a>
             <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
               <Button variant="ghost" asChild className="w-full">
                 <Link to="/auth" onClick={() => setIsOpen(false)}>Log in</Link>
               </Button>
               <Button asChild className="w-full gradient-primary border-0">
                 <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>Get Started</Link>
               </Button>
             </div>
           </div>
         </motion.div>
       )}
     </motion.header>
   );
 }