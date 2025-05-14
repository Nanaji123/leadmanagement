"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

// Mock lead data (would come from API in real application)
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
    createdAt: "2023-08-10T10:30:00Z",
    panCard: "ABCDE1234F",
    gender: "Male",
    dob: "1985-05-15",
    address: "123 MG Road, Indiranagar",
    pincode: "560038",
    employmentType: "Salaried",
    notes: "Customer has good credit history and stable job.",
    statusHistory: [
      { status: "New", date: "2023-08-10T10:30:00Z", by: "John Doe (You)" },
      { status: "In Review", date: "2023-08-11T14:20:00Z", by: "Admin" },
      { status: "Approved", date: "2023-08-12T09:15:00Z", by: "Admin" }
    ]
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
    createdAt: "2023-08-08T14:15:00Z",
    panCard: "FGHIJ5678K",
    gender: "Female",
    dob: "1990-08-22",
    address: "456 Connaught Place",
    pincode: "110001",
    employmentType: "Business Owner",
    notes: "Customer has requested expedited processing.",
    statusHistory: [
      { status: "New", date: "2023-08-08T14:15:00Z", by: "John Doe (You)" },
      { status: "In Review", date: "2023-08-09T11:30:00Z", by: "Admin" }
    ]
  }
];

// Styles using inline CSS
const styles = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  container: {
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "1.5rem 2rem 1.5rem 3rem",
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    transition: "margin-left 0.3s ease, width 0.3s ease",
    backgroundColor: "#f8fafc",
    "@media (max-width: 1024px)": {
      marginLeft: "0",
      width: "100%",
    },
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem"
  },
  leadId: {
    fontSize: "0.875rem",
    color: "#6b7280"
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
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
  card: {
    background: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "1.5rem"
  },
  sectionHeading: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #e5e7eb"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "1.5rem",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)"
    },
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(3, 1fr)"
    }
  },
  infoGroup: {
    marginBottom: "1.5rem"
  },
  infoLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.25rem"
  },
  infoValue: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#111827"
  },
  notesHeading: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.75rem"
  },
  notes: {
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: "1.5",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.375rem",
    borderLeft: "4px solid #e5e7eb"
  },
  timeline: {
    position: "relative" as const,
    paddingLeft: "1.5rem"
  },
  timelineItem: {
    position: "relative" as const,
    paddingBottom: "1.5rem"
  },
  timelineLine: {
    position: "absolute" as const,
    left: "-1.5rem",
    top: "0.5rem",
    bottom: "0",
    width: "1px",
    backgroundColor: "#e5e7eb"
  },
  timelineDot: {
    position: "absolute" as const,
    left: "-1.75rem",
    top: "0.25rem",
    width: "0.75rem",
    height: "0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#4f46e5",
    border: "2px solid white"
  },
  timelineStatus: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#111827"
  },
  timelineDate: {
    fontSize: "0.75rem",
    color: "#6b7280"
  },
  timelineBy: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.25rem"
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem"
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4f46e5",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb",
    background: "white",
    textDecoration: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "background-color 0.2s, border-color 0.2s",
    cursor: "pointer",
    fontSize: "0.875rem"
  },
  printButton: {
    backgroundColor: "#f9fafb"
  },
  editButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    borderColor: "#4f46e5"
  },
  loading: {
    padding: "2rem",
    textAlign: "center" as const,
    color: "#6b7280"
  },
  error: {
    padding: "1.5rem",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem"
  }
};

interface StatusHistory {
  status: string;
  date: string;
  by: string;
}

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
  panCard: string;
  gender: string;
  dob: string;
  address: string;
  pincode: string;
  employmentType: string;
  notes?: string;
  statusHistory: StatusHistory[];
}

