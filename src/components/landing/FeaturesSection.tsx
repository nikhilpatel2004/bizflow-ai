 import { motion } from "framer-motion";
 import { 
   MessageSquare, 
   ListTodo, 
   BarChart3, 
   Zap, 
   Shield, 
   Clock 
 } from "lucide-react";
 
 const features = [
   {
     icon: <MessageSquare className="w-6 h-6" />,
     title: "AI-Powered Chat",
     description: "Have natural conversations with specialized AI agents that understand your business context.",
   },
   {
     icon: <ListTodo className="w-6 h-6" />,
     title: "Smart Task Management",
     description: "Create tasks and let AI automatically assign them to the best-suited agent for optimal results.",
   },
   {
     icon: <BarChart3 className="w-6 h-6" />,
     title: "Business Analytics",
     description: "Get AI-driven insights and recommendations to grow your business faster.",
   },
   {
     icon: <Zap className="w-6 h-6" />,
     title: "Real-Time Streaming",
     description: "Watch AI responses stream in real-time for an interactive and engaging experience.",
   },
   {
     icon: <Shield className="w-6 h-6" />,
     title: "Secure & Private",
     description: "Your business data is encrypted and protected with enterprise-grade security.",
   },
   {
     icon: <Clock className="w-6 h-6" />,
     title: "24/7 Availability",
     description: "AI agents are always ready to help, no matter when you need assistance.",
   },
 ];
 
 export function FeaturesSection() {
   return (
     <section id="features" className="py-24 bg-muted/30">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-16"
         >
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Everything You Need to{" "}
             <span className="text-gradient">Supercharge</span> Your Business
           </h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             BizBrain AI combines powerful features with intuitive design to help you 
             accomplish more with less effort.
           </p>
         </motion.div>
 
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <motion.div
               key={feature.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               whileHover={{ y: -5 }}
               className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-soft-lg transition-all"
             >
               <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4">
                 {feature.icon}
               </div>
               <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
               <p className="text-muted-foreground">{feature.description}</p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 }