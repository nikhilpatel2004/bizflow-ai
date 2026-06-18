declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

export {};

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { messages, agentType } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured in Supabase Edge Function secrets.");
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages must be a non-empty array." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = agentPrompts[agentType] || agentPrompts.marketing;
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    const baseUrl = (Deno.env.get("OPENAI_BASE_URL") || "https://api.openai.com/v1").replace(/\/$/, "");
    const completionsUrl = `${baseUrl}/chat/completions`;

    console.log(`Agent chat request - Agent: ${agentType}, Messages: ${messages.length}`);

    const openAIResponse = await fetch(completionsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!openAIResponse.ok) {
      const retryAfter = openAIResponse.headers.get("retry-after");
      const headers: Record<string, string> = {
        ...corsHeaders,
        "Content-Type": "application/json",
      };
      if (retryAfter) headers["Retry-After"] = retryAfter;

      let message = "AI provider error";
      if (openAIResponse.status === 429) {
        message = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (openAIResponse.status === 402) {
        message = "Usage limit reached. Please add credits.";
      } else if (openAIResponse.status === 401) {
        message = "Authentication error. Please check your OpenAI API key.";
      }

      const text = await openAIResponse.text();
      console.error("AI provider error:", openAIResponse.status, text);

      const status =
        openAIResponse.status === 429 ||
        openAIResponse.status === 402 ||
        openAIResponse.status === 401
          ? openAIResponse.status
          : 500;

      return new Response(
        JSON.stringify({ error: message }),
        {
          status,
          headers,
        }
      );
    }

    const headers: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
    };
    const openAIRetryAfter = openAIResponse.headers.get("retry-after");
    if (openAIRetryAfter) headers["Retry-After"] = openAIRetryAfter;

    return new Response(openAIResponse.body, {
      headers,
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
