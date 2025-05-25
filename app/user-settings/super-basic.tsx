"use client"

import { useState } from "react"

export default function SuperBasicAddUser() {
  // Single state for current step
  const [step, setStep] = useState(1)

  // Function to move to step 2
  const goToStep2 = () => {
    console.log("Moving to step 2")
    setStep(2)
  }

  // Function to move back to step 1
  const goToStep1 = () => {
    console.log("Moving back to step 1")
    setStep(1)
  }

  return (
    <div
      style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Super Basic Add User Test</h1>

      {/* Current step indicator */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <strong>Current Step: {step}</strong>
      </div>

      {/* Step 1 Content */}
      {step === 1 && (
        <div style={{ border: "1px solid blue", padding: "20px", borderRadius: "8px" }}>
          <h2>Step 1: Verification</h2>
          <p>This is the verification step content.</p>
          <p>
            Enter OTP: <input type="text" placeholder="Enter 1234" />
          </p>
          <button
            onClick={goToStep2}
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Verify & Continue to Step 2
          </button>
        </div>
      )}

      {/* Step 2 Content */}
      {step === 2 && (
        <div style={{ border: "1px solid green", padding: "20px", borderRadius: "8px" }}>
          <h2>Step 2: Broker Details</h2>
          <p>This is the broker details step content.</p>
          <p>
            Broker: <input type="text" placeholder="Enter broker name" />
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              onClick={goToStep1}
              style={{
                backgroundColor: "gray",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Back to Step 1
            </button>
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
