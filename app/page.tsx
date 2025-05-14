"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "2rem 1rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto",
    position: "relative" as const,
    overflow: "hidden" as const,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  backgroundDecoration: {
    position: "absolute" as const,
    top: "0",
    right: "0",
    width: "120px",
    height: "120px",
    background: "radial-gradient(circle at top right, rgba(79, 70, 229, 0.15), transparent 70%)",
    borderTopRightRadius: "1rem",
    zIndex: "0",
  },
  contentContainer: {
    position: "relative" as const,
    zIndex: "1",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    textAlign: "center" as const,
    color: "#111827",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "2.5rem",
    textAlign: "center" as const,
    lineHeight: "1.5",
  },
  logo: {
    fontSize: "3.5rem",
    marginBottom: "1.5rem",
    textAlign: "center" as const,
    background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "block",
  },
  footer: {
    marginTop: "2.5rem",
    fontSize: "0.875rem",
    textAlign: "center" as const,
    color: "#6b7280",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "1.5rem",
  },
  poweredBy: {
    fontWeight: "500",
    color: "#4f46e5",
  }
};

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (token) {
      setIsLoggedIn(true);
      
      // Redirect based on role
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "agent") {
        router.push("/agent/dashboard");
      }
    }
  }, [router]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.backgroundDecoration}></div>
        <div style={styles.contentContainer}>
          <div style={styles.logo}>📊</div>
          <h1 style={styles.title}>Lead Management System</h1>
          <p style={styles.subtitle}>Secure access to your dashboard</p>
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
          <div style={styles.footer}>
            <p>&copy; 2023 Lead Management System. <span style={styles.poweredBy}>Powered by NextJS</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
