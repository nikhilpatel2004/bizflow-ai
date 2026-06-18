# BizBrain AI

BizBrain AI is a React dashboard that helps users plan work, chat with AI agents, and keep business tasks organized in one place.

The app includes authentication, a dashboard, AI chat agents, task management, analytics, and profile settings.

## Features

- Email/password authentication
- Dashboard with quick actions
- AI chat agents for:
  - Marketing
  - Content creation
  - Customer support
  - Analytics
- Task creation and tracking
- Analytics page
- User profile page
- Supabase database integration
- Supabase Edge Function for AI chat

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Supabase
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod

## Project setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

## Environment variables

Create a local `.env` file from your Supabase project settings:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Do not commit private keys, API keys, or passwords to this repository.

## Supabase setup

Run the migration SQL inside your Supabase project SQL editor.

The migration creates:

- `profiles`
- `tasks`
- `chat_messages`
- Row level security policies
- User profile creation trigger
- Timestamp update triggers

## AI chat setup

The chat page calls the Supabase Edge Function named `agent-chat`. This function expects an OpenAI-compatible chat completion API.

Set the required secrets in Supabase:

```bash
supabase functions secrets set OPENAI_API_KEY=your_chat_api_key --project-ref YOUR_PROJECT_REF
supabase functions secrets set OPENAI_BASE_URL=https://api.openai.com/v1 --project-ref YOUR_PROJECT_REF
supabase functions secrets set OPENAI_MODEL=gpt-4o-mini --project-ref YOUR_PROJECT_REF
```

For another OpenAI-compatible provider, keep `OPENAI_API_KEY` and set `OPENAI_BASE_URL` to that provider's chat-completions base URL.

## Datpaq utility APIs

Datpaq APIs are separate from the chat model setup above. Use them for utility endpoints like time conversion, DNS lookup, IP lookup, WHOIS, image processing, and similar services.

Store the key locally in your environment and do not hardcode it in source control:

```env
DATPAQ_API_KEY=your_datpaq_api_key
```

Datpaq requests use the `x-api-key` header. For browser apps, keep the key on the server side and call Datpaq from a Supabase Edge Function or another backend proxy. For local scripts or cURL, the convert-time endpoint can be called like this:

```bash
curl -X GET "https://datpaq.com/api/v1/convert-time?sourceTime=2025-11-11T14:00:00&sourceZone=America/New_York&targetZone=Europe/London" \
  -H "Accept: application/json" \
  -H "x-api-key: $DATPAQ_API_KEY"
```

```ts
const apiKey = Deno.env.get("DATPAQ_API_KEY");
const url = new URL("https://datpaq.com/api/v1/convert-time");
url.searchParams.set("sourceTime", "2025-11-11T14:00:00");
url.searchParams.set("sourceZone", "America/New_York");
url.searchParams.set("targetZone", "Europe/London");

const response = await fetch(url, {
  headers: {
    Accept: "application/json",
    "x-api-key": apiKey ?? "",
  },
});

const data = await response.json();
console.log(data);
```

Datpaq API keys are not a replacement for chat model keys. Keep chat provider secrets in Supabase Edge Function secrets, and use Datpaq keys only for Datpaq utility endpoints.

Deploy the Edge Function:

```bash
supabase functions deploy agent-chat
```

If the AI provider account has no remaining credits or has hit its rate limit, chat requests will return a rate-limit message.

## Main routes

- `/` — Landing page
- `/auth` — Login and signup
- `/dashboard` — Dashboard
- `/dashboard/chat` — AI agent chat
- `/dashboard/tasks` — Task management
- `/dashboard/analytics` — Analytics
- `/dashboard/profile` — User profile

## Notes

- Supabase authentication handles user login and signup.
- Chat messages are saved per user and agent type.
- Tasks are private to each authenticated user.
- The OpenAI API key must stay on the server side in Supabase, not in the frontend.
