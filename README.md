# JENZY ChatGPT proxy

This branch adds a minimal server-side proxy and a small frontend helper to connect the JENZY project with the OpenAI Chat API without modifying index.html.

Files added (on branch feature/add-chatgpt-proxy):
- server/index.js (Express proxy at /api/chat)
- server/package.json
- server/.env.example
- frontend/useChat.js (frontend helper to call /api/chat)

Important: I did NOT modify index.html as requested.

Quick setup
1. In the project root, install server dependencies and run locally:
   cd server
   npm install
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY and ALLOWED_ORIGIN
   npm start

2. Add environment variables in production (Vercel/Netlify/Render/etc):
   OPENAI_API_KEY (required)
   OPTIONAL: PROJECT_SECRET (recommended)
   OPTIONAL: ALLOWED_ORIGIN or set ALLOW_ALL_ORIGINS=true (not recommended)

3. From the frontend, call the helper function or POST to /api/chat. If PROJECT_SECRET is set, include the header x-project-secret.

Security notes
- Never commit OPENAI_API_KEY into the repo.
- Do not enable ALLOW_ALL_ORIGINS in production.
- Use PROJECT_SECRET and HTTPS to avoid abuse.

If you want, I can open a PR on the repository and create this branch in the repo. If you want me to proceed to open the PR now, reply CONFIRM and I will create the pull request (I will not modify index.html).