"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, Clock, Star, Play, Settings2 } from "lucide-react"

interface LandingPageProps {
  onSignIn: () => void
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Strategy Builder",
      description: "Create complex trading strategies with our intuitive drag-and-drop interface",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Execution",
      description: "Execute strategies instantly with real-time market data and lightning-fast processing",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Management",
      description: "Built-in risk controls and portfolio management tools to protect your investments",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics and reporting to track your strategy performance",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-User Support",
      description: "Collaborate with your team and manage multiple trading accounts seamlessly",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Monitoring",
      description: "Continuous monitoring and alerts to keep you informed of market changes",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Senior Trader",
      company: "Mumbai Securities",
      content:
        "STOXXO has revolutionized our trading operations. The strategy builder is incredibly powerful yet easy to use.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Portfolio Manager",
      company: "Delhi Capital",
      content:
        "The real-time execution and risk management features have significantly improved our trading performance.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Quantitative Analyst",
      company: "Bangalore Investments",
      content: "Best platform for algorithmic trading in the Indian markets. Highly recommended!",
      rating: 5,
    },
  ]

  const stats = [
    { label: "Active Traders", value: "10,000+" },
    { label: "Strategies Created", value: "50,000+" },
    { label: "Daily Volume", value: "₹500Cr+" },
    { label: "Success Rate", value: "94%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-sky-600 to-purple-600 rounded-lg">
                <Settings2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                  STOXXO
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Strategy Configuration Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Features
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Pricing
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                About
              </Button>
              <Button
                onClick={onSignIn}
                className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
            🚀 Now supporting SENSEX & NIFTY options
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Build Winning
            <span className="bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent block">
              Trading Strategies
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Professional-grade strategy configuration platform for Indian markets. Create, test, and deploy algorithmic
            trading strategies with real-time execution and advanced risk management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onSignIn}
              size="lg"
              className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg"
            >
              Start Building Strategies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools and features designed specifically for Indian market traders and institutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <div className="p-3 bg-gradient-to-r from-sky-100 to-purple-100 dark:from-sky-900 dark:to-purple-900 rounded-lg w-fit mb-4">
                    <div className="text-sky-600 dark:text-sky-400">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Trusted by professionals</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">See what our users are saying about STOXXO</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to transform your trading?</h2>
          <p className="text-xl text-sky-100 mb-8">
            Join thousands of traders who are already using STOXXO to build and execute winning strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignIn}
              size="lg"
              variant="secondary"
              className="bg-white text-sky-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-sky-600 px-8 py-4 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-sky-600 to-purple-600 rounded-lg">
                  <Settings2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">STOXXO</span>
              </div>
              <p className="text-slate-400">Professional trading strategy platform for the modern trader.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 STOXXO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
