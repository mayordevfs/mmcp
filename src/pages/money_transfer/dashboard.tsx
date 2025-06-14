// import { authenticatedUser } from '@/utils/auth-transfer-utils'


import Image from "next/image"
import { Bell, Search, Settings, Eye, Grid, RefreshCw } from "lucide-react"
import Input from "@/components/ui/input"
import { authenticatedUser } from "@/utils/auth-transfer-utils"
import Button from "@/components/ui/button"

// import { Progress } from "@/components/ui/progress"

export default function MoneyTransferDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <div className="bg-lime-400 rounded-full w-12 h-12 flex items-center justify-center">
              <span className="font-bold text-lg">GF</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="bg-slate-100 px-4 py-2 rounded-md font-medium">
                Dashboard
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Payments
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Analytics
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Cards
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                History
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Help
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Mathieu</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left sidebar - Accounts */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Accounts</h2>
              <button className="text-blue-600 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            {/* Euro Account */}
            <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-2xl font-bold">€3,524.60</h3>
                  <p className="text-sm text-gray-500">Euro account</p>
                </div>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md p-2 w-24 h-12 flex items-center">
                  <span className="text-white font-medium ml-2">9315</span>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-md p-2 w-24 h-12 flex items-center">
                  <span className="text-white font-medium ml-2">3412</span>
                </div>
              </div>
            </div>

            {/* Dollar Account */}
            <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-2xl font-bold">€342.52</h3>
                  <p className="text-sm text-gray-500">Dollar account</p>
                </div>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-2 w-24 h-12 flex items-center">
                  <span className="text-white font-medium ml-2">4563</span>
                </div>
              </div>
            </div>

            {/* Crypto Account */}
            <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-2xl font-bold">€1,676.11</h3>
                  <p className="text-sm text-gray-500">Crypto account</p>
                </div>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="bg-orange-400 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold">₿</span>
                </div>
                <div className="bg-blue-400 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold">Ξ</span>
                </div>
                <div className="bg-green-400 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-white font-bold">X</span>
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-4 space-y-4">
              <button className="flex items-center gap-2 text-gray-700 font-medium">
                <Eye className="w-5 h-5" /> Hide balance
              </button>
              <button className="flex items-center gap-2 text-gray-700 font-medium">
                <Grid className="w-5 h-5" /> Explore
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-400">© 2012-2023</div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input type="text" name="search" placeholder="Search" className="pl-10 bg-gray-50 border-gray-200" />
            </div>

            {/* Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Actions</h2>
                <a href="#" className="text-blue-600 text-sm">
                  All actions
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Transfer */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-4">Transfer</h3>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Receive */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-4">Receive</h3>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-gray-600 transform rotate-180" />
                    </div>
                  </div>
                </div>

                {/* Send to Jacob */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-4">Send to Jacob</h3>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Jacob"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Send to Mom */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-4">Send to Mom</h3>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Mom"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfers & Spending */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Transfers to people */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Transfers to people</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">••••</span>
                    <span className="text-xs">9315</span>
                    <button className="p-1 rounded-full bg-gray-100">
                      <Settings className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-lg font-bold">$7,562.12</div>
                  <div className="text-xs text-gray-400">from $10,000</div>
                </div>
                <progress value={75} className="h-2 bg-gray-100" />
                
                <div className="mt-4 text-xs text-gray-400">Limits will be updated on July 5</div>
              </div>

              {/* Spending in June */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">
                    Spending
                    <br />
                    in June
                  </h3>
                </div>
                <div className="mb-2">
                  <div className="text-lg font-bold">$12,562.53</div>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden bg-gray-100">
                  <div className="flex h-full">
                    <div className="bg-red-400 h-full w-1/3"></div>
                    <div className="bg-blue-400 h-full w-1/3"></div>
                    <div className="bg-purple-400 h-full w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-purple-500 rounded-lg p-6 text-white relative overflow-hidden mb-6">
              <div className="max-w-[70%]">
                <h3 className="text-xl font-bold mb-2">Protect your money</h3>
                <p className="text-purple-100 text-sm">
                  Set up two-factor authentication to protect the cards when shopping
                </p>
              </div>
              <div className="absolute right-4 bottom-4">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Security Lock"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-white rounded-lg p-3 border shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Visa"
                    layout="fill"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h4 className="text-sm font-medium">Visa issues</h4>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Mortgage"
                    layout="fill"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h4 className="text-sm font-medium">Mortgage terms</h4>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Cashback"
                    layout="fill"
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h4 className="text-sm font-medium">Cashback up to 50%</h4>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">History</h2>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-3">Today, 13 June</h3>

                {/* Nike Store */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Nike Store</div>
                      <div className="text-xs text-gray-400">Purchase</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-$28.60</div>
                    <div className="text-xs text-gray-400">11:45 AM</div>
                  </div>
                </div>

                {/* Mom */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Mom"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Mom</div>
                      <div className="text-xs text-gray-400">Replenishment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-500">+$100.60</div>
                    <div className="text-xs text-gray-400">9:21 AM</div>
                  </div>
                </div>

                {/* Auchan */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Auchan</div>
                      <div className="text-xs text-gray-400">Purchase</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-$18.13</div>
                    <div className="text-xs text-gray-400">1:12 AM</div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="blue"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Total</div>
                      <div className="text-xs text-gray-400">Purchase</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-$15.13</div>
                    <div className="text-xs text-gray-400">10:44 AM</div>
                  </div>
                </div>
              </div>

              {/* Yesterday */}
              <div className="bg-white rounded-lg p-4 shadow-sm border mt-4">
                <h3 className="font-medium mb-3">Yesterday, 12 June</h3>

                {/* Auchan */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Auchan</div>
                      <div className="text-xs text-gray-400">Purchase</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-$23.75</div>
                    <div className="text-xs text-gray-400">5:46 AM</div>
                  </div>
                </div>

                {/* Apple Store */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.5 8-9 13C6.5 19 3 14.6 3 11a9 9 0 0 1 9-9"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Apple Store</div>
                      <div className="text-xs text-gray-400">Purchase</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">-$999.00</div>
                    <div className="text-xs text-gray-400">6:17 AM</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline" className="text-blue-600">
                  All operations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


MoneyTransferDashboard.authenticateTransfer = {
    permissions:authenticatedUser
}
