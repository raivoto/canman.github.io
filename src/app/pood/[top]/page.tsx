import fs from 'fs'; import path from 'path'; import Link from 'next/link';
export default function Page({ params }: { params: { top: string } }) {
  const dir = path.join(process.cwd(), `src/data/products/${params.top}`);
  if (!fs.existsSync(dir)) return <div>404</div>;
  const subs = fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>{
    const data = JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
    return { slug: f.replace('.json',''), name: data[0]?.subCategory || f.replace('.json',''), count: data.length };
  });
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize" style={{color:'#0e4da4'}}>{params.top.replace(/-/g,' ')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subs.map(s=>(
          <Link key={s.slug} href={`/pood/${params.top}/${s.slug}`} className="border rounded-xl p-6 hover:shadow bg-white">
            <div className="font-semibold text-lg">{s.name}</div>
            <div className="text-gray-500 text-sm">{s.count} toodet</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
