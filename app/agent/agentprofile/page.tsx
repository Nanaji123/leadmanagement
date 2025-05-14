"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

// CSS type declaration to fix type errors
type CSSProperties = React.CSSProperties;

// Mock user data for the agent profile page
const MOCK_AGENT_DATA = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  role: "agent",
  joinDate: "2023-01-15",
  employeeId: "AGT-2023-001",
  branch: "Mumbai Central",
  manager: "Rajesh Kumar",
  recentActivity: [
    { action: "Lead Submitted", date: "2023-08-10T10:30:00Z", details: "Anil Kumar (ID: 1)" },
    { action: "Lead Updated", date: "2023-08-08T14:15:00Z", details: "Sunita Sharma (ID: 2)" },
    { action: "Profile Updated", date: "2023-08-05T09:45:00Z", details: "Changed phone number" },
    { action: "Lead Approved", date: "2023-08-01T11:20:00Z", details: "Vikram Malhotra (ID: 3)" }
  ],
  performance: {
    totalLeads: 28,
    approvalRate: 64,
    conversionRate: 42,
    averageResponseTime: "2 days",
    ranking: 5,
    totalAgents: 25
  }
};

// Styles using inline CSS
const styles: Record<string, CSSProperties> = {
  pageWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  container: {
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "1.5rem 2rem",
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    transition: "margin-left 0.3s ease, width 0.3s ease",
    backgroundColor: "#f8fafc",
  },
  pageHeader: {
    marginBottom: "2rem",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "1.25rem",
  },
  title: {
    fontSize: "1.85rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "0.5rem",
    letterSpacing: "-0.015em",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    maxWidth: "750px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.25rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 3px 15px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04)",
    padding: "0",
    marginBottom: "1.25rem",
    transition: "box-shadow 0.3s ease, transform 0.2s ease",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.02)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  cardAction: {
    fontSize: "0.8rem",
    color: "#4f46e5",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem 1.25rem",
    borderBottom: "1px solid #f8fafc",
    background: "linear-gradient(to right, #f8fafc, #ffffff)",
  },
  avatar: {
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.75rem",
    marginRight: "1.5rem",
    boxShadow: "0 6px 15px rgba(79, 70, 229, 0.4)",
    border: "2px solid white",
  },
  profileInfo: {
    flex: "1",
  },
  profileName: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.35rem",
    letterSpacing: "-0.01em",
  },
  profileRole: {
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "0.75rem",
    boxShadow: "0 1px 3px rgba(79, 70, 229, 0.15)",
    border: "1px solid rgba(79, 70, 229, 0.15)",
  },
  profileDetail: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.35rem",
    color: "#64748b",
    fontSize: "0.85rem",
  },
  detailIcon: {
    marginRight: "0.5rem",
    width: "1rem",
    textAlign: "center" as const,
    color: "#4f46e5",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    margin: "0 1.25rem",
    padding: "1.25rem",
    backgroundColor: "#f8f9ff",
    borderRadius: "0.5rem",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
    marginBottom: "1.25rem",
  },
  infoItem: {
    marginBottom: "0.5rem",
  },
  infoLabel: {
    fontSize: "0.7rem",
    color: "#64748b",
    marginBottom: "0.2rem",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  infoValue: {
    fontSize: "0.95rem",
    color: "#1e293b",
    fontWeight: "600",
  },
  statItem: {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statValue: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "500",
  },
  rankingBar: {
    height: "0.5rem",
    backgroundColor: "#e9ecef",
    borderRadius: "9999px",
    overflow: "hidden",
    marginTop: "0.5rem",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.08)",
  },
  rankingProgress: {
    height: "100%",
    backgroundImage: "linear-gradient(to right, #4f46e5, #6366f1)",
    borderRadius: "9999px",
    boxShadow: "0 1px 2px rgba(79, 70, 229, 0.2)",
  },
  activityItem: {
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s ease",
    position: "relative",
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.35rem",
  },
  activityTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  activityDate: {
    fontSize: "0.75rem",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    padding: "0.2rem 0.5rem",
    borderRadius: "0.3rem",
  },
  activityDetails: {
    fontSize: "0.85rem",
    color: "#64748b",
    paddingLeft: "1.25rem",
  },
  settingsForm: {
    padding: "1.25rem",
  },
  formGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.4rem",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.85rem",
    fontSize: "0.85rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
  },
  inputFocus: {
    borderColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.12)",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.65rem 1.25rem",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "600",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.25s ease",
    fontSize: "0.85rem",
    marginTop: "1rem",
    boxShadow: "0 3px 8px rgba(79, 70, 229, 0.25)",
    background: "linear-gradient(to right, #4f46e5, #6366f1)",
  },
  buttonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 10px rgba(79, 70, 229, 0.35)",
  },
};

