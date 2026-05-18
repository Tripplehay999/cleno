"use client";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";

const residentialServices = [
  {
    id: "standard",
    icon: "🧹",
    name: "Standard clean",
    desc: "Kitchen, bathrooms, bedrooms, living areas. Done right.",
    price: "From $120",
  },
  {
    id: "deep",
    icon: "✨",
    name: "Deep clean",
    desc: "Top to bottom — baseboards, inside appliances, all the hidden spots.",
    price: "From $180",
  },
  {
    id: "move",
    icon: "📦",
    name: "Move in / out",
    desc: "Leave the old place spotless. Start fresh in your new one.",
    price: "From $250",
  },
  {
    id: "recurring",
    icon: "🔁",
    name: "Recurring clean",
    desc: "Weekly or biweekly — same team, same standard, 10% off.",
    price: "Save 10%",
    badge: "Best value",
  },
];

const industrialServices = [
  {
    id: "office",
    icon: "🏢",
    name: "Office / Commercial",
    desc: "Offices, retail spaces, common areas — kept spotless for staff and clients.",
    price: "From $200",
  },
  {
    id: "industrial",
    icon: "🏭",
    name: "Industrial / Warehouse",
    desc: "Factories, warehouses, production floors. Heavy-duty cleaning done safely.",
    price: "From $350",
  },
  {
    id: "postconstruction",
    icon: "🔨",
    name: "Post-construction",
    desc: "Dust, debris, and residue cleared after a build or renovation. Move-in ready.",
    price: "From $400",
  },
];

function ServiceCard({
  s,
  onBook,
}: {
  s: { id: string; icon: string; name: string; desc: string; price: string; badge?: string };
  onBook: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onBook(s.id)}
      className="relative text-left p-5 rounded-2xl border border-gray-100 bg-[#F7F6F2] hover:border-[#1D9E75] hover:bg-[#F0FBF7] transition-all group"
    >
      {s.badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          {s.badge}
        </span>
      )}
      <span className="text-2xl block mb-3">{s.icon}</span>
      <h3 className="text-sm font-semibold text-[#1a1a18] mb-1">{s.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.desc}</p>
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          {s.price}
        </span>
        <span className="text-xs text-[#1D9E75] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Book this →
        </span>
      </div>
    </button>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultService, setDefaultService] = useState<string | undefined>();

  const openBooking = (serviceId?: string) => {
    setDefaultService(serviceId);
    setModalOpen(true);
  };

  return (
    <>
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService={defaultService}
      />

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="max-w-2xl mx-auto px-5 flex justify-between items-center py-5 border-b border-gray-100">
          <span className="text-xl font-semibold tracking-tight" style={{ color: "#1D9E75", letterSpacing: "-0.5px" }}>
            cleno
          </span>
          <button
            onClick={() => openBooking()}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#0F6E56]"
            style={{ background: "#1D9E75" }}
          >
            Book a clean
          </button>
        </nav>

        <main className="max-w-2xl mx-auto px-5">
          {/* Hero */}
          <section className="py-16 text-center">
            <h1
              className="text-5xl font-semibold leading-tight mb-5"
              style={{ letterSpacing: "-1.5px", color: "#1a1a18" }}
            >
              Come home to{" "}
              <span style={{ color: "#1D9E75" }}>clean.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
              Cleno takes cleaning off your plate — so your evenings and weekends are actually yours again.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => openBooking()}
                className="px-7 py-3.5 rounded-xl text-base font-semibold text-white transition-colors hover:bg-[#0F6E56]"
                style={{ background: "#1D9E75" }}
              >
                Book your first clean
              </button>
              <a
                href="#pricing"
                className="px-7 py-3.5 rounded-xl text-base font-medium border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
              >
                See pricing
              </a>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
              {["Toronto-based", "Insured & trusted", "Flexible scheduling", "No lock-in contracts"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#1D9E75" }} />
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Services */}
          <section id="pricing" className="pb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1D9E75" }}>
              What we do
            </p>
            <h2 className="text-3xl font-semibold mb-1" style={{ letterSpacing: "-0.5px" }}>
              Everything clean.
            </h2>
            <h2 className="text-3xl font-semibold mb-8" style={{ letterSpacing: "-0.5px" }}>
              Nothing complicated.
            </h2>

            {/* Residential */}
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Residential</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {residentialServices.map((s) => (
                <ServiceCard key={s.id} s={s} onBook={openBooking} />
              ))}
            </div>

            {/* Industrial & Commercial */}
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Industrial & Commercial</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industrialServices.map((s) => (
                <ServiceCard key={s.id} s={s} onBook={openBooking} />
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="pb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1D9E75" }}>
              How it works
            </p>
            <h2 className="text-3xl font-semibold mb-1" style={{ letterSpacing: "-0.5px" }}>
              Three steps.
            </h2>
            <h2 className="text-3xl font-semibold mb-8" style={{ letterSpacing: "-0.5px" }}>
              Then relax.
            </h2>
            <div className="space-y-5">
              {[
                {
                  n: "1",
                  title: "Book in 60 seconds",
                  body: "Tell us your space size, pick a time that works. No phone calls needed.",
                },
                {
                  n: "2",
                  title: "We show up, fully prepared",
                  body: "We bring everything. You don't need to do a thing before we arrive.",
                },
                {
                  n: "3",
                  title: "Come home to clean",
                  body: "Walk into a fresh space. If anything's not right, we'll fix it — no questions asked.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
                    style={{ background: "#1D9E75" }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a18] mb-0.5">{step.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial */}
          <section className="pb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1D9E75" }}>
              What people say
            </p>
            <h2 className="text-3xl font-semibold mb-6" style={{ letterSpacing: "-0.5px" }}>
              They trusted us first.
            </h2>
            <div
              className="border-l-4 rounded-r-xl p-5"
              style={{ borderColor: "#1D9E75", background: "#F7F6F2" }}
            >
              <p className="text-base text-[#1a1a18] leading-relaxed italic">
                "I was nervous booking a new cleaning service, but Cleno was so easy. Showed up on time, my apartment looked incredible. Already booked them again."
              </p>
              <p className="text-xs text-gray-400 mt-3">— Sarah M., Leslieville</p>
            </div>
          </section>

          {/* CTA */}
          <section className="pb-16">
            <div className="rounded-2xl p-10 text-center" style={{ background: "#1D9E75" }}>
              <h2 className="text-3xl font-semibold text-white mb-2" style={{ letterSpacing: "-0.5px" }}>
                Ready for a cleaner home?
              </h2>
              <p className="text-white/80 text-base mb-7">
                Book your first clean today. No commitment, no stress.
              </p>
              <button
                onClick={() => openBooking()}
                className="px-8 py-3.5 rounded-xl text-base font-semibold text-[#1D9E75] bg-white hover:bg-[#F0FBF7] transition-colors"
              >
                Get started
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-6 text-center">
          <p className="text-xs text-gray-400">
            © 2025 Cleno · Toronto, ON ·{" "}
            <a href="mailto:hello@cleno.ca" className="hover:text-[#1D9E75] transition-colors">
              hello@cleno.ca
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
