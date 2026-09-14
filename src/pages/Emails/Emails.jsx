import { useEffect, useState } from "react";
import {
  getEmailsApi,
  sendEmailApi
} from "../../api/email.api.js";
import { getLeadsApi } from "../../api/lead.api.js";

const Emails = () => {
  const [leads, setLeads] = useState([]);
  const [emails, setEmails] = useState([]);

  const [leadId, setLeadId] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [leadResponse, emailResponse] =
        await Promise.all([
          getLeadsApi(),
          getEmailsApi()
        ]);

      setLeads(leadResponse?.data || []);
      setEmails(emailResponse?.data || []);
    } catch (err) {
      console.error("Email page load error:", err);
      setError(err.message || "Failed to load email data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedLead = leads.find(
    (lead) => lead.id === leadId
  );

  const handleLeadChange = (e) => {
    const id = e.target.value;

    setLeadId(id);

    const lead = leads.find(
      (item) => item.id === id
    );

    if (lead) {
      setSubject(
        `Travel Confirmation - ${lead.destination || "Your Trip"}`
      );

      setHtmlBody(`
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 700px; margin: 0 auto; color: #1e293b;">

  <div style="background:#0f172a; padding:24px; border-radius:12px 12px 0 0;">
    <h1 style="margin:0; color:#ffffff; font-size:24px;">
      Travel Confirmation
    </h1>

    <p style="margin:8px 0 0; color:#cbd5e1;">
      ${lead.destination || "Travel Details"}
    </p>
  </div>

  <div style="padding:28px; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 12px 12px;">

    <p style="font-size:15px;">
      Dear ${lead.clientName},
    </p>

    <p style="font-size:15px; line-height:1.7;">
      Please review the travel details provided below.
      If everything is correct, click the authorization button
      to confirm.
    </p>

    <div style="background:#f8fafc; padding:18px; border-radius:10px; margin:20px 0;">

      <p style="margin:0 0 8px;">
        <strong>Destination:</strong>
        ${lead.destination || "-"}
      </p>

      <p style="margin:0 0 8px;">
        <strong>Travel Date:</strong>
        ${
          lead.travelDate
            ? new Date(
                lead.travelDate
              ).toLocaleDateString()
            : "-"
        }
      </p>

      <p style="margin:0;">
        <strong>Requirement:</strong>
        ${lead.travelRequirement || "-"}
      </p>

    </div>

    <p style="font-size:15px; line-height:1.7;">
      By clicking the button below, you confirm that you
      have reviewed and authorize the details described in
      this email.
    </p>

    <div style="text-align:center; margin:30px 0;">

      <a
        href="{{ACCEPT_URL}}"
        style="
          display:inline-block;
          background:#15803d;
          color:#ffffff;
          text-decoration:none;
          padding:14px 30px;
          border-radius:8px;
          font-weight:bold;
          font-size:15px;
        "
      >
        ✓ I Authorize
      </a>

    </div>

    <p style="font-size:12px; color:#64748b; line-height:1.6;">
      If you did not request this confirmation, please contact
      our support team.
    </p>

  </div>

</div>
      `.trim());
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!leadId) {
      setError("Please select a lead");
      return;
    }

    if (!subject.trim()) {
      setError("Email subject is required");
      return;
    }

    if (!htmlBody.trim()) {
      setError("Email HTML body is required");
      return;
    }

    try {
      setSending(true);

      await sendEmailApi({
        leadId,
        subject: subject.trim(),
        htmlBody
      });

      setSuccess(
        `Email sent successfully to ${selectedLead?.clientEmail || "client"}`
      );

      setLeadId("");
      setSubject("");
      setHtmlBody("");

      const response = await getEmailsApi();

      setEmails(response?.data || []);
    } catch (err) {
      console.error("Send email error:", err);
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-slate-500">
            Communication
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Email Builder
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and send authorization emails to your clients.
          </p>
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

        {/* Builder */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Form */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Compose Email
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a lead and prepare the email.
              </p>
            </div>

            <form
              onSubmit={handleSend}
              className="space-y-5 p-5"
            >

              {/* Lead */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Select Lead
                </label>

                <select
                  value={leadId}
                  onChange={handleLeadChange}
                  disabled={loading || sending}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">
                    Select a lead
                  </option>

                  {leads.map((lead) => (
                    <option
                      key={lead.id}
                      value={lead.id}
                    >
                      {lead.leadCode} — {lead.clientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client email */}
              {selectedLead && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Recipient
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedLead.clientName}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedLead.clientEmail}
                  </p>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  placeholder="Email subject"
                  disabled={sending}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* HTML */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    HTML Email
                  </label>

                  <span className="text-xs text-slate-400">
                    Use {"{{ACCEPT_URL}}"} for the authorization button
                  </span>
                </div>

                <textarea
                  value={htmlBody}
                  onChange={(e) =>
                    setHtmlBody(e.target.value)
                  }
                  rows={24}
                  disabled={sending}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-slate-950 px-3 py-3 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  placeholder="<html>...</html>"
                />
              </div>

              {/* Send */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending || loading}
                  className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? "Sending..."
                    : "Send Email"}
                </button>
              </div>

            </form>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Live Preview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preview of the email clients will receive.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6">

              {htmlBody ? (
                <div
                  className="min-h-[600px] overflow-hidden rounded-xl bg-white shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: htmlBody.replace(
                      /\{\{ACCEPT_URL\}\}/g,
                      "#"
                    )
                  }}
                />
              ) : (
                <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
                  <div>
                    <p className="font-medium text-slate-700">
                      Email preview
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Select a lead to start building your email.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Email History */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Email History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Emails sent from the CRM.
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading email history...
            </div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No emails have been sent yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Recipient
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sent By
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {emails.map((email) => (
                    <tr
                      key={email.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {email.lead?.clientName ||
                            "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {email.recipientEmail}
                        </p>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate text-sm text-slate-700">
                          {email.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {email.sentBy?.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {email.sentBy?.email || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            email.status === "ACCEPTED"
                              ? "bg-emerald-100 text-emerald-700"
                              : email.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {email.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {email.sentAt
                          ? new Date(
                              email.sentAt
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Emails;