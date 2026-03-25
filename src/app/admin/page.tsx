import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { listPosts } from '@/lib/db/queries';
import { timeAgo } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  try {
    posts = await listPosts();
  } catch {
    // DB not connected yet — show empty state
  }

  const drafts = posts.filter(p => p.status === 'draft');

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#1a1a2e]/10 px-8 py-4 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-playfair)] text-xl italic">
          sparrowhawk<span className="text-[#D63230]">.</span>
          <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest ml-3 not-italic text-[#1a1a2e]/40">editor</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-jetbrains)] text-xs text-[#1a1a2e]/50">{session.user?.name}</span>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
            <button className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/30 hover:text-[#D63230] transition-colors">Sign out</button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl">Essays</h2>
            <p className="font-[family-name:var(--font-newsreader)] text-[#1a1a2e]/50 mt-1 italic">
              {posts.length} essay{posts.length !== 1 ? 's' : ''} &middot; {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin/editor/new" className="px-5 py-2.5 bg-[#1a1a2e] text-[#FAF6F1] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider hover:bg-[#D63230] transition-colors duration-300">
            New Essay
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-[family-name:var(--font-newsreader)] text-lg text-[#1a1a2e]/40 italic">No essays yet. Start writing.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/admin/editor/${post.id}`} className="flex items-center gap-6 py-4 border-b border-[#1a1a2e]/[0.06] hover:bg-[#D63230]/[0.02] transition-colors group px-2 -mx-2">
                <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a1a2e]/[0.06] w-12 text-right flex-shrink-0 group-hover:text-[#D63230]/20 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${post.status === 'published' ? 'bg-[#2a9d8f]/10 text-[#2a9d8f]' : 'bg-[#1a1a2e]/5 text-[#1a1a2e]/40'}`}>
                      {post.status}
                    </span>
                    {post.category && <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30">{post.category}</span>}
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1a1a2e] truncate group-hover:text-[#D63230] transition-colors">{post.titleEn}</h3>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/30 block">{timeAgo(post.updatedAt)}</span>
                  {post.wordCountEn ? <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#1a1a2e]/20 block">{post.wordCountEn?.toLocaleString()} words</span> : null}
                </div>
                <span className="text-[#1a1a2e]/10 group-hover:text-[#D63230]/40 transition-colors flex-shrink-0">&rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
