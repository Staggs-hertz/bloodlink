import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

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

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const emptyProfile = {
  bloodType: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  city: "",
  state: "",
  country: "Nigeria",
  isAvailable: true,
  smsOptIn: false,
};

const formatBloodType = (bloodType) => {
  if (!bloodType) return "Not provided";

  const type = bloodTypes.find((item) => item.value === bloodType);

  return type?.label || bloodType.replace("_", " ");
};

const formatGender = (gender) => {
  if (!gender) return "Not provided";

  const option = genderOptions.find((item) => item.value === gender);

  return option?.label || gender;
};

const formatDate = (date) => {
  if (!date) return "Not provided";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not provided";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(emptyProfile);
  const [formData, setFormData] = useState(emptyProfile);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getDonorProfile();

        const donorProfile =
          response?.data?.donorProfile ||
          response?.data?.profile ||
          response?.data ||
          {};

        const loadedProfile = {
          bloodType: donorProfile.bloodType || "",
          gender: donorProfile.gender || "",
          dateOfBirth: donorProfile.dateOfBirth
            ? donorProfile.dateOfBirth.slice(0, 10)
            : "",
          phone: donorProfile.phone || "",
          city: donorProfile.city || "",
          state: donorProfile.state || "",
          country: donorProfile.country || "Nigeria",
          isAvailable: donorProfile.isAvailable ?? true,
          smsOptIn: donorProfile.smsOptIn ?? false,
        };

        setProfile(loadedProfile);
        setFormData(loadedProfile);
      } catch (err) {
        setError(
          err?.message || "Unable to load your profile. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setFormData(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
    setFormData(profile);
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.bloodType) {
      setError("Please select your blood type.");
      return;
    }

    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Please enter your date of birth.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!formData.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Blood type is handled separately by the backend donor endpoint.
       */
      if (formData.bloodType !== profile.bloodType) {
        await api.updateDonorBloodType({
          bloodType: formData.bloodType,
        });
      }

      /*
       * Update the remaining donor profile information.
       */
      await api.updateDonorProfile({
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || "Nigeria",
        smsOptIn: formData.smsOptIn,
      });

      /*
       * Availability is kept as part of the donor profile experience.
       */
      if (formData.isAvailable !== profile.isAvailable) {
        await api.updateDonorAvailability({
          isAvailable: formData.isAvailable,
        });
      }

      const updatedProfile = {
        ...formData,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || "Nigeria",
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      /*
       * Keep the authenticated user's information in sync where
       * AuthContext supports updating it.
       */
      if (typeof updateUser === "function") {
        updateUser({
          ...user,
        });
      }

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err?.message || "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted" />

          <div className="rounded-2xl bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted" />

              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-muted" />
                <div className="h-4 w-56 rounded bg-muted" />
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-7 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your donor information and donation preferences.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && !editing && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          <Check size={17} />
          {success}
        </div>
      )}

      {/* Profile */}
      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        {/* Profile heading */}
        <div className="border-b border-border px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={15} />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>

            <div className="sm:ml-auto">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Donor
              </span>
            </div>
          </div>
        </div>

        {editing ? (
          /* =========================
             EDIT MODE
          ========================= */
          <form onSubmit={handleSubmit}>
            <div className="space-y-8 p-6">
              {/* Personal information */}
              <section>
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-foreground">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Keep your donor information up to date.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Blood Type */}
                  <div>
                    <label
                      htmlFor="bloodType"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Blood Type
                    </label>

                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select gender</option>

                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="mb-2 block text-sm font-medium text-foreground"
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
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="border-t border-border pt-8">
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-foreground">
                    Location
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This helps keep your donor information accurate.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Jos"
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Plateau"
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Country */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Nigeria"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </section>

              {/* Donation preferences */}
              <section className="border-t border-border pt-8">
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-foreground">
                    Donation Preferences
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Control how you participate in blood donation.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Availability */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-primary"
                    />

                    <span>
                      <span className="block text-sm font-medium text-foreground">
                        Available to donate
                      </span>

                      <span className="mt-1 block text-xs text-muted-foreground">
                        Allow BloodLink to consider you when you are eligible
                        for a blood request.
                      </span>
                    </span>
                  </label>

                  {/* SMS */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50">
                    <input
                      type="checkbox"
                      name="smsOptIn"
                      checked={formData.smsOptIn}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-primary"
                    />

                    <span>
                      <span className="block text-sm font-medium text-foreground">
                        Receive SMS notifications
                      </span>

                      <span className="mt-1 block text-xs text-muted-foreground">
                        Receive donation-related notifications by SMS when
                        available.
                      </span>
                    </span>
                  </label>
                </div>
              </section>
            </div>

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border bg-secondary/30 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          /* =========================
             VIEW MODE
          ========================= */
          <div className="p-6">
            {/* Personal Information */}
            <section>
              <h3 className="text-base font-semibold text-foreground">
                Personal Information
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<User size={17} />}
                  label="Full Name"
                  value={
                    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    "Not provided"
                  }
                />

                <InfoItem
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={user?.email || "Not provided"}
                />

                <InfoItem
                  icon={<Phone size={17} />}
                  label="Phone Number"
                  value={profile.phone || "Not provided"}
                />

                <InfoItem
                  icon={<Calendar size={17} />}
                  label="Date of Birth"
                  value={formatDate(profile.dateOfBirth)}
                />

                <InfoItem label="Gender" value={formatGender(profile.gender)} />

                <InfoItem
                  label="Blood Type"
                  value={formatBloodType(profile.bloodType)}
                  highlight
                />
              </div>
            </section>

            {/* Location */}
            <section className="mt-8 border-t border-border pt-8">
              <h3 className="text-base font-semibold text-foreground">
                Location
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<MapPin size={17} />}
                  label="City"
                  value={profile.city || "Not provided"}
                />

                <InfoItem
                  icon={<MapPin size={17} />}
                  label="State"
                  value={profile.state || "Not provided"}
                />

                <InfoItem
                  label="Country"
                  value={profile.country || "Not provided"}
                />
              </div>
            </section>

            {/* Donation Preferences */}
            <section className="mt-8 border-t border-border pt-8">
              <h3 className="text-base font-semibold text-foreground">
                Donation Preferences
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Donation Availability"
                  value={profile.isAvailable ? "Available" : "Unavailable"}
                  status={profile.isAvailable ? "positive" : "neutral"}
                />

                <InfoItem
                  label="SMS Notifications"
                  value={profile.smsOptIn ? "Enabled" : "Disabled"}
                  status={profile.smsOptIn ? "positive" : "neutral"}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, highlight = false, status = "" }) => {
  let valueClass = "text-foreground";

  if (highlight) {
    valueClass = "text-primary font-semibold";
  }

  if (status === "positive") {
    valueClass = "text-green-600 font-medium";
  }

  if (status === "neutral") {
    valueClass = "text-muted-foreground font-medium";
  }

  return (
    <div className="rounded-xl border border-border bg-background/50 px-4 py-3.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className={`mt-1.5 text-sm ${valueClass}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
};

export default Profile;
