"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  buttonActive: {
    transform: "translateY(1px)"
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
  },
  otpContainer: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    marginTop: "1rem"
  },
  otpInput: {
    width: "3rem",
    height: "3rem",
    textAlign: "center" as const,
    fontSize: "1.25rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
    fontWeight: "600"
  },
  otpInputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
    backgroundColor: "#fff"
  },
  resendLink: {
    marginTop: "1rem",
    textAlign: "center" as const,
    color: "#4f46e5",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none"
  }
};

interface LoginFormProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginForm({ setIsLoggedIn }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (username && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo purposes, show OTP screen for valid credentials
        if ((username === "admin" && password === "admin") || 
            (username === "agent" && password === "agent")) {
          setLoading(false);
          setShowOtp(true);
          setSuccess("OTP sent to your registered mobile number");
          
          // Set a timer for resend
          setTimer(30);
          const interval = setInterval(() => {
            setTimer((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError("Invalid credentials");
          setLoading(false);
        }
      } else {
        setError("Please enter both username and password");
        setLoading(false);
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Take only the first digit
    setOtp(newOtp);
    
    // Auto-focus next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError("");
    
    const enteredOtp = otp.join("");
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check OTP - mock value is 123456
      if (enteredOtp === "123456") {
        if (username === "admin") {
          localStorage.setItem("authToken", "mock-token-admin");
          localStorage.setItem("userRole", "admin");
          setIsLoggedIn(true);
          router.push("/admin/dashboard");
        } else if (username === "agent") {
          localStorage.setItem("authToken", "mock-token-agent");
          localStorage.setItem("userRole", "agent");
          setIsLoggedIn(true);
          router.push("/agent/dashboard");
        }
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setOtpError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const resendOtp = () => {
    if (timer > 0) return;
    
    setSuccess("OTP resent to your registered mobile number");
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (showOtp) {
    return (
      <form onSubmit={handleOtpSubmit} style={styles.form}>
        {success && (
          <div style={styles.successMsg}>
            {success}
          </div>
        )}
        
        {otpError && (
          <div style={styles.errorMsg}>
            {otpError}
          </div>
        )}
        
        <div style={styles.inputGroup}>
          <label style={{...styles.label, textAlign: "center", marginBottom: "1rem"}}>
            Enter the 6-digit OTP sent to your mobile
          </label>
          
          <div style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedInput(`otp-${index}`)}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.otpInput,
                  ...(focusedInput === `otp-${index}` ? styles.otpInputFocus : {})
                }}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <div style={{...styles.resendLink, marginTop: "1.5rem", textAlign: "center"}}>
            {timer > 0 ? (
              <span style={{color: "#6b7280"}}>Resend OTP in {timer}s</span>
            ) : (
              <a onClick={resendOtp} style={{cursor: "pointer", color: "#4f46e5"}}>Resend OTP</a>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          style={{
            ...styles.button,
            ...(loading || otp.join("").length !== 6 ? styles.buttonDisabled : {})
          }}
          onMouseOver={(e) => {
            if (!loading && otp.join("").length === 6) {
              e.currentTarget.style.backgroundColor = "#4338ca";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#4f46e5";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && (
        <div style={styles.errorMsg}>
          {error}
        </div>
      )}
      
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
        <p style={{...styles.credentialText, marginTop: "0.75rem"}}>
          OTP: <span style={styles.credentialHighlight}>123456</span>
        </p>
      </div>
    </form>
  );
} 