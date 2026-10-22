import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(200).json([]);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: products } = await supabase.from('products').select('id, nome, marca, estoque_kg, estoque_minimo_dias, categoria, estoque_unidade, estoque_minimo_unidade').eq('ativo', 1);
    const prods = products || [];
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: salesList } = await supabase.from('sales').select('id').gte('created_at', since);
    const saleIds = (salesList || []).map(s => s.id);
    const byProduct = {};
    if (saleIds.length > 0) {
      const { data: items } = await supabase.from('sale_items').select('product_id, quantidade_kg').in('sale_id', saleIds);
      (items || []).forEach(it => {
        const id = it.product_id;
        byProduct[id] = (byProduct[id] || 0) + (Number(it.quantidade_kg) || 0);
      });
    }
    const isRacao = (p) => !p.categoria || p.categoria === 'racao';
    const alerts = prods.filter(p => {
      if (isRacao(p)) {
        const vendido = byProduct[p.id] || 0;
        const media = vendido / 30;
        const dias = media > 0 ? (Number(p.estoque_kg) || 0) / media : 999;
        return (Number(p.estoque_kg) || 0) > 0 && dias < (Number(p.estoque_minimo_dias) || 7);
      }
      return (Number(p.estoque_unidade) || 0) > 0 && (Number(p.estoque_unidade) || 0) < (Number(p.estoque_minimo_unidade) || 1);
    }).map(p => isRacao(p)
      ? { id: p.id, nome: p.nome, marca: p.marca || '', estoque_kg: p.estoque_kg, estoque_minimo_dias: p.estoque_minimo_dias ?? 7 }
      : { id: p.id, nome: p.nome, marca: p.marca || '', estoque_unidade: p.estoque_unidade ?? 0, estoque_minimo_unidade: p.estoque_minimo_unidade ?? 0 });
    return res.status(200).json(alerts);
  } catch (err) {
    console.error('Alerts error:', err);
    return res.status(200).json([]);
  }
}
