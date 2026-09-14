<<<<<<< HEAD
import fs from 'fs'; 
import path from 'path'; 
import Link from 'next/link';

function getAllProducts() {
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return [];
  let all: any[] = [];
  const tops = fs.readdirSync(base).filter(f=>{
    try { return fs.statSync(path.join(base,f)).isDirectory(); } catch { return false; }
  });
  for (const top of tops) {
    const topDir = path.join(base, top);
    const jsons = fs.readdirSync(topDir).filter(f=>f.endsWith('.json'));
    for (const jf of jsons) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(topDir, jf), 'utf8'));
        if (Array.isArray(data)) all.push(...data);
      } catch {}
    }
  }
  return all;
}

export default function Page(){
  const base = path.join(process.cwd(),'src/data/products');
  if(!fs.existsSync(base)) return <div>Tooteid pole</div>;
  const tops = fs.readdirSync(base).filter(f=>{
    try { return fs.statSync(path.join(base,f)).isDirectory(); } catch { return false; }
  });

  // loe kokku iga L1 kohta mitu L2 ja mitu toodet (uus süsteem)
  const stats = tops.map(top=>{
    const topDir = path.join(base, top);
    let count = 0;
    let subSet = new Set<string>();
    let realName = top;
    try {
      const jsons = fs.readdirSync(topDir).filter(f=>f.endsWith('.json'));
      for (const jf of jsons) {
        const data = JSON.parse(fs.readFileSync(path.join(topDir, jf), 'utf8'));
        count += data.length;
        data.forEach((p:any)=>{
          if (p.categoryL1) realName = p.categoryL1;
          if (p.categoryL2) subSet.add(p.categoryL2);
          // fallback vana süsteem: failinimi = sub
          if (!p.categoryL2) subSet.add(jf.replace('.json',''));
        });
      }
    } catch {}
    return { slug: top, name: realName, productCount: count, subCount: subSet.size || fs.readdirSync(topDir).filter(f=>f.endsWith('.json')).length };
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" style={{color:'#0e4da4'}}>Pood</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(top=>{
          return (
            <Link key={top.slug} href={`/pood/${top.slug}`} className="border rounded-xl p-6 hover:shadow bg-white">
              <div className="font-semibold text-lg">{top.name}</div>
              <div className="text-gray-500 text-sm">{top.subCount} alamkategooriat • {top.productCount} toodet</div>
            </Link>
          );
        })}
=======
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const base = path.join(process.cwd(), 'src/data/products');
  if (!fs.existsSync(base)) return [];
  const params: any[] = [];
  for (const top of fs.readdirSync(base)) {
    const topPath = path.join(base, top);
    if (!fs.statSync(topPath).isDirectory()) continue;
    for (const file of fs.readdirSync(topPath)) {
      if (!file.endsWith('.json')) continue;
      params.push({ top, sub: file.replace('.json','') });
    }
  }
  return params;
}

function getProducts(top: string, sub: string) {
  const p = path.join(process.cwd(), `src/data/products/${top}/${sub}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export default function Page({ params }: { params: { top: string; sub: string } }) {
  const products = getProducts(params.top, params.sub);
  if (!products) return notFound();

  const title = products[0]?.subCategory || params.sub.replace(/-/g,' ');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/pood" className="hover:underline">Pood</Link> /
        <Link href={`/pood/${params.top}`} className="hover:underline ml-1">{params.top}</Link> /
        <span className="ml-1 font-medium">{title}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2 capitalize" style={{color:'#0e4da4'}}>
        {title} ({products.length})
      </h1>
      <p className="text-gray-600 mb-6">{params.top} / {params.sub}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod: any) => (
          <div key={prod.sku} className="border rounded-xl p-4 hover:shadow-lg transition bg-white">
            <div className="aspect-[4/3] bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
              {prod.images?.[0]? (
               <img src={`/canman.github.io${prod.images[0]}`} alt={prod.title} className="object-contain w-full h-full" />
              ) : (
                <span className="text-gray-400">Pilt puudub</span>
              )}
            </div>
            <div className="text-xs text-gray-500">{prod.sku} {prod.brand && `• ${prod.brand}`}</div>
            <h3 className="font-semibold mt-1 line-clamp-2">{prod.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{prod.shortDescription || prod.description?.slice(0,100)}</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                {prod.salePrice? (
                  <>
                    <span className="text-red-600 font-bold text-lg">{prod.salePrice}€</span>
                    <span className="text-gray-400 line-through ml-2 text-sm">{prod.price}€</span>
                  </>
                ) : (
                  <span className="font-bold text-lg">{prod.finalPrice || prod.price}€</span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${prod.stock>0? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {prod.stock>0? `Laos: ${prod.stock}` : 'Otsas'}
              </span>
            </div>
          </div>
        ))}
>>>>>>> 078128bb208fbfa3cd5cadb8db3e03996d889e21
      </div>
    </div>
  );
}
