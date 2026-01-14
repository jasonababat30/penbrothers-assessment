"use client";

import { Button } from "@/components/ui/button";

const SyncDashboardComponent = () => {
    return (
        <>
            <div>Sync Dashboard Component</div>
            <Button variant={"destructive"} onClick={() => { alert("Bonjing ka from component") }}>Click me</Button>
        </>
    )
}

export default SyncDashboardComponent;
