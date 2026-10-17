import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yommeqomnbzlnszbfghm.supabase.co'
const supabaseAnonKey = 'sb_publishable_no3M4ZhcpnxkywA-UwJBRw_9JbbYsYj'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

