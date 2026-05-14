import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const FREE_MODELS = [
  'google/gemma-4-31b-it:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'meta-llama/llama-4-maverick:free',
  'inclusionai/ring-2.6-1t:free',
  'minimax/minimax-m2.5:free',
];

async function getEventContext() {
  try {
    const events = await readDB('events.json');
    if (!events || events.length === 0) return 'No upcoming events scheduled.';
    return events.map(e => `- ${e.title} | Date: ${e.date} | Location: ${e.location || 'TBD'}`).join('\n');
  } catch { return 'Unable to fetch events.'; }
}

async function getBlogContext() {
  try {
    const drafts = await readDB('blog-drafts.json');
    return drafts && drafts.length > 0 ? `There are ${drafts.length} blog drafts.` : 'No blog drafts.';
  } catch { return 'No blog drafts.'; }
}

function buildSystemPrompt(eventsContext, blogContext) {
  return `You are "Khaana Bot" for Khaana Bank Trust NGO. 
Mission: Feeding hungry, educating children, nurturing nature.
Boundary: Only NGO related topics.
Events: ${eventsContext}
Blogs: ${blogContext}`;
}

async function callOpenRouter(apiKey, model, messages) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 }),
  });
  if (!response.ok) return { ok: false };
  const data = await response.json();
  return { ok: true, content: data.choices?.[0]?.message?.content, model };
}

function parseActionFromResponse(rawContent) {
  let chatMessage = rawContent;
  let action = null;
  const actionMatch = rawContent.match(/---ACTION_JSON---\s*([\s\S]*?)\s*---END_ACTION---/);
  if (actionMatch) {
    chatMessage = rawContent.replace(/---ACTION_JSON---[\s\S]*?---END_ACTION---/, '').trim();
    try { action = JSON.parse(actionMatch[1].trim()); } catch {}
  }
  return { chatMessage, action };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  const openrouterKey = process.env.OPENROUTER_API_KEY || '';
  try {
    const { message, history = [] } = await request.json();
    const eventsContext = await getEventContext();
    const blogContext = await getBlogContext();
    const systemPrompt = buildSystemPrompt(eventsContext, blogContext);

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-5).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: message }
    ];

    if (openrouterKey) {
      for (const model of FREE_MODELS) {
        const result = await callOpenRouter(openrouterKey, model, chatMessages);
        if (result.ok) {
          const { chatMessage, action } = parseActionFromResponse(result.content);
          return NextResponse.json({ success: true, message: chatMessage, action }, { headers: CORS_HEADERS });
        }
      }
    }

    return NextResponse.json({ success: false, error: 'AI Offline' }, { status: 502, headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500, headers: CORS_HEADERS });
  }
}