export default function AgentProfile() {
  const router = useRouter();
  const [agent, setAgent] = useState(MOCK_AGENT_DATA);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [viewingAsAdmin, setViewingAsAdmin] = useState(false);

  // Form state for settings
  const [settings, setSettings] = useState({
    email: MOCK_AGENT_DATA.email,
    phone: MOCK_AGENT_DATA.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationPreferences, setNotificationPreferences] = useState([
    {
      name: "Lead Updates",
      description: "Receive notifications when leads are updated or their status changes",
      enabled: true,
    },
    {
      name: "Approval Notifications",
      description: "Get notified when leads are approved or rejected",
      enabled: true,
    },
    {
      name: "Task Reminders",
      description: "Receive reminders for follow-ups and pending tasks",
      enabled: false,
    },
    {
      name: "Performance Reports",
      description: "Weekly summary of your performance metrics and achievements",
      enabled: true,
    },
  ]);

  // Check authentication and handle responsive behavior
  useEffect(() => {
    // Get agent ID from URL query parameter
    const queryParams = new URLSearchParams(window.location.search);
    const idFromQuery = queryParams.get('id');
    if (idFromQuery) {
      setAgentId(idFromQuery);
      console.log("Viewing agent with ID:", idFromQuery);
    }
    
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      router.push("/");
      return;
    }
    
    // Allow both agent (viewing own profile) and admin (viewing any agent)
    if (userRole === "admin") {
      setViewingAsAdmin(true);
    } else if (userRole !== "agent") {
      router.push("/");
      return;
    }
    
    // In a real app, fetch agent data from API
    // Using mock data for demo
    // If viewing a specific agent (admin view), this would fetch that agent's data
    setLoading(false);
    
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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update user settings via API
    alert("Settings updated successfully!");
  };

  const handleToggleNotification = (index: number) => {
    const updatedPreferences = [...notificationPreferences];
    updatedPreferences[index].enabled = !updatedPreferences[index].enabled;
    setNotificationPreferences(updatedPreferences);
    // In a real app, this would update user preferences via API
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={{
          ...styles.container,
          marginLeft: isMobile ? "0" : "280px",
          width: isMobile ? "100%" : "calc(100% - 280px)"
        }}>
          <p>Loading profile...</p>
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
        <div style={styles.pageHeader}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h1 style={styles.title}>Agent Profile</h1>
            {viewingAsAdmin && (
              <Link href="/admin/manage-agents" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: "#4f46e5",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
              }}>
                ← Back to Agents List
              </Link>
            )}
          </div>
          <p style={styles.subtitle}>
            {viewingAsAdmin 
              ? "View complete agent information and performance metrics" 
              : "Manage your personal information, account settings, notification preferences, and view your performance metrics"}
          </p>
        </div>
        
        {/* Profile Information */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span style={{fontSize: "1.1rem"}}>👤</span> Agent Information
            </h2>
          </div>
          
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
              {agent.name.charAt(0)}
            </div>
            
            <div style={styles.profileInfo}>
              <h3 style={styles.profileName}>{agent.name}</h3>
              <span style={styles.profileRole}>Sales Agent</span>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📧</span>
                {agent.email}
              </div>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📱</span>
                {agent.phone}
              </div>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📅</span>
                Joined on {formatDate(agent.joinDate)}
              </div>
            </div>
          </div>
          
          <div style={styles.infoGrid}>
            <div style={{
              ...styles.infoItem,
              backgroundColor: "#f5f7ff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e9ff",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)"
            }}>
              <div style={{...styles.infoLabel, color: "#4f46e5"}}>Employee ID</div>
              <div style={styles.infoValue}>{agent.employeeId}</div>
            </div>
            
            <div style={{
              ...styles.infoItem,
              backgroundColor: "#f5f7ff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e9ff",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)"
            }}>
              <div style={{...styles.infoLabel, color: "#4f46e5"}}>Branch</div>
              <div style={styles.infoValue}>{agent.branch}</div>
            </div>
            
            <div style={{
              ...styles.infoItem,
              backgroundColor: "#f5f7ff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e9ff", 
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)"
            }}>
              <div style={{...styles.infoLabel, color: "#4f46e5"}}>Reporting Manager</div>
              <div style={styles.infoValue}>{agent.manager}</div>
            </div>
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
          gap: "1.75rem"
        }}>
          <div>
            {/* Account Settings */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span style={{fontSize: "1.1rem"}}>⚙️</span> Account Settings
                </h2>
              </div>
              
              <form onSubmit={handleSettingsSubmit} style={styles.settingsForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleSettingsChange}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "email" ? styles.inputFocus : {})
                    }}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleSettingsChange}
                    onFocus={() => setFocusedInput("phone")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "phone" ? styles.inputFocus : {})
                    }}
                  />
                </div>
                
                <div style={{
                  padding: "1.25rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.5rem",
                  marginBottom: "1.25rem",
                  marginTop: "1rem",
                  border: "1px solid #eef2ff"
                }}>
                  <div style={{fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", marginBottom: "1rem"}}>Change Password</div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={settings.currentPassword}
                      onChange={handleSettingsChange}
                      onFocus={() => setFocusedInput("currentPassword")}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        ...styles.input,
                        ...(focusedInput === "currentPassword" ? styles.inputFocus : {})
                      }}
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleSettingsChange}
                      onFocus={() => setFocusedInput("newPassword")}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        ...styles.input,
                        ...(focusedInput === "newPassword" ? styles.inputFocus : {})
                      }}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div style={{...styles.formGroup, marginBottom: "0"}}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleSettingsChange}
                      onFocus={() => setFocusedInput("confirmPassword")}
                      onBlur={() => setFocusedInput(null)}
                      style={{
                        ...styles.input,
                        ...(focusedInput === "confirmPassword" ? styles.inputFocus : {})
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  style={styles.button}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(79, 70, 229, 0.35)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 3px 8px rgba(79, 70, 229, 0.25)";
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
                    transform: "skewX(-15deg)",
                    transformOrigin: "left top"
                  }}></div>
                  Save Changes
                </button>
              </form>
            </div>
            
            {/* Notification Preferences */}
            <div style={{...styles.card, marginTop: "1.25rem"}}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <span style={{fontSize: "0.9rem"}}>🔔</span> Notification Preferences
                </h2>
              </div>
              
              <div style={{padding: "1.25rem"}}>
                <p style={{color: "#64748b", fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: "1.5"}}>
                  Manage how you receive notifications and updates about your leads and activities.
                </p>
                
                {notificationPreferences.map((preference, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.9rem 1rem",
                    borderRadius: "0.5rem",
                    marginBottom: index < notificationPreferences.length - 1 ? "0.75rem" : 0,
                    backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                    border: "1px solid #eef2ff",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)"
                  }}>
                    <div style={{maxWidth: "75%"}}>
                      <div style={{fontWeight: "600", color: "#1e293b", marginBottom: "0.25rem", fontSize: "0.85rem"}}>{preference.name}</div>
                      <div style={{fontSize: "0.8rem", color: "#64748b", lineHeight: "1.4"}}>{preference.description}</div>
                    </div>
                    
                    <div style={{position: "relative", display: "inline-block", width: "2.75rem", height: "1.5rem"}}>
                      <input
                        type="checkbox"
                        checked={preference.enabled}
                        onChange={() => handleToggleNotification(index)}
                        style={{opacity: 0, width: 0, height: 0}}
                      />
                      <div 
                        onClick={() => handleToggleNotification(index)}
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: preference.enabled ? "#4f46e5" : "#e2e8f0",
                          transition: "all 0.3s ease",
                          borderRadius: "2rem",
                          boxShadow: preference.enabled ? "0 0 8px rgba(79, 70, 229, 0.3)" : "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div style={{
                          position: "absolute",
                          height: "1.1rem",
                          width: "1.1rem",
                          left: "0.2rem",
                          bottom: "0.2rem",
                          backgroundColor: "white",
                          transition: "all 0.3s ease",
                          borderRadius: "50%",
                          transform: preference.enabled ? "translateX(1.35rem)" : "translateX(0)",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)"
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            {/* Performance Metrics and Recent Activity */}
            <div style={{
              display: "grid",
              gridTemplateRows: "auto auto",
              gap: "1.75rem",
            }}>
              {/* Performance Metrics */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <span style={{fontSize: "0.9rem"}}>📊</span> Your Performance
                  </h2>
                </div>
                
                <div style={{...styles.statItem, borderLeft: "3px solid #4f46e5", margin: "0.5rem 0"}}>
                  <div>
                    <div style={styles.statLabel}>Total Leads Submitted</div>
                  </div>
                  <div style={{...styles.statValue, color: "#4f46e5"}}>{agent.performance.totalLeads}</div>
                </div>
                
                <div style={{...styles.statItem, borderLeft: "3px solid #10b981", margin: "0.5rem 0"}}>
                  <div>
                    <div style={styles.statLabel}>Approval Rate</div>
                  </div>
                  <div style={{...styles.statValue, color: "#10b981"}}>{agent.performance.approvalRate}%</div>
                </div>
                
                <div style={{...styles.statItem, borderLeft: "3px solid #f59e0b", margin: "0.5rem 0"}}>
                  <div>
                    <div style={styles.statLabel}>Conversion Rate</div>
                  </div>
                  <div style={{...styles.statValue, color: "#f59e0b"}}>{agent.performance.conversionRate}%</div>
                </div>
                
                <div style={{...styles.statItem, borderLeft: "3px solid #6366f1", borderBottom: "none", margin: "0.5rem 0"}}>
                  <div>
                    <div style={styles.statLabel}>Average Response Time</div>
                  </div>
                  <div style={{...styles.statValue, color: "#6366f1"}}>{agent.performance.averageResponseTime}</div>
                </div>
                
                <div style={{
                  padding: "1rem 1.25rem 0.75rem",
                  backgroundColor: "#f8fafc",
                  margin: "0.5rem 0 0",
                  borderTop: "1px solid #f1f5f9"
                }}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem"}}>
                    <div style={{...styles.statLabel, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em"}}>Ranking</div>
                    <div style={{...styles.statValue, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.4rem"}}>
                      <span style={{
                        padding: "0.15rem 0.4rem",
                        backgroundColor: "#4f46e5", 
                        color: "white", 
                        borderRadius: "0.25rem", 
                        fontSize: "0.85rem",
                        boxShadow: "0 1px 3px rgba(79, 70, 229, 0.25)"
                      }}>#{agent.performance.ranking}</span>
                      <span style={{fontSize: "0.8rem", color: "#64748b", fontWeight: "500"}}>of {agent.performance.totalAgents}</span>
                    </div>
                  </div>
                  <div style={styles.rankingBar}>
                    <div 
                      style={{
                        ...styles.rankingProgress,
                        width: `${100 - ((agent.performance.ranking / agent.performance.totalAgents) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <span style={{fontSize: "0.9rem"}}>🕒</span> Recent Activity
                  </h2>
                  <Link href="/agent/lead-history" style={{
                    ...styles.cardAction,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem"
                  }}>
                    View All
                    <span style={{fontSize: "0.85rem"}}>→</span>
                  </Link>
                </div>
                
                <div style={{maxHeight: "300px", overflowY: "auto"}}>
                  {agent.recentActivity.map((activity, index) => (
                    <div 
                      key={index} 
                      style={{
                        padding: "0.9rem 1.25rem",
                        borderBottom: index < agent.recentActivity.length - 1 ? "1px solid #f1f5f9" : "none",
                        position: "relative",
                        transition: "background-color 0.2s ease",
                        backgroundColor: "transparent"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        bottom: "0",
                        width: "3px",
                        backgroundColor: 
                          activity.action.includes("Approved") ? "#10b981" : 
                          activity.action.includes("Submitted") ? "#4f46e5" : 
                          activity.action.includes("Updated") ? "#f59e0b" : "#6366f1",
                      }}></div>
                      <div style={styles.activityHeader}>
                        <div style={{fontSize: "0.85rem", fontWeight: "600", color: "#1e293b"}}>{activity.action}</div>
                        <div style={{fontSize: "0.7rem", backgroundColor: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", color: "#64748b"}}>
                          {formatDateTime(activity.date)}
                        </div>
                      </div>
                      <div style={{fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem"}}>{activity.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 