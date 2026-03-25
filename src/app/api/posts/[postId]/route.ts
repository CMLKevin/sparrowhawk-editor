import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPost, updatePost, deletePost } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await params;
  const post = await getPost(postId);
  if (!post)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await params;
  const body = await req.json();
  const updated = await updatePost(postId, body);
  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await params;
  await deletePost(postId);
  return NextResponse.json({ ok: true });
}
