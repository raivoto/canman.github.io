import fs from 'fs'; import path from 'path'; import Link from 'next/link';
export default function Page(){
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return <div>Tooteid pole</div>;
  const tops = fs.readdirSync(base).filter(f=>fs.statSync(path.join(base,f)).isDirectory());
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{color:'#0e4da4'}}>Pood</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tops.map(top=>{
          const subs = fs.readdirSync(path.join(base,top)).filter(f=>f.endsWith('.json')).length;
          return (
            <Link key={top} href={`/pood/${top}`} className="border rounded-xl p-6 hover:shadow bg-white">
              <div className="font-semibold text-lg capitalize">{top.replace(/-/g,' ')}</div>
              <div className="text-gray-500 text-sm">{subs} alamkategooriat</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
