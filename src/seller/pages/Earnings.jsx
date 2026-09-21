import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DashboardCard from "../components/DashboardCard";
import {
  Wallet,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Send,
  Calendar,
} from "lucide-react";
import { addSellerNotification } from "../../utils/notificationStorage";
import { sellerApi } from "../services/sellerApi";

export default function Earnings() {
  const [summary, setSummary] = useState({
    netEarnings: 0,
    platformCommission: 0,
    pendingPayouts: 0,
    totalPaidOut: 0,
    availableBalance: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [draftRange, setDraftRange] = useState({ startDate: "", endDate: "" });

  // Fetch earnings breakdown and seller profile details concurrently
  const fetchEarningsData = async (range = dateRange) => {
    try {
      setLoading(true);

      const params = {};
      if (range.startDate) params.startDate = range.startDate;
      if (range.endDate) params.endDate = range.endDate;

      const [earningsRes, sellerRes, bankRes] = await Promise.allSettled([
        sellerApi.getEarnings(params),
        sellerApi.getMe(),
        sellerApi.getBankDetails(),
      ]);

      if (earningsRes.status === "fulfilled") {
        const data = earningsRes.value.data;
        // Merge so missing keys keep their numeric defaults instead of becoming undefined
        setSummary((prev) => ({ ...prev, ...(data.summary || {}) }));
        setMonthlyData(Array.isArray(data.monthlyData) ? data.monthlyData : []);
        setPayouts(Array.isArray(data.payouts) ? data.payouts : []);
      } else {
        toast.error("Could not fetch seller earnings.");
      }

      // Merge basic seller details with bank account details
      let sellerInfo = {};
      if (sellerRes.status === "fulfilled") {
        const payload = sellerRes.value.data;
        sellerInfo = payload.seller || payload;
      }

      // Precedence: /seller/bank-details > /seller/earnings fallback > /seller/me
      const earningsBank =
        earningsRes.status === "fulfilled"
          ? earningsRes.value.data?.bankDetails || {}
          : {};

      const bankDetails =
        bankRes.status === "fulfilled"
          ? bankRes.value.data?.bankDetails || bankRes.value.data || {}
          : {};

      sellerInfo = {
        ...sellerInfo,
        bankName:
          bankDetails.bankName ||
          bankDetails.bankAccountName ||
          earningsBank.bankName ||
          sellerInfo.bankName,
        bankAccountNumber:
          bankDetails.bankAccountNumber ||
          earningsBank.bankAccountNumber ||
          sellerInfo.bankAccountNumber,
      };

      setSellerDetails(sellerInfo);
    } catch (err) {
      console.error("Failed to load seller data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyDateRange = () => {
    if (
      draftRange.startDate &&
      draftRange.endDate &&
      draftRange.startDate > draftRange.endDate
    ) {
      toast.error("Start date must be before end date.");
      return;
    }
    setDateRange(draftRange);
    fetchEarningsData(draftRange);
  };

  const handleClearDateRange = () => {
    const cleared = { startDate: "", endDate: "" };
    setDraftRange(cleared);
    setDateRange(cleared);
    fetchEarningsData(cleared);
  };

  // Submit payout request
  const handleRequestPayout = async () => {
    if (summary.availableBalance <= 0) {
      toast.error("No available balance to withdraw.");
      return;
    }

    setRequestingPayout(true);
    try {
      const response = await sellerApi.requestPayout();
      const newPayout = response.data?.payout;

      if (newPayout) {
        addSellerNotification(
          "Payout Initiated",
          `Payout request of LKR ${Number(newPayout.amount || 0).toLocaleString()} (ID: ${newPayout.id}) has been submitted.`,
          "info",
        );
      }

      toast.success("Payout request submitted successfully!");
      await fetchEarningsData(dateRange);
    } catch (err) {
      console.error("Payout request error:", err);
      // Reads message property created by axios response interceptor in client.js
      toast.error(err.message || "Failed to submit payout request.");
    } finally {
      setRequestingPayout(false);
    }
  };

  // Download CSV export
  const handleExportCSV = async () => {
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await sellerApi.exportEarningsCSV(params);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `earnings_history_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("CSV Export downloaded successfully!");
    } catch (err) {
      console.error("Export CSV error:", err);
      toast.error(err.message || "Failed to download CSV export.");
    }
  };

  const maxAmount =monthlyData.length > 0 ? Math.max(...monthlyData.map((d) => d.amount)) : 0;

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading seller earnings dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs text-slate-700">
        <Calendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
        <div>
          <span className="font-bold text-teal-800">
            Weekly Payouts Scheduled:
          </span>{" "}
          Payout requests are processed and sent to your bank account
          automatically every Wednesday. You can also manually trigger an
          express withdrawal below.
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              From
            </label>
            <input
              type="date"
              value={draftRange.startDate}
              max={draftRange.endDate || undefined}
              onChange={(e) =>
                setDraftRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              To
            </label>
            <input
              type="date"
              value={draftRange.endDate}
              min={draftRange.startDate || undefined}
              onChange={(e) =>
                setDraftRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm focus:border-dcc-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-dcc-primary/10"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyDateRange}
            className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover"
          >
            Apply
          </button>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              type="button"
              onClick={handleClearDateRange}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Filters earnings, sales trend and payout history below. The
          available balance for withdrawal is always up to date.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Earnings"
          value={`Rs. ${Number(summary.netEarnings || 0).toLocaleString("en-LK")}`}
          hint="Calculated net income"
          icon={Wallet}
        />
        <DashboardCard
          title="Pending Payout"
          value={`Rs. ${Number(
            (summary.pendingPayouts || 0) + (summary.availableBalance || 0),
          ).toLocaleString("en-LK")}`}
          hint="Awaiting weekly dispatch"
          icon={Landmark}
        />
        <DashboardCard
          title="Commission Deducted"
          value={`Rs. ${Number(summary.platformCommission || 0).toLocaleString(
            "en-LK",
          )}`}
          hint="10% DCC commission fee"
          icon={ArrowDownLeft}
        />
        <DashboardCard
          title="Withdrawn Cleared"
          value={`Rs. ${Number(summary.totalPaidOut || 0).toLocaleString("en-LK")}`}
          hint="Transferred to bank account"
          icon={ArrowUpRight}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payout Request Card */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900">Request payout</h2>
            <p className="text-xs text-slate-500">
              Withdraw available earnings to your linked bank account.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Payout Destination
            </span>
            {sellerDetails?.bankName && sellerDetails?.bankAccountNumber ? (
              <>
                <span className="mt-1 block text-sm font-bold text-slate-900">
                  {sellerDetails.bankName}
                </span>
                <span className="block text-xs text-slate-500">
                  Account ending in *{sellerDetails.bankAccountNumber.slice(-4)}
                </span>
              </>
            ) : (
              <span className="mt-1 block text-xs font-medium text-amber-600">
                No bank details set up. Please update your profile settings.
              </span>
            )}
          </div>

          <div className="flex justify-between border-b border-dashed border-slate-200 pb-2 text-xs font-semibold text-slate-600">
            <span>Available express:</span>
            <span className="text-slate-900">
              Rs.{" "}
              {Number(summary.availableBalance || 0).toLocaleString("en-LK")}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestPayout}
            disabled={
              requestingPayout ||
              summary.availableBalance <= 0 ||
              !sellerDetails?.bankAccountNumber
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-dcc-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-dcc-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {requestingPayout ? "Processing..." : "Withdraw Funds"}
          </button>
        </div>

        {/* Sales Trend Chart */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Sales Trend</h2>
              <p className="text-xs text-slate-500">
                Monthly earnings summary (in LKR).
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </div>

          <div className="flex h-40 items-end justify-between gap-2 border-b border-slate-100 pt-4">
            {monthlyData.length === 0 && (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                No sales recorded yet.
              </div>
            )}
            {monthlyData.map((d, index) => {
              const heightPct =
                maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
              return (
                <div
                  key={index}
                  className="group relative flex flex-1 flex-col items-center"
                >
                  <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    Rs. {Number(d.amount).toLocaleString()}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full min-h-[4px] cursor-pointer rounded-t-md bg-gradient-to-t from-dcc-primary/80 to-dcc-primary transition-all duration-500 hover:from-dcc-primary hover:to-dcc-primary-hover"
                  />
                  <span className="mt-2 block text-[10px] font-semibold text-slate-500">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-900">Payout history</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-xs text-slate-400"
                  >
                    No payout requests yet.
                  </td>
                </tr>
              )}
              {payouts.map((p) => {
                const dateStr = new Date(p.date).toLocaleDateString("en-LK", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <tr
                    key={p.id}
                    className="text-slate-700 hover:bg-slate-50/50"
                  >
                    <td className="py-3 font-semibold text-slate-900">
                      {p.id}
                    </td>
                    <td className="py-3 text-xs">{dateStr}</td>
                    <td className="py-3 text-xs text-slate-500">{p.account}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      LKR {Number(p.amount).toLocaleString("en-LK")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                          p.status === "cleared"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
                            : p.status === "failed"
                              ? "bg-rose-50 text-rose-700 ring-rose-200/80"
                              : "bg-amber-50 text-amber-700 ring-amber-200/80"
                        }`}
                      >
                        {p.status === "cleared"
                          ? "Cleared"
                          : p.status === "failed"
                            ? "Failed"
                            : "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
