 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Link } from "react-router-dom";
 import { ArrowRight, Sparkles } from "lucide-react";
 
 export function CTASection() {
   return (
     <section className="py-24">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center"
         >
           {/* Background decorations */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
           
           <div className="relative z-10">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
               <Sparkles className="w-4 h-4 text-white" />
               <span className="text-sm font-medium text-white">Start Free - No Credit Card Required</span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
               Ready to Transform Your Business?
             </h2>
             <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
               Join BizBrain AI today and let our AI agents handle the heavy lifting 
               while you focus on growing your business.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                 size="lg"
                 variant="secondary"
                 asChild
                 className="text-lg h-14 px-8 bg-white text-primary hover:bg-white/90"
               >
                 <Link to="/auth?mode=signup">
                   Get Started Free
                   <ArrowRight className="w-5 h-5 ml-2" />
                 </Link>
               </Button>
               <Button
                 size="lg"
                 variant="outline"
                 asChild
                 className="text-lg h-14 px-8 border-white/30 text-white hover:bg-white/10 bg-transparent"
               >
                 <Link to="/auth">
                   Log In
                 </Link>
               </Button>
             </div>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }