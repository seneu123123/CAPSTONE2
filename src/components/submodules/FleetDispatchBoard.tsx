import React, { useState } from 'react';
import { Booking, TourPackage } from '../../types';
import { 
  Compass, 
  Anchor, 
  Navigation, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Plus, 
  Radio, 
  Car,
  LifeBuoy
} from 'lucide-react';

interface FleetDispatchBoardProps {
  bookings: Booking[];
  packages?: TourPackage[];
}

interface FleetCraft {
  id: string;
  name: string;
  type: 'Motorized Banca' | 'Speedboat' | 'Tourist Van' | 'Coaster';
  registrationNo: string;
  assignedTour: string;
  assignedGuide: string;
  operatorCaptain: string;
  operatorContact: string;
  maxCapacity: number;
  currentPax: number;
  status: 'Cleared to Sail' | 'Pending Inspection' | 'Weather Hold' | 'Maintenance';
  departureTime: string;
  dockPier: string;
}

export const FleetDispatchBoard: React.FC<FleetDispatchBoardProps> = ({ bookings }) => {
  const [filterType, setFilterType] = useState<string>('all');
  
  // Fleet registry sample data
  const [fleet, setFleet] = useState<FleetCraft[]>([
    {
      id: 'craft-banca-01',
      name: 'MBCA Coron Pearl Explorer',
      type: 'Motorized Banca',
      registrationNo: 'PCG-PLW-2024-8819',
      assignedTour: 'Coron Ultimate Island Hopping & Kayangan Lake',
      assignedGuide: 'Michael Baynosa',
      operatorCaptain: 'Capt. Rolly Tan (Master Mariner)',
      operatorContact: '+63 920 111 2233',
      maxCapacity: 18,
      currentPax: 14,
      status: 'Cleared to Sail',
      departureTime: '07:30 AM',
      dockPier: 'Coron Municipal Wharf, Berth 3',
    },
    {
      id: 'craft-banca-02',
      name: 'MBCA El Nido Dreamer II',
      type: 'Motorized Banca',
      registrationNo: 'PCG-PLW-2025-4410',
      assignedTour: 'El Nido Tour A - Secret Lagoon & Shimizu Island',
      assignedGuide: 'Kyle Dulay',
      operatorCaptain: 'Capt. Jose Macaraeg',
      operatorContact: '+63 921 222 3344',
      maxCapacity: 20,
      currentPax: 18,
      status: 'Cleared to Sail',
      departureTime: '08:00 AM',
      dockPier: 'Bacuit Bay Main Slipway',
    },
    {
      id: 'craft-van-01',
      name: 'Toyota HiAce Grandia Executive 01',
      type: 'Tourist Van',
      registrationNo: 'DOT-NCR-VAN-901',
      assignedTour: 'Puerto Princesa Underground River Overland Transfer',
      assignedGuide: 'Michael Baynosa',
      operatorCaptain: 'Driver Eduardo Santos',
      operatorContact: '+63 917 555 6677',
      maxCapacity: 12,
      currentPax: 10,
      status: 'Cleared to Sail',
      departureTime: '06:00 AM',
      dockPier: 'Puerto Princesa Airport Terminal 2 Stand',
    },
    {
      id: 'craft-van-02',
      name: 'Toyota Commuter Deluxe 04',
      type: 'Tourist Van',
      registrationNo: 'DOT-NCR-VAN-904',
      assignedTour: 'Cebu - Bohol Ferry Link & Chocolate Hills Tour',
      assignedGuide: 'Ilona May Ambe',
      operatorCaptain: 'Driver Danilo Ramos',
      operatorContact: '+63 918 666 7788',
      maxCapacity: 14,
      currentPax: 14,
      status: 'Pending Inspection',
      departureTime: '08:30 AM',
      dockPier: 'Tagbilaran Seaport Arrival Bay',
    },
    {
      id: 'craft-speed-01',
      name: 'Speedcraft Blue Horizon',
      type: 'Speedboat',
      registrationNo: 'PCG-MPH-2026-1120',
      assignedTour: 'Siargao Sohoton Cove & Tri-Island VIP Charter',
      assignedGuide: 'Michael Baynosa',
      operatorCaptain: 'Capt. Vincent Cruz',
      operatorContact: '+63 919 777 8899',
      maxCapacity: 10,
      currentPax: 6,
      status: 'Weather Hold',
      departureTime: '09:00 AM',
      dockPier: 'General Luna Boulevard Jetty',
    },
  ]);

  const updateStatus = (id: string, nextStatus: FleetCraft['status']) => {
    setFleet(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
  };

  const filteredFleet = fleet.filter(c => filterType === 'all' || c.type === filterType);

  const clearedCount = fleet.filter(c => c.status === 'Cleared to Sail').length;
  const pendingCount = fleet.filter(c => c.status === 'Pending Inspection').length;
  const weatherHoldCount = fleet.filter(c => c.status === 'Weather Hold').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1014] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Maritime & Fleet Logistics Command
              </span>
              <span className="text-xs text-sand-muted">•</span>
              <span className="text-xs text-sand-muted font-mono">PCG Radio: VHF CH 16 Active</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-ivory">
              Vessel & Transport Fleet Dispatch Board
            </h2>
            <p className="text-xs sm:text-sm text-sand-muted font-light max-w-2xl">
              Monitor Philippine Coast Guard (PCG) sailing clearance, outrigger banca capacity allocations, and tourist van manifests to prevent vessel overloading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-ivory font-mono">
              Coast Guard Alert Level: <strong className="text-emerald-400">Normal / Calm</strong>
            </div>
          </div>
        </div>

        {/* Fleet Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-white/[0.08]">
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Cleared to Sail / Depart</span>
            <div className="text-2xl font-serif-display text-emerald-400 mt-0.5">{clearedCount} <span className="text-xs font-sans-body text-emerald-300/70 font-light">Craft</span></div>
          </div>
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider">Pending PCG Clearance</span>
            <div className="text-2xl font-serif-display text-amber-300 mt-0.5">{pendingCount} <span className="text-xs font-sans-body text-amber-200/70 font-light">At Dock</span></div>
          </div>
          <div className="bg-[#070B0E] p-3.5 rounded-xl border border-rose-500/20">
            <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">Weather / Maintenance Hold</span>
            <div className="text-2xl font-serif-display text-rose-400 mt-0.5">{weatherHoldCount} <span className="text-xs font-sans-body text-rose-300/70 font-light">Anchored</span></div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 bg-[#0B1014] p-3 rounded-2xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterType === 'all' ? 'bg-sunset-coral text-white' : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
          }`}
        >
          All Fleet Craft ({fleet.length})
        </button>
        <button
          onClick={() => setFilterType('Motorized Banca')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterType === 'Motorized Banca' ? 'bg-blue-600 text-white' : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
          }`}
        >
          Outrigger Bancas
        </button>
        <button
          onClick={() => setFilterType('Tourist Van')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterType === 'Tourist Van' ? 'bg-emerald-600 text-white' : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
          }`}
        >
          Tourist Vans
        </button>
        <button
          onClick={() => setFilterType('Speedboat')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filterType === 'Speedboat' ? 'bg-purple-600 text-white' : 'bg-[#070B0E] text-sand-muted hover:text-ivory border border-white/10'
          }`}
        >
          Speedboats
        </button>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFleet.map((craft) => {
          const loadPercentage = Math.round((craft.currentPax / craft.maxCapacity) * 100);
          const isNearOverload = loadPercentage >= 90;

          return (
            <div 
              key={craft.id}
              className="bg-[#0B1014] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    {craft.type.includes('Van') ? <Car className="w-5 h-5" /> : <Anchor className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-serif-display text-lg text-ivory font-medium">
                      {craft.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-sand-muted font-mono">
                      <span>{craft.type}</span>
                      <span>•</span>
                      <span>{craft.registrationNo}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
                  craft.status === 'Cleared to Sail'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : craft.status === 'Pending Inspection'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {craft.status}
                </span>
              </div>

              {/* Expedition & Location info */}
              <div className="bg-[#070B0E] p-3 rounded-xl border border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-ivory font-medium">
                  <Compass className="w-3.5 h-3.5 text-sunset-coral" />
                  <span>{craft.assignedTour}</span>
                </div>
                <div className="flex items-center justify-between text-sand-muted font-light pt-1">
                  <span>Dock / Stand: <strong className="text-ivory font-normal">{craft.dockPier}</strong></span>
                  <span>ETD: <strong className="text-amber-300 font-normal">{craft.departureTime}</strong></span>
                </div>
              </div>

              {/* Seating Capacity Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-sand-muted">
                    Seating Manifest: <strong className="text-ivory">{craft.currentPax} / {craft.maxCapacity} Pax</strong>
                  </span>
                  <span className={`font-mono font-bold ${isNearOverload ? 'text-amber-300' : 'text-emerald-400'}`}>
                    {loadPercentage}% Loaded
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      loadPercentage >= 100 
                        ? 'bg-rose-500' 
                        : isNearOverload 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Personnel & Quick Dispatch Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06] text-xs">
                <div className="text-sand-muted">
                  Guide: <strong className="text-ivory">{craft.assignedGuide}</strong> | Master: <strong className="text-ivory">{craft.operatorCaptain}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={craft.status}
                    onChange={(e) => updateStatus(craft.id, e.target.value as any)}
                    className="bg-[#070B0E] border border-white/10 rounded-lg px-2 py-1 text-xs text-ivory focus:outline-none"
                  >
                    <option value="Cleared to Sail">Cleared to Sail</option>
                    <option value="Pending Inspection">Pending PCG</option>
                    <option value="Weather Hold">Weather Hold</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <a
                    href={`tel:${craft.operatorContact}`}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-emerald-400 transition-all border border-white/10"
                    title="Call Vessel Master / Driver"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
