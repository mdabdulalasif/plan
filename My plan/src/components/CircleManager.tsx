import React, { useState } from 'react';
import { Users, PlusCircle, Phone, Mail, Clock, Calendar, CheckSquare, MessageSquare, Trash2, ShieldAlert, Award, Radio, Filter, Map, Heart, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contact, ContactCategory, ContactTier, ContactNote } from '../types';

interface CircleManagerProps {
  contacts: Contact[];
  onUpdateContacts: (updated: Contact[]) => void;
  onShareToCommunity: (content: string, type: 'Knowledge' | 'Habit Milestone', refTag: string) => void;
}

export default function CircleManager({ contacts, onUpdateContacts, onShareToCommunity }: CircleManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterTier, setFilterTier] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // New contact states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCategory, setNewCategory] = useState<ContactCategory>('Family');
  const [newTier, setNewTier] = useState<ContactTier>('Good');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLastContact, setNewLastContact] = useState('2026-05-20');
  const [newNote, setNewNote] = useState('');

  // Quick note log state
  const [quickNoteText, setQuickNoteText] = useState('');

  const categories: ContactCategory[] = ['Family', 'Friend', 'Colleague', 'Professional', 'Target Connect'];
  const tiers: ContactTier[] = ['Core', 'Good', 'Better', 'Best'];

  // Avatar colors
  const gradients = [
    'from-purple-500 to-indigo-500',
    'from-amber-500 to-red-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-pink-500 to-purple-500'
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Default contact frequencies (reminders)
    let days = 30;
    if (newTier === 'Core') days = 7;
    else if (newTier === 'Better') days = 14;
    else if (newTier === 'Best') days = 21;

    const initialNotesList: ContactNote[] = [];
    if (newNote.trim()) {
      initialNotesList.push({
        id: 'note-' + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        content: newNote.trim()
      });
    }

    const newContact: Contact = {
      id: 'contact-' + Math.random().toString(36).substr(2, 9),
      userId: 'current',
      name: newName.trim(),
      role: newRole.trim() || 'Connection Partner',
      category: newCategory,
      tier: newTier,
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      lastContactDate: newLastContact || undefined,
      frequencyDays: days,
      notes: initialNotesList,
      avatarColor: gradients[Math.floor(Math.random() * gradients.length)]
    };

    const updated = [newContact, ...contacts];
    onUpdateContacts(updated);

    // Notify community
    onShareToCommunity(
      `Just connected with ${newContact.name} as a ${newContact.tier} circle member in the ${newContact.category} group. Building bridges!`,
      'Knowledge',
      newContact.category
    );

    // Reset Form
    setNewName('');
    setNewRole('');
    setNewCategory('Family');
    setNewTier('Good');
    setNewEmail('');
    setNewPhone('');
    setNewLastContact('2026-05-20');
    setNewNote('');
    setIsAdding(false);
  };

  const handleLogInteraction = (contactId: string, customText?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const logContent = customText?.trim() || 'Established checkup conversation and discussed mutual goals.';

    const updated = contacts.map((c) => {
      if (c.id !== contactId) return c;
      const newNoteObj: ContactNote = {
        id: 'note-' + Math.random().toString(36).substr(2, 9),
        date: today,
        content: logContent,
      };
      return {
        ...c,
        lastContactDate: today,
        notes: [newNoteObj, ...c.notes]
      };
    });

    onUpdateContacts(updated);
    setQuickNoteText('');

    const targetContact = contacts.find((c) => c.id === contactId);
    if (targetContact) {
      onShareToCommunity(
        `Logged a deeper touchpoint conversation with ${targetContact.name} (${targetContact.tier} partner). Networking momentum is everything. 🗺️`,
        'Habit Milestone',
        targetContact.category
      );
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Verify: Remove this contact from your tracked networking circle?')) {
      onUpdateContacts(contacts.filter((c) => c.id !== contactId));
      if (selectedContactId === contactId) setSelectedContactId(null);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchTier = filterTier === 'All' || c.tier === filterTier;
    return matchCat && matchTier;
  });

  // Calculate stats for Tier orbits
  const statCoreCount = contacts.filter((c) => c.tier === 'Core').length;
  const statGoodCount = contacts.filter((c) => c.tier === 'Good').length;
  const statBetterCount = contacts.filter((c) => c.tier === 'Better').length;
  const statBestCount = contacts.filter((c) => c.tier === 'Best').length;
  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Concentric Circle Radar HUD */}
      <div className="bg-[#111827] p-5 rounded border border-[#334155] text-white grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Radar Radar graphics mapping */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
          <div className="text-center mb-4 z-10 pointer-events-none">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#38bdf8]">Sphere Radar Map</span>
          </div>

          <div className="relative w-64 h-64 border border-[#334155] rounded-full flex items-center justify-center">
            {/* Best position Circle (Outer) */}
            <div className="absolute w-52 h-52 border border-dashed border-[#334155]/60 rounded-full flex items-center justify-center">
              <span className="absolute top-1 text-[8px] font-mono font-bold uppercase tracking-widest text-[#64748b]">Best ({statBestCount})</span>
            </div>

            {/* Better position Circle */}
            <div className="absolute w-40 h-40 border border-[#334155]/40 rounded-full flex items-center justify-center">
              <span className="absolute top-1 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-500">Better ({statBetterCount})</span>
            </div>

            {/* Good position Circle */}
            <div className="absolute w-28 h-28 border border-[#334155]/20 rounded-full flex items-center justify-center">
              <span className="absolute top-1 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-600">Good ({statGoodCount})</span>
            </div>

            {/* Core Orbit Circle */}
            <div className="absolute w-16 h-16 bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-full flex items-center justify-center">
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#38bdf8] text-center leading-none">Core<br/>({statCoreCount})</span>
            </div>

            {/* Plotted dynamic connection nodes on orbits */}
            {contacts.slice(0, 15).map((contact, index) => {
              // Calculate angles for even pacing
              const angle = (index * (360 / Math.min(contacts.length, 15)) * Math.PI) / 180;
              let radius = 95; // default Best
              if (contact.tier === 'Core') radius = 32;
              else if (contact.tier === 'Good') radius = 56;
              else if (contact.tier === 'Better') radius = 76;

              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const initials = contact.name.split(' ').map((n) => n[0]).join('').substring(0, 2);

              return (
                <button
                  key={contact.id}
                  id={`radar-node-${contact.id}`}
                  onClick={() => setSelectedContactId(contact.id)}
                  title={`${contact.name} (${contact.tier})`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute w-7 h-7 rounded-sm bg-gradient-to-tr ${contact.avatarColor} cursor-pointer hover:scale-125 transition-all flex items-center justify-center text-[8px] font-mono font-bold text-white border border-[#0f172a] shadow-md ${
                    selectedContactId === contact.id ? 'scale-125 border-white ring-2 ring-[#38bdf8]' : ''
                  }`}
                >
                  {initials}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-500 font-mono mt-3 text-center leading-relaxed">
            Concentric orbits visually isolate network proximity: <strong>Core</strong>, <strong>Good</strong>, <strong>Better</strong>, and <strong>Best</strong> positioning.
          </p>
        </div>

        {/* Selected Contact Summary on Right */}
        <div className="lg:col-span-7 bg-[#1e293b] border border-[#334155] rounded p-4.5 min-h-60 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {selectedContactId && contacts.find((c) => c.id === selectedContactId) ? (
              (() => {
                const conn = contacts.find((c) => c.id === selectedContactId)!;
                const tierTagColor = 
                  conn.tier === 'Core' ? 'bg-[#ef4444] text-white' :
                  conn.tier === 'Best' ? 'bg-[#f59e0b] text-white' :
                  conn.tier === 'Better' ? 'bg-[#3b82f6] text-white' : 'bg-[#10b981] text-white';
                return (
                  <motion.div
                    key={conn.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded bg-gradient-to-tr ${conn.avatarColor} flex items-center justify-center text-white font-bold font-mono text-sm`}>
                          {conn.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-mono font-bold text-[#38bdf8] text-sm leading-tight">{conn.name}</h4>
                            <span className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded border border-white/10 ${tierTagColor}`}>
                              {conn.tier} Tag
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">{conn.role}</p>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Filter className="w-3.5 h-3.5 text-slate-500" />
                          <span>Group: <strong className="text-white">{conn.category}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Last: <strong className="text-white">{conn.lastContactDate || 'Never'}</strong></span>
                        </div>
                        {conn.email && (
                          <div className="flex items-center gap-1.5 text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{conn.email}</span>
                          </div>
                        )}
                        {conn.phone && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{conn.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Log Console */}
                      <div className="mt-4 pt-3.5 border-t border-[#334155] space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">LOG NEW NETWORK EVENT</span>
                        <div className="flex gap-2">
                          <input
                            id="quick-note-input"
                            type="text"
                            placeholder="E.g., Dinner meetup, synced startup ideas."
                            className="bg-[#0f172a] border border-[#334155] text-xs rounded px-2.5 py-1.5 text-slate-200 flex-1 focus:outline-none focus:border-[#38bdf8]"
                            value={quickNoteText}
                            onChange={(e) => setQuickNoteText(e.target.value)}
                          />
                          <button
                            id="btn-log-node-notes"
                            type="button"
                            onClick={() => handleLogInteraction(conn.id, quickNoteText)}
                            className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] rounded text-[10px] font-bold px-3 py-1.5 cursor-pointer active:scale-95 transition-all font-mono uppercase"
                          >
                            Log Event
                          </button>
                        </div>
                      </div>

                      {/* Past logs list */}
                      <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
                        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">INTERACTION RECORDS ({conn.notes.length})</span>
                        {conn.notes.length === 0 ? (
                          <p className="text-[10px] text-slate-550 font-mono italic">No logged conversations yet.</p>
                        ) : (
                          conn.notes.map((n) => (
                            <div key={n.id} className="bg-[#0f172a] p-2 rounded border border-[#334155]/60 text-[11px] leading-relaxed relative">
                              <span className="absolute top-1.5 right-2 text-[8px] text-slate-500 font-mono">{n.date}</span>
                              <p className="text-slate-300 pr-12 font-mono text-[10px]">{n.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#334155] flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Remind: Every {conn.frequencyDays} days</span>
                      <button
                        id="btn-delete-active-contact"
                        type="button"
                        onClick={() => handleDeleteContact(conn.id)}
                        className="text-rose-400 hover:text-rose-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Dissolve Contact
                      </button>
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-2">
                <Radio className="w-8 h-8 text-[#38bdf8] animate-pulse" />
                <p className="font-mono font-bold text-xs text-slate-300 uppercase tracking-widest">Awaiting Connections Sync</p>
                <p className="text-[11px] max-w-xs leading-relaxed font-mono">
                  No contact highlighted. Select a plotted profile node in the Concentric Radar Orbit or click a catalog card below to inspect contact records.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Control Catalogs panel */}
      <div className="bg-[#111827] p-3.5 rounded border border-[#334155] flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#38bdf8]" /> Filters:
          </span>

          {/* Directory Category */}
          <div className="flex gap-1 bg-[#0f172a] p-0.5 rounded border border-[#334155]">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                filterCategory === 'All' ? 'bg-[#1e293b] text-[#38bdf8] border border-[#334155]' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Contacts
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${
                  filterCategory === cat ? 'bg-[#1e293b] text-[#38bdf8] border border-[#334155]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Orbit Tiers */}
          <select
            id="filter-tier-select"
            className="bg-[#0f172a] text-slate-300 border border-[#334155] px-2 py-1 text-[11px] font-mono rounded focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="All">All Networking Tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t} Tier Tracker
              </option>
            ))}
          </select>
        </div>

        <button
          id="btn-trigger-add-contact"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold font-mono text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Enroll Connection
        </button>
      </div>

      {/* Expandable Add Contact Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddContact} className="bg-[#111827] p-5 rounded border border-[#334155] space-y-4 mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#334155]">
                <h3 className="font-mono font-bold text-xs text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Input Connections Database Container
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    id="contact-input-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Professional / Personal Role</label>
                  <input
                    id="contact-input-role"
                    type="text"
                    placeholder="E.g., Senior Partner at Cloud Ventures, or Mother"
                    className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Group Category</label>
                    <select
                      id="contact-input-category"
                      className="w-full text-xs font-mono bg-[#1e293b] text-white border border-[#334155] rounded p-2"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ContactCategory)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-[#111827]">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Circle Tier Orbit</label>
                    <select
                      id="contact-input-tier"
                      className="w-full text-xs font-mono bg-[#1e293b] text-white border border-[#334155] rounded p-2"
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value as ContactTier)}
                    >
                      {tiers.map((t) => (
                        <option key={t} value={t} className="bg-[#111827]">{t} Member</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email (Optional)</label>
                  <input
                    id="contact-input-email"
                    type="email"
                    placeholder="jane@doe.com"
                    className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 font-mono"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Phone (Optional)</label>
                  <input
                    id="contact-input-phone"
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 font-mono"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Last Contact Date</label>
                  <input
                    id="contact-input-date"
                    type="date"
                    className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 font-mono"
                    value={newLastContact}
                    onChange={(e) => setNewLastContact(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">First Interaction Log notes / Initial Context</label>
                <textarea
                  id="contact-input-note"
                  placeholder="Where did you meet? What are their key goals, interests, or upcoming plans?"
                  rows={2}
                  className="w-full text-xs bg-[#1e293b] text-white border border-[#334155] rounded p-2 focus:outline-none font-mono"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 border border-[#334155] hover:bg-[#1e293b] text-slate-350 rounded text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  id="btn-add-contact-submit"
                  type="submit"
                  className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] rounded text-xs font-bold font-mono"
                >
                  Commit Connection Details
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directory Grid output */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((c) => {
          const isSelected = selectedContactId === c.id;
          const tierTagColor = 
            c.tier === 'Core' ? 'bg-[#ef4444] text-white' :
            c.tier === 'Best' ? 'bg-[#f59e0b] text-white' :
            c.tier === 'Better' ? 'bg-[#3b82f6] text-white' : 'bg-[#10b981] text-white';
          return (
            <div
              key={c.id}
              onClick={() => setSelectedContactId(c.id)}
              className={`bg-[#1e293b] rounded border p-4.5 cursor-pointer hover:border-[#38bdf8]/40 transition-all duration-300 relative ${
                isSelected ? 'border-[#38bdf8] ring-1 ring-[#38bdf8]' : 'border-[#334155]'
              }`}
            >
              {/* Category tag badge left */}
              <div className="flex justify-between items-start gap-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded bg-gradient-to-tr ${c.avatarColor} flex items-center justify-center text-white text-xs font-bold font-mono shadow-inner`}>
                    {c.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h5 className="font-mono font-bold text-white text-sm leading-tight">{c.name}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal truncate max-w-40 font-mono">{c.role}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 font-mono">
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold leading-none rounded uppercase border border-white/5 ${tierTagColor}`}>
                    {c.tier} Member
                  </span>
                  <span className="text-[9px] text-[#38bdf8] italic">
                    {c.category}
                  </span>
                </div>
              </div>

              {/* Status information footer */}
              <div className="mt-3.5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 uppercase tracking-wide">
                  <Calendar className="w-3 h-3 text-[#38bdf8]" /> TOUCHED: {c.lastContactDate || 'Never'}
                </span>
                <span className="text-[#38bdf8] font-bold hover:underline">
                  Inspect Record →
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
