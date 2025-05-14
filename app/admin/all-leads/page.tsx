"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

// Mock data for leads
const MOCK_LEADS = [
  {
    id: 1,
    fullName: "Anil Kumar",
    phoneNumber: "9876543210",
    email: "anil.kumar@example.com",
    income: "650000",
    city: "Bangalore",
    state: "Karnataka",
    loanAmount: "450000",
    status: "Approved",
    agentName: "Rahul Sharma",
    agentId: 101,
    createdAt: "2023-08-10T10:30:00Z",
    updatedAt: "2023-08-11T14:20:00Z"
  },
  {
    id: 2,
    fullName: "Sunita Sharma",
    phoneNumber: "8765432109",
    email: "sunita.sharma@example.com",
    income: "850000",
    city: "Delhi",
    state: "Delhi",
    loanAmount: "750000",
    status: "Pending",
    agentName: "Priya Patel",
    agentId: 102,
    createdAt: "2023-08-08T14:15:00Z",
    updatedAt: "2023-08-08T14:15:00Z"
  },
  {
    id: 3,
    fullName: "Vikram Malhotra",
    phoneNumber: "7654321098",
    email: "vikram.malhotra@example.com",
    income: "950000",
    city: "Mumbai",
    state: "Maharashtra",
    loanAmount: "550000",
    status: "Approved",
    agentName: "Amit Kumar",
    agentId: 103,
    createdAt: "2023-08-05T09:45:00Z",
    updatedAt: "2023-08-06T11:30:00Z"
  },
  {
    id: 4,
    fullName: "Meena Patel",
    phoneNumber: "6543210987",
    email: "meena.patel@example.com",
    income: "1200000",
    city: "Ahmedabad",
    state: "Gujarat",
    loanAmount: "1200000",
    status: "Rejected",
    agentName: "Rahul Sharma",
    agentId: 101,
    createdAt: "2023-08-01T11:20:00Z",
    updatedAt: "2023-08-02T09:15:00Z"
  },
  {
    id: 5,
    fullName: "Rajesh Khanna",
    phoneNumber: "9876543211",
    email: "rajesh.khanna@example.com",
    income: "750000",
    city: "Pune",
    state: "Maharashtra",
    loanAmount: "500000",
    status: "Approved",
    agentName: "Neha Gupta",
    agentId: 104,
    createdAt: "2023-07-28T10:30:00Z",
    updatedAt: "2023-07-29T15:45:00Z"
  },
  {
    id: 6,
    fullName: "Priya Singh",
    phoneNumber: "8765432108",
    email: "priya.singh@example.com",
    income: "850000",
    city: "Lucknow",
    state: "Uttar Pradesh",
    loanAmount: "600000",
    status: "Pending",
    agentName: "Vikram Singh",
    agentId: 105,
    createdAt: "2023-07-25T14:15:00Z",
    updatedAt: "2023-07-25T14:15:00Z"
  },
  {
    id: 7,
    fullName: "Mohan Reddy",
    phoneNumber: "7654321097",
    email: "mohan.reddy@example.com",
    income: "950000",
    city: "Hyderabad",
    state: "Telangana",
    loanAmount: "800000",
    status: "Rejected",
    agentName: "Amit Kumar",
    agentId: 103,
    createdAt: "2023-07-20T09:45:00Z",
    updatedAt: "2023-07-21T10:30:00Z"
  },
  {
    id: 8,
    fullName: "Ananya Das",
    phoneNumber: "6543210986",
    email: "ananya.das@example.com",
    income: "700000",
    city: "Kolkata",
    state: "West Bengal",
    loanAmount: "450000",
    status: "Approved",
    agentName: "Priya Patel",
    agentId: 102,
    createdAt: "2023-07-15T11:20:00Z",
    updatedAt: "2023-07-16T09:45:00Z"
  }
];

