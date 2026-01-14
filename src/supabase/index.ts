import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabaseAdminClient = createClient(supabaseURL, supabaseServiceRoleKey);

export default supabaseAdminClient;
