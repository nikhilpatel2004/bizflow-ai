 import { motion } from "framer-motion";
 import { Link } from "react-router-dom";
 import { 
   Megaphone, 
   PenTool, 
   HeadphonesIcon, 
   TrendingUp,
   Plus,
   MessageSquare,
   ListTodo,
   ArrowRight,
 } from "lucide-react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { useAuth } from "@/hooks/useAuth";
 
 const agents = [
   {
     id: "marketing",
     name: "Marketing",
     icon: Megaphone,
     color: "bg-agent-marketing",
     description: "Campaigns & ads",
   },
   {
     id: "content",
     name: "Content",
     icon: PenTool,
     color: "bg-agent-content",
     description: "Blogs & social",
   },
   {
     id: "support",
     name: "Support",
     icon: HeadphonesIcon,
     color: "bg-agent-support",
     description: "Customer help",
   },
   {
     id: "analytics",
     name: "Analytics",
     icon: TrendingUp,
     color: "bg-agent-analytics",
     description: "Data & insights",
   },
 ];
 
 export default function Dashboard() {
   const { user } = useAuth();
   const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
 
   return (
     <div className="space-y-8">
       {/* Header */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
       >
         <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
         <p className="text-muted-foreground">
           Your AI agents are ready to help. What would you like to accomplish today?
         </p>
       </motion.div>
 
       {/* Quick Actions */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.1 }}
         className="flex flex-wrap gap-4"
       >
         <Button asChild className="gradient-primary border-0">
           <Link to="/dashboard/tasks">
             <Plus className="w-4 h-4 mr-2" />
             Create New Task
           </Link>
         </Button>
         <Button variant="outline" asChild>
           <Link to="/dashboard/chat">
             <MessageSquare className="w-4 h-4 mr-2" />
             Chat with Agents
           </Link>
         </Button>
       </motion.div>
 
       {/* AI Agents Grid */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
       >
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-semibold">Your AI Agents</h2>
           <Link
             to="/dashboard/chat"
             className="text-sm text-primary hover:underline flex items-center gap-1"
           >
             Start chatting <ArrowRight className="w-4 h-4" />
           </Link>
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {agents.map((agent, index) => (
             <motion.div
               key={agent.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
             >
               <Link to={`/dashboard/chat?agent=${agent.id}`}>
                 <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                   <CardContent className="p-6">
                     <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center text-white mb-4`}>
                       <agent.icon className="w-6 h-6" />
                     </div>
                     <h3 className="font-semibold mb-1">{agent.name} Agent</h3>
                     <p className="text-sm text-muted-foreground">{agent.description}</p>
                   </CardContent>
                 </Card>
               </Link>
             </motion.div>
           ))}
         </div>
       </motion.div>
 
       {/* Stats Overview */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.4 }}
       >
         <h2 className="text-xl font-semibold mb-4">Overview</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Total Tasks
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold">0</p>
               <p className="text-sm text-muted-foreground">No tasks yet</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Completed
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold text-success">0</p>
               <p className="text-sm text-muted-foreground">Complete your first task</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Agent Chats
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold text-primary">0</p>
               <p className="text-sm text-muted-foreground">Start a conversation</p>
             </CardContent>
           </Card>
         </div>
       </motion.div>
 
       {/* Getting Started */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.5 }}
       >
         <Card className="bg-muted/50 border-dashed">
           <CardContent className="p-6">
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                 <ListTodo className="w-6 h-6 text-primary-foreground" />
               </div>
               <div>
                 <h3 className="font-semibold mb-1">Get Started</h3>
                 <p className="text-muted-foreground mb-4">
                   Create your first task or start chatting with an AI agent to see BizBrain AI in action.
                 </p>
                 <div className="flex flex-wrap gap-2">
                   <Button size="sm" asChild>
                     <Link to="/dashboard/tasks">Create a Task</Link>
                   </Button>
                   <Button size="sm" variant="outline" asChild>
                     <Link to="/dashboard/chat">Chat with AI</Link>
                   </Button>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 }