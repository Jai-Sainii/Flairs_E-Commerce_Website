import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/profile`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center py-40">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-md border border-gray-100 py-20 flex justify-center items-center gap-4">
        {/* Avatar circle */}
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 font-semibold text-xl">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>

        {/* User info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Profile
          </span>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            {user.name || "Guest User"}
          </h2>
          <p className="text-sm text-gray-600 truncate max-w-[200px]">
            {user.email || "user@example.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
