import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const bloodTypes = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

const genders = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const getInitials = (user) => {
  return `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;
};

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role === "HOSPITAL") {
    return <HospitalProfile user={user} />;
  }

  if (user.role === "DONOR") {
    return <DonorProfile user={user} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card shadow-lg rounded-xl p-6">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>

        <p className="text-sm text-muted-foreground mt-2">
          Profile information is not available for this account type.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   DONOR PROFILE
   ============================================================ */

function DonorProfile({ user }) {
  const [formData, setFormData] = useState({
    bloodType: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    city: "",
    state: "",
    country: "Nigeria",
    isAvailable: true,
    smsOptIn: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getMyDonorProfile();
        const profile = response.data;

        setFormData({
          bloodType: profile?.bloodType || "",
          gender: profile?.gender || "",
          dateOfBirth: profile?.dateOfBirth
            ? profile.dateOfBirth.split("T")[0]
            : "",
          phone: profile?.phone || "",
          city: profile?.city || "",
          state: profile?.state || "",
          country: profile?.country || "Nigeria",
          isAvailable: profile?.isAvailable ?? true,
          smsOptIn: profile?.smsOptIn ?? false,
        });
      } catch (err) {
        setError(err.message || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.updateDonorProfile({
        bloodType: formData.bloodType || null,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        phone: formData.phone || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || "Nigeria",
        isAvailable: formData.isAvailable,
        smsOptIn: formData.smsOptIn,
      });

      const profile = response.data;

      setFormData({
        bloodType: profile?.bloodType || "",
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth
          ? profile.dateOfBirth.split("T")[0]
          : "",
        phone: profile?.phone || "",
        city: profile?.city || "",
        state: profile?.state || "",
        country: profile?.country || "Nigeria",
        isAvailable: profile?.isAvailable ?? true,
        smsOptIn: profile?.smsOptIn ?? false,
      });

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Complete your donor information to help us match you with blood
          requests.
        </p>
      </div>

      {/* Account Information */}
      <section className="bg-card rounded-xl shadow-lg p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-lg font-bold">
              {getInitials(user)}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {user.firstName} {user.lastName}
            </h2>

            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>

            <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Donor
            </span>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
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
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-400 shrink-0 mt-0.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      {/* Donor Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Donor Information
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Keep your information up to date so you can be matched accurately.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-7">
          {/* Personal Information */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Type */}
              <div>
                <label
                  htmlFor="bloodType"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Blood Type
                </label>

                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select blood type</option>

                  {bloodTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select gender</option>

                  {genders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </section>

          {/* Donation Preferences */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Donation Preferences
            </h3>

            <div className="space-y-3">
              {/* Availability */}
              <label className="flex items-start gap-3 p-4 rounded-lg shadow-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Available to donate
                  </span>

                  <span className="block text-xs text-muted-foreground mt-1">
                    Allow BloodLink to consider you when matching donors with
                    blood requests.
                  </span>
                </span>
              </label>

              {/* SMS */}
              <label className="flex items-start gap-3 p-4 rounded-lg shadow-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="smsOptIn"
                  checked={formData.smsOptIn}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-primary"
                />

                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Receive SMS notifications
                  </span>

                  <span className="block text-xs text-muted-foreground mt-1">
                    Allow BloodLink to send donation-related updates to your
                    phone number.
                  </span>
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-4 bg-secondary/50 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   HOSPITAL PROFILE
   ============================================================ */

function HospitalProfile({ user }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hospital Profile</h1>

        <p className="text-sm text-muted-foreground mt-1">
          View the information associated with your hospital account.
        </p>
      </div>

      {/* Account Information */}
      <section className="bg-card rounded-xl shadow-lg p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M3 21h18" />
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
              <path d="M9 7h6" />
              <path d="M9 11h6" />
              <path d="M9 15h2" />
              <path d="M13 15h2" />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {user.organizationName || "Hospital / Healthcare Institution"}
            </h2>

            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>

            <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Hospital
            </span>
          </div>
        </div>
      </section>

      {/* Institution Information */}
      <section className="bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Institution Information
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Information provided when this hospital account was registered.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Organization */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hospital / Institution Name
            </p>

            <p className="text-sm text-foreground mt-1">
              {user.organizationName || "Not provided"}
            </p>
          </div>

          {/* Registration Number */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Registration Number
            </p>

            <p className="text-sm text-foreground mt-1">
              {user.registrationNumber || "Not provided"}
            </p>
          </div>

          {/* Contact Person */}
          <div className="pt-5 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Account Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contact Name
                </p>

                <p className="text-sm text-foreground mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email
                </p>

                <p className="text-sm text-foreground mt-1 break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="pt-5 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Location
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Address
                </p>

                <p className="text-sm text-foreground mt-1">
                  {user.address || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    City
                  </p>

                  <p className="text-sm text-foreground mt-1">
                    {user.city || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    State
                  </p>

                  <p className="text-sm text-foreground mt-1">
                    {user.state || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Country
                  </p>

                  <p className="text-sm text-foreground mt-1">
                    {user.country || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="pt-5 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Institution Verification
            </h3>

            <div
              className={`flex items-center gap-3 p-4 rounded-lg border ${
                user.isVerifiedInstitution
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
              }`}
            >
              {user.isVerifiedInstitution ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-400 shrink-0"
                >
                  <path d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-400 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}

              <div>
                <p
                  className={`text-sm font-medium ${
                    user.isVerifiedInstitution
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {user.isVerifiedInstitution
                    ? "Institution Verified"
                    : "Verification Pending"}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {user.isVerifiedInstitution
                    ? "Your institution has been verified by an administrator."
                    : "Your institution has not yet been verified by an administrator."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   LOADING SKELETON
   ============================================================ */

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-40 bg-card rounded-lg" />

        <div className="h-28 bg-card border border-border rounded-xl" />

        <div className="h-125 bg-card border border-border rounded-xl" />
      </div>
    </div>
  );
}
