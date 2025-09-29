import React from "react";

export default function UserCard({ user = {} }) {

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-5 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">User Details</h3>
      <div className="space-y-2">
        <div>
          <span className="block text-gray-500 text-sm">name</span>
          <span className="block text-gray-900 font-medium">
            {user.name}
          </span>
        </div>
        <div>
          <span className="block text-gray-500 text-sm">Email</span>
          <span className="block text-gray-900 font-medium">{user.email}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200">
          Edit
        </button>
        <button className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 hover:bg-red-100">
          Delete
        </button>
      </div>
    </div>
  );
}
