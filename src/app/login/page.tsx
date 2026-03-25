import { signIn } from '@/lib/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F1]">
      <div className="text-center space-y-8">
        <h1 className="font-serif text-4xl italic text-[#1a1a2e]">
          sparrowhawk<span className="text-[#D63230]">.</span>
        </h1>
        <p className="text-[#1a1a2e]/60 font-mono text-sm uppercase tracking-widest">
          Editor
        </p>
        <form
          action={async () => {
            'use server';
            await signIn('github', { redirectTo: '/admin' });
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 bg-[#1a1a2e] text-[#FAF6F1] font-mono text-sm uppercase tracking-wider hover:bg-[#D63230] transition-colors duration-300"
          >
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
