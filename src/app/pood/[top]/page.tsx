import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const base = path.join(process.cwd(), 'src/data/products');
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base)
    .filter(f => fs.statSync(path.join(base, f)).isDirectory())
    .map(top => ({ top }));
}

export default function Page({ params }: { params: { top: string } }) {
  const dir = path.join(process.cwd(), `src/data/products/${params.top}`);
  if (!fs.existsSync(dir)) return notFound();

  const subs = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        return { slug: f.replace('.json',''), name: data[0]?.subCategory || f.replace('.json','').replace(/-/g,' '), count: data.length };
      } catch {
        return { slug: f.replace('.json',''), name: f.replace('.json',''), count: 0 };
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/pood" className="hover:underline">Pood</Link> / <span className="ml-1 font-medium">{params.top}</span>
      </div>
      <h1 className="text-3xl font-bold mb-6 capitalize" style={{color:'#0e4da4'}}>{params.top.replace(/-/g,' ')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subs.map(s=>(
          <Link key={s.slug} href={`/pood/${params.top}/${s.slug}`} className="border rounded-xl p-6 hover:shadow bg-white transition">
            <div className="font-semibold text-lg capitalize">{s.name}</div>
            <div className="text-gray-500 text-sm">{s.count} toodet</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
