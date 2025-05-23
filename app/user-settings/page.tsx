"use client"

import { useState } from "react"
import {
  Search,
  RefreshCw,
  Edit,
  Check,
  AlertTriangle,
  Filter,
  Trash2,
  UserPlus,
  LogOut,
  ChevronDown,
  Wallet,
  Users,
  CircleCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SimpleDialog } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function UserSettingsPage() {
  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      enabled: true,
      loggedIn: true,
      alias: "SIMULATED1",
      userId: "SIM1",
      broker: "APITest",
      totalMargin: "100,000,000.00",
      cashMargin: "100,000,000.00",
      pledgeMargin: "0.00",
      credits: 1000,
      apiKey: "",
      apiSecret: "",
    },
    {
      id: 2,
      enabled: true,
      loggedIn: true,
      alias: "ABHINAV",
      userId: "ZU4216",
      broker: "Zerodha",
      totalMargin: "13,310,977.50",
      cashMargin: "10,310,977.50",
      pledgeMargin: "3,000,000.00",
      credits: 750,
      apiKey: "3vc1r96gm...",
      apiSecret: "m5zvzkr8t339i...",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [filterBroker, setFilterBroker] = useState<string | null>(null)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
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
    totpKey: "",
    apiKey: "",
    apiSecret: "",
    enabled: true,
    credits: 500,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addUserStep, setAddUserStep] = useState(1)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.broker.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBroker = filterBroker ? user.broker === filterBroker : true
    return matchesSearch && matchesBroker
  })

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const getBrokerGradient = (broker: string) => {
    switch (broker) {
      case "Zerodha":
        return "bg-gradient-to-r from-blue-500 to-blue-600"
      case "APITest":
        return "bg-gradient-to-r from-purple-500 to-purple-700"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const getStatusGradient = (isLoggedIn: boolean, isEnabled: boolean) => {
    if (!isEnabled) return "bg-gradient-to-r from-gray-400 to-gray-500"
    return isLoggedIn
      ? "bg-gradient-to-r from-green-400 to-emerald-500"
      : "bg-gradient-to-r from-amber-400 to-amber-500"
  }

  const getStatusText = (isLoggedIn: boolean, isEnabled: boolean) => {
    if (!isEnabled) return "Disabled"
    return isLoggedIn ? "Active" : "Logged Out"
  }

  const uniqueBrokers = Array.from(new Set(users.map((user) => user.broker)))

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
    setEmailOtpSent(true)
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email. Please enter it to verify.",
    })
  }

  const verifyAndProceed = () => {
    setIsVerifying(true)

    setTimeout(() => {
      if (newUser.phoneOtp !== "1234") {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP sent to your phone",
          variant: "destructive",
        })
        setIsVerifying(false)
        return
      }

      if (newUser.emailOtp !== "1234") {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP sent to your email",
          variant: "destructive",
        })
        setIsVerifying(false)
        return
      }

      setNewUser((prev) => ({
        ...prev,
        phoneVerified: true,
        emailVerified: true,
      }))

      setAddUserStep(2)
      setIsVerifying(false)

      toast({
        title: "Verification Successful",
        description: "Phone and email verified successfully. Please complete broker details.",
      })
    }, 1500)
  }

  const handleAddUser = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      const newUserId = Math.max(...users.map((u) => u.id)) + 1
      const userToAdd = {
        ...newUser,
        id: newUserId,
        alias: newUser.fullName,
        userId: newUser.brokerId,
        totalMargin: "10,000,000.00",
        cashMargin: "10,000,000.00",
        pledgeMargin: "0.00",
        loggedIn: false,
      }

      setUsers((prevUsers) => [...prevUsers, userToAdd])

      // Reset form
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
        totpKey: "",
        apiKey: "",
        apiSecret: "",
        enabled: true,
        credits: 500,
      })
      setAddUserStep(1)
      setPhoneOtpSent(false)
      setEmailOtpSent(false)
      setShowAddUserDialog(false)
      setIsSubmitting(false)

      toast({
        title: "✅ User added successfully",
        description: "The new user has been added to your account",
      })
    }, 1500)
  }

  const resetDialog = () => {
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
      totpKey: "",
      apiKey: "",
      apiSecret: "",
      enabled: true,
      credits: 500,
    })
    setAddUserStep(1)
    setPhoneOtpSent(false)
    setEmailOtpSent(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/20 p-2.5">
                    <Users className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">User Settings</h1>
                </div>
                <p className="mt-1 text-white/80">Manage your trading accounts and user settings</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="bg-white hover:bg-white/90 text-indigo-600 border-0"
                  onClick={() => setShowAddUserDialog(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Total Users</h3>
                  <Users className="h-4 w-4 text-white/70" />
                </div>
                <p className="text-2xl font-bold mt-2">{users.length}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Active Users</h3>
                  <CircleCheck className="h-4 w-4 text-white/70" />
                </div>
                <p className="text-2xl font-bold mt-2">{users.filter((user) => user.loggedIn).length}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Available Credits</h3>
                  <Wallet className="h-4 w-4 text-white/70" />
                </div>
                <p className="text-2xl font-bold mt-2">5,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="p-2 font-medium text-sm">Filter by Broker</div>
                  <DropdownMenuItem onClick={() => setFilterBroker(null)} className="flex items-center gap-2">
                    {!filterBroker && <Check className="h-4 w-4" />}
                    <span className={!filterBroker ? "font-medium" : ""}>All Brokers</span>
                  </DropdownMenuItem>
                  {uniqueBrokers.map((broker) => (
                    <DropdownMenuItem
                      key={broker}
                      onClick={() => setFilterBroker(broker)}
                      className="flex items-center gap-2"
                    >
                      {filterBroker === broker && <Check className="h-4 w-4" />}
                      <span className={filterBroker === broker ? "font-medium" : ""}>{broker}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
                  <th className="p-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleAllUsers}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">User</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Broker</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Total Margin</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Credits</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors",
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50",
                      !user.enabled && "opacity-60",
                      "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20",
                    )}
                  >
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${getStatusGradient(user.loggedIn, user.enabled)}`}
                        ></div>
                        <span className="text-sm">{getStatusText(user.loggedIn, user.enabled)}</span>
                      </div>
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-md ${getBrokerGradient(user.broker)} flex items-center justify-center text-white font-semibold text-xs`}
                        >
                          {user.alias.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.alias}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <Badge className={`${getBrokerGradient(user.broker)} text-white`}>{user.broker}</Badge>
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700 font-medium">
                      {user.totalMargin.split(".")[0]}
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="font-medium">{user.credits}</span>
                      </div>
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-indigo-100 hover:text-indigo-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-600"
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Logout</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <SimpleDialog
        title={`Add New User - Step ${addUserStep} of 2`}
        description={
          addUserStep === 1 ? "Enter user details and verify phone and email" : "Enter broker and API details"
        }
        open={showAddUserDialog}
        onOpenChange={(open) => {
          if (!open) {
            resetDialog()
          }
          setShowAddUserDialog(open)
        }}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => {
                if (addUserStep === 2) {
                  setAddUserStep(1)
                } else {
                  setShowAddUserDialog(false)
                }
              }}
            >
              {addUserStep === 2 ? "Back" : "Cancel"}
            </Button>
            {addUserStep === 1 ? (
              <Button
                onClick={verifyAndProceed}
                disabled={isVerifying || !phoneOtpSent || !emailOtpSent || !newUser.phoneOtp || !newUser.emailOtp}
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
        }
      >
        {addUserStep === 1 ? (
          // Step 1: Verification form
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
                      placeholder="Enter OTP sent to phone (use 1234 for demo)"
                      value={newUser.phoneOtp}
                      onChange={(e) =>
                        handleNewUserInputChange("phoneOtp", e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      maxLength={4}
                    />
                    <p className="text-xs text-blue-600">An OTP has been sent to your phone. Use "1234" for demo.</p>
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
                      placeholder="Enter OTP sent to email (use 1234 for demo)"
                      value={newUser.emailOtp}
                      onChange={(e) =>
                        handleNewUserInputChange("emailOtp", e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      maxLength={4}
                    />
                    <p className="text-xs text-blue-600">An OTP has been sent to your email. Use "1234" for demo.</p>
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Broker details form
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
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
                <label htmlFor="totpKey" className="text-sm font-medium">
                  TOTP Key
                </label>
                <Input
                  id="totpKey"
                  placeholder="Enter TOTP key if applicable"
                  value={newUser.totpKey}
                  onChange={(e) => handleNewUserInputChange("totpKey", e.target.value)}
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

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Security Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Your broker and API credentials grant access to your trading account. Never share these
                      credentials with anyone and ensure you're using a secure connection when entering them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SimpleDialog>
    </div>
  )
}
