 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { User, Mail, Calendar, Save, Loader2 } from "lucide-react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { useAuth } from "@/hooks/useAuth";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 
 interface Profile {
   id: string;
   user_id: string;
   email: string | null;
   full_name: string | null;
   avatar_url: string | null;
   created_at: string;
 }
 
 export default function Profile() {
   const [profile, setProfile] = useState<Profile | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [fullName, setFullName] = useState("");
   const { user } = useAuth();
   const { toast } = useToast();
 
   useEffect(() => {
     if (user) {
       loadProfile();
     }
   }, [user]);
 
   const loadProfile = async () => {
     if (!user) return;
 
     const { data, error } = await supabase
       .from("profiles")
       .select("*")
       .eq("user_id", user.id)
       .single();
 
     if (error) {
       console.error("Error loading profile:", error);
     } else if (data) {
       setProfile(data);
       setFullName(data.full_name || "");
     }
     setIsLoading(false);
   };
 
   const updateProfile = async () => {
     if (!user) return;
 
     setIsSaving(true);
 
     const { error } = await supabase
       .from("profiles")
       .update({ full_name: fullName })
       .eq("user_id", user.id);
 
     if (error) {
       toast({
         title: "Error",
         description: "Failed to update profile",
         variant: "destructive",
       });
     } else {
       toast({
         title: "Profile updated",
         description: "Your profile has been updated successfully.",
       });
       setProfile((prev) => (prev ? { ...prev, full_name: fullName } : null));
     }
     setIsSaving(false);
   };
 
   if (isLoading) {
     return (
       <div className="flex items-center justify-center py-12">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="space-y-6 max-w-2xl">
       <div>
         <h1 className="text-2xl font-bold">Profile Settings</h1>
         <p className="text-muted-foreground">
           Manage your account information
         </p>
       </div>
 
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
       >
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <User className="w-5 h-5" />
               Account Information
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
               <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                 {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
               </div>
               <div>
                 <p className="font-semibold">{fullName || "No name set"}</p>
                 <p className="text-sm text-muted-foreground">{user?.email}</p>
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name</Label>
               <Input
                 id="fullName"
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 placeholder="Enter your full name"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <div className="flex items-center gap-2">
                 <Mail className="w-4 h-4 text-muted-foreground" />
                 <Input
                   id="email"
                   value={user?.email || ""}
                   disabled
                   className="bg-muted"
                 />
               </div>
               <p className="text-xs text-muted-foreground">
                 Email cannot be changed
               </p>
             </div>
 
             <div className="space-y-2">
               <Label>Member Since</Label>
               <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-muted-foreground" />
                 <p className="text-sm">
                   {profile?.created_at
                     ? new Date(profile.created_at).toLocaleDateString("en-US", {
                         year: "numeric",
                         month: "long",
                         day: "numeric",
                       })
                     : "Unknown"}
                 </p>
               </div>
             </div>
 
             <Button
               onClick={updateProfile}
               disabled={isSaving}
               className="gradient-primary border-0"
             >
               {isSaving ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="w-4 h-4 mr-2" />
                   Save Changes
                 </>
               )}
             </Button>
           </CardContent>
         </Card>
       </motion.div>
 
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.1 }}
       >
         <Card>
           <CardHeader>
             <CardTitle>Subscription</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="p-4 rounded-lg bg-muted/50">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-semibold">Free Plan</p>
                   <p className="text-sm text-muted-foreground">
                     Basic access to all AI agents
                   </p>
                 </div>
                 <Button variant="outline" disabled>
                   Upgrade (Coming Soon)
                 </Button>
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 }