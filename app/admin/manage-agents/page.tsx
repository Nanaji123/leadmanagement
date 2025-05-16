"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getAgents } from "@/services/agentService";

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: "0.5rem",
    marginBottom: "2rem",
  },
  card: {
    background: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    padding: "1rem 1.5rem",
    textAlign: "left" as const,
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "1rem 1.5rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    borderBottom: "1px solid #e5e7eb",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  statusActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
  },
  statusInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
  },
  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    border: "none",
    marginRight: "0.5rem",
  },
  editButton: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    color: "#4f46e5",
  },
  deleteButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
  },
  formWrapper: {
    padding: "1.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "2rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
  },
  input: {
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  select: {
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  cancelButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "white",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  submitButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  addAgentButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontWeight: "500",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "backgroundColor 0.2s ease",
  },
  searchBar: {
    display: "flex",
    margin: "1.5rem 0",
  },
  searchInput: {
    flex: "1",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.375rem 0 0 0.375rem",
    border: "1px solid #d1d5db",
    borderRight: "none",
    fontSize: "0.875rem",
  },
  searchButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0 0.375rem 0.375rem 0",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  successMessage: {
    color: "#10b981",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  filterBar: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "1rem",
    backgroundColor: "white",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  filterLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#4b5563",
  },
  filterSelect: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
    color: "#1f2937",
  },
  modal: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    color: "#6b7280",
    cursor: "pointer",
  },
  modalBody: {
    padding: "2rem",
  },
  modalFooter: {
    padding: "1.25rem 1.5rem",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  viewProfileButton: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    color: "#4f46e5",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s ease",
  },
  deleteModalContent: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
    padding: "1.5rem",
  },
  deleteModalTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  deleteModalMessage: {
    fontSize: "0.95rem",
    color: "#4b5563",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
  deleteModalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  cancelDeleteButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "white",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  confirmDeleteButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
  },
};

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch: string;
  joinDate: string;
  status: string;
  leadsGenerated: number;
  leadsConverted: number;
}

