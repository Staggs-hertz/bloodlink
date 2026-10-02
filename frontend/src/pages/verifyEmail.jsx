import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { api } from "../utils/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("The verification link is missing a token.");
        return;
      }

      try {
        const response = await api.verifyEmail(token);

        if (cancelled) return;

        setStatus("success");
        setMessage(
          response?.message || "Your email has been verified successfully.",
        );
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(
          error?.message || "This verification link is invalid or has expired.",
        );
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>

              <h1 className="mt-5 text-xl font-semibold text-foreground">
                Verifying your email
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we confirm your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle className="h-7 w-7" />
              </div>

              <h1 className="mt-5 text-xl font-semibold text-foreground">
                Email verified
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">{message}</p>

              <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Continue to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                <XCircle className="h-7 w-7" />
              </div>

              <h1 className="mt-5 text-xl font-semibold text-foreground">
                Verification failed
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">{message}</p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Go to Login
                </Link>

                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Return Home
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          BloodLink — Blood Donation Management System
        </p>
      </div>
    </main>
  );
};

export default VerifyEmail;
