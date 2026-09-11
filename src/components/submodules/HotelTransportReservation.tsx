import React, { useState } from 'react';
import { Booking, HotelReservation, TransportReservation } from '../../types';
import { 
  Hotel, 
  Car, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Search, 
  X, 
  Printer, 
  Luggage,
  ShieldCheck,
  User,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface HotelTransportReservationProps {
  bookings: Booking[];
  onUpdateHotelReservation: (bookingId: string, hotel: HotelReservation) => void;
  onUpdateTransportReservation: (bookingId: string, transport: TransportReservation) => void;
  isOperatorView: boolean;
}

export const HotelTransportReservation: React.FC<HotelTransportReservationProps> = ({
  bookings,
  onUpdateHotelReservation,
  onUpdateTransportReservation,
  isOperatorView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'hotels' | 'transport'>('hotels');
  
  // Modal Editing State
  const [editingHotelBooking, setEditingHotelBooking] = useState<Booking | null>(null);
  const [hotelForm, setHotelForm] = useState<Partial<HotelReservation>>({});

  const [editingTransportBooking, setEditingTransportBooking] = useState<Booking | null>(null);
  const [transportForm, setTransportForm] = useState<Partial<TransportReservation>>({});

  const filteredBookings = bookings.filter((b) =>
    b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tourTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenHotelModal = (b: Booking) => {
    setEditingHotelBooking(b);
    setHotelForm(b.hotelReservation || {
      id: `htl-${Date.now()}`,
      hotelName: 'Partner Eco-Resort & Suites',
      roomType: 'Deluxe Ocean View Room',
      checkInDate: b.travelDate,
      checkOutDate: b.travelDate,
      nights: 2,
      voucherCode: `HTL-VOUCH-${b.bookingRef.split('-')[2] || '99'}`,
      status: 'Confirmed',
      contactPhone: '+63 917 888 2026',
      notes: 'Breakfast inclusive for 2 adults'
    });
  };

  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelBooking || !hotelForm.hotelName) return;

    const savedHotel: HotelReservation = {
      id: hotelForm.id || `htl-${Date.now()}`,
      hotelName: hotelForm.hotelName || '',
      roomType: hotelForm.roomType || 'Standard',
      checkInDate: hotelForm.checkInDate || editingHotelBooking.travelDate,
      checkOutDate: hotelForm.checkOutDate || editingHotelBooking.travelDate,
      nights: Number(hotelForm.nights) || 1,
      voucherCode: hotelForm.voucherCode || `HTL-${Date.now()}`,
      status: hotelForm.status || 'Confirmed',
      contactPhone: hotelForm.contactPhone || '+63 917 000 0000',
      notes: hotelForm.notes || ''
    };

    onUpdateHotelReservation(editingHotelBooking.id, savedHotel);
    setEditingHotelBooking(null);
  };

  const handleOpenTransportModal = (b: Booking) => {
    setEditingTransportBooking(b);
    setTransportForm(b.transportReservation || {
      id: `trp-${Date.now()}`,
      vehicleType: 'Air-Conditioned Coaster Van',
      driverName: 'Kuya Ronald Mendoza',
      driverContact: '+63 928 333 4444',
      plateNumber: 'NAA-8842',
      pickupLocation: 'Airport Arrival Terminal',
      dropoffLocation: 'Resort Lobby / Wharf',
      pickupTime: '09:00 AM',
      status: 'Dispatched',
      notes: 'Private airport-to-resort transfer'
    });
  };

  const handleSaveTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransportBooking || !transportForm.vehicleType) return;

    const savedTransport: TransportReservation = {
      id: transportForm.id || `trp-${Date.now()}`,
      vehicleType: transportForm.vehicleType || 'Van',
      driverName: transportForm.driverName || 'Designated Driver',
      driverContact: transportForm.driverContact || '+63 900 000 0000',
      plateNumber: transportForm.plateNumber || 'TBA',
      pickupLocation: transportForm.pickupLocation || 'Airport',
      dropoffLocation: transportForm.dropoffLocation || 'Hotel',
      pickupTime: transportForm.pickupTime || '08:00 AM',
      status: transportForm.status || 'Dispatched',
      notes: transportForm.notes || ''
    };

    onUpdateTransportReservation(editingTransportBooking.id, savedTransport);
    setEditingTransportBooking(null);
  };

  return (
    <div className="space-y-8">
      {/* Submodule Header */}
      <div className="bg-[#0B1014] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sunset-coral text-xs font-sans-body tracking-[0.25em] uppercase font-medium">
              <Hotel className="w-4 h-4" />
              <span>Hotel & Transport Logistics</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-light text-ivory tracking-wide">
              Hotel & Transport Logistics Management
            </h1>
            <p className="text-xs sm:text-sm text-sand-muted max-w-2xl font-light leading-relaxed">
              Coordinate partner resort vouchers, manage private coaster vans and speedboats, and dispatch drivers and logistics.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 bg-[#070B0E] p-1.5 rounded-full border border-white/[0.08]">
            <button
              onClick={() => setActiveSubTab('hotels')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans-body tracking-wider transition ${
                activeSubTab === 'hotels'
                  ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
                  : 'text-sand-muted hover:text-ivory'
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              <span>Hotel Vouchers</span>
            </button>
            <button
              onClick={() => setActiveSubTab('transport')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans-body tracking-wider transition ${
                activeSubTab === 'transport'
                  ? 'bg-sunset-coral text-white font-medium shadow-md shadow-sunset-coral/20'
                  : 'text-sand-muted hover:text-ivory'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Transport Fleet</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-sand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search booking ref, guest name, or tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070B0E] border border-white/[0.08] rounded-full pl-10 pr-4 py-2 text-xs text-ivory placeholder-sand-muted/50 focus:outline-none focus:border-sunset-coral"
            />
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((b) => {
          const hotel = b.hotelReservation;
          const transport = b.transportReservation;

          if (activeSubTab === 'hotels') {
            return (
              <div
                key={b.id}
                className="bg-[#0B1014] border border-white/[0.06] hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ivory font-bold">{b.bookingRef}</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {hotel?.status || 'Confirmed'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-display text-xl text-ivory">
                      {hotel?.hotelName || 'Pending Hotel Assignment'}
                    </h3>
                    <p className="text-xs text-sand-muted font-light">{hotel?.roomType || 'Deluxe Room'}</p>
                  </div>

                  <div className="bg-[#070B0E] p-3 rounded-xl border border-white/[0.04] space-y-1.5 text-xs text-sand-muted font-light">
                    <div className="flex justify-between">
                      <span>Voucher Code:</span>
                      <span className="font-mono text-sunset-coral font-bold">{hotel?.voucherCode || 'HTL-GEN-01'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Guest:</span>
                      <span className="text-ivory">{b.customer.fullName} ({b.numPax} Pax)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-In:</span>
                      <span className="text-ivory">{hotel?.checkInDate || b.travelDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-sand-muted font-mono">{b.destination}</span>
                  {isOperatorView && (
                    <button
                      onClick={() => handleOpenHotelModal(b)}
                      className="px-4 py-1.5 bg-white/[0.04] hover:bg-sunset-coral text-ivory hover:text-white rounded-full text-xs transition border border-white/10"
                    >
                      Update Voucher
                    </button>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={b.id}
                className="bg-[#0B1014] border border-white/[0.06] hover:border-white/20 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ivory font-bold">{b.bookingRef}</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-sunset-coral/20 text-sunset-coral border border-sunset-coral/30">
                      {transport?.status || 'Dispatched'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-display text-xl text-ivory">
                      {transport?.vehicleType || '14-Seater Coaster Van'}
                    </h3>
                    <p className="text-xs text-sand-muted font-mono">Plate: {transport?.plateNumber || 'TBA-2026'}</p>
                  </div>

                  <div className="bg-[#070B0E] p-3 rounded-xl border border-white/[0.04] space-y-1.5 text-xs text-sand-muted font-light">
                    <div className="flex justify-between">
                      <span>Driver:</span>
                      <span className="text-ivory font-medium">{transport?.driverName || 'Ronald Mendoza'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup Time:</span>
                      <span className="text-sunset-coral font-mono">{transport?.pickupTime || '09:00 AM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Route:</span>
                      <span className="text-ivory truncate max-w-[150px]">{transport?.pickupLocation || 'Airport'} ➔ {transport?.dropoffLocation || 'Resort'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-sand-muted">{b.numPax} Passengers</span>
                  {isOperatorView && (
                    <button
                      onClick={() => handleOpenTransportModal(b)}
                      className="px-4 py-1.5 bg-white/[0.04] hover:bg-sunset-coral text-ivory hover:text-white rounded-full text-xs transition border border-white/10"
                    >
                      Dispatch Vehicle
                    </button>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Hotel Modal */}
      {editingHotelBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral">
                  {editingHotelBooking.bookingRef}
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Update Hotel Voucher</h3>
              </div>
              <button
                onClick={() => setEditingHotelBooking(null)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHotel} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Hotel / Resort Name</label>
                <input
                  type="text"
                  required
                  value={hotelForm.hotelName || ''}
                  onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Room Type</label>
                  <input
                    type="text"
                    value={hotelForm.roomType || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, roomType: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Voucher Code</label>
                  <input
                    type="text"
                    value={hotelForm.voucherCode || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, voucherCode: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-sunset-coral font-mono focus:outline-none focus:border-sunset-coral font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Check In</label>
                  <input
                    type="date"
                    value={hotelForm.checkInDate || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkInDate: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Check Out</label>
                  <input
                    type="date"
                    value={hotelForm.checkOutDate || ''}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkOutDate: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHotelBooking(null)}
                  className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transport Modal */}
      {editingTransportBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1014] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-xs font-sans-body uppercase tracking-wider text-sunset-coral">
                  {editingTransportBooking.bookingRef}
                </span>
                <h3 className="font-serif-display text-2xl text-ivory">Dispatch Transport Vehicle</h3>
              </div>
              <button
                onClick={() => setEditingTransportBooking(null)}
                className="p-1.5 rounded-full text-sand-muted hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransport} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Vehicle Description</label>
                <input
                  type="text"
                  required
                  value={transportForm.vehicleType || ''}
                  onChange={(e) => setTransportForm({ ...transportForm, vehicleType: e.target.value })}
                  className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Driver Name</label>
                  <input
                    type="text"
                    value={transportForm.driverName || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, driverName: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Plate Number</label>
                  <input
                    type="text"
                    value={transportForm.plateNumber || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, plateNumber: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-sunset-coral font-mono focus:outline-none focus:border-sunset-coral font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Pickup Time</label>
                  <input
                    type="text"
                    value={transportForm.pickupTime || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, pickupTime: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-sand-muted mb-1 font-sans-body">Driver Phone</label>
                  <input
                    type="text"
                    value={transportForm.driverContact || ''}
                    onChange={(e) => setTransportForm({ ...transportForm, driverContact: e.target.value })}
                    className="w-full bg-[#070B0E] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-ivory focus:outline-none focus:border-sunset-coral"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTransportBooking(null)}
                  className="px-4 py-2 rounded-full text-xs text-sand-muted hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-medium bg-sunset-coral text-white shadow-lg shadow-sunset-coral/20"
                >
                  Save Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
