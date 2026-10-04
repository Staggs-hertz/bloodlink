import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardPlus,
  Droplets,
  Info,
  Loader2,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api.js";

const initialFormData = {
  bloodType: "",
  urgency: "NORMAL",
  unitsNeeded: "1",
  patientName: "",
  patientAge: "",
  patientGender: "",
  patientReferenceNo: "",
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
    description: "Blood is needed without an immediate emergency.",
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

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const getErrorMessage = (error) => {
  if (error?.data?.errors) {
    if (Array.isArray(error.data.errors)) {
      return error.data.errors
        .map((item) => item.message || item.path || "Invalid input")
        .join(" ");
    }

    if (typeof error.data.errors === "object") {
      return Object.values(error.data.errors)
        .map((item) =>
          typeof item === "string" ? item : item?.message || "Invalid input",
        )
        .join(" ");
    }
  }

  return (
    error?.data?.message ||
    error?.message ||
    "Unable to submit the blood request. Please try again."
  );
};

const CreateBloodRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isVerifiedHospital =
    user?.role === "HOSPITAL" && user?.isVerifiedInstitution === true;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!isVerifiedHospital) {
      return "Your hospital institution must be verified by an administrator before you can submit a blood request.";
    }

    if (!formData.bloodType) {
      return "Please select the required blood type.";
    }

    const unitsNeeded = Number(formData.unitsNeeded);

    if (!Number.isInteger(unitsNeeded) || unitsNeeded < 1) {
      return "Units needed must be a whole number greater than 0.";
    }

    const patientName = formData.patientName.trim();

    if (!patientName) {
      return "Please enter the patient's name.";
    }

    if (patientName.length < 2) {
      return "Please enter a valid patient name.";
    }

    const patientAge = Number(formData.patientAge);

    if (
      formData.patientAge === "" ||
      !Number.isInteger(patientAge) ||
      patientAge < 0 ||
      patientAge > 120
    ) {
      return "Please enter a valid patient age between 0 and 120.";
    }

    if (!formData.patientGender) {
      return "Please select the patient's gender.";
    }

    if (!formData.patientReferenceNo.trim()) {
      return "Please enter the patient reference number.";
    }

    if (!formData.ward.trim()) {
      return "Please enter the ward.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
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
        patientReferenceNo: formData.patientReferenceNo.trim(),
        ward: formData.ward.trim(),
        notes: formData.notes.trim() || undefined,
      };

      await api.createRequest(payload);

      setSuccess(true);
      setFormData(initialFormData);

      window.setTimeout(() => {
        navigate("/requests");
      }, 1000);
    } catch (error) {
      console.error("Failed to create blood request:", error);
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
            <ClipboardPlus size={16} />
            <span>Blood Request</span>
          </div>

          <h1 className="text-2xl font-bold font-display text-foreground">
            New Blood Request
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Submit a blood request on behalf of your hospital for administrative
            review and donor matching.
          </p>
        </div>

        <Link
          to="/requests"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft size={16} />
          View Requests
        </Link>
      </section>

      {/* Verification notice */}
      {!isVerifiedHospital && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-yellow-800">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold">
              Hospital verification required
            </p>

            <p className="mt-1 text-xs leading-5">
              Your hospital institution must be verified by an administrator
              before a blood request can be submitted.
            </p>
          </div>
        </div>
      )}

      {/* Main form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-700"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">
                Blood request submitted successfully.
              </p>

              <p className="mt-0.5 text-xs">
                Redirecting you to your blood requests...
              </p>
            </div>
          </div>
        )}

        {/* Blood requirement */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Droplets size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Blood Requirement
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Specify the blood type, quantity, and urgency of the request.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            {/* Blood type */}
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
                disabled={submitting}
                required
                className={inputClass}
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
                step="1"
                value={formData.unitsNeeded}
                onChange={handleChange}
                disabled={submitting}
                required
                className={inputClass}
              />

              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter the number of blood units required.
              </p>
            </div>

            {/* Urgency */}
            <div className="sm:col-span-2">
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-foreground">
                  Urgency <span className="text-red-500">*</span>
                </legend>

                <div className="grid gap-3 md:grid-cols-3">
                  {urgencyOptions.map((option) => {
                    const selected = formData.urgency === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-xl border p-4 transition ${
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-background hover:border-primary/40"
                        } ${
                          submitting ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={selected}
                          onChange={handleChange}
                          disabled={submitting}
                          className="sr-only"
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                selected ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {option.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {option.description}
                            </p>
                          </div>

                          <span
                            className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                              selected
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            {selected && (
                              <span className="mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </section>

        {/* Patient information */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Patient Information
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Provide the basic information required to identify the patient
                  and process the request.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            {/* Patient name */}
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
                disabled={submitting}
                placeholder="Enter patient's full name"
                autoComplete="off"
                required
                className={inputClass}
              />
            </div>

            {/* Age */}
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
                step="1"
                value={formData.patientAge}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Enter age"
                required
                className={inputClass}
              />
            </div>

            {/* Gender */}
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
                disabled={submitting}
                required
                className={inputClass}
              >
                <option value="">Select gender</option>

                {genderOptions.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient reference number */}
            <div>
              <label
                htmlFor="patientReferenceNo"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Patient Reference Number <span className="text-red-500">*</span>
              </label>

              <input
                id="patientReferenceNo"
                name="patientReferenceNo"
                type="text"
                value={formData.patientReferenceNo}
                onChange={handleChange}
                disabled={submitting}
                placeholder="e.g. PAT-2026-001"
                autoComplete="off"
                required
                className={inputClass}
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
                disabled={submitting}
                placeholder="e.g. Emergency Ward"
                required
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Additional information */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Info size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Additional Information
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Include information that may help administrators review the
                  request.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
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
              disabled={submitting}
              rows={5}
              maxLength={1000}
              placeholder="Provide any relevant information about the request..."
              className={`${inputClass} resize-none`}
            />

            <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <Info size={14} className="mt-0.5 shrink-0" />

              <p>Avoid including unnecessary sensitive patient information.</p>
            </div>
          </div>
        </section>

        {/* Hospital information */}
        {user?.organizationName && (
          <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-3.5">
            <Building2
              size={18}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />

            <div>
              <p className="text-xs text-muted-foreground">
                Requesting institution
              </p>

              <p className="mt-0.5 text-sm font-medium text-foreground">
                {user.organizationName}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/requests"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting || !isVerifiedHospital}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ClipboardPlus size={17} />
                Submit Blood Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBloodRequest;
