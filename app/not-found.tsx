import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-accent text-sm font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
        404
      </span>
      <h1 className="text-3xl font-bold mt-3 mb-4">페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="inline-flex items-center gap-2 bg-accent text-night px-6 py-3 rounded-full text-sm font-semibold hover:bg-accent-strong transition-colors">
        홈으로 돌아가기
      </Link>
    </section>
  );
}
