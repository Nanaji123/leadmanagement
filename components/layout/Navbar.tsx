"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Styles using inline CSS
const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "250px",
    background: "linear-gradient(180deg, #0f172a 0%, #131f38 100%)",
    color: "white",
    position: "fixed" as const,
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "3px 0 15px rgba(0, 0, 0, 0.15)",
  },
  sidebarCollapsed: {
    transform: "translateX(-250px)",
  },
  sidebarContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "700",
    fontSize: "1.25rem",
    color: "white",
    textDecoration: "none",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    letterSpacing: "0.02em",
  },
  navItems: {
    display: "flex",
    flexDirection: "column" as const,
    padding: "1.25rem 0.75rem",
    flexGrow: 1,
    overflowY: "auto" as const,
  },
  navSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    color: "#64748b",
    marginBottom: "0.75rem",
    paddingLeft: "0.75rem",
    letterSpacing: "0.05em",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.6rem 0.75rem",
    borderRadius: "0.4rem",
    fontSize: "0.825rem",
    fontWeight: "500",
    color: "#e2e8f0",
    textDecoration: "none",
    transition: "all 0.15s ease-in-out",
    marginBottom: "0.25rem",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  activeNavLink: {
    backgroundColor: "#3b4fe0",
    color: "#ffffff",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(59, 79, 224, 0.4)",
    backgroundImage: "linear-gradient(to right, #4f46e5, #3b4fe0)",
  },
  icon: {
    fontSize: "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.5rem",
  },
  logoutSection: {
    padding: "1rem 1.25rem 1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "0.4rem",
    fontSize: "0.825rem",
    fontWeight: "500",
    color: "white",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s ease-in-out",
    borderLeft: "2px solid rgba(239, 68, 68, 0.5)",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.85rem 1.25rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },
  avatar: {
    width: "2.25rem",
    height: "2.25rem",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5 0%, #3b4fe0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.9rem",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column" as const,
  },
  userName: {
    fontWeight: "600",
    fontSize: "0.825rem",
    letterSpacing: "0.01em",
  },
  userRole: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    opacity: 0.8,
  },
  main: {
    flexGrow: 1,
    marginLeft: "280px",
    transition: "margin-left 0.3s ease",
    width: "calc(100% - 280px)",
  },
  mainExpanded: {
    marginLeft: "0",
    width: "100%",
  },
  mobileToggle: {
    position: "fixed" as const,
    zIndex: 100,
    top: "1rem",
    left: "1rem",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "#1e293b",
    color: "white",
    cursor: "pointer",
    display: "none",
    opacity: 0.9,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 1024px)": {
      display: "block",
    },
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
  // Media queries have to be applied with custom logic in React
};

export default function Navbar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if screen is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check auth on component mount
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      
      // Set mock user name based on role
      if (role === "admin") {
        setUserName("Admin User");
      } else if (role === "agent") {
        setUserName("John Doe");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }

    // Handle responsive behavior
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to check if a link is active
  const isLinkActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  // Adjust main content when sidebar state changes
  useEffect(() => {
    // Find all container elements and update their style
    if (typeof document !== 'undefined') {
      const containers = document.querySelectorAll('[style*="container"]');
      containers.forEach((element) => {
        const container = element as HTMLElement;
        if (isSidebarOpen && !isMobile) {
          container.style.marginLeft = '250px';
          container.style.width = 'calc(100% - 250px)';
        } else {
          container.style.marginLeft = '0';
          container.style.width = '100%';
        }
      });
    }
  }, [isSidebarOpen, isMobile]);

  if (!isLoggedIn) return null;

  return (
    <div style={styles.layout}>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          style={styles.mobileToggle}
          aria-label="Toggle navigation"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      )}
      
      {/* Sidebar */}
      <aside 
        style={{
          ...styles.sidebar,
          ...(isMobile && !isSidebarOpen ? styles.sidebarCollapsed : {})
        }}
      >
        <div style={styles.sidebarContent}>
          {/* Brand/Logo */}
          <Link href="/" style={styles.brand}>
            <span>📊</span> Lead Management
          </Link>
          
          {/* User Info Section */}
          <div style={styles.userSection}>
            <div style={styles.avatar}>
              {userName.charAt(0)}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{userName}</span>
              <span style={styles.userRole}>
                {userRole === "admin" ? "Administrator" : "Sales Agent"}
              </span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <nav style={styles.navItems}>
            {userRole === "admin" && (
              <div style={styles.navSection}>
                <h3 style={styles.sectionTitle}>Administration</h3>
                
                <Link 
                  href="/admin/dashboard" 
                  style={{
                    ...styles.navLink,
                    ...(isLinkActive("/admin/dashboard") ? styles.activeNavLink : {})
                  }}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span style={styles.icon}>📈</span>
                  Dashboard
                </Link>
                
                <Link 
                  href="/admin/all-leads" 
                  style={{
                    ...styles.navLink,
                    ...(isLinkActive("/admin/all-leads") ? styles.activeNavLink : {})
                  }}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span style={styles.icon}>📋</span>
                  All Leads
                </Link>
                
                <Link 
                  href="/admin/manage-agents" 
                  style={{
                    ...styles.navLink,
                    ...(isLinkActive("/admin/manage-agents") ? styles.activeNavLink : {})
                  }}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span style={styles.icon}>👥</span>
                  Manage Agents
                </Link>
        
                <Link 
                  href="/admin/profile" 
                  style={{
                    ...styles.navLink,
                    ...(isLinkActive("/admin/profile") ? styles.activeNavLink : {})
                  }}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span style={styles.icon}>👤</span>
                  Profile
                </Link>
              </div>
            )}
            
            {userRole === "agent" && (
              <>
                <div style={styles.navSection}>
                  <h3 style={styles.sectionTitle}>Overview</h3>
                  
                  <Link 
                    href="/agent/dashboard" 
                    style={{
                      ...styles.navLink,
                      ...(isLinkActive("/agent/dashboard") ? styles.activeNavLink : {})
                    }}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span style={styles.icon}>📈</span>
                    Dashboard
                  </Link>
                </div>
                
                <div style={styles.navSection}>
                  <h3 style={styles.sectionTitle}>Lead Management</h3>
                  
                  <Link 
                    href="/agent/submit-lead" 
                    style={{
                      ...styles.navLink,
                      ...(isLinkActive("/agent/submit-lead") ? styles.activeNavLink : {})
                    }}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span style={styles.icon}>📝</span>
                    Submit New Lead
                  </Link>
                  
                  <Link 
                    href="/agent/lead-history" 
                    style={{
                      ...styles.navLink,
                      ...(isLinkActive("/agent/lead-history") ? styles.activeNavLink : {})
                    }}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span style={styles.icon}>📋</span>
                    Lead History
                  </Link>
                </div>
                
                <div style={styles.navSection}>
                  <h3 style={styles.sectionTitle}>Account</h3>
                  
                  <Link 
                    href="/agent/agentprofile" 
                    style={{
                      ...styles.navLink,
                      ...(isLinkActive("/agent/agentprofile") ? styles.activeNavLink : {})
                    }}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span style={styles.icon}>👤</span>
                    My Profile
                  </Link>
                </div>
              </>
            )}
          </nav>
          
          {/* Logout Button */}
          <div style={styles.logoutSection}>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              <span style={styles.icon}>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
} 