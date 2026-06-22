import React, { useState } from 'react';
import { 
  Car, MapPin, Search, Sliders, Plus, X, Users, ArrowRight, ShieldCheck, 
  MapPinned, HelpCircle, Compass, AlarmClock, DollarSign 
} from 'lucide-react';
import { Ride } from '../types';

export default function RideHub() {
  const [filterQuery, setFilterQuery] = useState('');
  const [isAddingRide, setIsAddingRide] = useState(false);
  
  // New Ride Form states
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newPrice, setNewPrice] = useState('120');
  const [newProvider, setNewProvider] = useState('Uber Sedan');
  const [newDepTime, setNewDepTime] = useState('06:30 PM');
  const [newSeats, setNewSeats] = useState(3);

  const [rides, setRides] = useState<Ride[]>([
    {
      id: 'r1',
      from: 'Galgotias University, Main Gate',
      to: 'Noida Sector 62, Metro Stn',
      pricePerPerson: 110,
      timeText: '04:30 PM',
      provider: 'Uber XL',
      seatsAvailable: 2,
      seatsTotal: 4,
      status: 'Leaving Soon',
      timeAgoText: '2 mins ago'
    },
    {
      id: 'r2',
      from: 'Shiv Nadar University',
      to: 'DLF Mall of India',
      pricePerPerson: 85,
      timeText: '05:15 PM',
      provider: 'Ola Prime',
      seatsAvailable: 3,
      seatsTotal: 4,
      status: 'Filling Fast',
      timeAgoText: '15 mins ago'
    },
    {
      id: 'r3',
      from: 'Amity University Sector 125',
      to: 'IGI Airport Terminal 3',
      pricePerPerson: 140,
      timeText: '06:00 PM',
      provider: 'Uber Intercity',
      seatsAvailable: 1,
      seatsTotal: 4,
      status: 'Available',
      timeAgoText: '40 mins ago'
    }
  ]);

  const handleCreateRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom.trim() || !newTo.trim()) return;

    const addedRide: Ride = {
      id: Date.now().toString(),
      from: newFrom,
      to: newTo,
      pricePerPerson: Number(newPrice) || 100,
      timeText: newDepTime,
      provider: newProvider,
      seatsAvailable: newSeats,
      seatsTotal: 4,
      status: 'Available',
      timeAgoText: 'Just now'
    };

    setRides([addedRide, ...rides]);
    
    // Clear state
    setNewFrom('');
    setNewTo('');
    setNewPrice('120');
    setNewProvider('Uber Sedan');
    setIsAddingRide(false);
  };

  const handleAcceptRide = async (id: string) => {
    try {
      const { api } = await import('../api');
      await api.bookRide(id);
      setRides(rides.map(r => {
        if (r.id === id) {
          if (r.isAccepted) return r; // already accepted
          return {
            ...r,
            isAccepted: true,
            seatsAvailable: Math.max(0, r.seatsAvailable - 1)
          };
        }
        return r;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRide = (id: string) => {
    // Just hide it locally
    setRides(rides.map(r => {
      if (r.id === id) {
        return { ...r, isRejected: true };
      }
      return r;
    }));
  };

  const filteredRides = rides.filter(r => 
    r.from.toLowerCase().includes(filterQuery.toLowerCase()) || 
    r.to.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Ride Collaborations Header Banner */}
      <section className="space-y-1">
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-on-surface">
          Ride Collaborations
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Find trustworthy classmates heading your way and split the cab fare securely.
        </p>
      </section>

      {/* Filter / Search Bar Input */}
      <div className="glass-card card-shadow rounded-xl p-3.5 flex gap-3 items-center border border-outline-variant/30">
        <Search className="w-5 h-5 text-outline shrink-0" />
        <input 
          type="text" 
          placeholder="Search target destination..." 
          className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold placeholder:text-outline outline-none text-on-surface"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
        <button className="text-primary hover:bg-primary-fixed/30 p-1.5 rounded-full transition-colors active:scale-95 shrink-0">
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      {/* active rides list */}
      <div className="space-y-4">
        {filteredRides.length === 0 ? (
          <p className="text-center text-xs text-on-surface-variant/70 py-12">
            No rides matching your search listed currently. Host a new ride request!
          </p>
        ) : (
          filteredRides.map((ride) => {
            if (ride.isRejected) return null;

            return (
              <div 
                key={ride.id} 
                className={`glass-card rounded-[22px] overflow-hidden border border-outline-variant/30 transition-all duration-300 ${
                  ride.isAccepted ? 'shadow-lg border-green-500/20 bg-green-500/[0.02]' : 'card-shadow'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Status row and price */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase leading-none ${
                        ride.isAccepted ? 'bg-green-500/10 text-green-700' :
                        ride.status === 'Leaving Soon' ? 'bg-error/15 text-error' :
                        ride.status === 'Filling Fast' ? 'bg-amber-500/15 text-amber-700' :
                        'bg-blue-500/10 text-blue-700'
                      }`}>
                        {ride.isAccepted ? '✓ Request Confirmed' : ride.status}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant/75">
                        {ride.timeAgoText}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-primary font-bold text-lg font-display tracking-tight leading-none">
                        ₹{ride.pricePerPerson}
                      </div>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-on-surface-variant/75">
                        per person
                      </span>
                    </div>
                  </div>

                  {/* Route indicators details map-lines */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-between py-1 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white"></div>
                      <div className="w-0.5 flex-1 bg-outline-variant/45 min-h-[22px] my-1"></div>
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-[9px] font-mono font-bold tracking-wider text-on-surface-variant/70 uppercase">
                          FROM
                        </p>
                        <p className="font-bold text-xs text-on-surface">
                          {ride.from}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-mono font-bold tracking-wider text-on-surface-variant/70 uppercase">
                          TO
                        </p>
                        <p className="font-bold text-xs text-on-surface">
                          {ride.to}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details of the vehicle */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-outline-variant/15 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4 text-on-surface-variant/60" />
                        <span className="font-medium">{ride.provider}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-on-surface-variant/60" />
                        <span className="font-mono font-bold">
                          {ride.seatsAvailable}/{ride.seatsTotal} Seats Left
                        </span>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-[10px] uppercase tracking-wider bg-surface-container-high px-2 pb-0.5 rounded leading-none pt-1">
                      Dep: {ride.timeText}
                    </div>
                  </div>
                </div>

                {/* Bottom accept reject action buttons tray */}
                <div className="flex border-t border-outline-variant/15 overflow-hidden">
                  <button 
                    onClick={() => handleRejectRide(ride.id)}
                    className="flex-1 py-3 text-xs font-bold text-on-surface-variant/80 hover:bg-surface-container-low active:bg-surface-container-high transition-colors outline-none font-display uppercase tracking-wider"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAcceptRide(ride.id)}
                    className={`flex-[1.5] py-3 text-xs font-bold text-white transition-all shadow-md font-display uppercase tracking-wider ${
                      ride.isAccepted 
                        ? 'bg-green-500 shadow-none' 
                        : 'crimson-gradient hover:brightness-105 active:scale-[0.99]'
                    }`}
                  >
                    {ride.isAccepted ? 'Request Active' : 'Accept Ride Share'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FAB Floating action button to generate ride popup */}
      <button 
        onClick={() => setIsAddingRide(true)}
        className="fixed bottom-28 right-5 w-14 h-14 bg-primary hover:bg-primary-container text-white rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-95 transition-all hover:rotate-90 duration-300"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New ride creator modal overlay sheet */}
      {isAddingRide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form 
            onSubmit={handleCreateRide}
            className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up"
          >
            {/* Modal header */}
            <header className="p-4 bg-primary text-white flex justify-between items-center bg-primary">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary-fixed" />
                <div>
                  <h3 className="font-display font-bold text-base leading-none">Host Cab Share</h3>
                  <span className="text-[10px] text-white/70">Split and match with classmates</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddingRide(false)}
                className="p-1.5 hover:bg-white/15 rounded-full transition-colors outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-5 overflow-y-auto space-y-4 max-h-[70vh] bg-background">
              {/* FROM input */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Pick-up Point (FROM)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Hostels / Main Gate Cafe" 
                  required
                  className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white font-medium text-xs text-on-surface outline-none focus:border-primary"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                />
              </div>

              {/* TO input */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Destination Address (TO)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Terminal 3 / Sect 62 Metro" 
                  required
                  className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white font-medium text-xs text-on-surface outline-none focus:border-primary"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                />
              </div>

              {/* Vehicle Type provider */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Vehicle Type / Cab Provider
                </label>
                <select 
                  className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white font-semibold text-xs text-on-surface outline-none focus:border-primary"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                >
                  <option value="Uber XL Mini">Uber XL Mini</option>
                  <option value="Ola Prime sedan">Ola Prime Sedan</option>
                  <option value="Uber Intercity Cab">Uber Intercity Cab</option>
                  <option value="Private Campus Ride">Private Carpool</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Price input */}
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Price (₹) Per Person
                  </label>
                  <input 
                    type="number" 
                    placeholder="120"
                    required
                    className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white font-medium text-xs text-on-surface outline-none focus:border-primary"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Departure Time
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 06:45 PM" 
                    required
                    className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white font-medium text-xs text-on-surface outline-none focus:border-primary"
                    value={newDepTime}
                    onChange={(e) => setNewDepTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="p-4 border-t border-surface-container bg-white flex gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsAddingRide(false)}
                className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-xl font-display font-semibold text-xs text-on-surface-variant"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 crimson-gradient hover:brightness-105 active:scale-95 transition-all text-white font-display font-semibold rounded-xl text-xs shadow-md shadow-primary/10"
              >
                Post Cab Share
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
