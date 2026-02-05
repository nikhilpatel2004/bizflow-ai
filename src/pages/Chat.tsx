 import { useState, useEffect, useRef } from "react";
 import { useSearchParams } from "react-router-dom";
 import { motion, AnimatePresence } from "framer-motion";
 import ReactMarkdown from "react-markdown";
 import {
   Megaphone,
   PenTool,
   HeadphonesIcon,
   TrendingUp,
   Send,
   Loader2,
   Bot,
   User,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import { Card } from "@/components/ui/card";
 import { cn } from "@/lib/utils";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 
 type AgentType = "marketing" | "content" | "support" | "analytics";
 type Message = { role: "user" | "assistant"; content: string };
 
 const agents = [
   {
     id: "marketing" as AgentType,
     name: "Marketing",
     icon: Megaphone,
     color: "bg-agent-marketing",
     borderColor: "border-agent-marketing",
     description: "Campaigns, ads, and brand strategy",
   },
   {
     id: "content" as AgentType,
     name: "Content",
     icon: PenTool,
     color: "bg-agent-content",
     borderColor: "border-agent-content",
     description: "Blogs, social media, and copywriting",
   },
   {
     id: "support" as AgentType,
     name: "Support",
     icon: HeadphonesIcon,
     color: "bg-agent-support",
     borderColor: "border-agent-support",
     description: "Customer service and FAQs",
   },
   {
     id: "analytics" as AgentType,
     name: "Analytics",
     icon: TrendingUp,
     color: "bg-agent-analytics",
     borderColor: "border-agent-analytics",
     description: "Data insights and recommendations",
   },
 ];
 
 export default function Chat() {
   const [searchParams, setSearchParams] = useSearchParams();
   const [selectedAgent, setSelectedAgent] = useState<AgentType>(
     (searchParams.get("agent") as AgentType) || "marketing"
   );
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const { user } = useAuth();
   const { toast } = useToast();
 
   const currentAgent = agents.find((a) => a.id === selectedAgent)!;
 
   useEffect(() => {
     loadMessages();
   }, [selectedAgent, user]);
 
   useEffect(() => {
     scrollToBottom();
   }, [messages]);
 
   const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };
 
   const loadMessages = async () => {
     if (!user) return;
     
     const { data, error } = await supabase
       .from("chat_messages")
       .select("*")
       .eq("user_id", user.id)
       .eq("agent_type", selectedAgent)
       .order("created_at", { ascending: true });
 
     if (error) {
       console.error("Error loading messages:", error);
       return;
     }
 
     setMessages(
       data.map((msg) => ({
         role: msg.role as "user" | "assistant",
         content: msg.content,
       }))
     );
   };
 
   const handleAgentChange = (agentId: AgentType) => {
     setSelectedAgent(agentId);
     setSearchParams({ agent: agentId });
   };
 
   const saveMessage = async (role: "user" | "assistant", content: string) => {
     if (!user) return;
     
     await supabase.from("chat_messages").insert({
       user_id: user.id,
       agent_type: selectedAgent,
       role,
       content,
     });
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!input.trim() || isLoading) return;
 
     const userMessage = input.trim();
     setInput("");
     
     // Add user message
     const userMsg: Message = { role: "user", content: userMessage };
     setMessages((prev) => [...prev, userMsg]);
     await saveMessage("user", userMessage);
 
     setIsLoading(true);
 
     try {
       const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;
       
       const response = await fetch(CHAT_URL, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
         },
         body: JSON.stringify({
           messages: [...messages, userMsg],
           agentType: selectedAgent,
         }),
       });
 
       if (!response.ok) {
         if (response.status === 429) {
           throw new Error("Rate limit exceeded. Please try again later.");
         }
         if (response.status === 402) {
           throw new Error("Usage limit reached. Please add credits.");
         }
         throw new Error("Failed to get response");
       }
 
       // Stream the response
       const reader = response.body?.getReader();
       const decoder = new TextDecoder();
       let assistantContent = "";
       let textBuffer = "";
 
       if (reader) {
         while (true) {
           const { done, value } = await reader.read();
           if (done) break;
 
           textBuffer += decoder.decode(value, { stream: true });
 
           let newlineIndex: number;
           while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
             let line = textBuffer.slice(0, newlineIndex);
             textBuffer = textBuffer.slice(newlineIndex + 1);
 
             if (line.endsWith("\r")) line = line.slice(0, -1);
             if (line.startsWith(":") || line.trim() === "") continue;
             if (!line.startsWith("data: ")) continue;
 
             const jsonStr = line.slice(6).trim();
             if (jsonStr === "[DONE]") break;
 
             try {
               const parsed = JSON.parse(jsonStr);
               const content = parsed.choices?.[0]?.delta?.content as string | undefined;
               if (content) {
                 assistantContent += content;
                 setMessages((prev) => {
                   const last = prev[prev.length - 1];
                   if (last?.role === "assistant") {
                     return prev.map((m, i) =>
                       i === prev.length - 1 ? { ...m, content: assistantContent } : m
                     );
                   }
                   return [...prev, { role: "assistant", content: assistantContent }];
                 });
               }
             } catch {
               textBuffer = line + "\n" + textBuffer;
               break;
             }
           }
         }
       }
 
       if (assistantContent) {
         await saveMessage("assistant", assistantContent);
       }
     } catch (error) {
       toast({
         title: "Error",
         description: error instanceof Error ? error.message : "Failed to send message",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <div className="h-[calc(100vh-120px)] flex flex-col">
       {/* Agent Selector */}
       <div className="mb-4">
         <h1 className="text-2xl font-bold mb-4">Chat with AI Agents</h1>
         <div className="flex flex-wrap gap-2">
           {agents.map((agent) => (
             <button
               key={agent.id}
               onClick={() => handleAgentChange(agent.id)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
                 selectedAgent === agent.id
                   ? `${agent.borderColor} ${agent.color} text-white`
                   : "border-border hover:border-muted-foreground"
               )}
             >
               <agent.icon className="w-4 h-4" />
               <span className="font-medium">{agent.name}</span>
             </button>
           ))}
         </div>
         <p className="text-sm text-muted-foreground mt-2">
           {currentAgent.description}
         </p>
       </div>
 
       {/* Chat Messages */}
       <Card className="flex-1 overflow-hidden flex flex-col">
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {messages.length === 0 ? (
             <div className="h-full flex items-center justify-center text-center">
               <div>
                 <div className={`w-16 h-16 rounded-2xl ${currentAgent.color} flex items-center justify-center text-white mx-auto mb-4`}>
                   <currentAgent.icon className="w-8 h-8" />
                 </div>
                 <h3 className="text-lg font-semibold mb-2">
                   Start chatting with {currentAgent.name} Agent
                 </h3>
                 <p className="text-muted-foreground max-w-md">
                   Ask questions about {currentAgent.description.toLowerCase()}.
                   I'm here to help with your business needs!
                 </p>
               </div>
             </div>
           ) : (
             <AnimatePresence initial={false}>
               {messages.map((message, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.2 }}
                   className={cn(
                     "flex gap-3",
                     message.role === "user" ? "justify-end" : "justify-start"
                   )}
                 >
                   {message.role === "assistant" && (
                     <div className={`w-8 h-8 rounded-lg ${currentAgent.color} flex items-center justify-center text-white shrink-0`}>
                       <Bot className="w-4 h-4" />
                     </div>
                   )}
                   <div
                     className={cn(
                       "max-w-[80%] rounded-2xl px-4 py-3",
                       message.role === "user"
                         ? "bg-primary text-primary-foreground"
                         : "bg-muted"
                     )}
                   >
                     {message.role === "assistant" ? (
                       <div className="prose prose-sm dark:prose-invert max-w-none">
                         <ReactMarkdown>{message.content}</ReactMarkdown>
                       </div>
                     ) : (
                       <p className="whitespace-pre-wrap">{message.content}</p>
                     )}
                   </div>
                   {message.role === "user" && (
                     <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                       <User className="w-4 h-4" />
                     </div>
                   )}
                 </motion.div>
               ))}
             </AnimatePresence>
           )}
           {isLoading && messages[messages.length - 1]?.role === "user" && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex gap-3"
             >
               <div className={`w-8 h-8 rounded-lg ${currentAgent.color} flex items-center justify-center text-white`}>
                 <Bot className="w-4 h-4" />
               </div>
               <div className="bg-muted rounded-2xl px-4 py-3">
                 <Loader2 className="w-4 h-4 animate-spin" />
               </div>
             </motion.div>
           )}
           <div ref={messagesEndRef} />
         </div>
 
         {/* Input */}
         <form onSubmit={handleSubmit} className="p-4 border-t border-border">
           <div className="flex gap-2">
             <Textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={`Ask the ${currentAgent.name} Agent...`}
               className="min-h-[60px] max-h-[120px] resize-none"
               onKeyDown={(e) => {
                 if (e.key === "Enter" && !e.shiftKey) {
                   e.preventDefault();
                   handleSubmit(e);
                 }
               }}
             />
             <Button
               type="submit"
               size="icon"
               className="h-[60px] w-[60px] gradient-primary border-0"
               disabled={!input.trim() || isLoading}
             >
               {isLoading ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                 <Send className="w-5 h-5" />
               )}
             </Button>
           </div>
         </form>
       </Card>
     </div>
   );
 }