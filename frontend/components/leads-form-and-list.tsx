"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Lead {
  id: number;
  name: string;
  email: string;
  status: string;
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
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
      toast.error("Error fetching leads. Please try again."); // Show error toast
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
        setNewLead({ name: "", email: "", status: "" });
        setModalIsOpen(false); // Close the modal
      } else {
        toast.error("Error adding lead. (Make sure to use unique email)"); // Show error toast
      }
    } catch (error) {
      toast.error("Error adding lead. (Make sure to use unique email)"); // Show error toast
      console.error("Error adding lead:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leads/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchLeads();
      } else {
        toast.error("Error deleting lead. Please try again."); // Show error toast
      }
    } catch (error) {
      toast.error("Error deleting lead. Please try again."); // Show error toast
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <div className="max-w-md mt-4 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Leads Management</h1>
      <button
        onClick={() => setModalIsOpen(true)}
        className="w-full cursor-pointer bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add Lead
      </button>
      <h2 className="text-xl font-semibold mt-6">Leads List</h2>
      <ul className="mt-4 space-y-2 overflow-y-auto max-h-[200px]">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className="p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition duration-200 flex justify-between items-center"
          >
            <div>
              {lead.name} - {lead.email} - {lead.status}
            </div>
            <button
              onClick={() => handleDelete(lead.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete lead"
            >
              {/* Delete Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for adding a new lead */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        className="modal"
        overlayClassName="overlay"
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="absolute top-4 cursor-pointer right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times; {/* Close icon */}
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
        <form className="space-y-2" onSubmit={handleSubmit}>
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
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Leads;
