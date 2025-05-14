"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

// CSS type declaration to fix type errors
type CSSProperties = React.CSSProperties;

// Mock admin data for the profile page
const MOCK_ADMIN_DATA = {
  name: "Admin User",
  email: "admin@example.com",
  phone: "9876543210",
  role: "admin",
  joinDate: "2022-05-10",
  employeeId: "ADM-2022-001",
  department: "Sales Management",
  position: "Senior Administrator",
  recentActivity: [
    { action: "Agent Added", date: "2023-08-11T14:30:00Z", details: "Added new agent: Ravi Sharma" },
    { action: "Lead Approved", date: "2023-08-10T16:15:00Z", details: "Approved lead ID: 5" },
    { action: "System Update", date: "2023-08-09T09:30:00Z", details: "Updated lead workflow system" },
    { action: "Report Generated", date: "2023-08-07T11:20:00Z", details: "Monthly performance report" }
  ],
  systemStats: {
    totalAgents: 25,
    activeAgents: 22,
    totalLeadsMonth: 342,
    conversionRateMonth: 38,
    pendingApprovals: 14,
    systemUptime: "99.8%"
  }
};

// Styles using inline CSS
const styles: Record<string, CSSProperties> = {
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
  pageHeader: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.875rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  cardAction: {
    fontSize: "0.875rem",
    color: "#4f46e5",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    padding: "1rem 0",
  },
  avatar: {
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
    backgroundColor: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginRight: "1.5rem",
  },
  profileInfo: {
    flex: "1",
  },
  profileName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  profileRole: {
    backgroundColor: "#faf5ff",
    color: "#7c3aed",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "0.5rem",
  },
  profileDetail: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.25rem",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  detailIcon: {
    marginRight: "0.5rem",
    width: "1rem",
    textAlign: "center" as const,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginTop: "1rem",
  },
  infoItem: {
    marginBottom: "0.5rem",
  },
  infoLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
  },
  infoValue: {
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: "500",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  statLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  statTrend: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5rem",
    fontSize: "0.75rem",
  },
  trendUp: {
    color: "#10b981",
    display: "flex",
    alignItems: "center",
  },
  trendDown: {
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
  },
  activityItem: {
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.25rem",
  },
  activityTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#111827",
  },
  activityDate: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  activityDetails: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  settingsForm: {
    marginTop: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
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
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
    fontSize: "0.875rem",
  },
  inputFocus: {
    borderColor: "#7c3aed",
    boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.15)",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#7c3aed",
    color: "white",
    fontWeight: "500",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    fontSize: "0.875rem",
    marginTop: "1rem",
    boxShadow: "0 2px 5px rgba(124, 58, 237, 0.3)",
  },
  buttonHover: {
    backgroundColor: "#6d28d9",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(124, 58, 237, 0.4)",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#7c3aed",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none",
    marginBottom: "1rem",
  },
  permissionsHeading: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1rem",
  },
  permissionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  permissionName: {
    fontSize: "0.875rem",
    color: "#111827",
  },
  permissionDescription: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.25rem",
  },
  switch: {
    position: "relative" as const,
    display: "inline-block",
    width: "3rem",
    height: "1.5rem",
  },
  slider: {
    position: "absolute" as const,
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e5e7eb",
    transition: "0.4s",
    borderRadius: "9999px",
  },
  sliderActive: {
    backgroundColor: "#7c3aed",
  },
  sliderBefore: {
    position: "absolute" as const,
    content: '""',
    height: "1rem",
    width: "1rem",
    left: "0.25rem",
    bottom: "0.25rem",
    backgroundColor: "white",
    transition: "0.4s",
    borderRadius: "50%",
  },
  sliderBeforeActive: {
    transform: "translateX(1.5rem)",
  },
};

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState(MOCK_ADMIN_DATA);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Permission switches state
  const [permissions, setPermissions] = useState({
    manageAgents: true,
    approveLeads: true,
    viewReports: true,
    systemSettings: true,
  });

  // Form state for settings
  const [settings, setSettings] = useState({
    email: MOCK_ADMIN_DATA.email,
    phone: MOCK_ADMIN_DATA.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check authentication and handle responsive behavior
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "admin") {
      router.push("/");
      return;
    }
    
    // In a real app, fetch admin data from API
    // Using mock data for demo
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

  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
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
        marginLeft: isMobile ? "0" : "280px",
        width: isMobile ? "100%" : "calc(100% - 280px)"
      }}>
        <div style={styles.pageHeader}>
          <h1 style={styles.title}>Admin Profile</h1>
          <p style={styles.subtitle}>Manage your administrative profile, settings, and permissions</p>
        </div>
        
        {/* Admin Information */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span>👑</span> Administrator Information
            </h2>
          </div>
          
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
              {admin.name.charAt(0)}
            </div>
            
            <div style={styles.profileInfo}>
              <h3 style={styles.profileName}>{admin.name}</h3>
              <span style={styles.profileRole}>System Administrator</span>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📧</span>
                {admin.email}
              </div>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📱</span>
                {admin.phone}
              </div>
              
              <div style={styles.profileDetail}>
                <span style={styles.detailIcon}>📅</span>
                Administrator since {formatDate(admin.joinDate)}
              </div>
            </div>
          </div>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Employee ID</div>
              <div style={styles.infoValue}>{admin.employeeId}</div>
            </div>
            
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Department</div>
              <div style={styles.infoValue}>{admin.department}</div>
            </div>
            
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Position</div>
              <div style={styles.infoValue}>{admin.position}</div>
            </div>
          </div>
        </div>
        
        {/* System Stats */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <span>📊</span> System Stats
            </h2>
            <Link href="/admin/dashboard" style={styles.cardAction}>
              View Detailed Analytics
            </Link>
          </div>
          
          <div style={{
            ...styles.statsGrid,
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"
          }}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.totalAgents}</div>
              <div style={styles.statLabel}>Total Agents</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 2 this month</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.activeAgents}</div>
              <div style={styles.statLabel}>Active Agents</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 3 this week</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.totalLeadsMonth}</div>
              <div style={styles.statLabel}>Total Leads This Month</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 8% from last month</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.conversionRateMonth}%</div>
              <div style={styles.statLabel}>Conversion Rate</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ 2% from last month</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.pendingApprovals}</div>
              <div style={styles.statLabel}>Pending Approvals</div>
              <div style={styles.statTrend}>
                <span style={styles.trendDown}>↓ Needs attention</span>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{admin.systemStats.systemUptime}</div>
              <div style={styles.statLabel}>System Uptime</div>
              <div style={styles.statTrend}>
                <span style={styles.trendUp}>↑ Stable</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "1.5rem"
        }}>
          {/* Account Settings */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <span>⚙️</span> Account Settings
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
              
              <div style={styles.formGroup}>
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
              
              <button type="submit" style={styles.button}>
                Save Changes
              </button>
            </form>
          </div>
          
          {/* Admin Permissions */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <span>🔒</span> Admin Permissions
              </h2>
            </div>
            
            <div style={styles.permissionsHeading}>
              Configure your access rights and permissions
            </div>
            
            <div style={styles.permissionItem}>
              <div>
                <div style={styles.permissionName}>Manage Agents</div>
                <div style={styles.permissionDescription}>Add, edit, and deactivate agent accounts</div>
              </div>
              <div style={styles.switch} onClick={() => togglePermission("manageAgents")}>
                <div style={{
                  ...styles.slider,
                  ...(permissions.manageAgents ? styles.sliderActive : {}),
                }}>
                  <div style={{
                    ...styles.sliderBefore,
                    ...(permissions.manageAgents ? styles.sliderBeforeActive : {}),
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.permissionItem}>
              <div>
                <div style={styles.permissionName}>Approve Leads</div>
                <div style={styles.permissionDescription}>Review and approve lead submissions</div>
              </div>
              <div style={styles.switch} onClick={() => togglePermission("approveLeads")}>
                <div style={{
                  ...styles.slider,
                  ...(permissions.approveLeads ? styles.sliderActive : {}),
                }}>
                  <div style={{
                    ...styles.sliderBefore,
                    ...(permissions.approveLeads ? styles.sliderBeforeActive : {}),
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.permissionItem}>
              <div>
                <div style={styles.permissionName}>View Reports</div>
                <div style={styles.permissionDescription}>Access all system reports and analytics</div>
              </div>
              <div style={styles.switch} onClick={() => togglePermission("viewReports")}>
                <div style={{
                  ...styles.slider,
                  ...(permissions.viewReports ? styles.sliderActive : {}),
                }}>
                  <div style={{
                    ...styles.sliderBefore,
                    ...(permissions.viewReports ? styles.sliderBeforeActive : {}),
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.permissionItem}>
              <div>
                <div style={styles.permissionName}>System Settings</div>
                <div style={styles.permissionDescription}>Modify system configuration and settings</div>
              </div>
              <div style={styles.switch} onClick={() => togglePermission("systemSettings")}>
                <div style={{
                  ...styles.slider,
                  ...(permissions.systemSettings ? styles.sliderActive : {}),
                }}>
                  <div style={{
                    ...styles.sliderBefore,
                    ...(permissions.systemSettings ? styles.sliderBeforeActive : {}),
                  }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <span>🕒</span> Recent Activity
              </h2>
              <Link href="/admin/activity-log" style={styles.cardAction}>
                View All
              </Link>
            </div>
            
            {admin.recentActivity.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityHeader}>
                  <div style={styles.activityTitle}>{activity.action}</div>
                  <div style={styles.activityDate}>{formatDateTime(activity.date)}</div>
                </div>
                <div style={styles.activityDetails}>{activity.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 