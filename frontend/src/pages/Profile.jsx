import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  Edit2,
  Save,
  Building2,
  Flag,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      postalCode: "",
    },
  });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/profile`, {
          withCredentials: true,
        });
        setUser((prev) => ({ ...prev, ...res.data.user }));
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEditShippingAddress = async () => {
    setEdit(!edit);
    if (edit) {
      try {
        await axios.put(
          `${API_BASE_URL}/users/update/${user._id}`,
          {
            shippingAddress: {
              address: user.shippingAddress.address,
              city: user.shippingAddress.city,
              country: user.shippingAddress.country,
              phone: user.shippingAddress.phone,
              postalCode: user.shippingAddress.postalCode,
              fullName: user.shippingAddress.fullName,
            },
          },
          {
            withCredentials: true,
          },
        );
      } catch (err) {
        console.error("Error updating user address:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
          {/* Header Section - Minimal Gradient */}
          <div className="h-24 bg-gradient-to-r from-pink-500 to-rose-400 relative">
            <div className="absolute -bottom-10 left-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden"
              >
                <div className="h-full w-full bg-pink-50 flex items-center justify-center text-pink-500 text-2xl font-bold">
                  {user.name?.[0]?.toUpperCase() || <User size={28} />}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <motion.h1 className="text-2xl font-bold text-gray-800">
                  {user.name || "Guest"}
                </motion.h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                  <Mail size={14} className="text-pink-400" />
                  {user.email || "user@example.com"}
                </div>
              </div>
              <button
                onClick={handleEditShippingAddress}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  edit
                    ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    : "bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200"
                }`}
              >
                {edit ? (
                  <>
                    <Save size={14} /> Save
                  </>
                ) : (
                  <>
                    <Edit2 size={14} /> Edit
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-pink-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Shipping Details
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {edit ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                  >
                    <InputField
                      label="Full Name"
                      name="fullName"
                      value={user.shippingAddress?.fullName}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Phone"
                      name="phone"
                      value={user.shippingAddress?.phone}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Address"
                      name="address"
                      value={user.shippingAddress?.address}
                      onChange={handleChange}
                      fullWidth
                    />
                    <InputField
                      label="City"
                      name="city"
                      value={user.shippingAddress?.city}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Postal Code"
                      name="postalCode"
                      value={user.shippingAddress?.postalCode}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Country"
                      name="country"
                      value={user.shippingAddress?.country}
                      onChange={handleChange}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                  >
                    <InfoItem
                      label="Full Name"
                      value={user.shippingAddress?.fullName}
                    />
                    <InfoItem
                      label="Phone"
                      value={user.shippingAddress?.phone}
                    />
                    <InfoItem
                      label="Address"
                      value={user.shippingAddress?.address}
                      fullWidth
                    />
                    <InfoItem label="City" value={user.shippingAddress?.city} />
                    <InfoItem
                      label="Postal Code"
                      value={user.shippingAddress?.postalCode}
                    />
                    <InfoItem
                      label="Country"
                      value={user.shippingAddress?.country}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, fullWidth }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? "md:col-span-2" : ""}`}>
    <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-50 transition-all text-gray-700 placeholder-gray-300"
      placeholder={label}
    />
  </div>
);

const InfoItem = ({ label, value, fullWidth }) => (
  <div
    className={`p-3 bg-gray-50 rounded-lg border border-gray-100/50 hover:border-pink-100 transition-colors ${fullWidth ? "md:col-span-2" : ""}`}
  >
    <span className="text-[10px] font-bold uppercase text-pink-400 tracking-wider block mb-0.5">
      {label}
    </span>
    <p className="text-gray-700 font-medium truncate">{value || "-"}</p>
  </div>
);

export default Profile;