export default function ManageAgents() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  
  // For delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  
  // Form state for adding a new agent
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "Active",
    password: "",
    confirmPassword: "",
  });
  
  // Check authentication and fetch agents
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "admin") {
      router.push("/");
      return;
    }
    
    // Fetch agents from API
    setLoading(true);
    
    const fetchAgents = async () => {
      try {
        const fetchedAgents = await getAgents();
        setAgents(fetchedAgents);
        setFilteredAgents(fetchedAgents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to load agents data");
        setLoading(false);
      }
    };
    
    fetchAgents();
    
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
  
  // Filter agents when search term or status filter changes
  useEffect(() => {
    const filtered = agents.filter(agent => {
      const matchesSearch = searchTerm === "" || 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "" || agent.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredAgents(filtered);
  }, [agents, searchTerm, statusFilter]);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill all required fields");
      return;
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // In a real app, send API request to add new agent
    // Simulating API call and response
    try {
      // Create new agent object
      const newAgent: Agent = {
        id: Math.max(...agents.map(a => a.id), 0) + 1, // Generate new ID
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        branch: formData.branch,
        joinDate: formData.joinDate,
        status: formData.status,
        leadsGenerated: 0,
        leadsConverted: 0
      };
      
      // Add to the list
      setAgents(prev => [newAgent, ...prev]);
      
      // Reset form data
      setFormData({
        name: "",
        email: "",
        phone: "",
        branch: "",
        joinDate: new Date().toISOString().split("T")[0],
        status: "Active",
        password: "",
        confirmPassword: "",
      });
      
      // Show success message
      setSuccess("Agent added successfully");
      
      // Close modal
      setShowAddModal(false);
    } catch (err) {
      setError("Failed to add new agent");
    }
  };
  
  // Handle agent deletion
  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (!agentToDelete) return;
    
    // In a real app, send API request to delete agent
    // For demo, filter out the agent from the list
    setAgents(prev => prev.filter(a => a.id !== agentToDelete.id));
    
    // Close modal and reset
    setShowDeleteModal(false);
    setAgentToDelete(null);
    
    // Show success message (in a real app, you might want to display this in a toast)
    setSuccess(`Agent ${agentToDelete.name} has been deleted successfully`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Calculate conversion rate
  const getConversionRate = (generated: number, converted: number) => {
    if (generated === 0) return "0%";
    return `${Math.round((converted / generated) * 100)}%`;
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
          <p>Loading agents data...</p>
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
          <h1 style={styles.heading}>Manage Agents</h1>
          <button 
            style={styles.addAgentButton}
            onClick={() => setShowAddModal(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4338ca";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
            }}
          >
            <span>➕</span> Add New Agent
          </button>
        </div>
        
        <p style={styles.subtitle}>
          Manage your sales agents, track their performance, and add new team members.
        </p>
        
        {/* Success message */}
        {success && (
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>{success}</span>
          </div>
        )}
        
        {/* Search and Filters */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search agents by name, email, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button 
            style={styles.searchButton}
            onClick={() => {}} // Search is already handled by the useEffect
          >
            Search
          </button>
        </div>
        
        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        {/* Agents Table */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Agents List</h2>
            <span style={{fontSize: "0.875rem", color: "#6b7280"}}>
              {filteredAgents.length} agents found
            </span>
          </div>
          
          {filteredAgents.length === 0 ? (
            <div style={{padding: "2rem", textAlign: "center", color: "#6b7280"}}>
              No agents found matching your search criteria.
            </div>
          ) : (
            <div style={{overflowX: "auto"}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Agent</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Branch</th>
                    <th style={styles.th}>Join Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Performance</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map(agent => (
                    <tr key={agent.id}>
                      <td style={styles.td}>
                        <div style={{fontWeight: 600}}>{agent.name}</div>
                        <div style={{fontSize: "0.75rem", color: "#6b7280"}}>ID: {agent.id}</div>
                      </td>
                      <td style={styles.td}>
                        <div>{agent.email}</div>
                        <div>{agent.phone}</div>
                      </td>
                      <td style={styles.td}>{agent.branch}</td>
                      <td style={styles.td}>{formatDate(agent.joinDate)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(agent.status === "Active" ? styles.statusActive : styles.statusInactive)
                        }}>
                          {agent.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div>Leads: {agent.leadsGenerated}</div>
                        <div>Conversions: {agent.leadsConverted}</div>
                        <div>Rate: {getConversionRate(agent.leadsGenerated, agent.leadsConverted)}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
                          <Link 
                            href={`/agent/agentprofile?id=${agent.id}`}
                            style={styles.viewProfileButton}
                          >
                            👤 View Profile
                          </Link>
                          <div style={{display: "flex", justifyContent: "center"}}>
                            <button 
                              style={{...styles.actionButton, ...styles.deleteButton}}
                              title="Delete Agent"
                              onClick={() => handleDeleteClick(agent)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Add Agent Modal */}
        {showAddModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Add New Agent</h3>
                <button 
                  style={styles.modalCloseButton}
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div style={styles.modalBody}>
                <form onSubmit={handleSubmit}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Name <span style={{color: "#ef4444"}}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Email <span style={{color: "#ef4444"}}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Phone <span style={{color: "#ef4444"}}>*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter 10-digit phone number"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Branch</label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter branch name"
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Password <span style={{color: "#ef4444"}}>*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter password (min. 6 characters)"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Confirm Password <span style={{color: "#ef4444"}}>*</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Join Date</label>
                      <input
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  {error && <div style={styles.errorMessage}>{error}</div>}
                  {success && <div style={styles.successMessage}>{success}</div>}
                  
                  <div style={{...styles.formActions, marginTop: "2.5rem"}}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={styles.submitButton}
                    >
                      Add Agent
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && agentToDelete && (
          <div style={styles.modal}>
            <div style={styles.deleteModalContent}>
              <h3 style={styles.deleteModalTitle}>Confirm Delete</h3>
              <p style={styles.deleteModalMessage}>
                Are you sure you want to delete the agent <strong>{agentToDelete.name}</strong>? 
                This action cannot be undone.
              </p>
              <div style={styles.deleteModalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAgentToDelete(null);
                  }}
                  style={styles.cancelDeleteButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  style={styles.confirmDeleteButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }}
                >
                  Delete Agent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
