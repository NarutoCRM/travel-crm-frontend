import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Acceptance = () => {
    const { token } = useParams();

    const [status, setStatus] = useState("processing");
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const authorize = async () => {
            try {
                if (!token) {
                    throw new Error("Invalid authorization link.");
                }

                const response = await fetch(
                    `${API_URL}/emails/acceptance/${encodeURIComponent(token)}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                            "This authorization link is invalid or has expired."
                    );
                }

                if (!mounted) return;

                setStatus("success");
            } catch (err) {
                if (!mounted) return;

                setError(
                    err?.message ||
                        "This authorization link is invalid or has expired."
                );

                setStatus("error");
            }
        };

        authorize();

        return () => {
            mounted = false;
        };
    }, [token]);

    // Processing
    if (status === "processing") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Processing...
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Please wait while we record your authorization.
                    </p>
                </div>
            </div>
        );
    }

    // Error
    if (status === "error") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl bg-white border border-red-200 shadow-sm p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 text-3xl">
                        !
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        Authorization Failed
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // Thank You
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-white border border-green-200 shadow-sm p-8 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 text-3xl">
                    ✓
                </div>

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Thank You!
                </h1>

                <p className="mt-3 text-base text-slate-600">
                    Your authorization has been successfully received.
                </p>

                <div className="mt-6 rounded-xl bg-green-50 border border-green-100 p-4">
                    <p className="text-sm font-semibold text-green-700">
                        Authorization Confirmed
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                        Your response has been securely recorded.
                    </p>
                </div>

                <p className="mt-6 text-xs text-slate-400">
                    You may now close this window.
                </p>
            </div>
        </div>
    );
};

export default Acceptance;