/*
 * Sobe as fotos de produto do backup para o balde "produtos" do Supabase
 * novo e grava o endereço novo em products.foto_url.
 *
 * Uso (depois de criar o .env com as chaves do Supabase novo):
 *   node --env-file=.env scripts/migrar-fotos.mjs
 *
 * Pode rodar de novo: o upload usa upsert e o update é idempotente.
 */
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pasta = path.join(raiz, 'backup', 'thepethouse-2026-10-22', 'fotos');

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Faltam SUPABASE_URL e SUPABASE_ANON_KEY no .env');
  process.exit(1);
}
const supabase = createClient(url, key);

const arquivos = (await readdir(pasta)).filter((f) => /^produto-\d+\.(png|jpe?g|webp)$/i.test(f));
if (!arquivos.length) {
  console.log('Nenhuma foto em', pasta);
  process.exit(0);
}

for (const nome of arquivos) {
  const id = Number(nome.match(/\d+/)[0]);
  const ext = path.extname(nome).slice(1).toLowerCase();
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const corpo = await readFile(path.join(pasta, nome));

  const { error: errUp } = await supabase.storage.from('produtos').upload(nome, corpo, { contentType, upsert: true });
  if (errUp) { console.error(`x ${nome}: ${errUp.message}`); continue; }

  const publica = supabase.storage.from('produtos').getPublicUrl(nome).data.publicUrl + `?v=${Date.now()}`;
  const { error: errDb } = await supabase.from('products').update({ foto_url: publica }).eq('id', id);
  if (errDb) { console.error(`x produto ${id}: ${errDb.message}`); continue; }

  console.log(`ok produto ${id} -> ${nome}`);
}
