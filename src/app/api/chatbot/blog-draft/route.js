import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const drafts = await readDB('blog-drafts.json');
    return NextResponse.json(drafts);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const { title, content, category, summary, imageDescription } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    let drafts = [];
    try {
      drafts = await readDB('blog-drafts.json');
    } catch {
      drafts = [];
    }

    const newDraft = {
      id: uuidv4(),
      title,
      content,
      category: category || 'General',
      summary: summary || '',
      imageDescription: imageDescription || '',
      status: 'draft',
      generatedBy: 'ai-chatbot',
      createdAt: new Date().toISOString(),
    };

    drafts.unshift(newDraft);
    await writeDB('blog-drafts.json', drafts);

    return NextResponse.json(
      { message: 'Blog draft saved to admin panel for review.', draft: newDraft },
      { status: 201 }
    );
  } catch (err) {
    console.error('Blog draft save error:', err);
    return NextResponse.json({ error: 'Failed to save blog draft.' }, { status: 500 });
  }
}
