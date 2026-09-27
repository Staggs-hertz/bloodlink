import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const formatBloodType = (bloodType) => {
  const bloodTypeMap = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };

  return bloodTypeMap[bloodType] || bloodType || "—";
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "—";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const statusStyles = {
  COMPLETED: "bg-green-500/10 text-green-400",
  VERIFIED: "bg-green-500/10 text-green-400",
  PENDING: "bg-yellow-500/10 text-yellow-400",
  CANCELLED: "bg-red-500/10 text-red-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getMyDonations();

        setDonations(
          response.data?.items ||
            response.data?.donations ||
            response.data ||
            [],
        );
      } catch (err) {
        setError(err.message || "Failed to load your donation history.");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const totalDonations = donations.length;

  const completedDonations = donations.filter(
    (donation) =>
      donation.status === "COMPLETED" || donation.status === "VERIFIED",
  ).length;

  const totalUnits = donations.reduce((total, donation) => {
    return (
      total +
      Number(donation.unitsDonated ?? donation.units ?? donation.quantity ?? 0)
    );
  }, 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-44 bg-card rounded-lg" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-28 bg-card shadow-lg rounded-xl" />
            <div className="h-28 bg-card shadow-lg rounded-xl" />
            <div className="h-28 bg-card shadow-lg rounded-xl" />
          </div>

          <div className="h-96 bg-card border border-border rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Donations</h1>

        <p className="text-sm text-muted-foreground mt-1">
          View your blood donation history and contribution to the BloodLink
          community.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-400 shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <p className="text-sm text-red-400">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs font-medium text-red-400 hover:text-red-300 whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Donations */}
        <div className="bg-card rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>

              <p className="text-2xl font-bold text-foreground mt-1">
                {totalDonations}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a7 7 0 0 0 7-7c0-2-3-5-7-10-4 5-7 8-7 10a7 7 0 0 0 7 7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Donations */}
        <div className="bg-card rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>

              <p className="text-2xl font-bold text-foreground mt-1">
                {completedDonations}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Units */}
        <div className="bg-card rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Units Donated</p>

              <p className="text-2xl font-bold text-foreground mt-1">
                {totalUnits}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <section className="bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Donation History
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            A record of your previous blood donations.
          </p>
        </div>

        {donations.length === 0 ? (
          /* Empty State */
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a7 7 0 0 0 7-7c0-2-3-5-7-10-4 5-7 8-7 10a7 7 0 0 0 7 7z" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-foreground">
              No donations yet
            </h3>

            <p className="max-w-md mx-auto text-sm text-muted-foreground mt-2">
              Your completed blood donations will appear here once you make your
              first donation.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Blood Type
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Units
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {formatDate(
                          donation.donationDate ||
                            donation.date ||
                            donation.createdAt,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center min-w-10 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-semibold">
                          {formatBloodType(donation.bloodType)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-foreground">
                        {donation.unitsDonated ??
                          donation.units ??
                          donation.quantity ??
                          "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {donation.location ||
                          donation.donationCenter ||
                          donation.hospitalName ||
                          "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusStyles[donation.status] ||
                            "bg-primary/10 text-primary"
                          }`}
                        >
                          {formatStatus(donation.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {donations.map((donation) => (
                <div key={donation.id} className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(
                          donation.donationDate ||
                            donation.date ||
                            donation.createdAt,
                        )}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {donation.location ||
                          donation.donationCenter ||
                          donation.hospitalName ||
                          "Donation centre not specified"}
                      </p>
                    </div>

                    <span className="inline-flex items-center justify-center min-w-10 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-semibold">
                      {formatBloodType(donation.bloodType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Units</p>

                      <p className="text-sm font-medium text-foreground mt-1">
                        {donation.unitsDonated ??
                          donation.units ??
                          donation.quantity ??
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>

                      <span
                        className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[donation.status] ||
                          "bg-primary/10 text-primary"
                        }`}
                      >
                        {formatStatus(donation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
