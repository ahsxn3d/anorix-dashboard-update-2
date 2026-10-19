export default function Loading() {
  return (
    <div style={{ paddingTop: 72 }}>
      <div className="skeleton" style={{ height: 96, maxWidth: 640, marginBottom: 32 }} />
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '4 / 3.4' }} />)}
      </div>
    </div>
  );
}
