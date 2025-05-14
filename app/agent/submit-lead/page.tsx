"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

// CSS type declaration to fix type errors
type CSSProperties = React.CSSProperties;

// Styles using inline CSS
const styles: Record<string, CSSProperties | any> = {
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
  formCard: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    padding: "2rem",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
  },
  errorMessage: {
    padding: "1rem",
    marginBottom: "1.5rem",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    borderRadius: "0.5rem",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  successMessage: {
    padding: "1rem",
    marginBottom: "1.5rem",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    borderRadius: "0.5rem",
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  fullWidthField: {
    gridColumn: "1 / -1",
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
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },
  select: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
    fontSize: "0.875rem",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: "right 0.5rem center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1.5em 1.5em",
    paddingRight: "2.5rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "white",
    fontSize: "0.875rem",
    minHeight: "100px",
    resize: "vertical",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4f46e5",
    color: "white",
    fontWeight: "500",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
  },
  buttonHover: {
    backgroundColor: "#4338ca",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4f46e5",
    fontSize: "0.875rem",
    fontWeight: "500",
    textDecoration: "none",
    marginBottom: "1rem",
  },
  requiredField: {
    color: "#ef4444",
    marginLeft: "0.25rem",
  },
  formSection: {
    marginBottom: "2rem",
  },
  formSectionTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#4f46e5",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }
};

export default function SubmitLead() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Form fields state
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    income: "",
    panCard: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    employmentType: "",
    loanRequirement: ""
  });

  // Check authentication and handle responsive behavior
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "agent") {
      router.push("/");
    }
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePAN = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate required fields
    const requiredFields = ["fullName", "phoneNumber", "email", "income", "panCard", "gender", "dob"];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        setLoading(false);
        return;
      }
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phoneNumber)) {
      setError("Please enter a valid 10 digit phone number");
      setLoading(false);
      return;
    }

    // Validate PAN
    if (!validatePAN(formData.panCard)) {
      setError("Please enter a valid PAN card number (e.g. ABCDE1234F)");
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would be an API call to submit the lead
      // Mocking API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        income: "",
        panCard: "",
        gender: "",
        dob: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        employmentType: "",
        loanRequirement: ""
      });
      
    } catch (err) {
      setError("Failed to submit lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={{
        ...styles.container,
        marginLeft: isMobile ? "0" : "280px",
        width: isMobile ? "100%" : "calc(100% - 280px)"
      }}>
        
        <div style={styles.formCard}>
          <h1 style={styles.heading}>Submit New Lead</h1>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={styles.successMessage}>
              Lead submitted successfully! The lead has been added to your leads list.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>
                <span>👤</span> Personal Information
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem"
              }}>
                <div>
                  <label style={styles.label}>
                    Full Name<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("fullName")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "fullName" ? styles.inputFocus : {})
                    }}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>
                    Phone Number<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("phoneNumber")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "phoneNumber" ? styles.inputFocus : {})
                    }}
                    placeholder="10 digit number"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>
                    Email<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "email" ? styles.inputFocus : {})
                    }}
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>
                    PAN Card<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("panCard")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "panCard" ? styles.inputFocus : {})
                    }}
                    placeholder="e.g. ABCDE1234F"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>
                    Gender<span style={styles.requiredField}>*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("gender")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.select,
                      ...(focusedInput === "gender" ? styles.inputFocus : {})
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label style={styles.label}>
                    Date of Birth<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("dob")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "dob" ? styles.inputFocus : {})
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Address Information Section */}
            <div style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>
                <span>📍</span> Address Information
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem"
              }}>
                <div style={{ gridColumn: isMobile ? "1" : "1 / span 2" }}>
                  <label style={styles.label}>Address</label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("address")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.textarea,
                      ...(focusedInput === "address" ? styles.inputFocus : {})
                    }}
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("city")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "city" ? styles.inputFocus : {})
                    }}
                  />
                </div>
                
                <div>
                  <label style={styles.label}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("state")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "state" ? styles.inputFocus : {})
                    }}
                  />
                </div>
                
                <div>
                  <label style={styles.label}>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("pincode")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "pincode" ? styles.inputFocus : {})
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Financial Information Section */}
            <div style={styles.formSection}>
              <h2 style={styles.formSectionTitle}>
                <span>💸</span> Financial Information
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem"
              }}>
                <div>
                  <label style={styles.label}>
                    Income (₹)<span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("income")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "income" ? styles.inputFocus : {})
                    }}
                    placeholder="Annual income"
                  />
                </div>
                
                <div>
                  <label style={styles.label}>Employment Type</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("employmentType")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.select,
                      ...(focusedInput === "employmentType" ? styles.inputFocus : {})
                    }}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                
                <div>
                  <label style={styles.label}>Loan Requirement (₹)</label>
                  <input
                    type="number"
                    name="loanRequirement"
                    value={formData.loanRequirement}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput("loanRequirement")}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...styles.input,
                      ...(focusedInput === "loanRequirement" ? styles.inputFocus : {})
                    }}
                    placeholder="Requested loan amount"
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.buttonContainer}>
              <Link 
                href="/agent/dashboard"
                style={{
                  ...styles.button,
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563"
                }}
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
              >
                {loading ? "Submitting..." : "Submit Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 