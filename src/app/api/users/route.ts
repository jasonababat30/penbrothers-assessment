"use server";

import supabaseAdminClient from "@/supabase";

const supabase = supabaseAdminClient;

export async function GET() {
    try {
         const { data, error, status, count } = await supabase
            .from("users")
            .select(
                `
                    id,
                    name,
                    email,
                    synced_at
                `
            );

        if (error) {
            throw {
                status,
                message: error.message,
                error
            }
        }

        return Response.json(
            {
                data,
                count
            },
            {
                status: 200,
                headers: { "Content-type": "application/json" },
            }
        )

    } catch (error) {
        return Response.json(
            {
                message:
                // @ts-expect-error !! Catch-block Error is of type unknown
                error?.message ||
                "Something went wrong when fetching users",
                error,
            },
            {
                // @ts-expect-error !! Catch-block Error is of type unknown
                status: error?.status || 500,
                headers: { "Content-type": "application/json" },
            }
        );
    }
}
