"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getLead, updateLeadStatus } from "@/services/leadService";
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
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4f46e5",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none",
    marginBottom: "1.5rem",
    transition: "color 0.2s ease",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "2rem",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginLeft: "0.75rem",
  },
  statusApproved: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
  },
  statusPending: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#f59e0b",
  },
  statusRejected: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
  },
  statusNew: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
  },
  statusInReview: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#f59e0b",
  },
  card: {
    background: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  sectionHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  sectionBody: {
    padding: "1.5rem",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
  },
  detailItem: {
    marginBottom: "1rem",
  },
  detailLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#64748b",
    marginBottom: "0.5rem",
  },
  detailValue: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#1e293b",
  },
  detailValueLarge: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  timeline: {
    marginTop: "1rem",
  },
  timelineItem: {
    position: "relative" as const,
    paddingLeft: "2rem",
    paddingBottom: "1.5rem",
    borderLeft: "2px solid #e2e8f0",
  },
  timelineDot: {
    position: "absolute" as const,
    left: "-0.5rem",
    top: "0",
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)",
  },
  timelineContent: {
    padding: "0.75rem 1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
  },
  timelineStatus: {
    fontWeight: "600",
    color: "#1e293b",
  },
  timelineDate: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  timelineBy: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  statusUpdateForm: {
    marginTop: "1.5rem",
    padding: "1.25rem",
    backgroundColor: "#f8fafc",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#64748b",
    marginBottom: "0.5rem",
  },
  select: {
    display: "block",
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.875rem",
    color: "#1e293b",
    backgroundColor: "white",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: "right 0.5rem center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1.5em 1.5em",
    paddingRight: "2.5rem",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.875rem",
    color: "#1e293b",
    backgroundColor: "white",
    minHeight: "6rem",
    resize: "vertical" as const,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "500",
    fontSize: "0.875rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#4338ca",
  },
  notes: {
    marginTop: "1.5rem",
    padding: "1.25rem",
    backgroundColor: "#f8fafc",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
  },
  notesTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.75rem",
  },
  note: {
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    marginBottom: "0.75rem",
  },
  noteText: {
    fontSize: "0.875rem",
    color: "#1e293b",
  },
  noteInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.75rem",
    fontSize: "0.75rem",
    color: "#64748b",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  success: {
    color: "#10b981",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.625rem 1.25rem",
    backgroundColor: "white",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    fontWeight: "500",
    fontSize: "0.875rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s, border-color 0.2s",
  },
  alertButton: {
    backgroundColor: "#f8fafc",
    color: "#ef4444",
    borderColor: "#fca5a5",
  }
};

