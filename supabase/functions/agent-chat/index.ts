 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
};
 
 const agentPrompts: Record<string, string> = {
   marketing: `You are the Marketing Agent for BizBrain AI, a specialized AI assistant focused on marketing and business growth strategies.
 
 Your expertise includes:
 - Creating marketing campaigns and strategies
 - Writing advertisement copy that converts
 - Developing promotion and offer ideas
 - Building brand messaging and positioning
 - Social media marketing strategies
 - Email marketing campaigns
 - SEO and content marketing advice
 
 Guidelines:
 - Be professional yet approachable
 - Provide actionable, specific advice
 - Use bullet points and structured formatting for clarity
 - When suggesting copy, provide complete examples
 - Consider the user's business context when giving advice
 - Always explain the reasoning behind your recommendations`,
 
   content: `You are the Content Agent for BizBrain AI, a specialized AI assistant focused on content creation and copywriting.
 
 Your expertise includes:
 - Writing blog posts and articles
 - Creating social media content
 - Writing product descriptions
 - Drafting email marketing copy
 - Creating landing page copy
 - Writing headlines and taglines
 - Content strategy and planning
 
 Guidelines:
 - Write in a clear, engaging style
 - Adapt tone based on the target audience
 - Provide complete, usable content examples
 - Use formatting like headers, bullet points, and sections
 - Include SEO considerations when relevant
 - Offer multiple variations when appropriate`,
 
   support: `You are the Customer Support Agent for BizBrain AI, a specialized AI assistant focused on customer service excellence.
 
 Your expertise includes:
 - Generating professional customer reply templates
 - Creating comprehensive FAQ responses
 - Drafting support emails
 - Handling complaint resolution templates
 - Creating onboarding communication
 - Developing customer satisfaction strategies
 - Building support documentation
 
 Guidelines:
 - Maintain a helpful, empathetic tone
 - Provide clear, step-by-step solutions
 - Create templates that can be customized
 - Consider various customer scenarios
 - Focus on resolution and satisfaction
 - Include follow-up suggestions when appropriate`,
 
   analytics: `You are the Analytics Agent for BizBrain AI, a specialized AI assistant focused on business data analysis and strategic insights.
 
 Your expertise includes:
 - Analyzing business performance data
 - Providing growth strategy recommendations
 - Identifying trends and patterns
 - Creating actionable insights
 - Benchmarking and goal setting
 - KPI tracking recommendations
 - Data-driven decision making
 
 Guidelines:
 - Be data-focused and objective
 - Provide specific, measurable recommendations
 - Use clear examples and scenarios
 - Explain metrics and their importance
 - Suggest practical next steps
 - Consider industry context when analyzing`,
 };
 
 serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
 
   try {
     const { messages, agentType } = await req.json();
     
     const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
     if (!OPENAI_API_KEY) {
       throw new Error("OPENAI_API_KEY is not configured");
     }
 
     const systemPrompt = agentPrompts[agentType] || agentPrompts.marketing;
 
     console.log(`Agent chat request - Agent: ${agentType}, Messages: ${messages.length}`);
 
     const response = await fetch("https://api.openai.com/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${OPENAI_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "gpt-3.5-turbo",
         messages: [
           { role: "system", content: systemPrompt },
           ...messages,
         ],
         stream: true,
       }),
     });
 
     if (!response.ok) {
       if (response.status === 401) {
         return new Response(
           JSON.stringify({ error: "Authentication error. Please check your OpenAI API key." }),
           { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       if (response.status === 429) {
         return new Response(
           JSON.stringify({ error: "Rate limits exceeded or insufficient credits. Please check your OpenAI account and try again later." }),
           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       if (response.status === 402) {
         return new Response(
           JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
           { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       const text = await response.text();
       console.error("AI gateway error:", response.status, text);
       return new Response(
         JSON.stringify({ error: "AI gateway error" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(response.body, {
       headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
     });
   } catch (error) {
     console.error("Agent chat error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });