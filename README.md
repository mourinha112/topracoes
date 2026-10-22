# Top Rações

Loja online, painel da loja e sistema de gestão (PDV) num único deploy.

| Endereço | O que é | Login |
|---|---|---|
| `/` | Catálogo público: o cliente monta o pedido e manda pelo WhatsApp | não |
| `/painel` | Painel da loja: pedidos online, vitrine, kits, resumo, configurações | sim |
| `/admin` | Sistema completo: PDV, produtos, estoque, caixa, clientes, despesas, relatórios, marketing | sim |

Acesso do administrador: login `topracoes`, senha `Passaros66` (criado pelo SQL abaixo; troque depois).

---

## Subir do zero (uns 20 minutos)

### 1. Supabase

1. Em [supabase.com](https://supabase.com), **New project**. Guarde a senha do banco.
2. **SQL Editor → New query** → cole o conteúdo inteiro de
   `supabase/001_topracoes_completo.sql` → **Run**.
   Cria todas as tabelas, o balde das fotos, as configurações e o usuário admin.
3. **New query** de novo → cole `supabase/002_dados_thepethouse.sql` → **Run**.
   Traz os 321 produtos, 2.047 vendas, estoque, caixa, clientes e pedidos do sistema antigo.
   O arquivo é grande (uns 900 KB); se o editor reclamar, cole em duas partes.
4. **Project Settings → API**: anote a **Project URL** e a chave **anon public**.

### 2. Vercel

1. **Add New → Project**, escolha o repositório `mourinha112/topracoes`. Vite é detectado sozinho.
2. Em **Environment Variables** cadastre, antes do deploy:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | chave anon |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | chave anon |

3. **Deploy**. Depois aponte o domínio da loja para esse projeto.

### 3. Fotos dos produtos

Cinco produtos tinham foto guardada no Supabase antigo. Para levá-las:

```bash
cp .env.example .env     # preencha com as chaves do passo 1
npm install
node --env-file=.env scripts/migrar-fotos.mjs
```

As outras fotos apontam para links externos e continuam funcionando.

### 4. Primeiro uso

1. Entre em `/admin` com `topracoes` / `Passaros66`.
2. **Configurações → Loja online**: WhatsApp da loja (sem ele o botão de WhatsApp não aparece para o cliente), endereço, frete.
3. **Produtos**: revise preços e marque o que aparece no catálogo (**Loja online** no painel).
4. Mande o link da loja para os clientes.

---

## Rodar no computador

```bash
cp .env.example .env     # chaves do Supabase
npm install
npm run dev              # loja em http://localhost:3000, API em :3001
```

## Estrutura

```
api/            função serverless única (Vercel) + servidor Express para desenvolvimento
src/loja/       catálogo público (/)
src/painel/     painel da loja (/painel)
src/pages/      sistema de gestão (/admin)
supabase/       001 = banco completo, 002 = dados migrados
backup/         JSON e fotos exportados do sistema antigo em 22/10/2026
scripts/        gerador do 002 e migração das fotos
```

## Backup

`backup/thepethouse-2026-10-22/` tem a exportação crua de cada tabela do sistema antigo.
`python scripts/gerar-sql-dados.py` regenera o `002_dados_thepethouse.sql` a partir deles.
