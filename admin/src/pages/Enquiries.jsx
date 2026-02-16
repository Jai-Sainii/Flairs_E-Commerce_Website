import { useEffect, useState } from "react";
import EnquiryCard from "../components/EnquiryCard";
import axios from "axios";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/getAllContactInfo", {
          withCredentials: true,
        });
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-black font-semibold">Loading enquiries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-10">
      <h1 className="text-3xl font-extrabold text-black text-center mb-10">
        Customer Enquiries
      </h1>

      {enquiries.length === 0 ? (
        <p className="text-center text-black">No enquiries found</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {enquiries.map((enquiry) => (
            <EnquiryCard key={enquiry._id} enquiry={enquiry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Enquiries;
