import React, { useState } from 'react';
import { Booking, Passenger } from '../../types';
import { 
  Anchor, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Users, 
  AlertTriangle,
  Send,
  FileCheck2,
  Lock
} from 'lucide-react';
import { RubberStamp } from '../common/RubberStamp';
import { ActionConfirmModal } from '../common/ActionConfirmModal';
import { dispatchAppNotification } from '../../utils/notifications';

interface CoastGuardManifestModalProps {
  bookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  selectedTourId?: string;
  booking?: Booking | null;
}

export const CoastGuardManifestModal: React.FC<CoastGuardManifestModalProps> = ({
  bookings,
  isOpen,
  onClose,
  selectedTourId,
}) => {
  const [vesselName, setVesselName] = useState('M/B EL NIDO HORIZON-III');
  const [captainName, setCaptainName] = useState('Capt. Danilo Magbanua (Lic: MARINA-2018-9412)');
  const [departurePort, setDeparturePort] = useState('El Nido Ferry Terminal / Bacuit Bay Harbor');
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>(selectedTourId || 'all');
  const [isManifestLocked, setIsManifestLocked] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  if (!isOpen) return null;

  // Filter bookings if a specific tour is selected
  const filteredBookings = bookings.filter(b => 
    selectedTourFilter === 'all' || b.tourPackageId === selectedTourFilter
  );

  // Compile full passenger list
  const manifestPassengers: Array<{
    paxNumber: number;
    fullName: string;
    age: number;
    gender: string;
    nationality: string;
    passportOrId: string;
    emergencyContact: string;
    specialRequirements: string;
    boardingStatus: string;
    bookingRef: string;
    tourTitle: string;
    paymentStatus: string;
  }> = [];

  let paxCounter = 1;
  let hasUnpaidPassengers = false;

  filteredBookings.forEach((booking) => {
    const isPaid = booking.paymentStatus === 'Paid' || booking.paymentVerificationStatus === 'Verified';
    if (!isPaid) {
      hasUnpaidPassengers = true;
    }

    const paxes = booking.passengers && booking.passengers.length > 0 
      ? booking.passengers 
      : [
          {
            id: `${booking.id}-lead`,
            fullName: booking.customer.fullName,
            age: 32,
            gender: 'Female' as const,
            nationality: booking.customer.nationality || 'Filipino',
            passportOrId: booking.bookingRef,
            specialRequirements: booking.specialInstructions || 'None',
            boardingStatus: 'boarded' as const,
          }
        ];

    paxes.forEach((p) => {
      manifestPassengers.push({
        paxNumber: paxCounter++,
        fullName: p.fullName,
        age: p.age || 30,
        gender: p.gender || 'Female',
        nationality: p.nationality || booking.customer.nationality || 'Filipino',
        passportOrId: p.passportOrId || booking.bookingRef,
        emergencyContact: `${booking.customer.phone} (${booking.customer.email})`,
        specialRequirements: p.specialRequirements || booking.specialInstructions || 'None',
        boardingStatus: p.boardingStatus || 'boarded',
        bookingRef: booking.bookingRef,
        tourTitle: booking.tourTitle,
        paymentStatus: booking.paymentStatus || 'Pending',
      });
    });
  });

  const uniqueTours = Array.from(new Set(bookings.map(b => b.tourPackageId))).map(id => {
    const found = bookings.find(b => b.tourPackageId === id);
    return { id, title: found?.tourTitle || id };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmLockAndTransmit = () => {
    setIsManifestLocked(true);
    setIsConfirmModalOpen(false);

    dispatchAppNotification({
      title: 'Manifest Cleared & Transmitted',
      message: `Outbound roster for ${manifestPassengers.length} PAX transmitted to Philippine Coast Guard El Nido Station.`,
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Controls Toolbar (Screen-Only) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-[#0A101D] text-white shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-ivory">Philippine Coast Guard (PCG) Official Manifest</h2>
                {isManifestLocked && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Lock className="w-3 h-3" />
                    <span>Locked & Filed</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Standard Maritime Boarding Roster & Vessel Outbound Clearance Document</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedTourFilter}
              onChange={(e) => setSelectedTourFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="all">All Island Expeditions ({manifestPassengers.length} PAX)</option>
              {uniqueTours.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>

            {!isManifestLocked ? (
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                className="btn-pop btn-shimmer-wrap flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit & Transmit Clearance</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cleared with Port Authority</span>
              </span>
            )}

            <button
              onClick={handlePrint}
              className="btn-pop flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Manifest</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Manifest Printable Content Sheet */}
        <div className="overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0 print:overflow-visible relative">
          
          {/* Document Physical Rubber Stamp Placement */}
          <div className="absolute top-8 right-8 z-10 pointer-events-none hidden sm:block">
            <RubberStamp
              type={isManifestLocked ? 'VERIFIED' : hasUnpaidPassengers ? 'UNPAID' : 'PAID'}
              subtext={isManifestLocked ? 'PCG STATION CLEARED' : hasUnpaidPassengers ? 'COLLECTION PENDING' : 'ALL FARES SETTLED'}
              date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              verificationCode={`PCG-ELN-${Math.floor(100000 + Math.random() * 900000)}`}
              size="md"
              rotation={isManifestLocked ? -8 : -12}
              className="animate-stamp-drop shadow-2xl"
            />
          </div>

          {/* Official PCG Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-left text-[11px] text-slate-600 uppercase font-mono">
                FORM PCG-MR-2026<br />
                MARINA COMPLIANT<br />
                <span className="text-[10px] text-slate-400">SERIAL: HTT-MNF-9941</span>
              </div>
              <div className="text-center px-4">
                <div className="text-xs tracking-widest uppercase font-semibold text-slate-600">Republic of the Philippines</div>
                <div className="text-lg sm:text-xl font-bold tracking-wider uppercase text-slate-950 font-serif">Department of Transportation & Maritime Safety</div>
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-900">Philippine Coast Guard Auxiliary • Palawan District</div>
              </div>
              <div className="text-right text-[11px] text-slate-600 uppercase font-mono">
                STATION: EL NIDO<br />
                CLASS: COMMERCIAL EXPEDITION<br />
                <span className="text-[10px] text-slate-400">VALID: {new Date().toLocaleDateString('en-US')}</span>
              </div>
            </div>
            <div className="mt-3 text-sm font-bold uppercase tracking-wider bg-slate-100 py-1.5 px-4 rounded border border-slate-300">
              OFFICIAL PASSENGER MANIFEST & VESSEL CLEARANCE ROSTER
            </div>
          </div>

          {/* Vessel & Departure Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs mb-6">
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-semibold">Authorized Vessel:</span>
              <span className="font-bold text-slate-900">{vesselName}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-semibold">Master / Boat Captain:</span>
              <span className="font-bold text-slate-900">{captainName}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-semibold">Point of Departure:</span>
              <span className="font-bold text-slate-900">{departurePort}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-semibold">Departure Date & Time:</span>
              <span className="font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 08:30 AM PHT</span>
            </div>
          </div>

          {/* Passenger Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-300 text-slate-800 uppercase font-semibold text-[11px]">
                  <th className="p-2.5 w-10 text-center border-r border-slate-300">#</th>
                  <th className="p-2.5 border-r border-slate-300">Passenger Full Legal Name</th>
                  <th className="p-2.5 w-14 text-center border-r border-slate-300">Age</th>
                  <th className="p-2.5 w-16 text-center border-r border-slate-300">Gender</th>
                  <th className="p-2.5 border-r border-slate-300">Nationality</th>
                  <th className="p-2.5 border-r border-slate-300">ID / Passport Ref</th>
                  <th className="p-2.5 border-r border-slate-300">Tour & Booking Ref</th>
                  <th className="p-2.5 text-center border-r border-slate-300">Fare Status</th>
                  <th className="p-2.5 text-center">Boarding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {manifestPassengers.map((p) => {
                  const isPaxPaid = p.paymentStatus === 'Paid';
                  return (
                    <tr key={p.paxNumber} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-center font-mono font-medium border-r border-slate-200 text-slate-600">
                        {p.paxNumber}
                      </td>
                      <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">
                        {p.fullName}
                        {p.specialRequirements !== 'None' && (
                          <span className="block text-[10px] text-amber-700 font-normal">
                            Note: {p.specialRequirements}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">{p.age}</td>
                      <td className="p-2 text-center border-r border-slate-200">{p.gender}</td>
                      <td className="p-2 border-r border-slate-200">{p.nationality}</td>
                      <td className="p-2 font-mono text-[11px] border-r border-slate-200">
                        {p.passportOrId === 'No ID (To Follow)' || p.passportOrId?.toLowerCase().includes('follow') ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                            To Follow / None
                          </span>
                        ) : (
                          p.passportOrId
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-medium text-slate-800">{p.tourTitle}</div>
                        <div className="font-mono text-[10px] text-slate-500">{p.bookingRef}</div>
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isPaxPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {isPaxPaid ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.boardingStatus === 'boarded' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.boardingStatus === 'noshow'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.boardingStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary & Sign-off Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-300 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 font-semibold uppercase text-[10px]">Total Manifested Passengers:</div>
              <div className="text-2xl font-bold text-slate-900 font-mono">{manifestPassengers.length} PAX</div>
              <div className="text-[11px] text-slate-500">Maximum Licensed Vessel Capacity: 30 PAX</div>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                SEC-ID: PAL-CG-{new Date().getFullYear()}-{manifestPassengers.length}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="border-b border-slate-400 pb-1 w-48 text-center font-semibold text-slate-900">
                  {captainName.split('(')[0]}
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Master / Licensed Boat Captain Signature</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="border-b border-slate-400 pb-1 w-48 text-center text-slate-500">
                  {isManifestLocked ? 'PCG-STATION-OFFICER-04' : '___________________________'}
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">PCG Duty Officer Stamp & Clearance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Safeguard for Outbound Clearance */}
      <ActionConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmLockAndTransmit}
        title="File & Transmit Manifest to Coast Guard?"
        message="This will lock the passenger manifest for this vessel departure and submit the certified roster to the Philippine Coast Guard El Nido Station."
        details={[
          { label: 'Authorized Vessel', value: vesselName },
          { label: 'Total Passengers', value: `${manifestPassengers.length} PAX` },
          { label: 'Departure Port', value: departurePort },
          { label: 'Licensed Captain', value: captainName.split('(')[0] }
        ]}
        confirmText="Yes, Transmit Clearance"
        cancelText="No, Review Passenger List"
        variant="primary"
        warningNote={hasUnpaidPassengers ? 'Notice: Some passengers on this roster are marked as UNPAID. Verify payment before vessel departure.' : undefined}
      />
    </div>
  );
};
