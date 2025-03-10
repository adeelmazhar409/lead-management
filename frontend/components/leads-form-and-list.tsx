"use client";
import React, { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string;
  email: string;
  status: string; // Include status in the Lead interface
}

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState<{
    name: string;
    email: string;
    status: string;
  }>({
    name: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leads`
      );
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewLead({ ...newLead, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLead),
        }
      );
      if (response.ok) {
        fetchLeads();
        setNewLead({ name: "", email: "", status: "" }); // Reset the form
      }
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  return (
    <div className="max-w-md mt-4 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Leads Management</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="input-group">
          <label
            className="block text-sm font-medium text-black"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newLead.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="input-group">
          <label
            className="block text-sm font-medium text-black"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={newLead.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="input-group">
          <label
            className="block text-sm font-medium text-black"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={newLead.status}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="New">New</option>
            <option value="Engaged">Engaged</option>
            <option value="ProposalSent">Proposal Sent</option>
            <option value="ClosedWon">Closed Won</option>
            <option value="ClosedLost">Closed Lost</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Lead
        </button>
      </form>
      <h2 className="text-xl font-semibold mt-6">Leads List</h2>
      <ul className="mt-4 space-y-2 overflow-y-auto max-h-[200px]">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className="p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition duration-200"
          >
            {lead.name} - {lead.email} - {lead.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leads;
