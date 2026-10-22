"""
Gera supabase/002_dados_thepethouse.sql a partir dos JSON em backup/.

Uso:  python scripts/gerar-sql-dados.py

Mantém os IDs originais (as vendas apontam para os produtos pelo id) e
ajusta as sequências no final, para que cadastros novos continuem a
numeração sem colidir.
"""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP = os.path.join(RAIZ, 'backup', 'thepethouse-2026-10-22')
SAIDA = os.path.join(RAIZ, 'supabase', '002_dados_thepethouse.sql')
BUCKET_ANTIGO = 'https://jkbugbsnmygvrejjurvi.supabase.co/storage/v1/object/public/produtos/'

# ordem respeita as chaves estrangeiras
TABELAS = [
    ('products', ['id', 'nome', 'marca', 'tipo', 'categoria', 'peso_saco_kg', 'custo_saco', 'custo_por_kg',
                  'margem_percentual', 'margem_saco', 'preco_por_kg', 'preco_saco_fechado', 'estoque_kg',
                  'estoque_minimo_dias', 'custo_unitario', 'preco_unitario', 'estoque_unidade',
                  'estoque_minimo_unidade', 'especie', 'porte', 'perfil', 'foto_url', 'visivel_loja',
                  'vende_fracionado', 'promo_qtd', 'promo_preco', 'ativo', 'created_at', 'updated_at']),
    ('clients', ['id', 'nome', 'whatsapp', 'tipo_pet', 'racao_utilizada', 'ultima_compra', 'created_at']),
    ('sales', ['id', 'client_id', 'total', 'desconto', 'forma_pagamento', 'created_at']),
    ('sale_items', ['id', 'sale_id', 'product_id', 'tipo_venda', 'quantidade_kg', 'preco_unitario', 'subtotal']),
    ('stock_movements', ['id', 'product_id', 'tipo', 'quantidade_kg', 'motivo', 'sale_id', 'created_at']),
    ('fixed_costs', ['id', 'descricao', 'valor', 'created_at']),
    ('expenses', ['id', 'descricao', 'categoria', 'valor', 'data_vencimento', 'pago', 'data_pagamento',
                  'recorrente', 'data_inicio', 'data_fim', 'tipo_recorrencia', 'created_at']),
    ('cash_sessions', ['id', 'saldo_inicial', 'saldo_final', 'status', 'observacao_fechamento', 'opened_at', 'closed_at']),
    ('cash_movements', ['id', 'session_id', 'tipo', 'valor', 'descricao', 'sale_id', 'created_at']),
    ('orders', ['id', 'client_id', 'cliente_nome', 'cliente_whatsapp', 'tipo_entrega', 'endereco', 'referencia',
                'janela', 'observacao', 'subtotal', 'frete', 'total', 'status', 'assinatura', 'frequencia',
                'sale_id', 'created_at', 'updated_at']),
    ('order_items', ['id', 'order_id', 'product_id', 'descricao', 'tipo_venda', 'quantidade_kg', 'preco_unitario', 'subtotal']),
    ('kits', ['id', 'nome', 'descricao', 'preco', 'foto_url', 'ativo', 'visivel_loja', 'created_at', 'updated_at']),
    ('kit_itens', ['id', 'kit_id', 'product_id', 'tipo_venda', 'quantidade']),
]

# configurações que valem a pena levar; as de loja (whatsapp, endereço,
# frete) começam zeradas porque são da loja antiga
SETTINGS_LEVAR = {'taxa_maquininha', 'meta_diaria'}


def lit(v):
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return repr(v)
    return "'" + str(v).replace("'", "''") + "'"


def carregar(nome):
    with open(os.path.join(BACKUP, nome + '.json'), encoding='utf-8') as f:
        return json.load(f)


def main():
    linhas = [
        '-- =====================================================================',
        '-- TOP RAÇÕES - dados trazidos do sistema antigo (The Pet House)',
        '-- Backup feito em 22/10/2026. Gerado por scripts/gerar-sql-dados.py.',
        '--',
        '-- Rode DEPOIS do 001_topracoes_completo.sql, no mesmo SQL Editor.',
        '-- Pode rodar de novo: linhas que já existem (mesmo id) são ignoradas.',
        '--',
        '-- As fotos que estavam no balde do Supabase antigo ficam com foto_url',
        '-- vazia aqui; o scripts/migrar-fotos.mjs sobe os arquivos de',
        '-- backup/.../fotos e preenche o endereço novo.',
        '-- =====================================================================',
        '',
        'begin;',
        '',
    ]
    resumo = []
    for tabela, cols in TABELAS:
        rows = carregar(tabela)
        if not rows:
            continue
        resumo.append((tabela, len(rows)))
        linhas.append(f'-- {tabela}: {len(rows)} linhas')
        LOTE = 200
        for i in range(0, len(rows), LOTE):
            lote = rows[i:i + LOTE]
            linhas.append(f'insert into public.{tabela} ({", ".join(cols)}) values')
            vals = []
            for r in lote:
                r = dict(r)
                if tabela == 'products' and r.get('foto_url', '') and str(r['foto_url']).startswith(BUCKET_ANTIGO):
                    r['foto_url'] = None
                vals.append('  (' + ', '.join(lit(r.get(c)) for c in cols) + ')')
            linhas.append(',\n'.join(vals))
            linhas.append('on conflict (id) do nothing;')
            linhas.append('')
        linhas.append(
            f"select setval(pg_get_serial_sequence('public.{tabela}', 'id'), "
            f"coalesce((select max(id) from public.{tabela}), 0) + 1, false);")
        linhas.append('')

    settings = [s for s in carregar('settings') if s['key'] in SETTINGS_LEVAR]
    if settings:
        linhas.append('-- settings (só o que não é da loja antiga)')
        linhas.append('insert into public.settings (key, value) values')
        linhas.append(',\n'.join(f"  ({lit(s['key'])}, {lit(s['value'])})" for s in settings))
        linhas.append('on conflict (key) do update set value = excluded.value;')
        linhas.append('')

    linhas.append('commit;')
    linhas.append('')
    linhas.append('-- Conferência')
    linhas.append('select ' + ',\n       '.join(
        f"(select count(*) from public.{t}) as {t}" for t, _ in resumo) + ';')
    linhas.append('')

    with open(SAIDA, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(linhas))

    for t, n in resumo:
        print(f'{t:18} {n}')
    print('->', SAIDA, f'({os.path.getsize(SAIDA) // 1024} KB)')


if __name__ == '__main__':
    sys.exit(main())
