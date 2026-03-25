import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPostVersions, createPostVersion } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await params;
  const versions = await getPostVersions(postId);
  return NextResponse.json(versions);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await params;
  const body = await req.json();
  const versionNumber = body.versionNumber || 1;
  const version = await createPostVersion(postId, body.content, body.titleEn, body.titleZh, versionNumber);
  return NextResponse.json(version, { status: 201 });
}
