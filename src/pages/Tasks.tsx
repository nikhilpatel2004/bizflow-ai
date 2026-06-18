 import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import {
   Plus,
   Megaphone,
   PenTool,
   HeadphonesIcon,
   TrendingUp,
   Trash2,
   Loader2,
   Clock,
   CheckCircle,
   Circle,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import {
   Dialog,
   DialogContent,
  DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 import { cn } from "@/lib/utils";
 
 type AgentType = "marketing" | "content" | "support" | "analytics";
 type TaskStatus = "pending" | "in_progress" | "completed";
 type Priority = "low" | "medium" | "high";
 
 interface Task {
   id: string;
   title: string;
   description: string | null;
   agent_type: AgentType;
   status: TaskStatus;
   priority: Priority;
   result: string | null;
   created_at: string;
 }
 
 const agentConfig = {
   marketing: { icon: Megaphone, color: "bg-agent-marketing", label: "Marketing" },
   content: { icon: PenTool, color: "bg-agent-content", label: "Content" },
   support: { icon: HeadphonesIcon, color: "bg-agent-support", label: "Support" },
   analytics: { icon: TrendingUp, color: "bg-agent-analytics", label: "Analytics" },
 };
 
 const statusConfig = {
   pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
   in_progress: { icon: Clock, color: "text-warning", label: "In Progress" },
   completed: { icon: CheckCircle, color: "text-success", label: "Completed" },
 };
 
 const priorityConfig = {
   low: { color: "bg-muted text-muted-foreground", label: "Low" },
   medium: { color: "bg-warning/20 text-warning", label: "Medium" },
   high: { color: "bg-destructive/20 text-destructive", label: "High" },
 };
 
 export default function Tasks() {
   const [tasks, setTasks] = useState<Task[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isCreating, setIsCreating] = useState(false);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [filter, setFilter] = useState<"all" | TaskStatus>("all");
   const [newTask, setNewTask] = useState({
     title: "",
     description: "",
     agent_type: "marketing" as AgentType,
     priority: "medium" as Priority,
   });
   const { user } = useAuth();
   const { toast } = useToast();
 
   useEffect(() => {
     loadTasks();
   }, [user]);
 
   const loadTasks = async () => {
     if (!user) return;
 
     const { data, error } = await supabase
       .from("tasks")
       .select("*")
       .eq("user_id", user.id)
       .order("created_at", { ascending: false });
 
     if (error) {
       console.error("Error loading tasks:", error);
      const tableMissing =
        error.code === "PGRST205" ||
        error.message?.toLowerCase().includes("could not find") ||
        error.message?.toLowerCase().includes("relation") ||
        error.message?.toLowerCase().includes("tasks");

       toast({
         title: "Error",
        description: tableMissing
          ? "Tasks table is missing in Supabase. Run project migrations in your Supabase project."
          : "Failed to load tasks",
         variant: "destructive",
       });
     } else {
       setTasks(data as Task[]);
     }
     setIsLoading(false);
   };
 
   const createTask = async () => {
     if (!user || !newTask.title.trim()) return;
 
     setIsCreating(true);
 
     const { data, error } = await supabase
       .from("tasks")
       .insert({
         user_id: user.id,
         title: newTask.title,
         description: newTask.description || null,
         agent_type: newTask.agent_type,
         priority: newTask.priority,
         status: "pending",
       })
       .select()
       .single();
 
     if (error) {
       console.error("Error creating task:", error);
       toast({
         title: "Error",
         description: error.message || "Failed to create task",
         variant: "destructive",
       });
     } else {
       setTasks((prev) => [data as Task, ...prev]);
       setNewTask({
         title: "",
         description: "",
         agent_type: "marketing",
         priority: "medium",
       });
       setIsDialogOpen(false);
       toast({
         title: "Task created",
         description: "Your task has been created successfully.",
       });
     }
     setIsCreating(false);
   };
 
   const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
     const { error } = await supabase
       .from("tasks")
       .update({ status })
       .eq("id", taskId);
 
     if (error) {
       toast({
         title: "Error",
         description: "Failed to update task",
         variant: "destructive",
       });
     } else {
       setTasks((prev) =>
         prev.map((t) => (t.id === taskId ? { ...t, status } : t))
       );
     }
   };
 
   const deleteTask = async (taskId: string) => {
     const { error } = await supabase.from("tasks").delete().eq("id", taskId);
 
     if (error) {
       toast({
         title: "Error",
         description: "Failed to delete task",
         variant: "destructive",
       });
     } else {
       setTasks((prev) => prev.filter((t) => t.id !== taskId));
       toast({
         title: "Task deleted",
         description: "The task has been removed.",
       });
     }
   };
 
   const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
 
   return (
     <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
           <h1 className="text-2xl font-bold">Task Management</h1>
           <p className="text-muted-foreground">
             Create and manage your AI-powered business tasks
           </p>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogTrigger asChild>
             <Button className="gradient-primary border-0">
               <Plus className="w-4 h-4 mr-2" />
               New Task
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task and assign it to an AI agent.
              </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="title">Title</Label>
                 <Input
                   id="title"
                   placeholder="Enter task title..."
                   value={newTask.title}
                   onChange={(e) =>
                     setNewTask((prev) => ({ ...prev, title: e.target.value }))
                   }
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="description">Description</Label>
                 <Textarea
                   id="description"
                   placeholder="Describe what you need..."
                   value={newTask.description}
                   onChange={(e) =>
                     setNewTask((prev) => ({ ...prev, description: e.target.value }))
                   }
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Assign to Agent</Label>
                   <Select
                     value={newTask.agent_type}
                     onValueChange={(value: AgentType) =>
                       setNewTask((prev) => ({ ...prev, agent_type: value }))
                     }
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {Object.entries(agentConfig).map(([key, config]) => (
                         <SelectItem key={key} value={key}>
                           {config.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label>Priority</Label>
                   <Select
                     value={newTask.priority}
                     onValueChange={(value: Priority) =>
                       setNewTask((prev) => ({ ...prev, priority: value }))
                     }
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="low">Low</SelectItem>
                       <SelectItem value="medium">Medium</SelectItem>
                       <SelectItem value="high">High</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <Button
                 className="w-full gradient-primary border-0"
                 onClick={createTask}
                 disabled={!newTask.title.trim() || isCreating}
               >
                 {isCreating ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Creating...
                   </>
                 ) : (
                   "Create Task"
                 )}
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
 
       {/* Filters */}
       <div className="flex flex-wrap gap-2">
         {["all", "pending", "in_progress", "completed"].map((status) => (
           <Button
             key={status}
             variant={filter === status ? "default" : "outline"}
             size="sm"
             onClick={() => setFilter(status as typeof filter)}
           >
             {status === "all"
               ? "All"
               : status === "in_progress"
               ? "In Progress"
               : status.charAt(0).toUpperCase() + status.slice(1)}
           </Button>
         ))}
       </div>
 
       {/* Tasks List */}
       {isLoading ? (
         <div className="flex items-center justify-center py-12">
           <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
       ) : filteredTasks.length === 0 ? (
         <Card className="border-dashed">
           <CardContent className="flex flex-col items-center justify-center py-12">
             <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
               <Plus className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
             <p className="text-muted-foreground text-center mb-4">
               Create your first task to get started with BizBrain AI
             </p>
             <Button onClick={() => setIsDialogOpen(true)}>Create Task</Button>
           </CardContent>
         </Card>
       ) : (
         <div className="grid gap-4">
           <AnimatePresence>
             {filteredTasks.map((task) => {
               const agent = agentConfig[task.agent_type];
               const status = statusConfig[task.status];
               const priority = priorityConfig[task.priority];
               const StatusIcon = status.icon;
               const AgentIcon = agent.icon;
 
               return (
                 <motion.div
                   key={task.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                 >
                   <Card className="hover:shadow-md transition-shadow">
                     <CardContent className="p-4">
                       <div className="flex items-start gap-4">
                         <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center text-white shrink-0`}>
                           <AgentIcon className="w-5 h-5" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-start justify-between gap-2">
                             <div>
                               <h3 className="font-semibold">{task.title}</h3>
                               {task.description && (
                                 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                   {task.description}
                                 </p>
                               )}
                             </div>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="shrink-0 text-muted-foreground hover:text-destructive"
                               onClick={() => deleteTask(task.id)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </div>
                           <div className="flex flex-wrap items-center gap-2 mt-3">
                             <Badge variant="secondary" className={priority.color}>
                               {priority.label}
                             </Badge>
                             <div className={cn("flex items-center gap-1 text-sm", status.color)}>
                               <StatusIcon className="w-4 h-4" />
                               {status.label}
                             </div>
                             <Select
                               value={task.status}
                               onValueChange={(value: TaskStatus) =>
                                 updateTaskStatus(task.id, value)
                               }
                             >
                               <SelectTrigger className="h-7 w-auto text-xs">
                                 <span>Change status</span>
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="pending">Pending</SelectItem>
                                 <SelectItem value="in_progress">In Progress</SelectItem>
                                 <SelectItem value="completed">Completed</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               );
             })}
           </AnimatePresence>
         </div>
       )}
     </div>
   );
 }