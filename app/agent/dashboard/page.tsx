"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getLeadsByUser } from "@/services/leadService";

// Define types for stats and leads
interface AgentStats {
  totalLeads: number;
  leadsPending: number;
  leadsApproved: number;
  leadsRejected: number;
  conversionRate: number;
  lastMonthLeads: number;
  thisMonthLeads: number;
}

interface RecentLead {
  id: number;
  fullName: string;
  createdAt: string;
  status: string;
  loanAmount: string;
  phoneNumber?: string;
  email?: string;
  city?: string;
  state?: string;
  income?: string;
}

// Styles for the dashboard
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
  greeting: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem"
  },
  subGreeting: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2rem"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)"
    },
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, 1fr)"
    }
  },
  statCard: {
    background: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    }
  },
  statHeading: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827"
  },
  statTrend: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
    marginTop: "0.5rem"
  },
  trendUp: {
    color: "#10b981"
  },
  trendDown: {
    color: "#ef4444"
  },
  sectionHeading: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1rem",
    marginTop: "2rem"
  },
  ctaCard: {
    background: "linear-gradient(to right, #4f46e5, #7e22ce)",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    marginBottom: "2rem"
  },
  ctaText: {
    fontSize: "1.25rem",
    fontWeight: "500"
  },
  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "white",
    color: "#4f46e5",
    fontWeight: "500",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    alignSelf: "flex-start"
  },
  recentLeadsCard: {
    background: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
  },
  recentLeadsHeader: {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewAllLink: {
    color: "#4f46e5",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const
  },
  th: {
    padding: "0.75rem 1.5rem",
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
  }
};

