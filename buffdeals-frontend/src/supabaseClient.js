import { createClient } from '@supabase/supabase-js'


const supabase_url= import.meta.env.VITE_SUPABASE_URL
const supabase_key= import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabase_url, supabase_key)

export default supabase