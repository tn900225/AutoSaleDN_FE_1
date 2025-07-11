import React, { useEffect, useState, useMemo } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { FaEdit, FaTrash, FaTimes, FaSearch, FaFilter, FaEye } from "react-icons/fa";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const inputClass =
  "w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition placeholder-gray-400";
const filterInputClass =
  "px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 w-full text-base focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition placeholder-gray-400";

const formInit = { fullName: "", email: "", mobile: "", password: "" };

// Add date formatting utility
const formatDate = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy');
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(formInit);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // View More Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get all roles for filter dropdown
  const allRoles = useMemo(() => {
    const roles = Array.from(new Set(customers.map(c => c.role))).filter(Boolean);
    const sortingOptions = [
      { value: "nameAsc", label: "Name A → Z" },
      { value: "nameDesc", label: "Name Z → A" },
      { value: "emailAsc", label: "Email A → Z" },
      { value: "emailDesc", label: "Email Z → A" }
    ];
    const combinedOptions = [
      { value: "All", label: "All" },
      ...sortingOptions,
      { value: "separator", label: "---" },
      ...roles.map(role => ({ value: role, label: role }))
    ];
    return combinedOptions;
  }, [customers]);

  // Filtered and Searched customers
  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    // Apply filters
    if (roleFilter && roleFilter !== "All" && roleFilter !== "separator") {
      if (roleFilter.startsWith("name") || roleFilter.startsWith("email")) {
        // Apply sorting
        switch (roleFilter) {
          case "nameAsc":
            result.sort((a, b) => a.fullName.localeCompare(b.fullName));
            break;
          case "nameDesc":
            result.sort((a, b) => b.fullName.localeCompare(a.fullName));
            break;
          case "emailAsc":
            result.sort((a, b) => a.email.localeCompare(b.email));
            break;
          case "emailDesc":
            result.sort((a, b) => b.email.localeCompare(a.email));
            break;
          default:
            break;
        }
      } else {
        // Apply role filter
        result = result.filter(c => c.role === roleFilter);
      }
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        c =>
          (c.fullName && c.fullName.toLowerCase().includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term)) ||
          (c.mobile && c.mobile.toLowerCase().includes(term))
      );
    }

    // Pagination
    const totalPages = Math.ceil(result.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResult = result.slice(startIndex, endIndex);

    return {
      data: paginatedResult,
      totalPages,
      totalItems: result.length
    };
  }, [customers, searchTerm, roleFilter, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < filteredCustomers.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch("/api/Admin/customers", {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return [];
        }
        return r.json();
      })
      .then(setCustomers);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const openModalForAdd = () => {
    setForm(formInit);
    setEditingId(null);
    setShowModal(true);
  };

  const openModalForEdit = (cus) => {
    setForm({
      fullName: cus.fullName,
      email: cus.email,
      mobile: cus.mobile || "",
      password: "",
    });
    setEditingId(cus.userId || cus.user_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(formInit);
    setEditingId(null);
  };

  // VIEW MORE: Fetch user info + transaction history
  const handleViewMore = async (cus) => {
    setViewLoading(true);
    setShowViewModal(true);
    setViewUser(null);
    setViewHistory([]);
    try {
      const res = await fetch(`/api/Admin/customers/${cus.userId || cus.user_id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.status === 200) {
        const data = await res.json();
        setViewUser(data.user || data);
        setViewHistory(data.salesHistory || []);
      } else {
        setViewUser(null);
        setViewHistory([]);
      }
    } catch {
      setViewUser(null);
      setViewHistory([]);
    }
    setViewLoading(false);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewUser(null);
    setViewHistory([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/Admin/customers/${editingId}`
      : "/api/Admin/customers";
    const body = { ...form };
    if (!editingId) delete body.role;
    if (editingId && !form.password) delete body.password;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body),
    });

    fetchCustomers();
    handleCloseModal();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await fetch(`/api/Admin/customers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    setCustomers(customers.filter((c) => (c.userId || c.user_id) !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="text-3xl font-bold tracking-tight text-gray-800 mb-6">
            Customer Management
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {/* --- FILTER & SEARCH BAR here --- */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center mb-6">
              {/* Search box */}
              <div className="relative flex-1 min-w-[240px]">
                <input
                  className={filterInputClass + " pr-10"}
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {/* Combined Filter */}
              <div className="relative min-w-[160px]">
                <select
                  className={filterInputClass + " appearance-none pr-8"}
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  {allRoles.map(option => (
                    <option key={option.value} value={option.value} disabled={option.value === "separator"}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                className="bg-gradient-to-r from-violet-600 to-violet-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-violet-700 hover:to-violet-500 transition"
                onClick={openModalForAdd}
              >
                Add Customer
              </button>
            </div>
            {/* --- END FILTER BAR --- */}

            <div className="mb-4 flex justify-between items-end">
              <div className="text-lg font-semibold text-gray-700">Customer List</div>
              <div className="text-sm text-gray-400">
                {filteredCustomers.totalItems} customers
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-base">
                    <th className="py-3 px-4 font-bold text-left rounded-tl-xl">Full Name</th>
                    <th className="py-3 px-4 font-bold text-left">Email</th>
                    <th className="py-3 px-4 font-bold text-left">Mobile</th>
                    <th className="py-3 px-4 font-bold text-left">Role</th>
                    <th className="py-3 px-4 font-bold text-center rounded-tr-xl w-40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.data.map((c, idx) => (
                    <tr
                      key={c.userId || c.user_id}
                      className={`border-t last:border-b transition hover:bg-violet-50 ${idx % 2 === 1 ? "bg-gray-50" : ""}`}
                    >
                      <td className="py-3 px-4">{c.fullName}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{c.mobile}</td>
                      <td className="py-3 px-4">{c.role}</td>
                      <td className="py-3 px-4 text-center flex justify-center items-center gap-2">
                        <button
                          className="inline-block text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition"
                          title="View Details"
                          onClick={() => handleViewMore(c)}
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          className="inline-block mr-1 text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 p-2 rounded-full transition"
                          title="Edit"
                          onClick={() => openModalForEdit(c)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="inline-block text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition"
                          title="Delete"
                          onClick={() =>
                            handleDelete(c.userId || c.user_id)
                          }
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400 text-lg">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-400">
                Showing {filteredCustomers.data.length} of {filteredCustomers.totalItems} customers
              </div>
              <div className="flex items-center gap-4">
                <button
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-violet-50 hover:bg-violet-100'}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {filteredCustomers.totalPages}
                </span>
                <button
                  className={`px-4 py-2 rounded-lg ${currentPage === filteredCustomers.totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-violet-50 hover:bg-violet-100'}`}
                  onClick={handleNextPage}
                  disabled={currentPage === filteredCustomers.totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          {/* Modal giữ nguyên */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-lg p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
                  onClick={handleCloseModal}
                  type="button"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-violet-700">
                  {editingId ? "Update Customer Information" : "Add New Customer"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className={inputClass + " placeholder:font-light"}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass + " placeholder:font-light"}
                      type="email"
                      placeholder="example@gmail.com"
                      required
                      disabled={!!editingId}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Mobile</label>
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      className={inputClass + " placeholder:font-light"}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      {editingId ? "New Password" : "Password"}{!editingId && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass + " placeholder:font-light"}
                      type="password"
                      autoComplete="new-password"
                      placeholder={editingId ? "Leave empty if not changing" : "Enter password"}
                      required={!editingId}
                    />
                  </div>
                  <div className="text-right mt-2">
                    <button
                      className={`px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-violet-600 to-violet-400 text-white shadow hover:from-violet-700 hover:to-violet-500 transition ${loading ? "opacity-70" : ""}`}
                      disabled={loading}
                    >
                      {editingId ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View More Modal */}
          {showViewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-2xl p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
                  onClick={handleCloseViewModal}
                  type="button"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-violet-700">
                  Customer Details
                </h2>
                {viewLoading ? (
                  <div className="py-12 text-center text-gray-400">Loading...</div>
                ) : viewUser ? (
                  <div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-gray-700">Full Name:</div>
                        <div className="text-gray-900">{viewUser.fullName || viewUser.FullName}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Email:</div>
                        <div className="text-gray-900">{viewUser.email || viewUser.Email}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Mobile:</div>
                        <div className="text-gray-900">{viewUser.mobile || viewUser.Mobile || "-"}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Role:</div>
                        <div className="text-gray-900">{viewUser.role || viewUser.Role}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Created At:</div>
                        <div className="text-gray-900">{formatDate(viewUser.createdAt || viewUser.CreatedAt)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Updated At:</div>
                        <div className="text-gray-900">{formatDate(viewUser.updatedAt || viewUser.UpdatedAt)}</div>
                      </div>
                    </div>
                    <div className="mb-2 mt-6 text-lg font-semibold text-gray-700">
                      Transaction History
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-violet-50 text-gray-600 text-base">
                            <th className="py-2 px-3 font-bold text-left">No.</th>
                            <th className="py-2 px-3 font-bold text-left w-64">Car</th>
                            <th className="py-2 px-3 font-bold text-right">Price</th>
                            <th className="py-2 px-3 font-bold text-left">Status</th>
                            
                            <th className="py-2 px-3 font-bold text-left">Date</th>
                            <th className="py-2 px-3 font-bold text-center">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewHistory.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-6 text-gray-400">
                                No transactions found.
                              </td>
                            </tr>
                          )}
                          {viewHistory.map((h, index) => (
                            <tr key={h.saleId || h.SaleId} className="border-t">
                              <td className="py-2 px-3">{index + 1}</td>
                              <td className="py-2 px-3">
                                {h.car?.manufacturer || h.Car?.manufacturer} {h.car?.model || h.Car?.model} {h.car?.year || h.Car?.year}
                              </td>
                              
                              
                              <td className="py-2 px-3 text-left">
                                {h.finalPrice || h.FinalPrice
                                  ? Number(h.finalPrice || h.FinalPrice).toLocaleString('vi-VN', { 
                                    style: "currency", 
                                    currency: "VND" 
                                  })
                                  : "-"}
                              </td>
                              <td className="py-2 px-3">
                                {(() => {
                                  const status = h.saleStatus || h.SaleStatus;
                                  const statusColors = {
                                    Completed: 'text-green-600 font-bold',
                                    Canceled: 'text-red-500',
                                    Pending: 'text-orange-500'
                                  };
                                  return (
                                    <span className={statusColors[status] || ''}>
                                      {status}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="py-2 px-3">{formatDate(h.saleDate || h.SaleDate)}</td>
                              <td className="py-2 px-3 text-center">
                                <Link
                                  to={`/admin/transactions/${h.saleId || h.SaleId}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">Cannot load customer details.</div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}