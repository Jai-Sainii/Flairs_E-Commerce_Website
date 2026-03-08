import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";

const statusConfig = {
  New: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
    label: "New",
  },
  Read: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
    label: "Read",
  },
  Responded: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
    label: "Responded",
  },
};

function EnquiryCard({ enquiry, fetchEnquiries }) {
  const config = statusConfig[enquiry.status] || statusConfig.New;

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/updateContactStatus/${enquiry._id}`,
        { status: newStatus },
        { withCredentials: true },
      );
      toast.success(`Marked as ${newStatus}`);
      fetchEnquiries();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 space-y-4 shadow-lg shadow-pink-500/5 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-800">{enquiry.name}</h2>
          <p className="text-sm text-zinc-400">{enquiry.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
          <span className="text-xs text-zinc-400">
            {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Subject */}
      <div className="bg-zinc-50/50 rounded-xl px-4 py-3">
        <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">
          Subject
        </p>
        <p className="text-sm font-semibold text-zinc-700">{enquiry.subject}</p>
      </div>

      {/* Message */}
      <div className="bg-zinc-50/50 rounded-xl px-4 py-3">
        <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">
          Message
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          {enquiry.message}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
        {enquiry.status !== "Read" && enquiry.status !== "Responded" && (
          <button
            onClick={() => updateStatus("Read")}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Mark as Read
          </button>
        )}
        {enquiry.status !== "Responded" && (
          <button
            onClick={() => updateStatus("Responded")}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-flaire-pink to-flaire-coral text-white hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Mark as Responded
          </button>
        )}
        {enquiry.status === "Responded" && (
          <span className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200">
            ✓ Responded
          </span>
        )}
      </div>
    </div>
  );
}

export default EnquiryCard;
