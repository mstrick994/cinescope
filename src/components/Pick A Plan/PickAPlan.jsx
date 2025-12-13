import { useState } from "react";
import PlanToggle from "./PlanToggle";

// Pricing for each billing period
const PRICES = {
  monthly: {
    label: "Monthly",
    savingsLabel: "",
    premium: "14.99",
    essential: "8.99",
    cta: "Try 1 week free",
  },
  annual: {
    label: "Annual",
    savingsLabel: "Save up to 20% with annual billing",
    premium: "149.99",
    essential: "89.99",
    cta: "Try 1 week free",
  },
};

// Feature rows for the table
// true  = checkmark
// false = dash
// string = text
const FEATURE_ROWS = [
  {
    id: "adFree",
    label: "No ads",
    premium: true,
    essential: false,
  },
  {
    id: "library",
    label: "Access to full CineScope library",
    premium: true,
    essential: true,
  },
  {
    id: "quality",
    label: "Streaming quality",
    premium: "Up to 4K* on supported devices",
    essential: "Up to HD*",
  },
  {
    id: "devices",
    label: "Streams at once",
    premium: "Up to 4 devices",
    essential: "Up to 2 devices",
  },
  {
    id: "downloads",
    label: "Download movies & shows",
    premium: true,
    essential: false,
  },
  {
    id: "profiles",
    label: "Profiles & watchlists",
    premium: true,
    essential: true,
  },
];

const renderFeatureCell = (value) => {
  if (value === true) {
    return <span className="text-sm text-cine-highlight">✓</span>;
  }

  if (value === false) {
    return <span className="text-sm text-cine-muted/60">—</span>;
  }

  return <span className="text-xs sm:text-sm text-cine-muted">{value}</span>;
};

const PickAPlan = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const currentPricing = PRICES[billingPeriod];

  return (
    <section
      id="plans"
      className="relative w-full bg-gradient-to-b from-[#05040A] via-[#070B16] to-[#0C1726] border-t border-white/5"
    >
      {/* Soft top overlay so it blends with the section above */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cine-muted mb-2">
            Plans & pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-3">
            Select the plan that fits{" "}
            <span className="text-gradient-cine">how you watch</span>
          </h2>
          <p className="text-sm sm:text-base text-cine-muted max-w-2xl mx-auto">
            No hidden fees or contracts. Switch plans or cancel anytime.
          </p>
        </div>

        {/* Toggle + savings text */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <PlanToggle
            value={billingPeriod}
            onChange={(nextBillingPeriod) => setBillingPeriod(nextBillingPeriod)}
          />
          {currentPricing.savingsLabel && (
            <p className="text-xs sm:text-sm text-cine-highlight">
              {currentPricing.savingsLabel}
            </p>
          )}
        </div>

        {/* Scrollable comparison table */}
        <div className="overflow-x-auto">
          {/* No card bg; only horizontal lines between rows */}
          <div className="min-w-[720px] divide-y divide-white/10 bg-transparent">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-transparent py-5">
              {/* Empty top-left cell (no label) */}
              <div className="px-4 sm:px-6" />

              {/* Premium header */}
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Premium
                  </p>
                  <p className="text-xs text-cine-muted">
                    Best for movie lovers & families
                  </p>
                  <div className="mt-2 flex items-baseline justify-center gap-1.5">
                    <p className="text-xl sm:text-2xl font-semibold text-white">
                      <span className="align-top text-sm">$</span>
                      {currentPricing.premium}
                    </p>
                    <span className="text-[11px] sm:text-xs text-cine-muted">
                      /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
                    </span>
                  </div>
                </div>
              </div>

              {/* Essential header */}
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Essential
                  </p>
                  <p className="text-xs text-cine-muted">
                    Great value starter plan
                  </p>
                  <div className="mt-2 flex items-baseline justify-center gap-1.5">
                    <p className="text-xl sm:text-2xl font-semibold text-white">
                      <span className="align-top text-sm">$</span>
                      {currentPricing.essential}
                    </p>
                    <span className="text-[11px] sm:text-xs text-cine-muted">
                      /{billingPeriod === "monthly" ? "mo" : "yr"} after trial
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {FEATURE_ROWS.map((row) => (
              <div key={row.id} className="grid grid-cols-3 bg-transparent">
                {/* Feature label */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center">
                  <p className="text-xs sm:text-sm text-white">{row.label}</p>
                </div>

                {/* Premium cell */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center">
                  {renderFeatureCell(row.premium)}
                </div>

                {/* Essential cell */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center">
                  {renderFeatureCell(row.essential)}
                </div>
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-3 bg-transparent py-5">
              {/* Fine print */}
              <div className="px-4 sm:px-6 flex items-center">
                <p className="text-[11px] sm:text-xs text-cine-muted/80">
                  Free trial available for new members only. Cancel anytime
                  before your billing date.
                </p>
              </div>

              {/* Premium button */}
              <div className="px-4 sm:px-6 flex items-center">
                <button
                  type="button"
                  className="w-full rounded-md bg-cine-highlight/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-whte transition-colors hover:bg-cine-accent/50"
                >
                  {currentPricing.cta}
                </button>
              </div>

              {/* Essential button */}
              <div className="px-4 sm:px-6 flex items-center">
                <button
                  type="button"
                  className="w-full rounded-md bg-cine-highlight/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-cine-accent/50"
                >
                  {currentPricing.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into the Browse section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#050711]" />
    </section>
  );
};

export default PickAPlan;
