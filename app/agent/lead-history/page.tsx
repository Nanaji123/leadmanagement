"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

// Mock data for lead history
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
    createdAt: "2023-08-10T10:30:00Z"
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
    createdAt: "2023-08-08T14:15:00Z"
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
    createdAt: "2023-08-05T09:45:00Z"
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
    createdAt: "2023-08-01T11:20:00Z"
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
    createdAt: "2023-07-28T10:30:00Z"
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
    createdAt: "2023-07-25T14:15:00Z"
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
    createdAt: "2023-07-20T09:45:00Z"
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
    createdAt: "2023-07-15T11:20:00Z"
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
  createdAt: string;
}

export default function LeadHistory() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
    city: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  
  const leadsPerPage = 5;

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "agent") {
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
    
    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      
      if (!isNaN(days)) {
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        result = result.filter(lead => new Date(lead.createdAt) >= cutoffDate);
      }
    }
    
    // Filter by city
    if (filters.city) {
      result = result.filter(lead => lead.city === filters.city);
    }
    
    setFilteredLeads(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, leads]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(leads.map(lead => lead.city)));

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
          <h1 style={{...styles.heading, fontSize: "1.75rem", fontWeight: "700", color: "#1e293b"}}>Lead History</h1>
          <p style={{...styles.subtitle, color: "#64748b"}}>View and manage all your submitted leads</p>
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
              <label style={styles.filterLabel}>Date Range</label>
              <select 
                name="dateRange" 
                value={filters.dateRange}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
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
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Loan Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Submission Date</th>
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
                        <Link 
                          href={`/agent/lead-details/${lead.id}`}
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
            <div style={styles.pagination}>
              <button 
                style={styles.pageButton}
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
                style={styles.pageButton}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              
              <span style={styles.pageText}>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 