// Styles using inline CSS
const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc", // Light gray background for content area
  },
  container: {
    maxWidth: "1500px", // Increased from 1200px
    margin: "0 auto",
    padding: "1.5rem 2rem 1.5rem 3rem", // Added more left padding
    marginLeft: "250px", // Add margin for sidebar
    width: "calc(100% - 250px)", // Adjust width for sidebar
    transition: "margin-left 0.3s ease, width 0.3s ease",
    backgroundColor: "#f8fafc", // Light gray background
    "@media (max-width: 1024px)": {
      marginLeft: "0",
      width: "100%",
      padding: "1.5rem",
    },
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem"
  },
  card: {
    background: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  },
  filters: {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "1rem",
    alignItems: "center"
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem"
  },
  filterLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563"
  },
  filterSelect: {
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb",
    minWidth: "150px",
    outline: "none",
    color: "#111827"
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4f46e5",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none",
    marginBottom: "1rem"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },
  th: {
    padding: "1rem 1.5rem",
    textAlign: "left" as const,
    fontSize: "0.75rem",
    fontWeight: "500",
    textTransform: "uppercase" as const,
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb"
  },
  td: {
    padding: "1rem 1.5rem",
    fontSize: "0.875rem",
    color: "#111827",
    borderBottom: "1px solid #e5e7eb"
  },
  nameCell: {
    fontWeight: "500",
    color: "#111827",
    display: "block"
  },
  contactCell: {
    color: "#6b7280",
    fontSize: "0.75rem",
    display: "block",
    marginTop: "0.25rem"
  },
  dateCell: {
    color: "#6b7280",
    fontSize: "0.75rem"
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500"
  },
  statusApproved: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981"
  },
  statusPending: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#f59e0b"
  },
  statusRejected: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444"
  },
  amountCell: {
    fontWeight: "500"
  },
  viewLink: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1.5rem",
    alignItems: "center"
  },
  pageButton: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb",
    background: "white",
    fontSize: "0.875rem",
    cursor: "pointer"
  },
  activePageButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    borderColor: "#4f46e5"
  },
  pageText: {
    fontSize: "0.875rem",
    color: "#4b5563"
  },
  emptyState: {
    padding: "3rem 1.5rem",
    textAlign: "center" as const,
    color: "#6b7280"
  }
};

interface Lead {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  income: string;
  city: string;
  state: string;
  loanAmount: string;
  status: string;
  agentName: string;
  agentId: number;
  createdAt: string;
  updatedAt: string;
}

