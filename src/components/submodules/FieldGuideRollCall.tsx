import React, { useState, useMemo } from 'react';
import { Booking, Passenger } from '../../types';
import { 
  UserCheck, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  ShieldCheck, 
  Download, 
  Printer, 
  LifeBuoy, 
  Anchor, 
  HeartPulse, 
  Compass, 
  FileText,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import { CoastGuardManifestModal } from './CoastGuardManifestModal';

interface FieldGuideRollCallProps {
  bookings: Booking[];
  guideEmail?: string;
  onUpdateStatus?: (bookingId: string, status: any) => void;
}

interface SafetyItem {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  completed: boolean;
}

export const FieldGuideRollCall: React.FC<FieldGuideRollCallProps> = ({
  bookings,
  guideEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Local state for in-memory check-in status (per passenger key)
  const [boardedStatus, setBoardedStatus] = useState<Record<string, 'boarded' | 'pending' | 'noshow'>>({
    'pax-sample-1': 'boarded',
    'pax-sample-2': 'boarded',
  });

  // Pre-departure DOT Safety & Maritime Checklist
  const [safetyChecklist, setSafetyChecklist] = useState<SafetyItem[]>([
    {
      id: 'life_vests',
      title: 'DOT Approved Life Vests (100% PAX Coverage)',
      description: 'Verified correct sizes for all adult passengers, seniors, and mandatory pediatric vests for minors.',
      mandatory: true,
      completed: true,
    },
    {
      id: 'pcg_clearance',
      title: 'Philippine Coast Guard (PCG) Outbound Clearance',
      description: 'Master list submitted to station commander. No active Gale Warning or storm signal advisory.',
      mandatory: true,
      completed: true,
    },
    {
      id: 'trauma_kit',
      title: 'First-Aid & Emergency Medical Kit',
      description: 'Fully stocked with pressure bandages, antiseptic, burn gel, glucose, and marine venom vinegar solutions.',
      mandatory: true,
      completed: false,
    },
    {
      id: 'weather_briefing',
      title: 'PAGASA Marine Weather & Wave Condition Briefing',
      description: 'Sea condition rated moderate/calm. Wave heights under 1.2 meters along northern island channels.',
      mandatory: true,
      completed: true,
    },
    {
      id: 'satellite_radio',
      title: 'VHF Marine Radio & Operations Check-in (CH 16)',
      description: 'Radio check verified with base station dispatch prior to casting off lines.',
      mandatory: false,
      completed: false,
    },
  ]);

  const [opsDispatched, setOpsDispatched] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  // Flatten all passengers with booking context
  const flatPassengers = useMemo(() => {
    const list: Array<{
      pax: Passenger;
      booking: Booking;
      uniqueKey: string;
      specialFlag?: string;
      dietaryFlag?: string;
    }> = [];

    bookings.forEach((b) => {
      // Mock / fallback passengers if list is empty
      const paxes = b.passengers && b.passengers.length > 0 
        ? b.passengers 
        : [
            {
              id: `${b.id}-lead`,
              fullName: b.customer.fullName,
              age: 32,
              gender: 'Female' as const,
              passportOrId: b.bookingRef,
              specialRequirements: b.specialInstructions || 'Standard Pax'
            }
          ];

      paxes.forEach((p, idx) => {
        const uniqueKey = `${b.id}-${p.id || idx}`;
        
        // Derive medical / dietary flags
        let specialFlag = '';
        let dietaryFlag = '';
        const req = (p.specialRequirements || b.specialInstructions || '').toLowerCase();
        
        if (req.includes('asthma') || req.includes('allergy') || req.includes('medical') || req.includes('heart') || req.includes('senior')) {
          specialFlag = p.specialRequirements || 'Medical Flag';
        }
        if (req.includes('halal') || req.includes('vegetarian') || req.includes('vegan') || req.includes('kosher')) {
          dietaryFlag = req.includes('halal') ? 'Halal Menu' : req.includes('veg') ? 'Vegetarian Menu' : 'Special Diet';
        }

        list.push({
          pax: p,
          booking: b,
          uniqueKey,
          specialFlag,
          dietaryFlag
        });
      });
    });

    return list;
  }, [bookings]);

  // Unique tours list
  const uniqueTours = useMemo(() => {
    const map = new Map<string, string>();
    bookings.forEach((b) => {
      map.set(b.tourPackageId, b.tourTitle);
    });
    return Array.from(map.entries());
  }, [bookings]);

  // Filter passengers
  const filteredPassengers = useMemo(() => {
    return flatPassengers.filter((item) => {
      const matchesSearch = 
        item.pax.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.booking.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.booking.customer.phone.includes(searchQuery);

      const matchesTour = selectedTour === 'all' || item.booking.tourPackageId === selectedTour;

      const currentStatus = boardedStatus[item.uniqueKey] || 'pending';
      const matchesStatus = filterStatus === 'all' || currentStatus === filterStatus;

      return matchesSearch && matchesTour && matchesStatus;
    });
  }, [flatPassengers, searchQuery, selectedTour, filterStatus, boardedStatus]);

  // Status statistics
  const totalPaxCount = flatPassengers.length;
  const boardedCount = flatPassengers.filter(
    (p) => (boardedStatus[p.uniqueKey] || 'pending') === 'boarded'
  ).length;
  const pendingCount = flatPassengers.filter(
    (p) => (boardedStatus[p.uniqueKey] || 'pending') === 'pending'
  ).length;
  const noshowCount = flatPassengers.filter(
    (p) => boardedStatus[p.uniqueKey] === 'noshow'
  ).length;
  const medicalFlagsCount = flatPassengers.filter((p) => Boolean(p.specialFlag)).length;

  const togglePassengerStatus = (key: string, nextStatus: 'boarded' | 'pending' | 'noshow') => {
    setBoardedStatus((prev) => ({
      ...prev,
      [key]: nextStatus,
    }));
  };

  const toggleSafetyItem = (id: string) => {
    setSafetyChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const allMandatorySafetyMet = safetyChecklist
    .filter((i) => i.mandatory)
    .every((i) => i.completed);

  const handleDispatchManifestToOps = () => {
    setOpsDispatched(true);
    setTimeout(() => setOpsDispatched(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Field Dispatch Console
              </span>
              <span className="text-xs text-sand-muted">•</span>
              <span className="text-xs text-sand-muted font-mono">DOT Reg: #DOT-NCR-TO-2026-889</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory">
              Tour Guide Roll Call & Passenger Check-In
            </h2>
            <p className="text-xs sm:text-sm text-sand-muted font-light max-w-2xl">
              Real-time boarding terminal for deployed island tour guides. Verify passenger identities, log medical precautions, and complete pre-departure maritime safety clearance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsManifestModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs text-ivory font-medium transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sunset-coral" />
              <span>Official PCG Manifest</span>
            </button>
            <button
              onClick={handleDispatchManifestToOps}
              disabled={opsDispatched}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                opsDispatched 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-sunset-coral hover:bg-sunset-coral/90 text-white shadow-lg shadow-sunset-coral/20'
              }`}
            >
              {opsDispatched ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Transmitted to Operations Base</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Radio Ops Check-In</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-white/[0.08]">
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-sand-muted tracking-wider">Total Manifest</span>
            <div className="text-2xl font-serif-display text-ivory mt-0.5">{totalPaxCount} <span className="text-xs font-sans-body text-sand-muted font-light">Pax</span></div>
          </div>
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Boarded / Present</span>
            <div className="text-2xl font-serif-display text-emerald-400 mt-0.5">{boardedCount} <span className="text-xs font-sans-body text-emerald-300/70 font-light">Checked</span></div>
          </div>
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider">Pending Boarding</span>
            <div className="text-2xl font-serif-display text-amber-300 mt-0.5">{pendingCount} <span className="text-xs font-sans-body text-amber-200/70 font-light">En Route</span></div>
          </div>
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">Medical / Dietary Flags</span>
            <div className="text-2xl font-serif-display text-rose-400 mt-0.5">{medicalFlagsCount} <span className="text-xs font-sans-body text-rose-300/70 font-light">Noted</span></div>
          </div>
        </div>
      </div>

      {/* Pre-Departure DOT Safety Checklist Section */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg text-ivory">
                DOT & Maritime Pre-Departure Safety Checklist
              </h3>
              <p className="text-xs text-sand-muted font-light">
                Mandatory protocols required by the Philippine Coast Guard and Department of Tourism prior to vessel departure.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
              allMandatorySafetyMet 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}>
              {allMandatorySafetyMet ? '✓ Mandatory Items Satisfied' : '! Items Pending Clearance'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {safetyChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSafetyItem(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-ivory'
                  : 'bg-[#070B0E] border-white/10 text-sand-muted hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  item.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/30'
                }`}>
                  {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-ivory">{item.title}</span>
                    {item.mandatory && (
                      <span className="text-[9px] font-mono px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Req
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-sand-muted leading-tight font-light">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0B1014] p-3.5 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search passenger name, booking ref, or phone number..."
            className="w-full bg-[#070B0E] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted focus:outline-none focus:border-sunset-coral/60 transition-colors font-sans-body"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedTour}
            onChange={(e) => setSelectedTour(e.target.value)}
            className="bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral/60 transition-colors font-sans-body"
          >
            <option value="all">All Expeditions & Packages</option>
            {uniqueTours.map(([code, title]) => (
              <option key={code} value={code}>{title}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#070B0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral/60 transition-colors font-sans-body"
          >
            <option value="all">All Statuses ({totalPaxCount})</option>
            <option value="boarded">Boarded ({boardedCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="noshow">No-Show ({noshowCount})</option>
          </select>
        </div>
      </div>

      {/* Passenger Roll Call Card / Table List */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="font-serif-display text-lg text-ivory">
            Passenger Boarding Register ({filteredPassengers.length} of {totalPaxCount})
          </h3>
          <span className="text-xs text-sand-muted font-light">
            Click status to record passenger presence in real-time
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredPassengers.map(({ pax, booking, uniqueKey, specialFlag, dietaryFlag }) => {
            const currentStatus = boardedStatus[uniqueKey] || 'pending';

            return (
              <div 
                key={uniqueKey}
                className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Pax Details */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif-display text-sm font-semibold border ${
                    currentStatus === 'boarded' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : currentStatus === 'noshow'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-white/[0.04] text-ivory border-white/10'
                  }`}>
                    {pax.fullName.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif-display text-base text-ivory font-medium">
                        {pax.fullName}
                      </span>
                      <span className="text-xs text-sand-muted font-mono">
                        ({pax.gender || 'Adult'}, {pax.age ? `${pax.age} yo` : 'Pax'})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-sand-muted border border-white/10">
                        {booking.bookingRef}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-sand-muted font-light flex-wrap">
                      <span>Tour: <strong className="text-ivory font-normal">{booking.tourTitle}</strong></span>
                      <span>•</span>
                      <span>Hotel Pickup: <strong className="text-ivory font-normal">{booking.hotelReservation?.hotelName || 'Terminal Meet Point'}</strong></span>
                    </div>

                    {/* Medical & Dietary Badges */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {specialFlag && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <HeartPulse className="w-3 h-3" />
                          Medical: {specialFlag}
                        </span>
                      )}
                      {dietaryFlag && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Sparkles className="w-3 h-3" />
                          {dietaryFlag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Status Controls */}
                <div className="flex items-center gap-3 flex-wrap justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.04]">
                  <a
                    href={`tel:${booking.customer.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-ivory font-medium transition-all"
                    title="Call Customer Phone"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{booking.customer.phone}</span>
                  </a>

                  {/* 1-Click Status Selector */}
                  <div className="flex items-center p-1 bg-[#070B0E] border border-white/10 rounded-xl gap-1">
                    <button
                      onClick={() => togglePassengerStatus(uniqueKey, 'boarded')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        currentStatus === 'boarded'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Boarded</span>
                    </button>
                    <button
                      onClick={() => togglePassengerStatus(uniqueKey, 'pending')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        currentStatus === 'pending'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>
                    <button
                      onClick={() => togglePassengerStatus(uniqueKey, 'noshow')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        currentStatus === 'noshow'
                          ? 'bg-rose-700 text-white shadow-sm'
                          : 'text-sand-muted hover:text-ivory hover:bg-white/[0.05]'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>No-Show</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPassengers.length === 0 && (
            <div className="text-center py-12 text-sand-muted text-xs space-y-2">
              <UserCheck className="w-8 h-8 mx-auto text-sand-muted/50" />
              <p>No passengers matched the selected query or filters.</p>
            </div>
          )}
        </div>
      </div>

      <CoastGuardManifestModal
        bookings={bookings}
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
      />
    </div>
  );
};
