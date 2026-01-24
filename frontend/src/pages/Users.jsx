import React from "react";
import UserCard from "../components/UserCard";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useEffect } from "react";
import { useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    let res = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data.user);
    setUsers(res.data.user);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">User List</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Users;
