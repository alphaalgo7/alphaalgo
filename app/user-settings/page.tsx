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
  ArrowUpRight,
  Download,
  Circle,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SimpleDialog } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      marketOrders: "Allowed",
      credits: 1000,
      apiKey: "",
      apiSecret: "",
      historical: false,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: false,
      password: "************",
      pin: "************",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
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
      marketOrders: "Allowed",
      credits: 750,
      apiKey: "3vc1r96gm...",
      apiSecret: "m5zvzkr8t339i...",
      historical: true,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: true,
      password: "************",
      pin: "************ G5FL4E...",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
    },
    {
      id: 3,
      enabled: true,
      loggedIn: true,
      alias: "MAYANK",
      userId: "YV8917",
      broker: "Zerodha",
      totalMargin: "9,254,463.36",
      cashMargin: "7,254,463.36",
      pledgeMargin: "2,000,000.00",
      marketOrders: "Allowed",
      credits: 500,
      apiKey: "764kf25ca...",
      apiSecret: "aw0e536ai46d...",
      historical: true,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: true,
      password: "********",
      pin: "************ HMTW5...",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
    },
    {
      id: 4,
      enabled: true,
      loggedIn: true,
      alias: "SATISH",
      userId: "DA2311",
      broker: "Zerodha",
      totalMargin: "10,953,934.39",
      cashMargin: "8,953,934.39",
      pledgeMargin: "2,000,000.00",
      marketOrders: "Allowed",
      credits: 1200,
      apiKey: "uba5mmc0...",
      apiSecret: "3ba638une0...",
      historical: true,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: true,
      password: "************",
      pin: "************ XQZZO...",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
    },
    {
      id: 5,
      enabled: true,
      loggedIn: false,
      alias: "DIKSHYA",
      userId: "YC7167",
      broker: "Zerodha",
      totalMargin: "10,465,472.82",
      cashMargin: "8,465,472.82",
      pledgeMargin: "2,000,000.00",
      marketOrders: "Allowed",
      credits: 300,
      apiKey: "9m5ypqnrz...",
      apiSecret: "28ogyrj79ngpi...",
      historical: true,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: true,
      password: "********",
      pin: "************ 33WJLIE...",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
    },
    {
      id: 6,
      enabled: false,
      loggedIn: false,
      alias: "RIDDHI",
      userId: "YS7077",
      broker: "Zerodha",
      totalMargin: "9,559,854.70",
      cashMargin: "7,559,854.70",
      pledgeMargin: "2,000,000.00",
      marketOrders: "Allowed",
      credits: 0,
      apiKey: "w7nj0v2blq...",
      apiSecret: "xd8xu5oct5ib...",
      historical: true,
      utilizedMargin: "0.00",
      utilizedMarginPercent: "0.00",
      enableCncSqOff: false,
      sqOffOrderType: "MARKET",
      autoLogin: true,
      password: "************",
      pin: "************ VTQTFN...",
      twoFA: "",
      maxProfit: "0",
      maxLoss: "0",
      maxLossWaitSec: "0",
      profitLocking: "0~0~0~0",
      qtyByExposure: "0",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({})
  const [editMode, setEditMode] = useState<Record<number, boolean>>({})
  const [editedUsers, setEditedUsers] = useState<Record<string, any>>({})
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [filterBroker, setFilterBroker] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    phoneOtp: "",
    emailOtp: "",
    phoneVerified: false,
    emailVerified: false,
    username: "",
    broker: "Zerodha",
    brokerId: "",
    brokerPassword: "",
    totpKey: "",
    apiKey: "",
    apiSecret: "",
    enabled: true,
    totalMargin: "10,000,000.00",
    cashMargin: "10,000,000.00",
    pledgeMargin: "0.00",
    credits: 500,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)

  // Add Credits dialog state
  const [showAddCreditsDialog, setShowAddCreditsDialog] = useState(false)
  const [creditAmount, setCreditAmount] = useState(1000)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentStep, setPaymentStep] = useState(1)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  // Add these new state variables after the existing state declarations
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [showBulkLogoutDialog, setShowBulkLogoutDialog] = useState(false)
  const [showBulkSquareOffDialog, setShowBulkSquareOffDialog] = useState(false)
  const [showBulkLoginDialog, setShowBulkLoginDialog] = useState(false)
  const [isProcessingBulkAction, setIsProcessingBulkAction] = useState(false)

  const [addUserStep, setAddUserStep] = useState(1) // 1 for verification, 2 for broker details
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const filteredUsers = users.filter((user) => {
    // Text search
    const matchesSearch =
      user.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.broker.toLowerCase().includes(searchTerm.toLowerCase())

    // Broker filter
    const matchesBroker = filterBroker ? user.broker === filterBroker : true

    return matchesSearch && matchesBroker
  })

  const toggleShowSecret = (userId: number) => {
    setShowSecrets((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const toggleEditMode = (userId: number) => {
    if (editMode[userId]) {
      // Save changes
      setEditMode((prev) => ({
        ...prev,
        [userId]: false,
      }))
    } else {
      // Enter edit mode
      setEditMode((prev) => ({
        ...prev,
        [userId]: true,
      }))
      // Initialize edited user data
      setEditedUsers((prev) => ({
        ...prev,
        [userId]: { ...users.find((u) => u.id === userId) },
      }))
    }
  }

  const handleInputChange = (userId: number, field: string, value: any) => {
    setEditedUsers((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }))
  }

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

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.loggedIn).length
  const enabledUsers = users.filter((user) => user.enabled).length
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0)

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

    // Simulate OTP verification
    setTimeout(() => {
      if (newUser.phoneOtp !== "1234") {
        toast({
          title: "OTP did not match. Please try again.",
          description: "Please check the OTP sent to your phone",
          variant: "destructive",
        })
        setIsVerifying(false)
        return
      }

      if (newUser.emailOtp !== "1234") {
        toast({
          title: "OTP did not match. Please try again.",
          description: "Please check the OTP sent to your email",
          variant: "destructive",
        })
        setIsVerifying(false)
        return
      }

      // Both OTPs verified
      setNewUser((prev) => ({
        ...prev,
        phoneVerified: true,
        emailVerified: true,
        username: prev.fullName, // Set username from full name
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

    // Simulate API call
    setTimeout(() => {
      // Add the new user to the list with a new ID
      const newUserId = Math.max(...users.map((u) => u.id)) + 1
      const userToAdd = {
        ...newUser,
        id: newUserId,
        alias: newUser.fullName,
        userId: newUser.brokerId,
        password: newUser.brokerPassword,
        twoFA: newUser.totpKey,
        loggedIn: false,
        autoLogin: true,
        historical: true,
        marketOrders: "Allowed",
        enableCncSqOff: false,
        sqOffOrderType: "MARKET",
        maxProfit: "0",
        maxLoss: "0",
        maxLossWaitSec: "0",
        profitLocking: "0~0~0~0",
        qtyByExposure: "0",
        utilizedMargin: "0.00",
        utilizedMarginPercent: "0.00",
      }

      setUsers((prevUsers) => [...prevUsers, userToAdd])

      // Reset form and close dialog
      setNewUser({
        fullName: "",
        phoneNumber: "",
        email: "",
        phoneOtp: "",
        emailOtp: "",
        phoneVerified: false,
        emailVerified: false,
        username: "",
        broker: "Zerodha",
        brokerId: "",
        brokerPassword: "",
        totpKey: "",
        apiKey: "",
        apiSecret: "",
        enabled: true,
        totalMargin: "10,000,000.00",
        cashMargin: "10,000,000.00",
        pledgeMargin: "0.00",
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

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user })
    setShowEditDialog(true)
  }

  const handleLogoutUser = (userId: number) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, loggedIn: false } : user)))
  }

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id))
      setShowDeleteDialog(false)
      setUserToDelete(null)
    }
  }

  const handleSaveEditedUser = () => {
    if (editingUser) {
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === editingUser.id ? editingUser : user)))
      setShowEditDialog(false)
      setEditingUser(null)
    }
  }

  const handleEditInputChange = (field: string, value: any) => {
    setEditingUser((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddCredits = () => {
    if (paymentStep === 1) {
      setPaymentStep(2)
      return
    }

    setIsProcessingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would make an API call to process payment
      // and then update the credits

      // For now, we'll just update the total credits
      setIsProcessingPayment(false)
      setShowAddCreditsDialog(false)
      setPaymentStep(1)

      // Reset card details
      setCardDetails({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      })

      // Show success message or update UI
      alert(`Successfully purchased ${creditAmount} credits!`)
    }, 2000)
  }

  const handleIncrementCredits = () => {
    if (creditAmount < 10000) {
      setCreditAmount(creditAmount + 500)
    }
  }

  const handleDecrementCredits = () => {
    if (creditAmount > 500) {
      setCreditAmount(creditAmount - 500)
    }
  }

  // Add these new handler functions after the existing handler functions

  const handleBulkLogout = () => {
    setShowBulkLogoutDialog(true)
  }

  const confirmBulkLogout = () => {
    setIsProcessingBulkAction(true)

    // Simulate API call
    setTimeout(() => {
      // Update all selected users to logged out
      setUsers((prevUsers) =>
        prevUsers.map((user) => (selectedUsers.includes(user.id) ? { ...user, loggedIn: false } : user)),
      )

      // Reset selection and close dialog
      setSelectedUsers([])
      setShowBulkLogoutDialog(false)
      setIsProcessingBulkAction(false)
    }, 1000)
  }

  const handleBulkSquareOff = () => {
    setShowBulkSquareOffDialog(true)
  }

  const confirmBulkSquareOff = () => {
    setIsProcessingBulkAction(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would close all positions
      // For now, we'll just show an alert
      alert(`Square off completed for ${selectedUsers.length} users`)

      // Reset selection and close dialog
      setSelectedUsers([])
      setShowBulkSquareOffDialog(false)
      setIsProcessingBulkAction(false)
    }, 1000)
  }

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true)
  }

  const confirmBulkDelete = () => {
    setIsProcessingBulkAction(true)

    // Simulate API call
    setTimeout(() => {
      // Remove all selected users
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)))

      // Reset selection and close dialog
      setSelectedUsers([])
      setShowBulkDeleteDialog(false)
      setIsProcessingBulkAction(false)
    }, 1000)
  }

  const handleBulkLogin = () => {
    setShowBulkLoginDialog(true)
  }

  const confirmBulkLogin = () => {
    setIsProcessingBulkAction(true)

    // Simulate API call
    setTimeout(() => {
      // Update all selected users to logged in
      setUsers((prevUsers) =>
        prevUsers.map((user) => (selectedUsers.includes(user.id) && user.enabled ? { ...user, loggedIn: true } : user)),
      )

      // Reset selection and close dialog
      setSelectedUsers([])
      setShowBulkLoginDialog(false)
      setIsProcessingBulkAction(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>

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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  onClick={() => setShowAddCreditsDialog(true)}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Add Credits
                </Button>
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
                <p className="text-2xl font-bold mt-2">{totalUsers}</p>
                <div className="mt-2 text-xs text-white/70">
                  <span className="inline-flex items-center text-emerald-300">
                    <ArrowUpRight className="h-3 w-3 mr-1" />{" "}
                    {totalUsers > 0 ? Math.round((enabledUsers / totalUsers) * 100) : 0}% enabled
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Active Users</h3>
                  <CircleCheck className="h-4 w-4 text-white/70" />
                </div>
                <p className="text-2xl font-bold mt-2">{activeUsers}</p>
                <div className="mt-2 text-xs text-white/70">
                  <span className="inline-flex items-center text-emerald-300">
                    <ArrowUpRight className="h-3 w-3 mr-1" />{" "}
                    {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% logged in
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/70">Available Credits</h3>
                  <Wallet className="h-4 w-4 text-white/70" />
                </div>
                <p className="text-2xl font-bold mt-2">5,000</p>
                <div className="mt-2 text-xs text-white/70">
                  <span className="inline-flex items-center">
                    <Download className="h-3 w-3 mr-1 text-emerald-300" />{" "}
                    <span className="text-emerald-300">Buy more credits</span>
                  </span>
                </div>
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

              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600">{selectedUsers.length} selected</Badge>
              <span className="text-sm text-indigo-700 dark:text-indigo-300">
                {selectedUsers.length === filteredUsers.length ? "All users selected" : ""}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900 text-green-700 dark:text-green-400"
                onClick={handleBulkLogin}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Login Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                onClick={handleBulkLogout}
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                onClick={handleBulkSquareOff}
              >
                <Circle className="h-3.5 w-3.5 mr-1" />
                Square Off
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

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
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Cash Margin</th>
                  <th className="p-3 text-left font-medium text-sm text-gray-600 dark:text-gray-300">Pledge Margin</th>
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
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700 font-medium">
                      {user.cashMargin.split(".")[0]}
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700 font-medium">
                      {user.pledgeMargin.split(".")[0]}
                    </td>
                    <td className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-medium">{user.credits}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                          <div
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (user.credits / 1500) * 100)}%` }}
                          ></div>
                        </div>
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
                                onClick={() => handleEditUser(user)}
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
                                onClick={() => handleLogoutUser(user.id)}
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
                                onClick={() => handleDeleteUser(user)}
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

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-600"
              onClick={() => setShowAddCreditsDialog(true)}
            >
              <Wallet className="h-3.5 w-3.5 mr-1.5" />
              Add Credits
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600"
              onClick={() => setShowAddUserDialog(true)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <SimpleDialog
        title={addUserStep === 1 ? "Add New User - Verification" : "Add New User - Broker Details"}
        description={
          addUserStep === 1 ? "Enter user details and verify phone and email" : "Enter broker and API details"
        }
        open={showAddUserDialog}
        onOpenChange={(open) => {
          if (!open) {
            // Reset form when closing
            setNewUser({
              fullName: "",
              phoneNumber: "",
              email: "",
              phoneOtp: "",
              emailOtp: "",
              phoneVerified: false,
              emailVerified: false,
              username: "",
              broker: "Zerodha",
              brokerId: "",
              brokerPassword: "",
              totpKey: "",
              apiKey: "",
              apiSecret: "",
              enabled: true,
              totalMargin: "10,000,000.00",
              cashMargin: "10,000,000.00",
              pledgeMargin: "0.00",
              credits: 500,
            })
            setAddUserStep(1)
            setPhoneOtpSent(false)
            setEmailOtpSent(false)
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Broker Details (existing form)
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
          </div>
        )}
      </SimpleDialog>

      {/* Edit User Dialog */}
      <SimpleDialog
        title="Edit User"
        description="Update user details"
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedUser} className="bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </Button>
          </div>
        }
      >
        {editingUser && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="edit-username"
                value={editingUser.alias}
                onChange={(e) => handleEditInputChange("alias", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-broker" className="text-sm font-medium">
                Broker
              </label>
              <select
                id="edit-broker"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingUser.broker}
                onChange={(e) => handleEditInputChange("broker", e.target.value)}
              >
                <option value="Zerodha">Zerodha</option>
                <option value="APITest">API Test</option>
                <option value="Upstox">Upstox</option>
                <option value="Angel">Angel Broking</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-userId" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="edit-userId"
                value={editingUser.userId}
                onChange={(e) => handleEditInputChange("userId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-apiKey" className="text-sm font-medium">
                API Key
              </label>
              <Input
                id="edit-apiKey"
                value={editingUser.apiKey}
                onChange={(e) => handleEditInputChange("apiKey", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-apiSecret" className="text-sm font-medium">
                API Secret
              </label>
              <Input
                id="edit-apiSecret"
                value={editingUser.apiSecret}
                onChange={(e) => handleEditInputChange("apiSecret", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-credits" className="text-sm font-medium">
                Credits
              </label>
              <Input
                id="edit-credits"
                type="number"
                value={editingUser.credits}
                onChange={(e) => handleEditInputChange("credits", Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-enabled"
                checked={editingUser.enabled}
                onChange={(e) => handleEditInputChange("enabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="edit-enabled" className="text-sm font-medium">
                Enabled
              </label>
            </div>
          </div>
        )}
      </SimpleDialog>

      {/* Delete Confirmation Dialog */}
      <SimpleDialog
        title="Delete User"
        description={`Are you sure you want to delete user "${userToDelete?.alias}"? This action cannot be undone.`}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        size="sm"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete the user and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </SimpleDialog>

      {/* Add Credits Dialog */}
      <SimpleDialog
        title=""
        description=""
        open={showAddCreditsDialog}
        onOpenChange={setShowAddCreditsDialog}
        size="xl"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => {
                if (paymentStep === 2) {
                  setPaymentStep(1)
                } else {
                  setShowAddCreditsDialog(false)
                }
              }}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              {paymentStep === 2 ? "Back" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddCredits}
              disabled={isProcessingPayment}
              className={`${paymentStep === 1 ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-gradient-to-r from-emerald-500 to-teal-500"} hover:opacity-90 transition-all duration-200 shadow-lg`}
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : paymentStep === 1 ? (
                "Continue to Payment"
              ) : (
                "Complete Purchase"
              )}
            </Button>
          </div>
        }
      >
        {paymentStep === 1 ? (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-12 -mr-12 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-8 -ml-8 blur-xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Add Trading Credits</h2>
                <p className="text-indigo-100 mb-4">Power up your trading with additional credits</p>

                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-indigo-100">Current Balance</div>
                      <div className="text-xl font-bold">5,000 credits</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-indigo-100">Value</div>
                    <div className="text-xl font-bold">₹9,500</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div
                onClick={() => setCreditAmount(500)}
                className={`group cursor-pointer transition-all duration-300 ${creditAmount === 500 ? "scale-105" : "hover:scale-105"}`}
              >
                <div
                  className={`h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${creditAmount === 500 ? "ring-2 ring-violet-500 shadow-lg shadow-violet-100 dark:shadow-none" : "hover:shadow-lg"}`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-full">
                        Basic
                      </span>
                      {creditAmount === 500 && (
                        <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Selected
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 p-4">
                        <Wallet className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">500</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">credits</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">₹999</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">₹1.99 per credit</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setCreditAmount(1000)}
                className={`group cursor-pointer transition-all duration-300 ${creditAmount === 1000 ? "scale-105" : "hover:scale-105"}`}
              >
                <div
                  className={`h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden relative transition-all duration-300 ${creditAmount === 1000 ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-none" : "hover:shadow-lg"}`}
                >
                  <div className="absolute top-0 left-0 w-full">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm w-fit">
                      MOST POPULAR
                    </div>
                  </div>

                  <div className="p-5 pt-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                        Standard
                      </span>
                      {creditAmount === 1000 && (
                        <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Selected
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 p-4">
                        <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">1,000</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">credits</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">₹1,899</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ₹1.89 per credit <span className="text-emerald-500 ml-1">Save 5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setCreditAmount(2500)}
                className={`group cursor-pointer transition-all duration-300 ${creditAmount === 2500 ? "scale-105" : "hover:scale-105"}`}
              >
                <div
                  className={`h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${creditAmount === 2500 ? "ring-2 ring-blue-500 shadow-lg shadow-blue-100 dark:shadow-none" : "hover:shadow-lg"}`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        Premium
                      </span>
                      {creditAmount === 2500 && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Selected
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4">
                        <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">2,500</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">credits</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">₹4,499</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ₹1.79 per credit <span className="text-emerald-500 ml-1">Save 10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Custom Amount</h4>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleDecrementCredits}
                    disabled={creditAmount <= 500}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {creditAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">credits</div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleIncrementCredits}
                    disabled={creditAmount >= 10000}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Price per credit:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{creditAmount >= 2500 ? "1.79" : creditAmount >= 1000 ? "1.89" : "1.99"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹
                    {(creditAmount * (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99)).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">GST (18%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹
                    {(
                      creditAmount *
                      (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                      0.18
                    ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        1.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-blue-500 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300">Credits Information</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Credits are used for executing trades and accessing premium features. They do not expire and can be
                  used across all your trading accounts.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-12 -mr-12 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-8 -ml-8 blur-xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Complete Your Purchase</h2>
                <p className="text-teal-100 mb-4">You're just one step away from adding credits</p>

                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div>
                    <div className="text-sm text-teal-100">Order Summary</div>
                    <div className="text-xl font-bold">{creditAmount.toLocaleString()} credits</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-teal-100">Total Amount</div>
                    <div className="text-xl font-bold">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        1.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TabsTrigger
                  value="card"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </TabsTrigger>
                <TabsTrigger
                  value="upi"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <img src="/upi-logo.png" alt="UPI" className="h-4 w-4 mr-2" />
                  UPI
                </TabsTrigger>
                <TabsTrigger
                  value="netbanking"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
                >
                  <img src="/bank-icon.png" alt="Bank" className="h-4 w-4 mr-2" />
                  Net Banking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="mt-6 space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white">Card Details</h3>
                    <div className="flex items-center gap-2">
                      <img src="/visa-logo-generic.png" alt="Visa" className="h-6" />
                      <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                      <img src="/generic-payment-logo.png" alt="RuPay" className="h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Card Number
                      </label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                          className="pl-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cardName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name on Card
                      </label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.cardName}
                        onChange={(e) => handleCardDetailsChange("cardName", e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expiry Date
                        </label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardDetailsChange("expiryDate", e.target.value)}
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="cvv" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          CVV
                        </label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardDetailsChange("cvv", e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-56 text-xs">
                                    The 3 or 4 digit security code on the back of your card
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="saveCard" className="text-sm text-gray-700 dark:text-gray-300">
                        Save card for future payments
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount * (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99)
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        0.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex items-center justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        1.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upi" className="mt-6 space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">UPI Payment</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="upiId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        UPI ID
                      </label>
                      <div className="relative">
                        <Input
                          id="upiId"
                          placeholder="name@upi"
                          className="pl-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <img src="/upi-logo.png" alt="UPI" className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter your UPI ID (e.g., mobilenumber@upi)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Or pay using UPI apps</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <img src="src/assets/google-pay.png" alt="Google Pay" className="h-10 w-10 mx-auto mb-2" />
                        <div className="text-xs text-gray-700 dark:text-gray-300">Google Pay</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <img src="/phonepe-logo.png" alt="PhonePe" className="h-10 w-10 mx-auto mb-2" />
                        <div className="text-xs text-gray-700 dark:text-gray-300">PhonePe</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <img src="/generic-digital-payment-logo.png" alt="Paytm" className="h-10 w-10 mx-auto mb-2" />
                        <div className="text-xs text-gray-700 dark:text-gray-300">Paytm</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <img src="/amazon-pay-logo.png" alt="Amazon Pay" className="h-10 w-10 mx-auto mb-2" />
                        <div className="text-xs text-gray-700 dark:text-gray-300">Amazon Pay</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount * (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99)
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        0.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex items-center justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        1.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="netbanking" className="mt-6 space-y-5">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Net Banking</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                      <img src="/hdfc-bank-logo.png" alt="HDFC" className="h-8 mx-auto mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300">HDFC Bank</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                      <img src="/icici-bank-logo.png" alt="ICICI" className="h-8 mx-auto mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300">ICICI Bank</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                      <img src="/generic-bank-logo.png" alt="SBI" className="h-8 mx-auto mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300">SBI</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                      <img src="/axis-bank-logo.png" alt="Axis" className="h-8 mx-auto mb-2" />
                      <div className="text-xs text-gray-700 dark:text-gray-300">Axis Bank</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="otherBank" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Other Banks
                      </label>
                      <select
                        id="otherBank"
                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="">Select a bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="yes">Yes Bank</option>
                        <option value="idfc">IDFC First Bank</option>
                        <option value="indusind">IndusInd Bank</option>
                        <option value="federal">Federal Bank</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="pnb">Punjab National Bank</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount * (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99)
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        0.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex items-center justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg text-gray-900 dark:text-white">
                      ₹
                      {(
                        creditAmount *
                        (creditAmount >= 2500 ? 1.79 : creditAmount >= 1000 ? 1.89 : 1.99) *
                        1.18
                      ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  <span>Secure payment</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-1"></div>
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  <span>Instant credit</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-1"></div>
                <div className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SimpleDialog>

      {/* Bulk Logout Confirmation Dialog */}
      <SimpleDialog
        title="Logout Selected Users"
        description={`Are you sure you want to log out ${selectedUsers.length} selected user${selectedUsers.length > 1 ? "s" : ""}?`}
        open={showBulkLogoutDialog}
        onOpenChange={setShowBulkLogoutDialog}
        size="sm"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowBulkLogoutDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkLogout}
              disabled={isProcessingBulkAction}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isProcessingBulkAction ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Logout Users"
              )}
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-md">
          <div className="flex items-start gap-3">
            <LogOut className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-indigo-800">Logout Information</h4>
              <p className="text-sm text-indigo-700 mt-1">
                This will log out the selected users from their trading accounts. They will need to log in again to
                continue trading.
              </p>
            </div>
          </div>
        </div>
      </SimpleDialog>

      {/* Bulk Square Off Confirmation Dialog */}
      <SimpleDialog
        title="Square Off Selected Users"
        description={`Are you sure you want to square off all positions for ${selectedUsers.length} selected user${selectedUsers.length > 1 ? "s" : ""}?`}
        open={showBulkSquareOffDialog}
        onOpenChange={setShowBulkSquareOffDialog}
        size="sm"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowBulkSquareOffDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkSquareOff}
              disabled={isProcessingBulkAction}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isProcessingBulkAction ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Square Off"
              )}
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Square Off Information</h4>
              <p className="text-sm text-amber-700 mt-1">
                This will close all open positions for the selected users. This action may result in realized profits or
                losses.
              </p>
            </div>
          </div>
        </div>
      </SimpleDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <SimpleDialog
        title="Delete Selected Users"
        description={`Are you sure you want to delete ${selectedUsers.length} selected user${selectedUsers.length > 1 ? "s" : ""}? This action cannot be undone.`}
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        size="sm"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkDelete} disabled={isProcessingBulkAction}>
              {isProcessingBulkAction ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Delete Users"
              )}
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete the selected users and all their associated data. This action cannot be
                undone.
              </p>
            </div>
          </div>
        </div>
      </SimpleDialog>

      {/* Bulk Login Confirmation Dialog */}
      <SimpleDialog
        title="Login Selected Users"
        description={`Are you sure you want to log in ${selectedUsers.length} selected user${selectedUsers.length > 1 ? "s" : ""}?`}
        open={showBulkLoginDialog}
        onOpenChange={setShowBulkLoginDialog}
        size="sm"
        footer={
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setShowBulkLoginDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkLogin}
              disabled={isProcessingBulkAction}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessingBulkAction ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Login Users"
              )}
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Login Information</h4>
              <p className="text-sm text-green-700 mt-1">
                This will log in the selected users to their trading accounts. Only enabled users will be logged in.
              </p>
            </div>
          </div>
        </div>
      </SimpleDialog>
    </div>
  )
}
