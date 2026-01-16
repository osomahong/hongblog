"use client";

import { useEffect } from "react";
import { NeoButton, NeoTiltCard } from "@/components/neo";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Unhandled Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
            <NeoTiltCard
                className="max-w-2xl w-full bg-white border-4 border-black p-8 sm:p-12 halftone-corner"
                intensity={10}
            >
                <div className="flex flex-col items-center space-y-6">
                    <div className="bg-red-500 border-4 border-black p-4 rotate-3 punk-burst">
                        <AlertTriangle className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter comic-emphasis">
                            오류가 발생했습니다
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                            페이지를 렌더링하는 중에 예상치 못한 문제가 발생했습니다.
                            잠시 후 다시 시도해 주세요.
                        </p>
                        {error.digest && (
                            <p className="text-xs font-mono text-gray-400">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                        <NeoButton
                            variant="primary"
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> 다시 시도하기
                        </NeoButton>

                        <Link href="/" className="w-full sm:w-auto">
                            <NeoButton
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> 홈으로 이동
                            </NeoButton>
                        </Link>
                    </div>
                </div>
            </NeoTiltCard>
        </div>
    );
}
