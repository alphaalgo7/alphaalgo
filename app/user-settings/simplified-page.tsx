"use client"

import { useState } from "react"
import { UserPlus, RefreshCw, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function SimplifiedUserSettingsPage() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [addUserStep, setAddUserStep] = useState(1) // 1 for verification, 2 for broker details
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)

  const [newUser, setNewUser] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    phoneOtp: "",
    emailOtp: "",
    phoneVerified: false,
    emailVerified: false,
    broker: "Zerodha",
    brokerId: "",
    brokerPassword: "",
    apiKey: "",
    apiSecret: "",
  })

  const handleNewUserInputChange = (field: string, value: any) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const sendPhoneOtp = () => {
    if (!newUser.phoneNumber || newUser.phoneNumber.length !== 10) {
      toast({
        title: "Invalid phone number format",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    // Simulate OTP sending
    setPhoneOtpSent(true)
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your phone. Please enter it to verify.",
    })
  }

  const sendEmailOtp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Simulate OTP sending
    setEmailOtpSent(true)
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email. Please enter it to verify.",
    })
  }

  const verifyAndProceed = () => {
    setIsVerifying(true)

    // Add a console log for debugging
    console.log("Verifying OTPs:", newUser.phoneOtp, newUser.emailOtp)

    // Simplified verification logic
    if (newUser.phoneOtp !== "1234") {
      toast({
        title: "Phone OTP did not match",
        description: "Please check the OTP sent to your phone. For testing, use '1234'.",
        variant: "destructive",
      })
      setIsVerifying(false)
      return
    }

    if (newUser.emailOtp !== "1234") {
      toast({
        title: "Email OTP did not match",
        description: "Please check the OTP sent to your email. For testing, use '1234'.",
        variant: "destructive",
      })
      setIsVerifying(false)
      return
    }

    // Both OTPs verified - update state and move to next step
    toast({
      title: "Verification Successful",
      description: "Phone and email verified successfully. Proceeding to broker details.",
    })

    // Update verification status
    setNewUser((prev) => ({
      ...prev,
      phoneVerified: true,
      emailVerified: true,
    }))

    // Move to step 2 immediately
    setAddUserStep(2)
    setIsVerifying(false)

    // Add a console log to confirm step change
    console.log("Moving to step 2")
  }

  const handleAddUser = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "✅ User added successfully",
        description: "The new user has been added to your account",
      })

      // Reset form and close dialog
      setNewUser({
        fullName: "",
        phoneNumber: "",
        email: "",
        phoneOtp: "",
        emailOtp: "",
        phoneVerified: false,
        emailVerified: false,
        broker: "Zerodha",
        brokerId: "",
        brokerPassword: "",
        apiKey: "",
        apiSecret: "",
      })
      setAddUserStep(1)
      setPhoneOtpSent(false)
      setEmailOtpSent(false)
      setShowAddUserDialog(false)
      setIsSubmitting(false)
    }, 1500)
  }

  const resetAndCloseDialog = () => {
    setNewUser({
      fullName: "",
      phoneNumber: "",
      email: "",
      phoneOtp: "",
      emailOtp: "",
      phoneVerified: false,
      emailVerified: false,
      broker: "Zerodha",
      brokerId: "",
      brokerPassword: "",
      apiKey: "",
      apiSecret: "",
    })
    setAddUserStep(1)
    setPhoneOtpSent(false)
    setEmailOtpSent(false)
    setShowAddUserDialog(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Settings</h1>
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Click the "Add User" button above to add a new user.</p>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog
        open={showAddUserDialog}
        onOpenChange={(open) => {
          if (!open) resetAndCloseDialog()
          else setShowAddUserDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {addUserStep === 1 ? "Add New User - Verification" : "Add New User - Broker Details"}
            </DialogTitle>
            <DialogDescription>
              {addUserStep === 1 ? "Enter user details and verify phone and email" : "Enter broker and API details"}
            </DialogDescription>
          </DialogHeader>

          {addUserStep === 1 ? (
            // Step 1: Verification
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={newUser.fullName}
                    onChange={(e) => handleNewUserInputChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="phoneNumber"
                      placeholder="Enter 10-digit phone number"
                      value={newUser.phoneNumber}
                      onChange={(e) =>
                        handleNewUserInputChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendPhoneOtp}
                      disabled={phoneOtpSent || newUser.phoneNumber.length !== 10}
                      className="whitespace-nowrap"
                    >
                      {phoneOtpSent ? "OTP Sent" : "Send OTP"}
                    </Button>
                  </div>
                  {phoneOtpSent && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter OTP sent to phone"
                        value={newUser.phoneOtp}
                        onChange={(e) =>
                          handleNewUserInputChange("phoneOtp", e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        maxLength={4}
                      />
                      <p className="text-xs text-blue-600">
                        An OTP has been sent to your phone. Please enter it to verify.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) => handleNewUserInputChange("email", e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendEmailOtp}
                      disabled={emailOtpSent || !newUser.email}
                      className="whitespace-nowrap"
                    >
                      {emailOtpSent ? "OTP Sent" : "Send OTP"}
                    </Button>
                  </div>
                  {emailOtpSent && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter OTP sent to email"
                        value={newUser.emailOtp}
                        onChange={(e) =>
                          handleNewUserInputChange("emailOtp", e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        maxLength={4}
                      />
                      <p className="text-xs text-blue-600">
                        An OTP has been sent to your email. Please enter it to verify.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Verification Required</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Please verify both your phone number and email address to proceed with adding the user.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      <strong>For testing:</strong> Use OTP "1234" for both phone and email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Broker Details
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Verification Complete</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Phone and email verified for {newUser.fullName}. Please complete the broker details below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="broker" className="text-sm font-medium">
                    Broker <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="broker"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newUser.broker}
                    onChange={(e) => handleNewUserInputChange("broker", e.target.value)}
                  >
                    <option value="Zerodha">Zerodha</option>
                    <option value="APITest">API Test</option>
                    <option value="Upstox">Upstox</option>
                    <option value="Angel">Angel Broking</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="brokerId" className="text-sm font-medium">
                    Broker ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="brokerId"
                    placeholder="e.g., AB1234"
                    value={newUser.brokerId}
                    onChange={(e) => handleNewUserInputChange("brokerId", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="brokerPassword" className="text-sm font-medium">
                    Broker Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="brokerPassword"
                    type="password"
                    placeholder="Enter broker password"
                    value={newUser.brokerPassword}
                    onChange={(e) => handleNewUserInputChange("brokerPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="apiKey"
                    placeholder="Enter API Key"
                    value={newUser.apiKey}
                    onChange={(e) => handleNewUserInputChange("apiKey", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="apiSecret" className="text-sm font-medium">
                    API Secret <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="apiSecret"
                    placeholder="Enter API Secret"
                    value={newUser.apiSecret}
                    onChange={(e) => handleNewUserInputChange("apiSecret", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  if (addUserStep === 2) {
                    setAddUserStep(1)
                  } else {
                    resetAndCloseDialog()
                  }
                }}
              >
                {addUserStep === 2 ? "Back" : "Cancel"}
              </Button>
              {addUserStep === 1 ? (
                <Button
                  onClick={verifyAndProceed}
                  disabled={
                    isVerifying ||
                    !phoneOtpSent ||
                    !emailOtpSent ||
                    !newUser.phoneOtp ||
                    !newUser.emailOtp ||
                    !newUser.fullName
                  }
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              ) : (
                <Button onClick={handleAddUser} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adding User...
                    </>
                  ) : (
                    "Add User"
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
