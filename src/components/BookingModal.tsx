"use client";

import { useState, useEffect, useRef } from "react";

const RESIDENTIAL_IDS = ["standard", "deep", "move", "recurring"];

const SERVICES = [
  {
    id: "standard",
    icon: "🧹",
    name: "Standard clean",
    desc: "Kitchen, bathrooms, bedrooms, living areas.",
    price: "From $120",
    duration: "2–3 hrs",
  },
  {
    id: "deep",
    icon: "✨",
    name: "Deep clean",
    desc: "Top to bottom — baseboards, inside appliances, all the hidden spots.",
    price: "From $180",
    duration: "3–5 hrs",
  },
  {
    id: "move",
    icon: "📦",
    name: "Move in / out",
    desc: "Leave the old place spotless. Start fresh in your new one.",
    price: "From $250",
    duration: "4–6 hrs",
  },
  {
    id: "recurring",
    icon: "🔁",
    name: "Recurring clean",
    desc: "Weekly or biweekly — same team, same standard.",
    price: "Save 10%",
    duration: "2–3 hrs",
    badge: "Best value",
  },
  {
    id: "office",
    icon: "🏢",
    name: "Office / Commercial",
    desc: "Offices, retail spaces, common areas — kept spotless for staff and clients.",
    price: "From $200",
    duration: "2–4 hrs",
    group: "Industrial & Commercial",
  },
  {
    id: "industrial",
    icon: "🏭",
    name: "Industrial / Warehouse",
    desc: "Factories, warehouses, production floors. Heavy-duty cleaning done safely.",
    price: "From $350",
    duration: "4–8 hrs",
    group: "Industrial & Commercial",
  },
  {
    id: "postconstruction",
    icon: "🔨",
    name: "Post-construction",
    desc: "Dust, debris, and residue cleared after a build or renovation.",
    price: "From $400",
    duration: "4–8 hrs",
    group: "Industrial & Commercial",
  },
];

const RESIDENTIAL_SIZES = [
  { id: "studio", label: "Studio / 1BR", detail: "1 bed · 1 bath" },
  { id: "two", label: "2 Bedroom", detail: "2 beds · 1–2 baths" },
  { id: "three", label: "3 Bedroom", detail: "3 beds · 2 baths" },
  { id: "four", label: "4+ Bedroom", detail: "4+ beds · 2+ baths" },
];

const COMMERCIAL_SIZES = [
  { id: "sm", label: "Under 1,000 sq ft", detail: "Small office or studio" },
  { id: "md", label: "1,000–3,000 sq ft", detail: "Medium office or floor" },
  { id: "lg", label: "3,000–10,000 sq ft", detail: "Large space or warehouse" },
  { id: "xl", label: "10,000+ sq ft", detail: "Industrial facility" },
];

const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

function getNext14Days() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
}

type Step = "service" | "size" | "datetime" | "contact" | "confirm";

