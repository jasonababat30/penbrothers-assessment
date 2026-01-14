"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/components/ui/table";
import axios from "axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment"

interface User {
    id: string;
    name: string;
    email: string;
    synced_at: Date | null;
}

const SyncDashboardComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);
    const [userIdToBeSynced, setUserIdToBeSynced] = useState<string>("");
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const hasFetched = useRef(false);


    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchUsers = async () => {
            setIsFetchingUsers(true);
            try {
                const { data: fetched_user_response } = await axios.get<ApiResponse<User[]>>("/api/users");
                const { data: fetched_users } = fetched_user_response;

                setUsers(prev => ([...prev, ...fetched_users]));
                setIsFetchingUsers(false)
            } catch (error) {
                console.error("🔖 Fetching Users Error: ", error);
                toast.error("Something went wrong with fetching users")
            }
        }

        fetchUsers();
    },[]);

    const handleSyncUser = async (userId: string) => {
        try {
            setUserIdToBeSynced(userId);
            setIsSyncing(true);
            
            setTimeout(async () => {
                const { data: sync_user_response } = await axios.patch<ApiResponse<User>>(
                    `/api/users/${userId}/sync-user`,
                    {}
                );

                const { data: synced_user } = sync_user_response;

                setIsFetchingUsers(true);
                setUserIdToBeSynced("");
                setIsSyncing(false);
                
                setUsers(prev => {
                    const notYetSyncedUsers = prev.filter(user => user.id !== userId);

                    return [
                        ...notYetSyncedUsers,
                        synced_user
                    ]
                });
                setIsFetchingUsers(false);
            }, 3000)

        } catch (error) {
            setUserIdToBeSynced("");
            setIsSyncing(false);
            console.error("🔖 Syncing User Error: ", error);
            toast.error("Something went wrong with syncing user");
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Sync Dashboard</h2>

            <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="text-left">Name</TableHead>
                        <TableHead className="text-left">Email</TableHead>
                        <TableHead className="text-left">Sync Status</TableHead>
                    </TableRow>
                </TableHeader>

                {isFetchingUsers ? (
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                                <TableCell>
                                    <Skeleton className="w-32 h-6 rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-48 h-6 rounded-md" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="w-24 h-6 rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : users.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 font-medium">
                        No users available.
                    </div>
                ) : (
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="text-gray-600">{user.email}</TableCell>
                                <TableCell>
                                    {!user.synced_at ? (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleSyncUser(user.id)}
                                            disabled={isSyncing}
                                        >
                                            {userIdToBeSynced === user.id && isSyncing
                                                ? "Syncing..."
                                                : "Sync User"}
                                        </Button>
                                    ) : (
                                        <span className="text-gray-500">
                                            {moment(user.synced_at).format("MMM DD, YYYY")}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
        </div>
    );
}

export default SyncDashboardComponent;