export default function AllLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
    dateFrom: "",
    dateTo: "",
    city: "",
    agent: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "admin") {
      router.push("/");
      return;
    }

    // In a real app, fetch leads from API
    // Using mock data for demo
    setLoading(false);
    setLeads(MOCK_LEADS);
    setFilteredLeads(MOCK_LEADS);
    
    // Handle responsive behavior
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [router]);

  // Apply filters to leads
  useEffect(() => {
    let result = [...leads];
    
    // Filter by status
    if (filters.status) {
      result = result.filter(lead => lead.status === filters.status);
    }
    
    // Filter by built-in date range
    if (filters.dateRange) {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      
      if (!isNaN(days)) {
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        result = result.filter(lead => new Date(lead.createdAt) >= cutoffDate);
      }
    }
    
    // Filter by custom date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(lead => new Date(lead.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(lead => new Date(lead.createdAt) <= toDate);
    }
    
    // Filter by city
    if (filters.city) {
      result = result.filter(lead => lead.city === filters.city);
    }
    
    // Filter by agent
    if (filters.agent) {
      result = result.filter(lead => lead.agentId.toString() === filters.agent);
    }
    
    setFilteredLeads(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, leads]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear the built-in date range if custom dates are used
    if (name === 'dateFrom' || name === 'dateTo') {
      setFilters(prev => ({
        ...prev,
        dateRange: "",
        [name]: value
      }));
    }
    // Clear custom date range if built-in range is used
    else if (name === 'dateRange' && value) {
      setFilters(prev => ({
        ...prev,
        dateFrom: "",
        dateTo: "",
        [name]: value
      }));
    }
    else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["ID", "Customer Name", "Phone", "Email", "Agent", "City", "State", "Income", "Loan Amount", "Status", "Date Created", "Last Updated"];
    const csvRows: string[][] = [headers];
    
    // Add data rows
    filteredLeads.forEach(lead => {
      const row = [
        String(lead.id),
        lead.fullName,
        lead.phoneNumber,
        lead.email,
        lead.agentName,
        lead.city,
        lead.state,
        `₹${parseInt(lead.income).toLocaleString('en-IN')}`,
        `₹${parseInt(lead.loanAmount).toLocaleString('en-IN')}`,
        lead.status,
        new Date(lead.createdAt).toLocaleDateString(),
        new Date(lead.updatedAt).toLocaleDateString()
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

  // Get unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(leads.map(lead => lead.city)));
  
  // Get unique agents for filter dropdown
  const uniqueAgents = Array.from(
    new Map(leads.map(lead => [lead.agentId, { id: lead.agentId, name: lead.agentName }])).values()
  );

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setLeadsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Pagination calculations
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return styles.statusApproved;
      case "Pending":
        return styles.statusPending;
      case "Rejected":
        return styles.statusRejected;
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={{
          ...styles.container,
          marginLeft: isMobile ? "0" : "250px",
          width: isMobile ? "100%" : "calc(100% - 250px)"
        }}>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={{
        ...styles.container,
        marginLeft: isMobile ? "0" : "250px",
        width: isMobile ? "100%" : "calc(100% - 250px)"
      }}>
        <div style={{marginBottom: "2rem"}}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h1 style={{...styles.heading, fontSize: "1.75rem", fontWeight: "700", color: "#1e293b", margin: 0}}>All Leads</h1>
            
            <button 
              onClick={exportToCSV}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#047857";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
            >
              <span>📊</span> Export to CSV
            </button>
          </div>
          <p style={{...styles.subtitle, color: "#64748b", margin: 0}}>Comprehensive view of all leads across agents</p>
          
          {/* Custom Date Range */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1.25rem",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}>
            <div style={{fontWeight: "500", color: "#4b5563", fontSize: "0.875rem"}}>Date Range:</div>
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <label style={{fontSize: "0.875rem", color: "#4b5563"}}>From:</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <label style={{fontSize: "0.875rem", color: "#4b5563"}}>To:</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            <div>
              <span style={{fontSize: "0.75rem", color: "#6b7280"}}>or</span>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <select
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                }}
              >
                <option value="">Preset Ranges</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{...styles.card, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"}}>
          {/* Filters */}
          <div style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select 
                name="status" 
                value={filters.status}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>City</label>
              <select 
                name="city" 
                value={filters.city}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Agent</label>
              <select 
                name="agent" 
                value={filters.agent}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Agents</option>
                {uniqueAgents.map(agent => (
                  <option key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Leads Table */}
          <div style={{ overflowX: "auto" as const }}>
            {currentLeads.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No leads found matching your filters.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Customer Details</th>
                    <th style={styles.th}>Agent</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Loan Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Updated</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeads.map(lead => (
                    <tr key={lead.id}>
                      <td style={styles.td}>
                        <span style={styles.nameCell}>{lead.fullName}</span>
                        <span style={styles.contactCell}>{lead.phoneNumber}</span>
                        <span style={styles.contactCell}>{lead.email}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{fontWeight: "500"}}>{lead.agentName}</span>
                        <span style={styles.contactCell}>ID: {lead.agentId}</span>
                      </td>
                      <td style={styles.td}>
                        <span>{lead.city}</span>
                        <span style={styles.contactCell}>{lead.state}</span>
                      </td>
                      <td style={{...styles.td, ...styles.amountCell}}>
                        ₹{parseInt(lead.loanAmount).toLocaleString('en-IN')}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(lead.status)
                        }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {formatDate(lead.createdAt)}
                      </td>
                      <td style={styles.td}>
                        {formatDate(lead.updatedAt)}
                      </td>
                      <td style={styles.td}>
                        <Link 
                          href={`/admin/lead-details/${lead.id}`}
                          style={styles.viewLink}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <div style={{
              ...styles.pagination,
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid #e5e7eb"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}>
                <span style={styles.pageText}>
                  Rows per page:
                </span>
                <select
                  value={leadsPerPage}
                  onChange={handleRowsPerPageChange}
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    backgroundColor: "white",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span style={styles.pageText}>
                  Showing {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length}
                </span>
              </div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <button 
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer"
                  }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    style={{
                      ...styles.pageButton,
                      ...(page === currentPage ? styles.activePageButton : {})
                    }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                  }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 