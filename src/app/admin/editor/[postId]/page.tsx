import { EditorWrapper } from '@/components/editor/EditorWrapper';

export default async function EditorPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;

  return <EditorWrapper postId={postId} />;
}
