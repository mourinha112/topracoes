// Cliente Supabase do navegador.
// As chaves vem das variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// (arquivo .env no computador, Environment Variables na Vercel).
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Veja o README.')
}

export const supabase = createClient(supabaseUrl || 'https://invalido.supabase.co', supabaseKey || 'sem-chave')

export const tables = {
  users: 'users',
  products: 'products',
  clients: 'clients',
  sales: 'sales',
  sale_items: 'sale_items',
  stock_movements: 'stock_movements',
  fixed_costs: 'fixed_costs',
  expenses: 'expenses',
  cash_sessions: 'cash_sessions',
  cash_movements: 'cash_movements',
  settings: 'settings'
}