export default function LeadDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [newStatus, setNewStatus] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "admin") {
      router.push("/");
      return;
    }
    
    // Fetch lead data from API
    const fetchLead = async () => {
      setLoading(true);
      setError("");
      
      try {
        const leadData = await getLead(id);
        setLead(leadData);
        setNewStatus(leadData.status);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lead:", err);
        setError("Failed to load lead data");
        setLoading(false);
      }
    };
    
    fetchLead();
    
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
  }, [id, router]);

  // Get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return styles.statusApproved;
      case "Pending":
      case "In Review":
        return styles.statusInReview;
      case "Rejected":
        return styles.statusRejected;
      case "New":
        return styles.statusNew;
      default:
        return {};
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format datetime for display
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle status update form submission
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate form
    if (!newStatus) {
      setError("Please select a status");
      return;
    }
    
    try {
      // Send API request to update lead status
      await updateLeadStatus(id, newStatus, newNote);
      
      // Update local state with new status
      const now = new Date().toISOString();
      const adminName = localStorage.getItem("userName") || "Admin";
      
      const newStatusEntry = {
        status: newStatus,
        created_at: now,
        user_name: adminName,
        notes: newNote || `Status updated to ${newStatus}`
      };
      
      setLead({
        ...lead,
        status: newStatus,
        updated_at: now,
        status_history: [newStatusEntry, ...(lead.status_history || [])]
      });
      
      // Clear note field after successful update
      setNewNote("");
      setSuccess("Lead status updated successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update lead status");
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
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
            minHeight: "60vh"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{
                display: "inline-block",
                width: "2rem",
                height: "2rem",
                border: "3px solid #e2e8f0",
                borderTopColor: "#4f46e5",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading lead details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={{
          ...styles.container,
          marginLeft: isMobile ? "0" : "250px",
          width: isMobile ? "100%" : "calc(100% - 250px)"
        }}>
          <Link href="/admin/all-leads" style={styles.backLink}>
            ← Back to All Leads
          </Link>
          <div style={{
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            marginTop: "2rem"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#cbd5e1" }}>🔍</div>
            <h2 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>Lead Not Found</h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>The lead you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link href="/admin/all-leads" style={{
              ...styles.button,
              textDecoration: "none",
            }}>
              Return to All Leads
            </Link>
          </div>
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
        <Link href="/admin/all-leads" style={styles.backLink}>
          ← Back to All Leads
        </Link>
        
        <h1 style={styles.heading}>
          Lead Details
          <span style={{
            ...styles.statusBadge,
            ...getStatusStyle(lead.status)
          }}>
            {lead.status}
          </span>
        </h1>
        
        <p style={styles.subtitle}>
          Lead #{lead.id} | Submitted on {formatDate(lead.created_at)}
        </p>
        
        {/* Personal Information Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Full Name</div>
                <div style={styles.detailValueLarge}>{lead.full_name || lead.fullName || "N/A"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Phone Number</div>
                <div style={styles.detailValue}>{lead.phoneNumber || "N/A"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>{lead.email || "N/A"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Gender</div>
                <div style={styles.detailValue}>{lead.gender || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Information Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Location Information</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>City</div>
                <div style={styles.detailValue}>{lead.city || "N/A"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>State</div>
                <div style={styles.detailValue}>{lead.state || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial Information Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Financial Information</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Annual Income</div>
                <div style={styles.detailValueLarge}>
                  ₹{parseInt(lead.income || "0").toLocaleString('en-IN')}
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Loan Amount</div>
                <div style={styles.detailValueLarge}>
                  ₹{parseInt(lead.loan_requirement || lead.loanAmount || "0").toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status History Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Status History</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.timeline}>
              {lead.status_history && lead.status_history.length > 0 ? (
                lead.status_history.map((history: any, index: number) => (
                  <div key={index} style={styles.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineStatus}>
                        Status: <span style={{
                          color: 
                            history.status === "Approved" ? "#10b981" :
                            history.status === "In Review" ? "#f59e0b" :
                            history.status === "Rejected" ? "#ef4444" :
                            history.status === "New" ? "#3b82f6" : 
                            "#4b5563"
                        }}>
                          {history.status}
                        </span>
                      </div>
                      <div style={styles.timelineDate}>
                        {formatDateTime(history.created_at)}
                      </div>
                      <div style={styles.timelineBy}>
                        By: {history.user_name || "System"}
                      </div>
                      {history.notes && (
                        <div style={{marginTop: "0.5rem", fontSize: "0.875rem", color: "#4b5563"}}>
                          {history.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.875rem"
                }}>
                  No status history available
                </div>
              )}
            </div>
            
            {/* Status Update Form */}
            <div style={styles.statusUpdateForm}>
              <h3 style={{fontSize: "1rem", fontWeight: "600", color: "#1e293b", marginBottom: "1rem"}}>
                Update Lead Status
              </h3>
              
              <form onSubmit={handleUpdateStatus}>
                <div style={styles.formGroup}>
                  <label htmlFor="status" style={styles.label}>
                    Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="note" style={styles.label}>
                    Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this status update"
                    style={styles.textarea}
                  />
                </div>
                
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                
                <div style={{marginTop: "1rem"}}>
                  <button 
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#4338ca";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#4f46e5";
                    }}
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button 
            style={styles.secondaryButton}
            onClick={() => router.push('/admin/all-leads')}
          >
            Back to List
          </button>
          
          <button 
            style={{...styles.secondaryButton, color: "#4f46e5", borderColor: "#c7d2fe"}}
            onClick={() => window.print()}
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
} 