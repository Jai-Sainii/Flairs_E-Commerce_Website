import { useEffect, useState } from "react";
import EnquiryCard from "../components/EnquiryCard";
import axios from "axios";
import { API_BASE_URL } from "../api";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/getAllContactInfo`, {
        withCredentials: true,
      });
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Stats
  const totalEnquiries = enquiries.length;
  const newCount = enquiries.filter(
    (e) => !e.status || e.status === "New",
  ).length;
  const readCount = enquiries.filter((e) => e.status === "Read").length;
  const respondedCount = enquiries.filter(
    (e) => e.status === "Responded",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-flaire-pink/20 border-t-flaire-pink rounded-full animate-spin-slow" />
          <p className="text-zinc-500 font-medium text-sm">
            Loading enquiries...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-800 text-center">
          Customer Enquiries
        </h1>
        <p className="text-center text-zinc-400 text-sm mt-1">
          View and respond to customer messages
        </p>
      </div>

      {/* Stats */}
      {totalEnquiries > 0 && (
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-zinc-800">{totalEnquiries}</p>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              Total
            </p>
          </div>
          <div className="bg-blue-50/50 backdrop-blur-md border border-blue-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{newCount}</p>
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">
              New
            </p>
          </div>
          <div className="bg-amber-50/50 backdrop-blur-md border border-amber-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{readCount}</p>
            <p className="text-xs text-amber-500 font-medium uppercase tracking-wide">
              Read
            </p>
          </div>
          <div className="bg-emerald-50/50 backdrop-blur-md border border-emerald-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">
              {respondedCount}
            </p>
            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
              Responded
            </p>
          </div>
        </div>
      )}

      {/* Enquiries list */}
      {enquiries.length === 0 ? (
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-zinc-400 text-lg">No enquiries found</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry._id}
              enquiry={enquiry}
              fetchEnquiries={fetchEnquiries}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;
