"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";

// Custom styles for the form using inline CSS
const styles = {
  form: {
    width: "100%"
  },
  errorMsg: {
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    fontSize: "0.875rem",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    fontWeight: "500"
  },
  successMsg: {
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    fontSize: "0.875rem",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    fontWeight: "500"
  },
  inputGroup: {
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151"
  },
  input: {
    width: "100%",
    padding: "0.875rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontSize: "1rem",
    backgroundColor: "#f9fafb"
  },
  inputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
    backgroundColor: "#fff"
  },
  button: {
    width: "100%",
    padding: "0.875rem 1.5rem",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s, box-shadow 0.2s",
    fontSize: "0.925rem",
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  buttonHover: {
    backgroundColor: "#4338ca",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed"
  },
  demoCredentials: {
    marginTop: "2rem",
    textAlign: "center" as const,
    padding: "1.25rem",
    borderRadius: "8px",
    backgroundColor: "rgba(79, 70, 229, 0.05)",
    color: "#6b7280",
    fontSize: "0.875rem",
    border: "1px solid rgba(79, 70, 229, 0.1)"
  },
  credentialTitle: {
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#4b5563"
  },
  credentialText: {
    margin: "0.5rem 0",
    color: "#6b7280"
  },
  credentialHighlight: {
    fontWeight: "600",
    color: "#4f46e5"
  }
};

interface LoginFormProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginForm({ setIsLoggedIn }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    if (username && password) {
      const res = await login({ email: username, password });

      // Destructure properly
      const { token, user } = res;

      // Store data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName",  user.email); // fallback if full_name is null
      setIsLoggedIn(true);

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "agent") {
        router.push("/agent/dashboard");
      } else {
        router.push("/dashboard"); // fallback
      }
    } else {
      setError("Please enter both username and password");
    }
  } catch (err) {
    console.error(err);
    setError("Authentication failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.errorMsg}>{error}</div>}

      <div style={styles.inputGroup}>
        <label htmlFor="username" style={styles.label}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setFocusedInput("username")}
          onBlur={() => setFocusedInput(null)}
          style={{
            ...styles.input,
            ...(focusedInput === "username" ? styles.inputFocus : {})
          }}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="password" style={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
          style={{
            ...styles.input,
            ...(focusedInput === "password" ? styles.inputFocus : {})
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {})
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "#4338ca";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#4f46e5";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div style={styles.demoCredentials}>
        <p style={styles.credentialTitle}>Demo Credentials</p>
        <p style={styles.credentialText}>
          Admin: <span style={styles.credentialHighlight}>admin/admin</span>
        </p>
        <p style={styles.credentialText}>
          Agent: <span style={styles.credentialHighlight}>agent/agent</span>
        </p>
      </div>
    </form>
  );
}
