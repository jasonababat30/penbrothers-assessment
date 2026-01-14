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

interface User {
    id: string;
    name: string;
    email: string;
    synced_at: Date | null;
}

const SyncDashboardComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);

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
    },[])

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
                                                            toast("👩‍🦳") 
                                                        }}
                                                    >
                                                        Sync Data
                                                    </Button>
                                                ) :
                                                user.synced_at.toLocaleDateString()
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
