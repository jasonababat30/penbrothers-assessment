"use server";

import supabaseAdminClient from "@/supabase";

const supabase = supabaseAdminClient;

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            throw {
                message: "ID is required",
                status: 400,
            };
        }

        const { 
            error: fetched_user_error,
            status: fetched_user_status 
        } = await supabase
            .from("users")
            .select(
                `
                    id,
                    email
                `
            )
            .eq('id', id)
            .single();

        if (fetched_user_error) {
            throw {
                message: fetched_user_error.message,
                status: fetched_user_status,
                error: fetched_user_error
            }
        }

        const { 
            data: updated_user_data, 
            error: updated_user_error, 
            status: updated_user_status 
        } = await supabase
            .from("users")
            .update({
                synced_at: new Date()
            })
            .eq('id', id)
            .select(
                `
                    id,
                    name,
                    email,
                    synced_at
                `
            )
            .single();

        if (updated_user_error) {
            throw {
                message: updated_user_error.message,
                status: updated_user_status,
                error: updated_user_error
            }
        }

        return Response.json(
            {
                data: updated_user_data,
                message: "User synced successfully"
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
                "Something went wrong when syncing user",
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
