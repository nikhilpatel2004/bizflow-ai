 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   PieChart,
   Pie,
   Cell,
 } from "recharts";
 import {
   Megaphone,
   PenTool,
   HeadphonesIcon,
   TrendingUp,
   CheckCircle,
   Clock,
   Circle,
 } from "lucide-react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 
 const COLORS = ["hsl(250, 84%, 54%)", "hsl(280, 84%, 60%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)"];
 
 export default function Analytics() {
   const [taskStats, setTaskStats] = useState({
     total: 0,
     pending: 0,
     in_progress: 0,
     completed: 0,
   });
   const [agentUsage, setAgentUsage] = useState<{ name: string; value: number }[]>([]);
   const [chatStats, setChatStats] = useState({ total: 0 });
   const { user } = useAuth();
 
   useEffect(() => {
     if (user) {
       loadStats();
     }
   }, [user]);
 
   const loadStats = async () => {
     if (!user) return;
 
     // Load tasks
     const { data: tasks } = await supabase
       .from("tasks")
       .select("*")
       .eq("user_id", user.id);
 
     if (tasks) {
       setTaskStats({
         total: tasks.length,
         pending: tasks.filter((t) => t.status === "pending").length,
         in_progress: tasks.filter((t) => t.status === "in_progress").length,
         completed: tasks.filter((t) => t.status === "completed").length,
       });
 
       // Agent usage
       const agentCounts = {
         Marketing: tasks.filter((t) => t.agent_type === "marketing").length,
         Content: tasks.filter((t) => t.agent_type === "content").length,
         Support: tasks.filter((t) => t.agent_type === "support").length,
         Analytics: tasks.filter((t) => t.agent_type === "analytics").length,
       };
       setAgentUsage(
         Object.entries(agentCounts).map(([name, value]) => ({ name, value }))
       );
     }
 
     // Load chat messages count
     const { count } = await supabase
       .from("chat_messages")
       .select("*", { count: "exact", head: true })
       .eq("user_id", user.id);
 
     setChatStats({ total: count || 0 });
   };
 
   const statusData = [
     { name: "Pending", value: taskStats.pending, icon: Circle, color: "text-muted-foreground" },
     { name: "In Progress", value: taskStats.in_progress, icon: Clock, color: "text-warning" },
     { name: "Completed", value: taskStats.completed, icon: CheckCircle, color: "text-success" },
   ];
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
         <p className="text-muted-foreground">
           Track your productivity and AI agent usage
         </p>
       </div>
 
       {/* Overview Stats */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0 }}
         >
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Total Tasks
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold">{taskStats.total}</p>
             </CardContent>
           </Card>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
         >
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Completed
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold text-success">{taskStats.completed}</p>
             </CardContent>
           </Card>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
         >
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 In Progress
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold text-warning">{taskStats.in_progress}</p>
             </CardContent>
           </Card>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Chat Messages
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-3xl font-bold text-primary">{chatStats.total}</p>
             </CardContent>
           </Card>
         </motion.div>
       </div>
 
       {/* Charts */}
       <div className="grid lg:grid-cols-2 gap-6">
         {/* Task Status Chart */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
         >
           <Card>
             <CardHeader>
               <CardTitle>Task Status Distribution</CardTitle>
             </CardHeader>
             <CardContent>
               {taskStats.total === 0 ? (
                 <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                   No tasks yet. Create your first task to see analytics.
                 </div>
               ) : (
                 <ResponsiveContainer width="100%" height={300}>
                   <BarChart data={statusData}>
                     <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                     <XAxis dataKey="name" className="text-xs" />
                     <YAxis className="text-xs" />
                     <Tooltip
                       contentStyle={{
                         backgroundColor: "hsl(var(--card))",
                         border: "1px solid hsl(var(--border))",
                         borderRadius: "8px",
                       }}
                     />
                     <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               )}
             </CardContent>
           </Card>
         </motion.div>
 
         {/* Agent Usage Chart */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
         >
           <Card>
             <CardHeader>
               <CardTitle>Agent Usage</CardTitle>
             </CardHeader>
             <CardContent>
               {taskStats.total === 0 ? (
                 <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                   No agent usage data yet.
                 </div>
               ) : (
                 <div className="flex items-center justify-center">
                   <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                       <Pie
                         data={agentUsage}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {agentUsage.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip
                         contentStyle={{
                           backgroundColor: "hsl(var(--card))",
                           border: "1px solid hsl(var(--border))",
                           borderRadius: "8px",
                         }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               )}
               {taskStats.total > 0 && (
                 <div className="flex flex-wrap justify-center gap-4 mt-4">
                   {agentUsage.map((agent, index) => (
                     <div key={agent.name} className="flex items-center gap-2">
                       <div
                         className="w-3 h-3 rounded-full"
                         style={{ backgroundColor: COLORS[index] }}
                       />
                       <span className="text-sm">{agent.name}</span>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
         </motion.div>
       </div>
 
       {/* Agent Cards */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
       >
         <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { name: "Marketing", icon: Megaphone, color: "bg-agent-marketing", tasks: agentUsage.find(a => a.name === "Marketing")?.value || 0 },
             { name: "Content", icon: PenTool, color: "bg-agent-content", tasks: agentUsage.find(a => a.name === "Content")?.value || 0 },
             { name: "Support", icon: HeadphonesIcon, color: "bg-agent-support", tasks: agentUsage.find(a => a.name === "Support")?.value || 0 },
             { name: "Analytics", icon: TrendingUp, color: "bg-agent-analytics", tasks: agentUsage.find(a => a.name === "Analytics")?.value || 0 },
           ].map((agent) => (
             <Card key={agent.name}>
               <CardContent className="p-4">
                 <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center text-white mb-3`}>
                   <agent.icon className="w-5 h-5" />
                 </div>
                 <p className="font-medium">{agent.name}</p>
                 <p className="text-2xl font-bold">{agent.tasks}</p>
                 <p className="text-xs text-muted-foreground">tasks assigned</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </motion.div>
     </div>
   );
 }