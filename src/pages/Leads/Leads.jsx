import { useEffect, useMemo, useState } from "react";
import {
  createLeadApi,
  getLeadsApi,
  updateLeadApi,
  updateLeadStatusApi
} from "../../api/lead.api.js";
import { getStoredUser } from "../../utils/auth.js";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "EMAIL_SENT", label: "Email Sent" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "CLOSED", label: "Closed" }
];

const emptyForm = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  destination: "",
  travelDate: "",
  travelRequirement: "",
  notes: ""
};

const statusClass = {
  NEW: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  EMAIL_SENT: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-200 text-gray-700"
};

const statusLabel = (status) => {
  const item = STATUS_OPTIONS.find((x) => x.value === status);
  return item?.label || status;
};

const Leads = () => {
  const user = getStoredUser();

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingLead, setEditingLead] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadsApi({
        search: search.trim(),
        status: statusFilter
      });

      setLeads(response?.data || []);
    } catch (err) {
      console.error("Load leads error:", err);
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadLeads();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingLead(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.clientName.trim()) {
      setError("Client name is required");
      return;
    }

    if (!form.clientEmail.trim()) {
      setError("Client email is required");
      return;
    }

    try {
      setSaving(true);

      if (editingLead) {
        await updateLeadApi(editingLead.id, {
          clientName: form.clientName.trim(),
          clientEmail: form.clientEmail.trim(),
          clientPhone: form.clientPhone.trim(),
          destination: form.destination.trim(),
          travelDate: form.travelDate || null,
          travelRequirement: form.travelRequirement.trim(),
          notes: form.notes.trim()
        });

        setSuccess("Lead updated successfully");
      } else {
        await createLeadApi({
          clientName: form.clientName.trim(),
          clientEmail: form.clientEmail.trim(),
          clientPhone: form.clientPhone.trim(),
          destination: form.destination.trim(),
          travelDate: form.travelDate || null,
          travelRequirement: form.travelRequirement.trim(),
          notes: form.notes.trim()
        });

        setSuccess("Lead created successfully");
      }

      resetForm();
      await loadLeads();
    } catch (err) {
      console.error("Lead save error:", err);
      setError(err.message || "Failed to save lead");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);

    setForm({
      clientName: lead.clientName || "",
      clientEmail: lead.clientEmail || "",
      clientPhone: lead.clientPhone || "",
      destination: lead.destination || "",
      travelDate: lead.travelDate
        ? new Date(lead.travelDate).toISOString().split("T")[0]
        : "",
      travelRequirement: lead.travelRequirement || "",
      notes: lead.notes || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleStatusChange = async (leadId, status) => {
    try {
      setError("");
      setSuccess("");

      await updateLeadStatusApi(leadId, status);

      setSuccess("Lead status updated successfully");

      await loadLeads();

      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => ({
          ...prev,
          status
        }));
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.message || "Failed to update lead status");
    }
  };

  const visibleLeads = useMemo(() => {
    return leads;
  }, [leads]);

  return (
    <div className="min-h-full bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Sales Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Leads
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage clients, travel requirements and lead status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLeads}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* Create/Edit Lead */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              {editingLead ? "Edit Lead" : "Create Lead"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingLead
                ? "Update client and travel information."
                : "Add a new client lead to the CRM."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Client Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Client Name
                </label>

                <input
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Client Email
                </label>

                <input
                  type="email"
                  name="clientEmail"
                  value={form.clientEmail}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="clientPhone"
                  value={form.clientPhone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Las Vegas, USA"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Travel Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Travel Date
                </label>

                <input
                  type="date"
                  name="travelDate"
                  value={form.travelDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Requirement */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Travel Requirement
                </label>

                <input
                  type="text"
                  name="travelRequirement"
                  value={form.travelRequirement}
                  onChange={handleChange}
                  placeholder="Flights + Hotel"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional client requirements..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {editingLead && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingLead
                    ? "Update Lead"
                    : "Create Lead"}
              </button>
            </div>
          </form>
        </div>

        {/* Search & Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, email, lead code or destination..."
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All Status</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Lead List */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Lead List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {visibleLeads.length} lead
                {visibleLeads.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Loading leads...
            </div>
          ) : visibleLeads.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No leads found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a lead or change your search/filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Lead
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Destination
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Travel Date
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    {isSuperAdmin && (
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created By
                      </th>
                    )}

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {lead.leadCode}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString()
                            : "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">
                          {lead.clientName}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {lead.clientEmail}
                        </div>

                        {lead.clientPhone && (
                          <div className="mt-1 text-xs text-slate-400">
                            {lead.clientPhone}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {lead.destination || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {lead.travelDate
                          ? new Date(lead.travelDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(
                              lead.id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                            statusClass[lead.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option
                              key={status.value}
                              value={status.value}
                            >
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {isSuperAdmin && (
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-slate-700">
                            {lead.createdBy?.name || "-"}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            {lead.createdBy?.email || ""}
                          </div>
                        </td>
                      )}

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(lead)}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Lead Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedLead.leadCode}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <Detail
                label="Client Name"
                value={selectedLead.clientName}
              />

              <Detail
                label="Client Email"
                value={selectedLead.clientEmail}
              />

              <Detail
                label="Phone"
                value={selectedLead.clientPhone}
              />

              <Detail
                label="Destination"
                value={selectedLead.destination}
              />

              <Detail
                label="Travel Date"
                value={
                  selectedLead.travelDate
                    ? new Date(
                        selectedLead.travelDate
                      ).toLocaleDateString()
                    : "-"
                }
              />

              <Detail
                label="Requirement"
                value={selectedLead.travelRequirement}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Notes"
                  value={selectedLead.notes}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                    statusClass[selectedLead.status] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {statusLabel(selectedLead.status)}
                </span>
              </div>

              {selectedLead.createdBy && (
                <Detail
                  label="Created By"
                  value={selectedLead.createdBy.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1.5 text-sm text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default Leads;