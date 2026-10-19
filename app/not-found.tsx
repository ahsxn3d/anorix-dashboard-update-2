import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="login">
      <span />
      <div className="login-mid">
        <span className="eyebrow">404</span>
        <h1 className="h-display">Nothing <span className="serif">here</span></h1>
        <Link href="/projects" className="btn btn-plain">Back to projects</Link>
      </div>
      <span />
    </main>
  );
}
