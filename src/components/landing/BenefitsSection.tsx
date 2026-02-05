 import { motion } from "framer-motion";
 import { CheckCircle, ArrowRight } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Link } from "react-router-dom";
 
 const benefits = [
   "Save hours every week with automated business tasks",
   "Get expert-level marketing and content assistance",
   "Improve customer satisfaction with faster responses",
   "Make data-driven decisions with AI-powered insights",
   "Scale your operations without hiring additional staff",
   "Access 24/7 AI assistance whenever you need it",
 ];
 
 export function BenefitsSection() {
   return (
     <section id="benefits" className="py-24 bg-muted/30">
       <div className="container mx-auto px-4">
         <div className="grid lg:grid-cols-2 gap-12 items-center">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
           >
             <h2 className="text-3xl md:text-4xl font-bold mb-6">
               Why Businesses Choose{" "}
               <span className="text-gradient">BizBrain AI</span>
             </h2>
             <p className="text-lg text-muted-foreground mb-8">
               Join thousands of businesses that have transformed their operations 
               with the power of collaborative AI agents.
             </p>
 
             <ul className="space-y-4 mb-8">
               {benefits.map((benefit, index) => (
                 <motion.li
                   key={benefit}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.3, delay: index * 0.1 }}
                   className="flex items-start gap-3"
                 >
                   <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
                   <span className="text-lg">{benefit}</span>
                 </motion.li>
               ))}
             </ul>
 
             <Button size="lg" asChild className="gradient-primary border-0">
               <Link to="/auth?mode=signup">
                 Start Your Free Trial
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Link>
             </Button>
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="relative"
           >
             <div className="relative p-8 rounded-3xl bg-card border border-border/50 shadow-soft-lg">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
               <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
               
               <div className="relative space-y-6">
                 <StatCard number="10x" label="Faster Task Completion" />
                 <StatCard number="24/7" label="AI Availability" />
                 <StatCard number="4" label="Specialized Agents" />
                 <StatCard number="100%" label="Business Focus" />
               </div>
             </div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }
 
 function StatCard({ number, label }: { number: string; label: string }) {
   return (
     <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
       <span className="text-3xl font-bold text-gradient">{number}</span>
       <span className="text-muted-foreground">{label}</span>
     </div>
   );
 }