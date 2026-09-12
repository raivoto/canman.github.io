import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function generateStaticParams() {
  const base = path.join(process.cwd(), 'src/data/products');
  if (!fs.existsSync(base)) return [];
  const dirs = fs.readdirSync(base).filter(f => {
    try { return fs.statSync(path.join(base, f)).isDirectory(); } catch { return false; }
  });
  return dirs.map(top => ({ top }));
}

export default function TopPage({ params }: { params: { top: string } }) {
  const dir = path.join(process.cwd(), 'src/data/products', params.top);
  const files = fs.existsSync(dir)? fs.readdirSync(dir).filter(f => f.endsWith('.json')) : [];
  const subs = files.map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const json = JSON.parse(raw);
    return { slug: f.replace('.json',''), name: json[0]?.subCategory || f.replace('.json',''), count: json.length };
  });
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{color:'#0e4da4'}}>{params.top}</h1>
      <div className="grid grid-cols-3 gap-4">
        {subs.map(s => (
          <Link key={s.slug} href={`/pood/${params.top}/${s.slug}`} className="border p-6 rounded-xl bg-white hover:shadow">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-500">{s.count} toodet</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
