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
    const fetchLeadData = async () => {
    setLoading(true);
    
    try {
        if (!id) {
          setError("Invalid lead ID");
          setLoading(false);
          return;
        }
        
        console.log("Fetching lead details for ID:", id);
        
        // First try to get the data from API
        try {
          console.log("Attempting to fetch from API");
          const apiLead = await getLead(id as string);
          console.log("API data received:", apiLead);
          console.log("Phone number from API:", apiLead.phone_number || apiLead.phoneNumber);
          
          if (apiLead) {
            const mappedLead = {
              id: apiLead.id,
              fullName: apiLead.full_name || apiLead.fullName || "Not provided",
              phoneNumber: apiLead.phone_number || apiLead.phoneNumber || "Not provided",
              email: apiLead.email || "Not provided",
              income: apiLead.income || "0",
              city: apiLead.city || "Not provided",
              state: apiLead.state || "Not provided", 
              loanAmount: apiLead.loan_requirement || apiLead.loanAmount || "0",
              status: apiLead.status || "Pending",
              agentName: apiLead.agent_name || apiLead.agentName || "Not provided",
              agentId: apiLead.agent_id || apiLead.agentId || "0",
              createdAt: apiLead.created_at || apiLead.createdAt || new Date().toISOString(),
              updatedAt: apiLead.updated_at || apiLead.updatedAt || new Date().toISOString(),
              panCard: apiLead.pan_card || apiLead.panCard || "Not provided",
              gender: apiLead.gender || "Not provided",
              dob: apiLead.dob || "Not provided", 
              address: apiLead.address || "Not provided",
              pincode: apiLead.pincode || "Not provided",
              employmentType: apiLead.employment_type || apiLead.employmentType || "Not provided",
              statusHistory: apiLead.status_history || apiLead.statusHistory || [
                {
                  status: "New",
                  date: apiLead.created_at || apiLead.createdAt || new Date().toISOString(),
                  by: "System",
                  notes: "Lead created"
                }
              ],
              notes: apiLead.notes || []
            };
            
            console.log("Setting lead data from API:", mappedLead);
            setLead(mappedLead);
            setNewStatus(mappedLead.status);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.error("API call failed:", apiError);
          // Continue to try localStorage as fallback
        }
        
        // If API call failed, use data from localStorage
        const storedName = localStorage.getItem(`lead_${id}_fullName`);
        console.log("Looking for data in localStorage, found name:", storedName);
        console.log("Phone number from localStorage:", localStorage.getItem(`lead_${id}_phoneNumber`));
        
        if (storedName) {
          // We have data in localStorage, use it
          const leadData = {
            id: parseInt(id as string),
            fullName: storedName,
            phoneNumber: localStorage.getItem(`lead_${id}_phoneNumber`) || "Not provided",
            email: localStorage.getItem(`lead_${id}_email`) || "Not provided",
            income: localStorage.getItem(`lead_${id}_income`) || "0",
            city: localStorage.getItem(`lead_${id}_city`) || "Not provided",
            state: localStorage.getItem(`lead_${id}_state`) || "Not provided",
            loanAmount: localStorage.getItem(`lead_${id}_loanAmount`) || "0",
            status: localStorage.getItem(`lead_${id}_status`) || "Pending",
            agentName: localStorage.getItem(`lead_${id}_agentName`) || "Not provided",
            agentId: localStorage.getItem(`lead_${id}_agentId`) || "0",
            createdAt: localStorage.getItem(`lead_${id}_createdAt`) || new Date().toISOString(),
            updatedAt: localStorage.getItem(`lead_${id}_updatedAt`) || new Date().toISOString(),
            panCard: localStorage.getItem(`lead_${id}_panCard`) || "Not provided",
            gender: localStorage.getItem(`lead_${id}_gender`) || "Not provided",
            dob: localStorage.getItem(`lead_${id}_dob`) || "Not provided",
            address: localStorage.getItem(`lead_${id}_address`) || "Not provided",
            pincode: localStorage.getItem(`lead_${id}_pincode`) || "Not provided",
            employmentType: localStorage.getItem(`lead_${id}_employmentType`) || "Not provided",
            statusHistory: [
              {
                status: "New",
                date: localStorage.getItem(`lead_${id}_createdAt`) || new Date().toISOString(),
                by: "Agent",
                notes: "Lead created"
              },
              {
                status: localStorage.getItem(`lead_${id}_status`) || "Pending",
                date: localStorage.getItem(`lead_${id}_updatedAt`) || new Date().toISOString(),
                by: "System",
                notes: "Status updated"
              }
            ],
            notes: []
          };
          
          console.log("Setting lead data from localStorage:", leadData);
          setLead(leadData);
          setNewStatus(leadData.status);
        } else {
          setError("Lead data not found. Please go back and try again.");
        }
      } catch (err) {
        console.error("Failed to load lead data:", err);
        setError("Failed to load lead data. Please try again.");
      } finally {
      setLoading(false);
    }
    };
    
    fetchLeadData();
    
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
        return styles.statusPending;
      case "Rejected":
        return styles.statusRejected;
      default:
        return {};
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format datetime for display
  const formatDateTime = (dateString: string) => {
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
      // Add to status history
      const now = new Date().toISOString();
      const newStatusEntry = {
        status: newStatus,
        date: now,
        by: "Admin",
        notes: newNote || `Status updated to ${newStatus}`
      };
      
      // Try to update status via API
      try {
        await updateLeadStatus(id, newStatus, newNote);
      } catch (apiError) {
        console.error("API update failed, using local update:", apiError);
      }
      
      // Update local state
      setLead({
        ...lead,
        status: newStatus,
        updatedAt: now,
        statusHistory: [newStatusEntry, ...lead.statusHistory]
      });
      
      // Update localStorage
      localStorage.setItem(`lead_${id}_status`, newStatus);
      localStorage.setItem(`lead_${id}_updatedAt`, now);
      
      // Clear note field after successful update
      setNewNote("");
      setSuccess("Lead status updated successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
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
          <p>Loading lead details...</p>
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
          <p>Lead not found</p>
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
          Lead #{lead.id} | Submitted by {lead.agentName} on {formatDate(lead.createdAt)}
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
                <div style={styles.detailValueLarge}>{lead.fullName}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Phone Number</div>
                <div style={styles.detailValue}>{lead.phone_number || lead.phoneNumber || "Not provided"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Email</div>
                <div style={styles.detailValue}>{lead.email}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>PAN Card</div>
                <div style={styles.detailValue}>{lead.panCard || "Not provided"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Gender</div>
                <div style={styles.detailValue}>{lead.gender || "Not provided"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Date of Birth</div>
                <div style={styles.detailValue}>{lead.dob ? formatDate(lead.dob) : "Not provided"}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Information Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Address Information</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Address</div>
                <div style={styles.detailValue}>{lead.address || "Not provided"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>City</div>
                <div style={styles.detailValue}>{lead.city}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>State</div>
                <div style={styles.detailValue}>{lead.state}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Pincode</div>
                <div style={styles.detailValue}>{lead.pincode || "Not provided"}</div>
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
                  ₹{parseInt(lead.income).toLocaleString('en-IN')}
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Employment Type</div>
                <div style={styles.detailValue}>{lead.employmentType || lead.employment_type || "Not provided"}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Loan Amount</div>
                <div style={styles.detailValueLarge}>
                  ₹{parseInt(lead.loanAmount || lead.loan_requirement || "0").toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Agent Information Card */}
        <div style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Agent Information</h2>
          </div>
          <div style={styles.sectionBody}>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Agent Name</div>
                <div style={styles.detailValue}>{lead.agentName}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Agent ID</div>
                <div style={styles.detailValue}>{lead.agentId}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Submission Date</div>
                <div style={styles.detailValue}>{formatDateTime(lead.createdAt)}</div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Last Updated</div>
                <div style={styles.detailValue}>{formatDateTime(lead.updatedAt)}</div>
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
              {lead.statusHistory && lead.statusHistory.map((history: any, index: number) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineDot}></div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineStatus}>
                      Status: <span style={{
                        color: 
                          history.status === "Approved" ? "#10b981" :
                          history.status === "Pending" ? "#f59e0b" :
                          history.status === "Rejected" ? "#ef4444" : 
                          "#4b5563"
                      }}>
                        {history.status}
                      </span>
                    </div>
                    <div style={styles.timelineDate}>
                      {formatDateTime(history.date)}
                    </div>
                    <div style={styles.timelineBy}>
                      By: {history.by}
                    </div>
                    {history.notes && (
                      <div style={{marginTop: "0.5rem", fontSize: "0.875rem", color: "#4b5563"}}>
                        {history.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(!lead.statusHistory || lead.statusHistory.length === 0) && (
                <div style={{padding: "1rem", color: "#6b7280", fontSize: "0.875rem"}}>
                  No status history available.
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
                    <option value="Pending">Pending</option>
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
        
        {/* Notes Card */}
        {lead.notes && lead.notes.length > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Notes</h2>
            </div>
            <div style={styles.sectionBody}>
              {lead.notes.map((note: any, index: number) => (
                <div key={index} style={styles.note}>
                  <div style={styles.noteText}>{note.text}</div>
                  <div style={styles.noteInfo}>
                    <span>By: {note.by}</span>
                    <span>{formatDateTime(note.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
          
          <button 
            style={{...styles.button}}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4338ca";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
            }}
            onClick={() => {
              // In a real app, navigate to edit page
              alert("Edit functionality would be implemented here");
            }}
          >
            Edit Lead
          </button>
        </div>
      </div>
    </div>
  );
} 