"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
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
        <div>
            <div>User Dashboard</div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Sync Status</TableHead>
                    </TableRow>
                </TableHeader>

                {
                    isFetchingUsers
                    ? (
                        <TableBody>
                            {
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="w-30 h-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-60 h-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="w-25 h-8"/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    )
                    : (
                        <TableBody>
                            {
                                users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {
                                                !user.synced_at ?
                                                (
                                                    <Button 
                                                        onClick={() => {
                                                            handleSyncUser(user.id)
                                                        }}
                                                        disabled={isSyncing}
                                                    >
                                                        {
                                                            userIdToBeSynced === user.id && isSyncing
                                                            ? "Syncing User..."
                                                            : "Sync User"
                                                        }
                                                    </Button>
                                                ) :
                                                moment(user.synced_at).format("MMM DD, YYYY")
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    )
                }
            </Table>
        </div>
    )
}

export default SyncDashboardComponent;
