"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { FiUsers, FiCheckCircle, FiXCircle, FiBarChart2 } from "react-icons/fi";
import Link from "next/link";

import { getLeads } from "@/services/leadService";

const MOCK_LEADS = [
  {
    id: 1,
    full_name: "Rahul Sharma",
    phoneNumber: "9876543210",
    email: "rahul.sharma@example.com",
    income: "750000",
    city: "Mumbai",
    state: "Maharashtra",
    loan_requirement: "500000",
    status: "New",
    created_at: "2023-07-15T10:30:00Z"
  },
  {
    id: 2,
    full_name: "Priya Patel",
    phoneNumber: "8765432109",
    email: "priya.patel@example.com",
    income: "850000",
    city: "Delhi",
    state: "Delhi",
    loan_requirement: "750000",
    status: "In Review",
    created_at: "2023-07-14T09:15:00Z"
  },
  {
    id: 3,
    full_name: "Amit Kumar",
    phoneNumber: "7654321098",
    email: "amit.kumar@example.com",
    income: "950000",
    city: "Bangalore",
    state: "Karnataka",
    loan_requirement: "1000000",
    status: "Approved",
    created_at: "2023-07-10T14:20:00Z"
  },
  {
    id: 4,
    full_name: "Neha Gupta",
    phoneNumber: "6543210987",
    email: "neha.gupta@example.com",
    income: "600000",
    city: "Chennai",
    state: "Tamil Nadu",
    loan_requirement: "400000",
    status: "Rejected",
    created_at: "2023-07-05T11:45:00Z"
  },
  {
    id: 5,
    full_name: "Vikram Singh",
    phoneNumber: "5432109876",
    email: "vikram.singh@example.com",
    income: "1200000",
    city: "Hyderabad",
    state: "Telangana",
    loan_requirement: "800000",
    status: "New",
    created_at: "2023-07-16T08:30:00Z"
  }
];

interface Lead {
  id: number;
  full_name: string;
  phoneNumber: string;
  email: string;
  income: string;
  city: string;
  state: string;
  loan_requirement: string;
  status: string;
  created_at: string;
}

// Stats calculation functions
const calculateStats = (leads: Lead[]) => {
  const totalLeads = leads.length;
  const approvedLeads = leads.filter(lead => lead.status === "Approved").length;
  const rejectedLeads = leads.filter(lead => lead.status === "Rejected").length;
  const newLeads = leads.filter(lead => lead.status === "New").length;
  const inReviewLeads = leads.filter(lead => lead.status === "In Review").length;
  
  const approvalRate = totalLeads ? Math.round((approvedLeads / totalLeads) * 100) : 0;
  const rejectionRate = totalLeads ? Math.round((rejectedLeads / totalLeads) * 100) : 0;
  
  const totalLoanAmount = leads.reduce((sum, lead) => sum + parseInt(lead.loan_requirement), 0);
  const avgLoanAmount = totalLeads ? Math.round(totalLoanAmount / totalLeads) : 0;
  
  return {
    totalLeads,
    approvedLeads,
    rejectedLeads,
    newLeads,
    inReviewLeads,
    approvalRate,
    rejectionRate,
    totalLoanAmount,
    avgLoanAmount
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    location: "",
  });

  const [stats, setStats] = useState({
    totalLeads: 0,
    approvedLeads: 0,
    rejectedLeads: 0,
    newLeads: 0,
    inReviewLeads: 0,
    approvalRate: 0,
    rejectionRate: 0,
    totalLoanAmount: 0,
    avgLoanAmount: 0
  });

  // Check authentication and handle responsive behavior
  // ...existing code...
