 import { motion } from "framer-motion";
 import { Card, CardContent } from "@/components/ui/card";
 import { Megaphone, PenTool, HeadphonesIcon, TrendingUp } from "lucide-react";
 
 const agents = [
   {
     id: "marketing",
     name: "Marketing Agent",
     icon: <Megaphone className="w-8 h-8" />,
     color: "bg-agent-marketing",
     borderColor: "border-agent-marketing/30",
     description: "Your AI marketing strategist that creates campaigns, generates ad copy, and builds compelling brand messaging.",
     capabilities: [
       "Marketing campaign strategies",
       "Advertisement copywriting",
       "Promotion and offer ideas",
       "Brand voice development",
     ],
   },
   {
     id: "content",
     name: "Content Agent",
     icon: <PenTool className="w-8 h-8" />,
     color: "bg-agent-content",
     borderColor: "border-agent-content/30",
     description: "Your creative writing partner that produces engaging content across all formats and platforms.",
     capabilities: [
       "Blog posts and articles",
       "Social media content",
       "Product descriptions",
       "Email marketing copy",
     ],
   },
   {
     id: "support",
     name: "Support Agent",
     icon: <HeadphonesIcon className="w-8 h-8" />,
     color: "bg-agent-support",
     borderColor: "border-agent-support/30",
     description: "Your customer service expert that helps create helpful responses and build better relationships.",
     capabilities: [
       "Customer reply templates",
       "FAQ documentation",
       "Support ticket responses",
       "Real-time chat assistance",
     ],
   },
   {
     id: "analytics",
     name: "Analytics Agent",
     icon: <TrendingUp className="w-8 h-8" />,
     color: "bg-agent-analytics",
     borderColor: "border-agent-analytics/30",
     description: "Your data-driven advisor that analyzes performance and provides actionable growth strategies.",
     capabilities: [
       "Business performance analysis",
       "Growth strategy recommendations",
       "Trend predictions",
       "Actionable insights",
     ],
   },
 ];
 
 export function AgentsSection() {
   return (
     <section id="agents" className="py-24">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-16"
         >
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Meet Your <span className="text-gradient">AI Agent Team</span>
           </h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             Four specialized AI agents working together to handle every aspect of your 
             business operations with expertise and precision.
           </p>
         </motion.div>
 
         <div className="grid md:grid-cols-2 gap-8">
           {agents.map((agent, index) => (
             <motion.div
               key={agent.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
             >
               <Card className={`h-full border-2 ${agent.borderColor} hover:shadow-lg transition-all`}>
                 <CardContent className="p-6">
                   <div className="flex items-start gap-4 mb-4">
                     <div className={`w-16 h-16 rounded-2xl ${agent.color} flex items-center justify-center text-white shrink-0`}>
                       {agent.icon}
                     </div>
                     <div>
                       <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                       <p className="text-muted-foreground">{agent.description}</p>
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                       Capabilities
                     </p>
                     <ul className="grid grid-cols-2 gap-2">
                       {agent.capabilities.map((capability) => (
                         <li
                           key={capability}
                           className="flex items-center gap-2 text-sm"
                         >
                           <div className={`w-1.5 h-1.5 rounded-full ${agent.color}`} />
                           {capability}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 }