export default function LeadDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "agent") {
      router.push("/");
      return;
    }

    // Handle responsive behavior
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // In a real app, fetch lead from API
    // Using mock data for demo
    const fetchLead = () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          const leadId = parseInt(params.id);
          const foundLead = MOCK_LEADS.find(l => l.id === leadId);
          
          if (foundLead) {
            setLead(foundLead);
          } else {
            setError("Lead not found");
          }
          
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load lead details");
        setLoading(false);
      }
    };
    
    fetchLead();
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [params.id, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return styles.statusApproved;
      case "Pending":
      case "In Review":
        return styles.statusPending;
      case "Rejected":
        return styles.statusRejected;
      default:
        return {};
    }
  };

  const handlePrint = () => {
    window.print();
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
          <div style={styles.loading}>Loading lead details...</div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={{
          ...styles.container,
          marginLeft: isMobile ? "0" : "250px",
          width: isMobile ? "100%" : "calc(100% - 250px)"
        }}>
          <div style={styles.error}>{error || "Lead not found"}</div>
          <Link href="/agent/lead-history" style={styles.backLink}>
            <span>←</span> Back to Lead History
          </Link>
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
        <div style={styles.header}>
          <div>
            <h1 style={{...styles.heading, fontSize: "1.75rem", fontWeight: "700", color: "#1e293b"}}>Lead Details</h1>
            <p style={{...styles.leadId, color: "#64748b"}}>Lead ID: {lead.id}</p>
          </div>
          <div style={{...styles.statusBadge, ...getStatusStyle(lead.status)}}>
            {lead.status}
          </div>
        </div>
        
        {/* Personal Information */}
        <div style={{...styles.card, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)"}}>
          <h2 style={{...styles.sectionHeading, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem"}}>Personal Information</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem"
          }}>
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Full Name</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.fullName}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Phone Number</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.phoneNumber}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Email</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.email}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Gender</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.gender}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Date of Birth</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{formatDate(lead.dob)}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>PAN Card</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.panCard}</p>
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div style={{...styles.card, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", marginTop: "1.5rem"}}>
          <h2 style={{...styles.sectionHeading, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem"}}>Address Information</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem"
          }}>
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Address</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.address}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>City</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.city}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>State</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.state}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Pincode</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.pincode}</p>
            </div>
          </div>
        </div>
        
        {/* Financial Information */}
        <div style={{...styles.card, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", marginTop: "1.5rem"}}>
          <h2 style={{...styles.sectionHeading, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem"}}>Financial Information</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem"
          }}>
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Income</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>₹{parseInt(lead.income).toLocaleString('en-IN')}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Employment Type</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{lead.employmentType}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Loan Amount</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>₹{parseInt(lead.loanAmount).toLocaleString('en-IN')}</p>
            </div>
            
            <div style={styles.infoGroup}>
              <p style={{...styles.infoLabel, color: "#64748b", fontSize: "0.8rem", fontWeight: "500"}}>Submission Date</p>
              <p style={{...styles.infoValue, fontSize: "1rem", color: "#1e293b"}}>{formatDate(lead.createdAt)}</p>
            </div>
          </div>
          
          {lead.notes && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{...styles.notesHeading, fontSize: "1rem", color: "#1e293b", fontWeight: "600"}}>Notes</h3>
              <p style={{...styles.notes, backgroundColor: "#f8fafc", borderLeft: "4px solid #4f46e5", padding: "1.25rem"}}>{lead.notes}</p>
            </div>
          )}
        </div>
        
        {/* Status History */}
        <div style={{...styles.card, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", marginTop: "1.5rem"}}>
          <h2 style={{...styles.sectionHeading, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem"}}>Status History</h2>
          
          <div style={{...styles.timeline, paddingTop: "0.75rem"}}>
            {lead.statusHistory.map((history, index) => (
              <div key={index} style={{...styles.timelineItem, paddingLeft: "0.5rem"}}>
                {index < lead.statusHistory.length - 1 && (
                  <div style={{...styles.timelineLine, backgroundColor: "#e2e8f0"}}></div>
                )}
                <div style={{...styles.timelineDot, 
                  backgroundColor: "#4f46e5", 
                  boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)"
                }}></div>
                <p style={{...styles.timelineStatus, fontSize: "0.95rem", fontWeight: "600", color: "#1e293b"}}>{history.status}</p>
                <p style={{...styles.timelineDate, color: "#64748b"}}>{formatDateTime(history.date)}</p>
                <p style={{...styles.timelineBy, color: "#64748b"}}>By: {history.by}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div style={{...styles.actions, marginTop: "2rem", marginBottom: "0.5rem"}}>
          <button 
            onClick={handlePrint}
            style={{
              ...styles.actionButton, 
              ...styles.printButton,
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
              padding: "0.65rem 1.25rem",
              fontWeight: "600",
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)"
            }}
          >
            <span>🖨️</span> Print
          </button>
          
          <Link 
            href={`/agent/edit-lead/${lead.id}`}
            style={{
              ...styles.actionButton, 
              ...styles.editButton,
              backgroundColor: "#4f46e5",
              borderColor: "#4f46e5",
              padding: "0.65rem 1.25rem",
              fontWeight: "600",
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
              boxShadow: "0 3px 10px rgba(79, 70, 229, 0.3)"
            }}
          >
            <span>✏️</span> Edit Lead
          </Link>
        </div>
      </div>
    </div>
  );
} 