interface BookingData {
  service: string;
  size: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function BookingModal({ open, onClose, defaultService }: Props) {
  const [step, setStep] = useState<Step>("service");
  const [data, setData] = useState<BookingData>({
    service: defaultService || "",
    size: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const isResidential = RESIDENTIAL_IDS.includes(data.service);

  const days = getNext14Days();

  // reset on open
  useEffect(() => {
    if (open) {
      setStep(defaultService ? "size" : "service");
      setData({ service: defaultService || "", size: "", date: "", time: "", name: "", email: "", phone: "", notes: "" });
      setSubmitted(false);
    }
  }, [open, defaultService]);

  // trap scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const selectedService = SERVICES.find((s) => s.id === data.service);
  const sizeList = isResidential ? RESIDENTIAL_SIZES : COMMERCIAL_SIZES;
  const selectedSize = sizeList.find((s) => s.id === data.size);

  const steps: Step[] = ["service", "size", "datetime", "contact", "confirm"];
  const stepIndex = steps.indexOf(step);

  const canNext = () => {
    if (step === "service") return !!data.service;
    if (step === "size") return !!data.size;
    if (step === "datetime") return !!data.date && !!data.time;
    if (step === "contact") return !!data.name && !!data.email && !!data.phone;
    return true;
  };

  const next = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const back = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const submit = async () => {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, serviceName: selectedService?.name, size: selectedSize?.label }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
    } catch {
      setSendError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const stepLabels = ["Service", isResidential ? "Home size" : "Space size", "Date & time", "Your info", "Confirm"];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-medium text-[#1D9E75] uppercase tracking-wide">
              {submitted ? "You're booked!" : stepLabels[stepIndex]}
            </p>
            <p className="text-base font-semibold text-[#1a1a18] mt-0.5">
              {submitted ? "See you soon 🎉" : "Book your clean"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="px-5 pt-3 shrink-0">
            <div className="flex gap-1.5">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= stepIndex ? "#1D9E75" : "#e5e7eb" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {submitted ? (
            <ConfirmScreen data={data} selectedService={selectedService} selectedSize={selectedSize} onClose={onClose} isResidential={isResidential} />
          ) : step === "service" ? (
            <ServiceStep data={data} setData={setData} />
          ) : step === "size" ? (
            <SizeStep data={data} setData={setData} isResidential={isResidential} />
          ) : step === "datetime" ? (
            <DateTimeStep data={data} setData={setData} days={days} times={TIMES} />
          ) : step === "contact" ? (
            <ContactStep data={data} setData={setData} />
          ) : (
            <ReviewStep data={data} selectedService={selectedService} selectedSize={selectedSize} isResidential={isResidential} />
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
            {sendError && (
              <p className="text-xs text-red-500 mb-2 text-center">{sendError}</p>
            )}
            <div className="flex gap-3">
              {stepIndex > 0 && (
                <button
                  onClick={back}
                  disabled={sending}
                  className="flex-none px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={step === "confirm" ? submit : next}
                disabled={!canNext() || sending}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: canNext() && !sending ? "#1D9E75" : "#9CA3AF",
                  cursor: canNext() && !sending ? "pointer" : "not-allowed",
                }}
              >
                {sending ? "Sending…" : step === "confirm" ? "Confirm booking" : "Continue →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Step components ---

function ServiceOption({ s, selected, onSelect }: { s: typeof SERVICES[0]; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 rounded-xl border-2 transition-all relative"
      style={{
        borderColor: selected ? "#1D9E75" : "#E5E7EB",
        background: selected ? "#F0FBF7" : "white",
      }}
    >
      {s.badge && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full">
          {s.badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#1a1a18]">{s.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
          <div className="flex gap-3 mt-2">
            <span className="text-xs font-medium text-[#1D9E75]">{s.price}</span>
            <span className="text-xs text-gray-400">· {s.duration}</span>
          </div>
        </div>
        <div
          className="w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center"
          style={{ borderColor: selected ? "#1D9E75" : "#D1D5DB" }}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />}
        </div>
      </div>
    </button>
  );
}

function ServiceStep({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  const residential = SERVICES.filter((s) => RESIDENTIAL_IDS.includes(s.id));
  const commercial = SERVICES.filter((s) => !RESIDENTIAL_IDS.includes(s.id));
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">What kind of clean do you need?</p>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Residential</p>
      <div className="space-y-2 mb-4">
        {residential.map((s) => (
          <ServiceOption key={s.id} s={s} selected={data.service === s.id} onSelect={() => setData({ ...data, service: s.id, size: "" })} />
        ))}
      </div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Industrial & Commercial</p>
      <div className="space-y-2">
        {commercial.map((s) => (
          <ServiceOption key={s.id} s={s} selected={data.service === s.id} onSelect={() => setData({ ...data, service: s.id, size: "" })} />
        ))}
      </div>
    </div>
  );
}

function SizeStep({ data, setData, isResidential }: { data: BookingData; setData: (d: BookingData) => void; isResidential: boolean }) {
  const sizes = isResidential ? RESIDENTIAL_SIZES : COMMERCIAL_SIZES;
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        {isResidential ? "How big is your place?" : "What's the size of the space?"}
      </p>
      {sizes.map((s) => (
        <button
          key={s.id}
          onClick={() => setData({ ...data, size: s.id })}
          className="w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4"
          style={{
            borderColor: data.size === s.id ? "#1D9E75" : "#E5E7EB",
            background: data.size === s.id ? "#F0FBF7" : "white",
          }}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm text-[#1a1a18]">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.detail}</p>
          </div>
          <div
            className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
            style={{ borderColor: data.size === s.id ? "#1D9E75" : "#D1D5DB" }}
          >
            {data.size === s.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />}
          </div>
        </button>
      ))}
    </div>
  );
}

function DateTimeStep({
  data, setData, days, times,
}: {
  data: BookingData;
  setData: (d: BookingData) => void;
  days: Date[];
  times: string[];
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Pick a date and arrival window.</p>
      {/* Date scroll */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Date</p>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {days.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const isSelected = data.date === iso;
          const dow = d.toLocaleDateString("en-CA", { weekday: "short" });
          const dom = d.getDate();
          const mon = d.toLocaleDateString("en-CA", { month: "short" });
          return (
            <button
              key={iso}
              onClick={() => setData({ ...data, date: iso })}
              className="flex-none w-14 py-3 rounded-xl border-2 flex flex-col items-center gap-0.5 transition-all"
              style={{
                borderColor: isSelected ? "#1D9E75" : "#E5E7EB",
                background: isSelected ? "#1D9E75" : "white",
              }}
            >
              <span className="text-[10px] font-medium" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>
                {dow}
              </span>
              <span className="text-base font-bold leading-none" style={{ color: isSelected ? "white" : "#1a1a18" }}>
                {dom}
              </span>
              <span className="text-[10px]" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>
                {mon}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-5 mb-2">Arrival time</p>
      <div className="grid grid-cols-3 gap-2">
        {times.map((t) => {
          const isSelected = data.time === t;
          return (
            <button
              key={t}
              onClick={() => setData({ ...data, time: t })}
              className="py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
              style={{
                borderColor: isSelected ? "#1D9E75" : "#E5E7EB",
                background: isSelected ? "#1D9E75" : "white",
                color: isSelected ? "white" : "#1a1a18",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactStep({ data, setData }: { data: BookingData; setData: (d: BookingData) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Almost there — just a few details.</p>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Full name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Jane Smith"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#1D9E75] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="jane@email.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#1D9E75] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          placeholder="416-555-0100"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#1D9E75] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Anything we should know? <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          placeholder="Pets, access codes, specific focus areas…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#1D9E75] transition-colors resize-none"
        />
      </div>
    </div>
  );
}

function ReviewStep({
  data, selectedService, selectedSize, isResidential,
}: {
  data: BookingData;
  selectedService: typeof SERVICES[0] | undefined;
  selectedSize: { id: string; label: string; detail: string } | undefined;
  isResidential: boolean;
}) {
  const formattedDate = data.date
    ? new Date(data.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">Everything look right?</p>
      <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
        <Row label="Service" value={selectedService ? `${selectedService.icon} ${selectedService.name}` : ""} />
        <Row label={isResidential ? "Home size" : "Space size"} value={selectedSize?.label || ""} />
        <Row label="Date" value={formattedDate} />
        <Row label="Time" value={data.time} />
        <Row label="Name" value={data.name} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        {data.notes && <Row label="Notes" value={data.notes} />}
      </div>
      <div className="mt-4 flex items-start gap-2.5 bg-[#F0FBF7] rounded-xl p-3.5">
        <span className="text-[#1D9E75] text-base mt-0.5">✓</span>
        <p className="text-xs text-[#0F6E56] leading-relaxed">
          If anything's not right after the clean, we'll fix it — no questions asked.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 px-4 py-3">
      <span className="text-xs text-gray-400 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium text-[#1a1a18] text-right">{value}</span>
    </div>
  );
}

function ConfirmScreen({
  data, selectedService, selectedSize, onClose, isResidential,
}: {
  data: BookingData;
  selectedService: typeof SERVICES[0] | undefined;
  selectedSize: { id: string; label: string; detail: string } | undefined;
  onClose: () => void;
  isResidential: boolean;
}) {
  const formattedDate = data.date
    ? new Date(data.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center text-3xl mx-auto mb-4">
        ✓
      </div>
      <h3 className="text-xl font-semibold text-[#1a1a18] mb-1">You're all set, {data.name.split(" ")[0]}!</h3>
      <p className="text-sm text-gray-500 mb-6">
        We'll send a confirmation to <strong>{data.email}</strong>.<br />
        See you on {formattedDate} at {data.time}.
      </p>
      <div className="rounded-xl bg-[#F7F6F2] p-4 text-left mb-6 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Service</span>
          <span className="font-medium">{selectedService?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{isResidential ? "Home" : "Space"}</span>
          <span className="font-medium">{selectedSize?.label}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">When</span>
          <span className="font-medium">{formattedDate} · {data.time}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Questions? Email us at{" "}
        <a href="mailto:hello@cleno.ca" className="text-[#1D9E75] underline">hello@cleno.ca</a>
      </p>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#0F6E56] transition-colors"
      >
        Done
      </button>
    </div>
  );
}
