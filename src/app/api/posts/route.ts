import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listPosts, createPost } from '@/lib/db/queries';

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allPosts = await listPosts();
  return NextResponse.json(allPosts);
}

export async function POST() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await createPost();
  return NextResponse.json(post, { status: 201 });
}
