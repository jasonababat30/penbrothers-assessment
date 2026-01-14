"use server";

import supabaseAdminClient from "@/supabase";

const supabase = supabaseAdminClient;

export async function GET() {

    const bing = await supabase
        .from("users")
        .select("*");


    console.log("🐸 env: ", process.env.BONJING)
    console.log("🐨 bing: ", bing);
    return new Response("HELLO WORLD from Sync Dashboard API!!!");
}
