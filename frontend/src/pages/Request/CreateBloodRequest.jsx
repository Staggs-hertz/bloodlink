import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api.js";

const initialFormData = {
  bloodType: "",
  urgency: "NORMAL",
  unitsNeeded: 1,
  patientName: "",
  patientAge: "",
  patientGender: "",
  hospitalNo: "",
  ward: "",
  notes: "",
};

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

const urgencyOptions = [
  {
    value: "NORMAL",
    label: "Normal",
    description: "Blood is needed but there is no immediate emergency.",
  },
  {
    value: "URGENT",
    label: "Urgent",
    description: "Blood is needed within a short period.",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    description: "Immediate blood support is required.",
  },
];

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export default function CreateBloodRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.bloodType) {
      setError("Please select the required blood type.");
      return;
    }

    if (!formData.patientName.trim()) {
      setError("Please enter the patient's name.");
      return;
    }

    if (!formData.patientAge) {
      setError("Please enter the patient's age.");
      return;
    }

    if (!formData.patientGender) {
      setError("Please select the patient's gender.");
      return;
    }

    if (!formData.hospitalNo.trim()) {
      setError("Please enter the hospital number.");
      return;
    }

    if (!formData.ward.trim()) {
      setError("Please enter the ward.");
      return;
    }

    if (!formData.unitsNeeded || Number(formData.unitsNeeded) < 1) {
      setError("Units needed must be at least 1.");
      return;
    }

    if (Number(formData.patientAge) < 0 || Number(formData.patientAge) > 120) {
      setError("Please enter a valid patient age.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        bloodType: formData.bloodType,
        urgency: formData.urgency,
        unitsNeeded: Number(formData.unitsNeeded),
        patientName: formData.patientName.trim(),
        patientAge: Number(formData.patientAge),
        patientGender: formData.patientGender,
        hospitalNo: formData.hospitalNo.trim(),
        ward: formData.ward.trim(),
        notes: formData.notes.trim() || undefined,
      };

      await api.createRequest(payload);

      setSuccess("Blood request submitted successfully.");

      setFormData(initialFormData);

      setTimeout(() => {
        navigate("/requests");
      }, 1200);
    } catch (err) {
      console.error("Failed to create blood request:", err);

      setError(
        err?.message || "Unable to submit the blood request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            New Blood Request
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Submit a request for blood on behalf of your hospital.
          </p>
        </div>

        <Link
          to="/requests"
          className="inline-flex items-center justify-center rounded-lg shadow-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          View Requests
        </Link>
      </div>

      {/* Form Card */}
      <div className="rounded-xl bg-card shadow-lg">
        <form onSubmit={handleSubmit}>
          {/* Alerts */}
          <div className="space-y-3 px-6 pt-6">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}
          </div>

          {/* Blood Requirement */}
          <section className="border-b border-border p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Blood Requirement
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Provide the type and quantity of blood required.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Blood Type */}
              <div>
                <label
                  htmlFor="bloodType"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Blood Type <span className="text-red-500">*</span>
                </label>

                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select blood type</option>

                  {bloodTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Units */}
              <div>
                <label
                  htmlFor="unitsNeeded"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Units Needed <span className="text-red-500">*</span>
                </label>

                <input
                  id="unitsNeeded"
                  name="unitsNeeded"
                  type="number"
                  min="1"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Urgency */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="urgency"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Urgency <span className="text-red-500">*</span>
                </label>

                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {urgencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} — {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Patient Information */}
          <section className="border-b border-border p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Patient Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter the basic information of the patient requiring blood.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Patient Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="patientName"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Patient Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Patient Age */}
              <div>
                <label
                  htmlFor="patientAge"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Patient Age <span className="text-red-500">*</span>
                </label>

                <input
                  id="patientAge"
                  name="patientAge"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.patientAge}
                  onChange={handleChange}
                  placeholder="Enter age"
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Patient Gender */}
              <div>
                <label
                  htmlFor="patientGender"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Patient Gender <span className="text-red-500">*</span>
                </label>

                <select
                  id="patientGender"
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select gender</option>

                  {genderOptions.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Number */}
              <div>
                <label
                  htmlFor="hospitalNo"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Hospital Number <span className="text-red-500">*</span>
                </label>

                <input
                  id="hospitalNo"
                  name="hospitalNo"
                  type="text"
                  value={formData.hospitalNo}
                  onChange={handleChange}
                  placeholder="e.g. HOS-2026-001"
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Ward */}
              <div>
                <label
                  htmlFor="ward"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Ward <span className="text-red-500">*</span>
                </label>

                <input
                  id="ward"
                  name="ward"
                  type="text"
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="e.g. Emergency Ward"
                  required
                  className="w-full rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Additional Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add any relevant information that may help administrators
                process the request.
              </p>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Provide any additional information about the request..."
                className="w-full resize-none rounded-lg shadow-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Do not include unnecessary sensitive patient information.
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border bg-secondary/20 p-6 sm:flex-row sm:justify-end">
            <Link
              to="/requests"
              className="inline-flex items-center justify-center rounded-lg shadow-lg bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Blood Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
