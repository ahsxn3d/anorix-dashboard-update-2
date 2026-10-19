/** Re-mounts on every route change, so each page plays the enter reveal (CSS only, transform/opacity). */
export default function StudioTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
