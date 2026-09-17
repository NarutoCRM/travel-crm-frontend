import { useEffect, useState } from "react";

import {
  getLeadsApi,
  getLeadApi,
  updateLeadApi,
  updateLeadStatusApi
} from "../../api/lead.api.js";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "EMAIL_SENT", label: "Email Sent" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "CLOSED", label: "Closed" }
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

const statusClass = {
  NEW: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  EMAIL_SENT: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-200 text-gray-700"
};

const statusLabel = (status) => {
  const item = STATUS_OPTIONS.find(
    (x) => x.value === status
  );

  return item?.label || status || "-";
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

const Leads = () => {
  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    destination: "",
    travelDate: "",
    travelRequirement: "",
    notes: ""
  });

  const loadLeads = async ({
    targetPage = page,
    targetLimit = limit,
    targetSearch = search,
    targetStatus = statusFilter,
    targetClient = clientFilter
  } = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadsApi({
        page: targetPage,
        limit: targetLimit,
        search: targetSearch.trim(),
        status: targetStatus,
        clientName: targetClient.trim()
      });

      console.log("LEADS API RESPONSE:", response);

      const result = response?.data;

      const leadData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      const paginationData =
        result?.pagination || {
          page: targetPage,
          limit: targetLimit,
          total: leadData.length,
          totalPages:
            leadData.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPreviousPage: false
        };

      setLeads(leadData);
      setPagination(paginationData);

    } catch (err) {
      console.error("Load leads error:", err);

      setError(
        err?.message || "Failed to load leads"
      );

      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads({
      targetPage: page,
      targetLimit: limit
    });
  }, [page, limit, statusFilter]);

  const handleSearch = async (e) => {
    e.preventDefault();

    setPage(1);

    await loadLeads({
      targetPage: 1,
      targetLimit: limit,
      targetSearch: search,
      targetStatus: statusFilter,
      targetClient: clientFilter
    });
  };

  const handleClientFilter = async (e) => {
    const value = e.target.value;

    setClientFilter(value);
    setPage(1);

    await loadLeads({
      targetPage: 1,
      targetLimit: limit,
      targetSearch: search,
      targetStatus: statusFilter,
      targetClient: value
    });
  };

  const clearFilters = async () => {
    setSearch("");
    setStatusFilter("");
    setClientFilter("");
    setPage(1);

    await loadLeads({
      targetPage: 1,
      targetLimit: limit,
      targetSearch: "",
      targetStatus: "",
      targetClient: ""
    });
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);

    setLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;

    if (
      pagination.totalPages &&
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);
  };

  const handleView = async (lead) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await getLeadApi(lead.id);

      setSelectedLead(response?.data || lead);
    } catch (err) {
      console.error("Get lead error:", err);

      setError(
        err?.message || "Failed to load lead details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const startEdit = (lead) => {
    setEditingLead(lead);

    setEditForm({
      clientName: lead.clientName || "",
      clientEmail: lead.clientEmail || "",
      clientPhone: lead.clientPhone || "",
      destination: lead.destination || "",
      travelDate: lead.travelDate
        ? new Date(lead.travelDate)
          .toISOString()
          .split("T")[0]
        : "",
      travelRequirement:
        lead.travelRequirement || "",
      notes: lead.notes || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const cancelEdit = () => {
    setEditingLead(null);

    setEditForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      destination: "",
      travelDate: "",
      travelRequirement: "",
      notes: ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (!editForm.clientName.trim()) {
        setError("Client name is required");
        return;
      }

      if (!editForm.clientEmail.trim()) {
        setError("Client email is required");
        return;
      }

      await updateLeadApi(editingLead.id, {
        clientName: editForm.clientName.trim(),
        clientEmail: editForm.clientEmail.trim(),
        clientPhone: editForm.clientPhone.trim(),
        destination: editForm.destination.trim(),
        travelDate: editForm.travelDate || null,
        travelRequirement:
          editForm.travelRequirement.trim(),
        notes: editForm.notes.trim()
      });

      setSuccess("Lead updated successfully");

      cancelEdit();

      await loadLeads();
    } catch (err) {
      console.error("Update lead error:", err);

      setError(
        err?.message || "Failed to update lead"
      );
    }
  };

  const handleStatusChange = async (
    leadId,
    status
  ) => {
    try {
      setError("");
      setSuccess("");

      await updateLeadStatusApi(
        leadId,
        status
      );

      setSuccess(
        "Lead status updated successfully"
      );

      await loadLeads();

      if (selectedLead?.id === leadId) {
        const response = await getLeadApi(leadId);

        setSelectedLead(
          response?.data || {
            ...selectedLead,
            status
          }
        );
      }
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setError(
        err?.message ||
        "Failed to update lead status"
      );
    }
  };

  const getEmailSentAt = (lead) => {
    if (!lead?.emails?.length) {
      return null;
    }

    return lead.emails
      .map((email) => email.sentAt)
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b) - new Date(a)
      )[0];
  };

  const getAcceptedEmail = (lead) => {
    if (!lead?.emails?.length) {
      return null;
    }

    return (
      lead.emails.find(
        (email) =>
          email.acceptedAt ||
          email.acceptance?.acceptedAt
      ) || null
    );
  };

  const acceptedEmail =
    getAcceptedEmail(selectedLead);

  const acceptedAt =
    acceptedEmail?.acceptedAt ||
    acceptedEmail?.acceptance?.acceptedAt ||
    null;

  const customerIp =
    acceptedEmail?.acceptance?.ipAddress ||
    null;

  const customerUserAgent =
    acceptedEmail?.acceptance?.userAgent ||
    null;

  const emailSentAt =
    getEmailSentAt(selectedLead);

  const totalPages =
    pagination.totalPages || 0;

  const showingFrom =
    pagination.total > 0
      ? (pagination.page - 1) *
      pagination.limit +
      1
      : 0;

  const showingTo =
    pagination.total > 0
      ? Math.min(
        pagination.page *
        pagination.limit,
        pagination.total
      )
      : 0;

  const pageNumbers = [];

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - page) <= 2
    ) {
      pageNumbers.push(i);
    }
  }

  const uniquePageNumbers = [
    ...new Set(pageNumbers)
  ];

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
              View and manage all authorized leads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadLeads()}
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

        {/* Edit Lead */}
        {editingLead && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Edit Lead
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update client and travel information.
              </p>
            </div>

            <form
              onSubmit={saveEdit}
              className="p-5"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <EditInput
                  label="Client Name"
                  name="clientName"
                  value={editForm.clientName}
                  onChange={handleEditChange}
                />

                <EditInput
                  label="Client Email"
                  name="clientEmail"
                  type="email"
                  value={editForm.clientEmail}
                  onChange={handleEditChange}
                />

                <EditInput
                  label="Phone"
                  name="clientPhone"
                  value={editForm.clientPhone}
                  onChange={handleEditChange}
                />

                <EditInput
                  label="Destination"
                  name="destination"
                  value={editForm.destination}
                  onChange={handleEditChange}
                />

                <EditInput
                  label="Travel Date"
                  name="travelDate"
                  type="date"
                  value={editForm.travelDate}
                  onChange={handleEditChange}
                />

                <EditInput
                  label="Travel Requirement"
                  name="travelRequirement"
                  value={
                    editForm.travelRequirement
                  }
                  onChange={handleEditChange}
                />

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Update Lead
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_220px_auto_auto]"
          >
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search client, email, lead code or destination..."
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All Status
              </option>

              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>

            <input
              type="text"
              value={clientFilter}
              onChange={handleClientFilter}
              placeholder="Filter by client name"
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Lead List */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* List Header */}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Lead List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {pagination.total || 0} total lead
                {pagination.total !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                Leads per page
              </span>

              <select
                value={limit}
                onChange={handleLimitChange}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-slate-500"
              >
                {PAGE_SIZE_OPTIONS.map(
                  (size) => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No leads found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or filter.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[1200px] w-full">
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
                        Created
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {lead.leadCode}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            ID: {lead.id}
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
                          {formatDate(
                            lead.travelDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-slate-700">
                            {formatDateTime(
                              lead.createdAt
                            )}
                          </div>
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
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusClass[
                              lead.status
                            ] ||
                              "bg-slate-100 text-slate-700"
                              }`}
                          >
                            {STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={
                                    status.value
                                  }
                                  value={
                                    status.value
                                  }
                                >
                                  {status.label}
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  lead
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  lead
                                )
                              }
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

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {showingFrom}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-700">
                    {showingTo}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {pagination.total}
                  </span>{" "}
                  leads
                </p>

                <div className="flex items-center gap-1">

                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      handlePageChange(
                        page - 1
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {uniquePageNumbers.map(
                    (number, index) => {
                      const previous =
                        uniquePageNumbers[
                        index - 1
                        ];

                      const showDots =
                        previous &&
                        number - previous > 1;

                      return (
                        <div
                          key={number}
                          className="flex items-center gap-1"
                        >
                          {showDots && (
                            <span className="px-2 text-slate-400">
                              ...
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handlePageChange(
                                number
                              )
                            }
                            className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium ${page === number
                              ? "bg-slate-900 text-white"
                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            {number}
                          </button>
                        </div>
                      );
                    }
                  )}

                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      handlePageChange(
                        page + 1
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
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
                onClick={() =>
                  setSelectedLead(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {detailsLoading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Loading lead details...
              </div>
            ) : (
              <div className="space-y-7 p-6">

                {/* Client Information */}
                <section>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Client Information
                  </h4>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <Detail
                      label="Client Name"
                      value={
                        selectedLead.clientName
                      }
                    />

                    <Detail
                      label="Client Email"
                      value={
                        selectedLead.clientEmail
                      }
                    />

                    <Detail
                      label="Phone"
                      value={
                        selectedLead.clientPhone
                      }
                    />

                    <Detail
                      label="Destination"
                      value={
                        selectedLead.destination
                      }
                    />

                    <Detail
                      label="Travel Date"
                      value={formatDate(
                        selectedLead.travelDate
                      )}
                    />

                    <Detail
                      label="Travel Requirement"
                      value={
                        selectedLead.travelRequirement
                      }
                    />
                  </div>

                  <div className="mt-5">
                    <Detail
                      label="Notes"
                      value={selectedLead.notes}
                    />
                  </div>
                </section>

                {/* Lead Information */}
                <section>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Lead Information
                  </h4>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <Detail
                      label="Lead Code"
                      value={
                        selectedLead.leadCode
                      }
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass[
                          selectedLead.status
                        ] ||
                          "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {statusLabel(
                          selectedLead.status
                        )}
                      </span>
                    </div>

                    <Detail
                      label="Created By"
                      value={
                        selectedLead.createdBy
                          ? `${selectedLead.createdBy.name} (${selectedLead.createdBy.email})`
                          : "-"
                      }
                    />

                    <Detail
                      label="Lead Created"
                      value={formatDateTime(
                        selectedLead.createdAt
                      )}
                    />

                    <Detail
                      label="Last Updated"
                      value={formatDateTime(
                        selectedLead.updatedAt
                      )}
                    />

                    <Detail
                      label="Email Sent"
                      value={formatDateTime(
                        emailSentAt
                      )}
                    />
                  </div>
                </section>

                {/* Acceptance Information */}
                <section>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Customer Acceptance
                  </h4>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <Detail
                      label="Accepted At"
                      value={formatDateTime(
                        acceptedAt
                      )}
                    />

                    <Detail
                      label="Customer IP Address"
                      value={customerIp}
                    />

                    <div className="sm:col-span-2">
                      <Detail
                        label="Customer User Agent"
                        value={
                          customerUserAgent
                        }
                      />
                    </div>

                  </div>
                </section>

                {/* Payment Information */}
                <section>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Payment Information
                  </h4>

                  {!selectedLead.emails ||
                    selectedLead.emails.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      No payment information found.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      {selectedLead.emails.map((email) => (
                        <div key={email.id} className="mb-4 last:mb-0">
                          <div className="mb-3 text-xs font-semibold text-slate-500">
                            Email: {email.subject || "-"}
                          </div>

                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Detail
                              label="Card Number"
                              value={
                                email.cardLast4
                                  ? `•••• ${email.cardLast4}`
                                  : "-"
                              }
                            />

                            <Detail
                              label="Card Expiry"
                              value={email.cardExpiry || "-"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>


                {/* Email History */}
                <section>
                  <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Email History
                  </h4>

                  {!selectedLead.emails ||
                    selectedLead.emails.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                      No email records found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedLead.emails.map((email) => {
                        const emailAcceptedAt =
                          email.acceptedAt ||
                          email.acceptance?.acceptedAt ||
                          null;

                        return (
                          <div
                            key={email.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <Detail label="Recipient" value={email.recipientEmail} />
                              <Detail label="Subject" value={email.subject} />

                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Email Status
                                </p>
                                <span
                                  className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${email.status === "ACCEPTED"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : email.status === "FAILED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                  {email.status || "-"}
                                </span>
                              </div>

                              <Detail label="Sent At" value={formatDateTime(email.sentAt)} />
                              <Detail label="Accepted At" value={formatDateTime(emailAcceptedAt)} />
                              <Detail
                                label="Acceptance IP"
                                value={email.acceptance?.ipAddress}
                              />
                              <Detail
                                label="Sent By"
                                value={
                                  email.sentBy
                                    ? `${email.sentBy.name} (${email.sentBy.email})`
                                    : "-"
                                }
                              />
                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-4">
                              <button
                                type="button"
                                onClick={() => setSelectedEmail(email)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                View Email
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

              </div>
            )}
          </div>
        </div>
      )}
      {selectedEmail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Email Preview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedEmail.subject}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Email Information */}
            <div className="grid grid-cols-1 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 sm:grid-cols-3">

              <Detail
                label="Recipient"
                value={selectedEmail.recipientEmail}
              />

              <Detail
                label="Sent At"
                value={formatDateTime(selectedEmail.sentAt)}
              />

              <Detail
                label="Status"
                value={selectedEmail.status}
              />

            </div>

            {/* Full Saved HTML */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
              <div className="mx-auto min-h-[500px] max-w-4xl overflow-hidden rounded-xl bg-white shadow">

                <iframe
                  title="Saved Email Preview"
                  srcDoc={selectedEmail.htmlBody}
                  className="min-h-[700px] w-full border-0"
                  sandbox=""
                />

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const EditInput = ({
  label,
  name,
  type = "text",
  value,
  onChange
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    />
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1.5 break-words text-sm text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default Leads;