export default function AgentDashboard() {
  const router = useRouter();
  const [agent, setAgent] = useState({ name: "Agent" });
  const [stats, setStats] = useState<AgentStats>({
    totalLeads: 0,
    leadsPending: 0,
    leadsApproved: 0,
    leadsRejected: 0,
    conversionRate: 0,
    lastMonthLeads: 0,
    thisMonthLeads: 0
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!token || userRole !== "agent" || !userId) {
      router.push("/");
      return;
    }

    // Fetch agent name (if available)
    const agentName = localStorage.getItem("userName") || "Agent";
    setAgent({ name: agentName });

    // Fetch leads and calculate stats
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const apiLeads = await getLeadsByUser(userId);

        // Map API fields to dashboard format
        const mappedLeads = apiLeads.map((lead: any) => ({
          id: lead.id,
          fullName: lead.full_name,
          phoneNumber: lead.phone_number || lead.phoneNumber || "",
          email: lead.email || "",
          income: lead.income || "",
          city: lead.city || "",
          state: lead.state || "",
          createdAt: lead.created_at,
          status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
          loanAmount: lead.loan_requirement?.toString() ?? "",
        }));

        // Sort by createdAt descending
        mappedLeads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Stats calculation
        const totalLeads = mappedLeads.length;
        const leadsPending = mappedLeads.filter((l: any) => l.status === "Pending").length;
        const leadsApproved = mappedLeads.filter((l: any) => l.status === "Approved").length;
        const leadsRejected = mappedLeads.filter((l: any) => l.status === "Rejected").length;
        const conversionRate = totalLeads > 0 ? Math.round((leadsApproved / totalLeads) * 100) : 0;

        // Last month and this month leads
        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = (thisMonth === 0 ? 11 : thisMonth - 1);
        const thisYear = now.getFullYear();
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const thisMonthLeads = mappedLeads.filter((l: any) => {
          const d = new Date(l.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        const lastMonthLeads = mappedLeads.filter((l: any) => {
          const d = new Date(l.createdAt);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        }).length;

        setStats({
          totalLeads,
          leadsPending,
          leadsApproved,
          leadsRejected,
          conversionRate,
          lastMonthLeads,
          thisMonthLeads,
        });

        setRecentLeads(mappedLeads.slice(0, 4));
      } catch (error) {
        setStats({
          totalLeads: 0,
          leadsPending: 0,
          leadsApproved: 0,
          leadsRejected: 0,
          conversionRate: 0,
          lastMonthLeads: 0,
          thisMonthLeads: 0,
        });
        setRecentLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();

    // Responsive
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

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

  // Update handleViewLead function to match the mappedLeads format
  const handleViewLead = (lead: any) => {
    // Store lead data in localStorage before navigation
    localStorage.setItem(`lead_${lead.id}_fullName`, lead.fullName || "Unknown");
    localStorage.setItem(`lead_${lead.id}_phoneNumber`, lead.phoneNumber || "Not Available");
    localStorage.setItem(`lead_${lead.id}_email`, lead.email || "Not Available");
    localStorage.setItem(`lead_${lead.id}_income`, lead.income || "0");
    localStorage.setItem(`lead_${lead.id}_city`, lead.city || "Not Available");
    localStorage.setItem(`lead_${lead.id}_state`, lead.state || "Not Available");
    localStorage.setItem(`lead_${lead.id}_loanAmount`, lead.loanAmount || "0");
    localStorage.setItem(`lead_${lead.id}_status`, lead.status || "Pending");
    localStorage.setItem(`lead_${lead.id}_createdAt`, lead.createdAt || new Date().toISOString());
    localStorage.setItem(`lead_${lead.id}_updatedAt`, lead.updatedAt || lead.createdAt || new Date().toISOString());
    localStorage.setItem(`lead_${lead.id}_agentName`, localStorage.getItem("userName") || "Agent");
    localStorage.setItem(`lead_${lead.id}_agentId`, localStorage.getItem("userId") || "0");
    
    // Store default values for additional fields
    localStorage.setItem(`lead_${lead.id}_panCard`, lead.panCard || "ABCDE1234F");
    localStorage.setItem(`lead_${lead.id}_gender`, lead.gender || "Male");
    localStorage.setItem(`lead_${lead.id}_dob`, lead.dob || "1990-01-01");
    localStorage.setItem(`lead_${lead.id}_address`, lead.address || "123 Main Street, City Center");
    localStorage.setItem(`lead_${lead.id}_pincode`, lead.pincode || "500001");
    localStorage.setItem(`lead_${lead.id}_employmentType`, lead.employmentType || "Salaried");
    
    router.push(`/agent/lead-details/${lead.id}`);
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
          <p>Loading dashboard...</p>
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
          <h1 style={{...styles.greeting, fontSize: "1.75rem", fontWeight: "700", color: "#1e293b"}}>Welcome back, {agent.name}</h1>
          <p style={{...styles.subGreeting, color: "#64748b"}}>Here's an overview of your leads and performance</p>
        </div>
        
        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem"
        }}>
          {/* Total Leads Card */}
          <div style={{...styles.statCard, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", padding: "1.75rem"}}>
            <p style={{...styles.statHeading, color: "#64748b", fontWeight: "600"}}>
              <span style={{ fontSize: "1.25rem" }}>📊</span> Total Leads
            </p>
            <h3 style={{...styles.statValue, fontSize: "2.25rem", marginTop: "0.5rem"}}>
              {stats.totalLeads}
            </h3>
            <p style={{...styles.statTrend, ...styles.trendUp, marginTop: "0.75rem"}}>
              <span>↑</span> 33% from last month
            </p>
          </div>
          
          {/* Pending Leads Card */}
          <div style={{...styles.statCard, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", padding: "1.75rem"}}>
            <p style={{...styles.statHeading, color: "#64748b", fontWeight: "600"}}>
              <span style={{ fontSize: "1.25rem" }}>⏳</span> Pending Leads
            </p>
            <h3 style={{...styles.statValue, fontSize: "2.25rem", marginTop: "0.5rem"}}>
              {stats.leadsPending}
            </h3>
            <p style={{...styles.statTrend, ...styles.trendUp, marginTop: "0.75rem"}}>
              <span>•</span> Awaiting approval
            </p>
          </div>
          
          {/* Approved Leads Card */}
          <div style={{...styles.statCard, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", padding: "1.75rem"}}>
            <p style={{...styles.statHeading, color: "#64748b", fontWeight: "600"}}>
              <span style={{ fontSize: "1.25rem" }}>✅</span> Approved Leads
            </p>
            <h3 style={{...styles.statValue, fontSize: "2.25rem", marginTop: "0.5rem"}}>
              {stats.leadsApproved}
            </h3>
            <p style={{...styles.statTrend, ...styles.trendUp, marginTop: "0.75rem"}}>
              <span>↑</span> 50% from last month
            </p>
          </div>
          
          {/* Conversion Rate Card */}
          <div style={{...styles.statCard, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", padding: "1.75rem"}}>
            <p style={{...styles.statHeading, color: "#64748b", fontWeight: "600"}}>
              <span style={{ fontSize: "1.25rem" }}>🎯</span> Conversion Rate
            </p>
            <h3 style={{...styles.statValue, fontSize: "2.25rem", marginTop: "0.5rem"}}>
              {stats.conversionRate}%
            </h3>
            <p style={{...styles.statTrend, ...styles.trendUp, marginTop: "0.75rem"}}>
              <span>↑</span> 12% from last month
            </p>
          </div>
        </div>
        
        {/* CTA Card */}
        <div style={{...styles.ctaCard, 
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)",
          borderRadius: "0.75rem",
          padding: "2.25rem",
          marginTop: "0.75rem",
          marginBottom: "2.5rem"
        }}>
          <p style={{...styles.ctaText, fontSize: "1.35rem", fontWeight: "600"}}>
            Ready to add a new customer lead?
          </p>
          <Link href="/agent/submit-lead" style={{
            ...styles.ctaButton, 
            padding: "0.85rem 1.75rem", 
            borderRadius: "0.5rem",
            fontWeight: "600",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
          }}>
            <span>Submit New Lead</span>
            <span>→</span>
          </Link>
        </div>
        
        {/* Recent Leads */}
        <h2 style={{...styles.sectionHeading, 
          fontSize: "1.4rem", 
          fontWeight: "700", 
          color: "#1e293b",
          marginTop: "2.5rem",
          marginBottom: "1.25rem"
        }}>Recent Leads</h2>
        
        <div style={{...styles.recentLeadsCard, 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          borderRadius: "0.75rem"
        }}>
          <div style={{...styles.recentLeadsHeader, 
            padding: "1.25rem 1.75rem", 
            borderBottom: "1px solid #f1f5f9"
          }}>
            <h3 style={{ fontWeight: "600", color: "#1e293b" }}>Latest Submissions</h3>
            <Link href="/agent/lead-history" style={{
              ...styles.viewAllLink, 
              fontWeight: "600", 
              color: "#4f46e5"
            }}>
              View all leads →
            </Link>
          </div>
          
          <div style={{ overflowX: "auto" as const }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{...styles.th, 
                    padding: "1rem 1.75rem", 
                    color: "#64748b", 
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>Customer</th>
                  <th style={{...styles.th, 
                    padding: "1rem 1.75rem", 
                    color: "#64748b", 
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>Status</th>
                  <th style={{...styles.th, 
                    padding: "1rem 1.75rem", 
                    color: "#64748b", 
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>Loan Amount</th>
                  <th style={{...styles.th, 
                    padding: "1rem 1.75rem", 
                    color: "#64748b", 
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id}>
                    <td style={{...styles.td, padding: "1.25rem 1.75rem"}}>
                      <span style={{...styles.nameCell, fontWeight: "600"}}>{lead.fullName}</span>
                      <span style={styles.dateCell}>{formatDate(lead.createdAt)}</span>
                    </td>
                    <td style={{...styles.td, padding: "1.25rem 1.75rem"}}>
                      <span style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(lead.status),
                        padding: "0.35rem 0.85rem",
                        fontWeight: "600"
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{...styles.td, ...styles.amountCell, padding: "1.25rem 1.75rem"}}>
                      ₹{parseInt(lead.loanAmount).toLocaleString('en-IN')}
                    </td>
                    <td style={{...styles.td, padding: "1.25rem 1.75rem"}}>
                      <button 
                        onClick={() => handleViewLead(lead)}
                        style={{
                          color: "#4f46e5",
                          textDecoration: "none",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          fontSize: "inherit"
                        }}
                      >
                        View Details
                        <span style={{fontSize: "0.9rem"}}>→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 