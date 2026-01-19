"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@/lib/gtm";

type Props = {
    eventName: string;
};

export function ListViewTracker({ eventName }: Props) {
    const firedRef = useRef<boolean>(false);

    useEffect(() => {
        if (firedRef.current) return;

        sendGAEvent(eventName, {});
        firedRef.current = true;
    }, [eventName]);

    return null;
}
