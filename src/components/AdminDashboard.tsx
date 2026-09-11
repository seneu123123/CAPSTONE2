import React from 'react';
import { Booking, CustomerFeedback, TourPackage } from '../types';
import { 
  TrendingUp, 
  MapPin, 
  UserCheck, 
  CreditCard, 
  Star, 
  CheckCircle2, 
  Hotel, 
  Car, 
  ArrowRight,
  Layers,
  Sparkles,
  Calendar,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Ship,
  Receipt,
  ClipboardCheck,
  Users
} from 'lucide-react';
import { hasTabAccess, findStaffAccountByEmail } from '../utils/rbac';

interface AdminDashboardProps {
  packages: TourPackage[];
  bookings: Booking[];
  feedbacks: CustomerFeedback[];
  adminRole?: string;
  adminEmail?: string;
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  packages,
  bookings,
  feedbacks,
  adminRole = 'Super Admin',
  adminEmail = 'karlljacob8@gmail.com',
  onNavigateTab
}) => {
  const staffAccount = findStaffAccountByEmail(adminEmail);
  const userContext = staffAccount || { email: adminEmail, role: adminRole };
  const canAccess = (tab: any) => hasTabAccess(userContext, tab);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.invoice.amountPaid, 0);
  const pendingRevenue = bookings.reduce((sum, b) => sum + b.invoice.balanceDue, 0);
  const activePackagesCount = packages.filter((p) => p.status === 'Active').length;
  const confirmedBookingsCount = bookings.filter((b) => b.bookingStatus === 'Confirmed').length;
  const totalPassengersCount = bookings.reduce((sum, b) => sum + (b.passengers?.length || b.numPax || 1), 0);

  const isGuide = adminRole.includes('Guide');
  const isFinance = adminRole.includes('Finance');
  const isOps = adminRole.includes('Operations');

  return (
    <div className="space-y-8">
      {/* Overview Welcome Banner */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sunset-coral/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-sans-body tracking-[0.25em] uppercase text-sunset-coral font-medium">
              {isGuide ? 'Field Guide Dispatch Hub' : isFinance ? 'Finance & Revenue Ledger' : isOps ? 'Fleet & Logistics Command' : 'Operations Control Tower'}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory tracking-wide leading-tight">
              {isGuide ? (
                <>My Assigned Expeditions & <br /><span className="italic font-normal text-white">Passenger Roster</span></>
              ) : isFinance ? (
                <>Fiscal Reconciliation & <br /><span className="italic font-normal text-white">Accounts Receivable</span></>
              ) : isOps ? (
                <>Tour Logistics, Fleet & <br /><span className="italic font-normal text-white">Manifest Operations</span></>
              ) : (
                <>Tour Operations & <br /><span className="italic font-normal text-white">Booking Management System</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              {isGuide 
                ? 'Welcome back, Michael. Manage your daily passenger roll call, safety briefings, emergency contacts, and tour schedules.'
                : isFinance
                ? 'Welcome back, Ilona. Verify multi-channel payments, monitor downpayment aging, and generate official BIR 2307 tax receipts.'
                : isOps
                ? 'Welcome back, Kyle. Coordinate vessel dispatch, avoid craft overloading, assign guides, and oversee bookings.'
                : 'Integrated operational suite managing core submodules: Catalog, Manifests, Dispatch, Logistics, Reconciliation, and RBAC.'}
            </p>
          </div>
        </div>

        {/* Role-Sanitized Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.08]">
          {isGuide ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  My Assigned Tours
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  {bookings.length} <span className="text-sm font-sans-body text-sand-muted font-light">Runs</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Active assigned expedition schedules
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Passengers in Care
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {totalPassengersCount} <span className="text-sm font-sans-body text-sand-muted font-light">Pax</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Confirmed on active manifests
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  DOT Safety Status
                </span>
                <div className="font-serif-display text-3xl text-amber-300">
                  100% DOT
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Life vest & maritime clearance active
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Next Departure
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  07:30 AM
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Coron Municipal Wharf, Berth 3
                </div>
              </div>
            </>
          ) : isFinance ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Total Collected (YTD)
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  ₱{totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Verified payments cleared
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Pending Receivables
                </span>
                <div className="font-serif-display text-3xl text-amber-300">
                  ₱{pendingRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Outstanding balance due
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Unverified Downpayments
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {bookings.filter(b => b.paymentStatus !== 'Paid').length} <span className="text-sm font-sans-body text-sand-muted font-light">Records</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Requires cashier reconciliation
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  VAT Output (12%)
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  ₱{(totalRevenue - totalRevenue / 1.12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  BIR Form 2550M ledger
                </div>
              </div>
            </>
          ) : isOps ? (
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Expeditions
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  {activePackagesCount} <span className="text-sm font-sans-body text-sand-muted font-light">Packages</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {packages.length} total inventory routes
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Passengers Manifested
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {totalPassengersCount} <span className="text-sm font-sans-body text-sand-muted font-light">Pax</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {confirmedBookingsCount} confirmed bookings
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-blue-500/20 space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Vessels & Vans Deployed
                </span>
                <div className="font-serif-display text-3xl text-blue-400">
                  5 Active
                </div>
                <div className="text-xs text-sand-muted font-light">
                  Bancas, vans & speedboats
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Customer CSAT
                </span>
                <div className="font-serif-display text-3xl text-amber-400 flex items-center gap-1.5">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {feedbacks.length} traveler reviews
                </div>
              </div>
            </>
          ) : (
            // Super Admin Overview
            <>
              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Total Revenue Collected
                </span>
                <div className="font-serif-display text-3xl text-emerald-400">
                  ₱{totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-sand-muted font-light">
                  ₱{pendingRevenue.toLocaleString()} pending balance
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Manifest Bookings
                </span>
                <div className="font-serif-display text-3xl text-ivory">
                  {confirmedBookingsCount} <span className="text-sm font-sans-body text-sand-muted font-light">Confirmed</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {bookings.length} total registered records
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Active Tour Catalog
                </span>
                <div className="font-serif-display text-3xl text-sunset-coral">
                  {activePackagesCount} <span className="text-sm font-sans-body text-sand-muted font-light">Packages</span>
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {packages.length} total inventory items
                </div>
              </div>

              <div className="bg-[#070B0E] p-5 rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-[11px] font-sans-body tracking-wider uppercase text-sand-muted">
                  Guest CSAT Rating
                </span>
                <div className="font-serif-display text-3xl text-amber-400 flex items-center gap-1.5">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-sand-muted font-light">
                  {feedbacks.length} verified traveler reviews
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submodule Quick Access Hub (Role Filtered) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-sans-body tracking-[0.25em] uppercase text-sand-muted font-medium">
            Authorized Submodules Directory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Submodule: Field Guide Roll Call */}
          {canAccess('guide_roster') && (
            <div
              onClick={() => onNavigateTab('guide_roster')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-emerald-500/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Field Guide Roll Call & Check-In
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Real-time passenger boarding terminal, medical and dietary precaution tags, and pre-departure safety checklist.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-emerald-400 font-medium">
                Live Check-In Terminal →
              </div>
            </div>
          )}

          {/* Submodule: Packages */}
          {canAccess('packages') && (
            <div
              onClick={() => onNavigateTab('packages')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Tour Package & Catalog Management
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Create and configure archipelago expeditions, itineraries, inclusions, pricing rules, and capacity limits.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {packages.length} Packages Configured →
              </div>
            </div>
          )}

          {/* Submodule: Bookings */}
          {canAccess('bookings') && (
            <div
              onClick={() => onNavigateTab('bookings')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  {isFinance ? 'Billing & Financial Manifest' : isGuide ? 'My Passenger Manifest' : 'Booking & Passenger Manifest'}
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  {isFinance 
                    ? 'Verify passenger billing records, deposit vouchers, and outstanding balance collections.'
                    : 'Track guest reservations, manage passenger manifests, verify identities, and monitor pickup locations.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {bookings.length} Bookings on Record →
              </div>
            </div>
          )}

          {/* Submodule: Fleet Dispatch */}
          {canAccess('fleet_dispatch') && (
            <div
              onClick={() => onNavigateTab('fleet_dispatch')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-blue-500/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    <Ship className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Fleet & Vessel Dispatch Board
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Monitor Philippine Coast Guard sailing status, banca capacities, tourist van allocations, and assigned boat captains.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-blue-400 font-medium">
                Maritime Dispatch Console →
              </div>
            </div>
          )}

          {/* Submodule: Itineraries */}
          {canAccess('itineraries') && (
            <div
              onClick={() => onNavigateTab('itineraries')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  {isGuide ? 'My Assigned Tour Schedules' : 'Tour Scheduling & Guide Dispatch'}
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  {isGuide 
                    ? 'View day-by-day itineraries, meal arrangements, and assigned hotel drop-off locations.'
                    : 'Schedule departure dates, assign certified local guides, and monitor daily activity milestone timelines.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {isGuide ? 'View My Calendar →' : 'Live Guide Dispatch →'}
              </div>
            </div>
          )}

          {/* Submodule: Hotel & Transport */}
          {canAccess('reservations') && (
            <div
              onClick={() => onNavigateTab('reservations')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Hotel & Transport Logistics
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Issue partner hotel vouchers, arrange private coaster vans & speedboats, and manage logistics contacts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                Vouchers & Vehicles →
              </div>
            </div>
          )}

          {/* Submodule: Payment Gate Audit */}
          {canAccess('payment_gate') && (
            <div
              onClick={() => onNavigateTab('payment_gate')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-emerald-500/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Payment Gate & Receipt Audit
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Dedicated anti-fraud gate for Finance and Super Admin. Inspect uploaded client receipt photos, match transaction reference numbers, and detect duplicate submissions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-emerald-400 font-medium">
                Verify Proof of Payment →
              </div>
            </div>
          )}

          {/* Submodule: Payments */}
          {canAccess('payments') && (
            <div
              onClick={() => onNavigateTab('payments')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Billing, Invoices & Payments
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Generate official invoices, verify GCash, Maya, and bank transfers, and balance outstanding accounts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                Ledger & Payments →
              </div>
            </div>
          )}

          {/* Submodule: Fiscal Reconciliation */}
          {canAccess('reconciliation') && (
            <div
              onClick={() => onNavigateTab('reconciliation')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-amber-400/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Fiscal Reconciliation & Payouts
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Channel settlements (GCash, Maya, Wire Transfers), downpayment aging analysis, and BIR 2307 Official Receipts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-amber-300 font-medium">
                Tax & Settlement Hub →
              </div>
            </div>
          )}

          {/* Submodule: Feedback */}
          {canAccess('feedback') && (
            <div
              onClick={() => onNavigateTab('feedback')}
              className="bg-[#0B1014] border border-white/[0.06] hover:border-sunset-coral/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-sunset-coral/10 text-sunset-coral">
                    <Star className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-sunset-coral group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Customer Feedback & CSAT Moderation
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Collect post-tour ratings, calculate Net Promoter Scores, and moderate customer testimonials.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-sunset-coral font-medium">
                {feedbacks.length} Feedback Submissions →
              </div>
            </div>
          )}

          {/* Submodule: Staff & RBAC Governance */}
          {canAccess('rbac') && (
            <div
              onClick={() => onNavigateTab('rbac')}
              className="bg-[#0B1014] border border-rose-500/20 hover:border-rose-500/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-sand-muted group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-serif-display text-xl text-ivory group-hover:text-white transition-colors">
                  Staff & RBAC Governance Center
                </h3>
                <p className="text-xs text-sand-muted mt-2 font-light leading-relaxed">
                  Manage staff roles, cryptographic TOTP 2FA, granular sub-permissions, and immutable security audit chains.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-rose-400 font-medium">
                Super Admin Security Console →
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
