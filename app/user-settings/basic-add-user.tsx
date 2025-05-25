"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function BasicAddUser() {
  // Core state
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Debug state
  const [debugInfo, setDebugInfo] = useState("")

  // Form state
  const [phoneOtp, setPhoneOtp] = useState("")
  const [emailOtp, setEmailOtp] = useState("")

  // Reset function
  const resetDialog = () => {
    setCurrentStep(1)
    setPhoneOtp("")
    setEmailOtp("")
    setDebugInfo("")
  }

  // Handle dialog close
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetDialog()
    }
  }

  // Handle verification
  const handleVerify = () => {
    setDebugInfo(`Attempting verification with Phone OTP: ${phoneOtp}, Email OTP: ${emailOtp}`)

    // Simple verification - both OTPs must be "1234"
    if (phoneOtp === "1234" && emailOtp === "1234") {
      setDebugInfo((prev) => `${prev}\nVerification successful! Moving to step 2...`)
      setCurrentStep(2)
    } else {
      setDebugInfo((prev) => `${prev}\nVerification failed. Please use "1234" for both OTPs.`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Add User Test</h1>
      <p className="mb-4">This is a simplified test to ensure the step transition works properly.</p>

      <Button onClick={() => setOpen(true)}>Open Add User Dialog</Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStep === 1 ? "Step 1: Verification" : "Step 2: Broker Details"}</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div className="w-10 h-1 bg-gray-200"></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2 ? "bg-indigo-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            // Step 1 content
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone OTP</label>
                <Input
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter phone OTP (use 1234)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email OTP</label>
                <Input
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter email OTP (use 1234)"
                />
              </div>

              {/* Debug info */}
              {debugInfo && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap">{debugInfo}</div>
              )}
            </div>
          ) : (
            // Step 2 content
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800">✅ Verification successful! You are now on Step 2.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Broker</label>
                <select className="w-full p-2 border rounded">
                  <option>Zerodha</option>
                  <option>Upstox</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Broker ID</label>
                <Input placeholder="Enter broker ID" />
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 2) {
                    setCurrentStep(1)
                    setDebugInfo("Moved back to step 1")
                  } else {
                    setOpen(false)
                  }
                }}
              >
                {currentStep === 2 ? "Back" : "Cancel"}
              </Button>

              {currentStep === 1 ? (
                <Button onClick={handleVerify}>Verify & Continue</Button>
              ) : (
                <Button>Add User</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
