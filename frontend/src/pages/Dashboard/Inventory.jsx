import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

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

const getStockStatus = (units) => {
  if (units <= 0) {
    return {
      label: "Out of Stock",
      className: "bg-red-100 text-red-700",
    };
  }

  if (units <= 3) {
    return {
      label: "Low Stock",
      className: "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Available",
    className: "bg-green-100 text-green-700",
  };
};

const getInventoryValue = (inventory, bloodType) => {
  if (!Array.isArray(inventory)) return 0;

  const item = inventory.find((entry) => entry.bloodType === bloodType);

  return Number(item?.unitsAvailable ?? 0);
};

export default function Inventory() {
  const { user } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editingBloodType, setEditingBloodType] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const canUpdateInventory =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    let isMounted = true;

    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getInventory();

        const inventoryData =
          response?.data?.items ||
          response?.data?.inventory ||
          response?.data ||
          [];

        if (isMounted) {
          setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        }
      } catch (err) {
        console.error("Failed to load inventory:", err);

        if (isMounted) {
          setError(
            err?.message || "Unable to load blood inventory. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInventory();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  const startEditing = (bloodType) => {
    const currentValue = getInventoryValue(inventory, bloodType);

    setEditingBloodType(bloodType);
    setEditValue(String(currentValue));
    setSaveError("");
  };

  const cancelEditing = () => {
    setEditingBloodType(null);
    setEditValue("");
    setSaveError("");
  };

  const handleUpdateInventory = async (bloodType) => {
    const units = Number(editValue);

    if (!Number.isInteger(units) || units < 0) {
      setSaveError("Available units must be a whole number of 0 or greater.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      await api.updateInventory(bloodType, units);

      setEditingBloodType(null);
      setEditValue("");

      setReloadKey((currentKey) => currentKey + 1);
    } catch (err) {
      console.error("Failed to update inventory:", err);

      setSaveError(
        err?.message || "Unable to update the inventory. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const totalUnits = bloodTypes.reduce(
    (total, bloodType) => total + getInventoryValue(inventory, bloodType.value),
    0,
  );

  const availableTypes = bloodTypes.filter(
    (bloodType) => getInventoryValue(inventory, bloodType.value) > 3,
  ).length;

  const lowStockTypes = bloodTypes.filter((bloodType) => {
    const units = getInventoryValue(inventory, bloodType.value);

    return units > 0 && units <= 3;
  }).length;

  const outOfStockTypes = bloodTypes.filter(
    (bloodType) => getInventoryValue(inventory, bloodType.value) <= 0,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Blood Inventory
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View the current availability of blood across all blood groups.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>

            <button
              type="button"
              onClick={handleRetry}
              className="font-medium underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Units</p>

            <p className="mt-2 text-2xl font-semibold text-foreground">
              {totalUnits}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all blood groups
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Available Groups</p>

            <p className="mt-2 text-2xl font-semibold text-green-600">
              {availableTypes}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              More than 3 units available
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Low Stock</p>

            <p className="mt-2 text-2xl font-semibold text-orange-600">
              {lowStockTypes}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              1–3 units available
            </p>
          </div>

          <div className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Out of Stock</p>

            <p className="mt-2 text-2xl font-semibold text-red-600">
              {outOfStockTypes}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              No units available
            </p>
          </div>
        </div>
      )}

      {/* Inventory */}
      <div className="overflow-hidden rounded-xl bg-card shadow-lg">
        <div className="border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Blood Stock
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current units available for each blood type.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="rounded-xl border border-border p-5">
                  <div className="h-5 w-12 animate-pulse rounded bg-secondary" />

                  <div className="mt-5 h-8 w-16 animate-pulse rounded bg-secondary" />

                  <div className="mt-3 h-5 w-20 animate-pulse rounded-full bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Inventory could not be loaded.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {bloodTypes.map((bloodType) => {
              const units = getInventoryValue(inventory, bloodType.value);

              const status = getStockStatus(units);

              const isEditing = editingBloodType === bloodType.value;

              return (
                <div
                  key={bloodType.value}
                  className="rounded-xl shadow-lg bg-background p-5"
                >
                  {/* Blood Type */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {bloodType.label}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {bloodType.value.replace("_", " ")}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Units */}
                  {!isEditing ? (
                    <>
                      <div className="mt-6">
                        <p className="text-3xl font-semibold text-foreground">
                          {units}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {units === 1 ? "unit" : "units"} available
                        </p>
                      </div>

                      {/* Admin Controls */}
                      {canUpdateInventory && (
                        <button
                          type="button"
                          onClick={() => startEditing(bloodType.value)}
                          className="mt-5 w-full rounded-lg shadow-lg bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          Update Stock
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="mt-5">
                      <label
                        htmlFor={`inventory-${bloodType.value}`}
                        className="mb-2 block text-sm font-medium text-foreground"
                      >
                        Available Units
                      </label>

                      <input
                        id={`inventory-${bloodType.value}`}
                        type="number"
                        min="0"
                        step="1"
                        value={editValue}
                        onChange={(event) => setEditValue(event.target.value)}
                        className="w-full rounded-lg shadow-lg bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                      {saveError && (
                        <p className="mt-2 text-xs text-red-600">{saveError}</p>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleUpdateInventory(bloodType.value)}
                          className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={cancelEditing}
                          className="flex-1 rounded-lg shadow-lg bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="rounded-xl shadow-lg bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">
          Inventory Status
        </h3>

        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              Available: more than 3 units
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Low stock: 1–3 units</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Out of stock: 0 units</span>
          </div>
        </div>
      </div>
    </div>
  );
}
