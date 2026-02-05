 import { Link } from "react-router-dom";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { ArrowRight, Sparkles, Zap, Users, BarChart3 } from "lucide-react";
 
 export function HeroSection() {
   return (
     <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
       {/* Background Effects */}
       <div className="absolute inset-0 gradient-hero" />
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
       
       <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-4xl mx-auto text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
           >
             <Sparkles className="w-4 h-4 text-primary" />
             <span className="text-sm font-medium">Powered by Advanced AI Agents</span>
           </motion.div>
 
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
           >
             Your AI-Powered{" "}
             <span className="text-gradient">Business Assistant</span>
           </motion.h1>
 
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
           >
             Multiple specialized AI agents collaborate to handle marketing, content creation, 
             customer support, and analytics for your business.
           </motion.p>
 
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
           >
             <Button size="lg" asChild className="gradient-primary border-0 text-lg h-14 px-8">
               <Link to="/auth?mode=signup">
                 Start Free Trial
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Link>
             </Button>
             <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
               <a href="#agents">
                 Meet the Agents
               </a>
             </Button>
           </motion.div>
 
           {/* Agent Preview Cards */}
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.4 }}
             className="grid grid-cols-2 md:grid-cols-4 gap-4"
           >
             <AgentPreviewCard
               icon={<Zap className="w-6 h-6" />}
               title="Marketing"
               color="bg-agent-marketing"
               delay={0}
             />
             <AgentPreviewCard
               icon={<Sparkles className="w-6 h-6" />}
               title="Content"
               color="bg-agent-content"
               delay={0.1}
             />
             <AgentPreviewCard
               icon={<Users className="w-6 h-6" />}
               title="Support"
               color="bg-agent-support"
               delay={0.2}
             />
             <AgentPreviewCard
               icon={<BarChart3 className="w-6 h-6" />}
               title="Analytics"
               color="bg-agent-analytics"
               delay={0.3}
             />
           </motion.div>
         </div>
       </div>
     </section>
   );
 }
 
 function AgentPreviewCard({
   icon,
   title,
   color,
   delay,
 }: {
   icon: React.ReactNode;
   title: string;
   color: string;
   delay: number;
 }) {
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.4, delay: 0.5 + delay }}
       whileHover={{ y: -5, scale: 1.02 }}
       className="p-4 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer"
     >
       <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white mb-3 mx-auto`}>
         {icon}
       </div>
       <p className="font-medium text-center">{title} Agent</p>
     </motion.div>
   );
 }