useEffect(() => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!token || userRole !== "admin") {
    router.push("/");
    return;
  }

  setLoading(true);
  setError("");
  getLeads()
    .then((apiLeads) => {
      setLeads(apiLeads);
      setFilteredLeads(apiLeads);
      setStats(calculateStats(apiLeads));
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load leads");
      setLoading(false);
    });

  // Handle responsive behavior
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);

  return () => window.removeEventListener("resize", checkIfMobile);
}, [router]);
// ...existing code...

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    let result = [...leads];
    
    // Filter by status
    if (filters.status) {
      result = result.filter(lead => lead.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(lead => new Date(lead.created_at) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(lead => new Date(lead.created_at) <= toDate);
    }
    
    // Filter by location (city or state)
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(
        lead => 
          lead.city.toLowerCase().includes(location) || 
          lead.state.toLowerCase().includes(location)
      );
    }
    
    setFilteredLeads(result);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      location: "",
    });
    setFilteredLeads(leads);
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["ID", "Full Name", "Phone", "Email", "Income", "City", "State", "Loan Amount", "Status", "Date"];
    const csvRows: string[][] = [headers];
    
    // Add data rows
    filteredLeads.forEach(lead => {
      const row = [
        String(lead.id),
        lead.full_name,
        lead.phoneNumber,
        lead.email,
        lead.income,
        lead.city,
        lead.state,
        lead.loan_requirement,
        lead.status,
        new Date(lead.created_at).toLocaleDateString()
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "leads_export_" + new Date().toISOString().split("T")[0] + ".csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString();
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <Navbar />
      <div style={{
        maxWidth: "1500px",
        margin: "0 auto",
        padding: "2rem 2.5rem",
        marginLeft: isMobile ? "0" : "250px",
        width: isMobile ? "100%" : "calc(100% - 250px)",
        transition: "margin-left 0.3s ease, width 0.3s ease",
      }}>
        <div style={{
          marginBottom: "2rem",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
            <h1 style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              color: "#1e293b",
              letterSpacing: "-0.01em",
            }}>
              Lead Management Dashboard
            </h1>
          </div>
          
          {/* Improved Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}>
            {/* Total Leads Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)";
            }}>
              <div style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                backgroundColor: "#4f46e5" 
              }}></div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "1rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Total Leads</span>
                <div style={{ 
                  width: "2.75rem", 
                  height: "2.75rem", 
                  borderRadius: "0.75rem", 
                  backgroundColor: "rgba(79, 70, 229, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#4f46e5",
                  border: "1px solid rgba(79, 70, 229, 0.2)"
                }}>
                  <FiUsers size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: "2.25rem", 
                fontWeight: "700", 
                color: "#1e293b",
                paddingLeft: "0.75rem"
              }}>
                {loading ? "..." : stats.totalLeads}
              </div>
              <div style={{ 
                fontSize: "0.875rem", 
                color: "#64748b", 
                marginTop: "0.5rem",
                paddingLeft: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                <span>Total leads in the system</span>
              </div>
            </div>
            
            {/* Approval Rate Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)";
            }}>
              <div style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                backgroundColor: "#10b981" 
              }}></div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "1rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Approval Rate</span>
                <div style={{ 
                  width: "2.75rem", 
                  height: "2.75rem", 
                  borderRadius: "0.75rem", 
                  backgroundColor: "rgba(16, 185, 129, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#10b981",
                  border: "1px solid rgba(16, 185, 129, 0.2)"
                }}>
                  <FiCheckCircle size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: "2.25rem", 
                fontWeight: "700", 
                color: "#1e293b",
                paddingLeft: "0.75rem"
              }}>
                {loading ? "..." : `${stats.approvalRate}%`}
              </div>
              <div style={{ 
                fontSize: "0.875rem", 
                color: "#64748b", 
                marginTop: "0.5rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ color: "#10b981", fontWeight: "600" }}>{loading ? "..." : stats.approvedLeads}</span> leads approved
              </div>
            </div>
            
            {/* Total Loan Amount Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)";
            }}>
              <div style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                backgroundColor: "#f59e0b" 
              }}></div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "1rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Total Loan Amount</span>
                <div style={{ 
                  width: "2.75rem", 
                  height: "2.75rem", 
                  borderRadius: "0.75rem", 
                  backgroundColor: "rgba(245, 158, 11, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.2)"
                }}>
                  <FiBarChart2 size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: "2.25rem", 
                fontWeight: "700", 
                color: "#1e293b",
                paddingLeft: "0.75rem"
              }}>
                {loading ? "..." : formatCurrency(stats.totalLoanAmount)}
              </div>
              <div style={{ 
                fontSize: "0.875rem", 
                color: "#64748b", 
                marginTop: "0.5rem",
                paddingLeft: "0.75rem"
              }}>
                Avg: <span style={{ fontWeight: "600" }}>{loading ? "..." : formatCurrency(stats.avgLoanAmount)}</span> per lead
              </div>
            </div>
            
            {/* Number of Agents Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)";
            }}>
              <div style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "6px",
                height: "100%",
                backgroundColor: "#6366f1" 
              }}></div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "1rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Number of Agents</span>
                <div style={{ 
                  width: "2.75rem", 
                  height: "2.75rem", 
                  borderRadius: "0.75rem", 
                  backgroundColor: "rgba(99, 102, 241, 0.1)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#6366f1",
                  border: "1px solid rgba(99, 102, 241, 0.2)"
                }}>
                  <FiUsers size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: "2.25rem", 
                fontWeight: "700", 
                color: "#1e293b",
                paddingLeft: "0.75rem"
              }}>
                {loading ? "..." : "12"}
              </div>
              <div style={{ 
                fontSize: "0.875rem", 
                color: "#64748b", 
                marginTop: "0.5rem",
                paddingLeft: "0.75rem"
              }}>
                <span style={{ color: "#6366f1", fontWeight: "600" }}>5</span> active agents this month
              </div>
            </div>
          </div>
          
          {error && (
            <div style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
              borderRadius: "0.375rem",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              fontWeight: "500",
              fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}
          
          {/* Improved Filters Section */}
          <div style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
            marginBottom: "1.5rem",
            border: "1px solid #f1f5f9",
          }}>
            <h2 style={{
              fontSize: "1.15rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "0.75rem",
            }}>
              <span>🔍</span> Filter Leads
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr",
              gap: "2rem",
            }}>
              <div>
                <label 
                  htmlFor="status"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "1rem", 
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label 
                  htmlFor="dateFrom"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="dateTo"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="location"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  City
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  style={{
                    display: "block",
                    width: "70%",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                    transition: "all 0.2s ease",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
            </div>
            
            <div style={{
              marginTop: "1.75rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #f1f5f9",
            }}>
              <button
                onClick={resetFilters}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  color: "#475569",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(79, 70, 229, 0.4)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#4338ca";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(79, 70, 229, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#4f46e5";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(79, 70, 229, 0.4)";
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Improved Leads Table */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            border: "1px solid #f1f5f9",
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <h2 style={{
                fontSize: "1.15rem",
                fontWeight: "600",
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}>
                <span>📋</span> Lead Records
              </h2>
              <div style={{
                fontSize: "0.875rem",
                color: "#64748b",
                fontWeight: "500",
              }}>
                {filteredLeads.length} leads found
              </div>
            </div>
            
            {loading ? (
              <div style={{
                padding: "3rem",
                textAlign: "center",
                color: "#64748b",
              }}>
                <div style={{
                  display: "inline-block",
                  width: "2rem",
                  height: "2rem",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#4f46e5",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem",
                }}></div>
                <style jsx>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
                <p>Loading leads data...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div style={{
                padding: "3rem",
                textAlign: "center",
                color: "#64748b",
              }}>
                <div style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  color: "#cbd5e1",
                }}>
                  🔍
                </div>
                <p style={{ fontWeight: "500" }}>No leads found matching your filters.</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Try adjusting your filter criteria.</p>
              </div>
            ) : (
              <div style={{
                overflowX: "auto",
              }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Name
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Contact
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Income
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Location
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Loan
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8fafc";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}>
                          {lead.full_name}
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                        }}>
                          <div style={{
                            fontSize: "0.875rem",
                            color: "#1e293b",
                          }}>{lead.phoneNumber}</div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            marginTop: "0.125rem",
                          }}>{lead.email}</div>
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#1e293b",
                          fontWeight: "500",
                        }}>
                          ₹{parseInt(lead.income).toLocaleString()}
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#1e293b",
                        }}>
                          {lead.city}
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#1e293b",
                          fontWeight: "500",
                        }}>
                          ₹{parseInt(lead.loan_requirement).toLocaleString()}
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                        }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "0.3rem 0.6rem",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            borderRadius: "9999px",
                            backgroundColor: 
                              lead.status === 'New' ? "rgba(59, 130, 246, 0.1)" :
                              lead.status === 'In Review' ? "rgba(245, 158, 11, 0.1)" :
                              lead.status === 'Approved' ? "rgba(16, 185, 129, 0.1)" : 
                              "rgba(239, 68, 68, 0.1)",
                            color: 
                              lead.status === 'New' ? "#3b82f6" :
                              lead.status === 'In Review' ? "#f59e0b" :
                              lead.status === 'Approved' ? "#10b981" : 
                              "#ef4444",
                            border: 
                              lead.status === 'New' ? "1px solid rgba(59, 130, 246, 0.2)" :
                              lead.status === 'In Review' ? "1px solid rgba(245, 158, 11, 0.2)" :
                              lead.status === 'Approved' ? "1px solid rgba(16, 185, 129, 0.2)" : 
                              "1px solid rgba(239, 68, 68, 0.2)",
                          }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                          color: "#64748b",
                        }}>
                          {formatDate(lead.created_at)}
                        </td>
                        <td style={{
                          padding: "1rem 1.25rem",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}>
                          <Link 
                            href={`/admin/lead-details/${lead.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "0.375rem",
                              backgroundColor: "#4f46e5",
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                              textDecoration: "none",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#4338ca";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#4f46e5";
                            }}
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
