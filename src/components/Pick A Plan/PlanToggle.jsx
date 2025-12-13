// src/components/Pricing/PlanToggle.jsx
const OPTIONS = [
  { id: "monthly", label: "Monthly", sub: "Pay month to month" },
  { id: "annual", label: "Annual", sub: "Best value" },
];

const PlanToggle = ({ value, onChange }) => {
  const isAnnual = value === "annual";

  return (
    <div className="relative inline-flex items-center">
      {/* Outer pill */}
      <div className="relative flex w-64 max-w-full items-center rounded-full border-3 border-white bg-white/5 p-1 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        {/* Sliding highlight */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-cine-highlight/70  transition-transform duration-300 ease-out
            ${isAnnual ? "translate-x-full" : "translate-x-0"}
          `}
        />

        {/* Options */}
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className="relative z-10 flex-1 px-2.5 py-3.5 text-left"
        >
          <span
            className={`block text-l font-semibold uppercase tracking-[0.16em] transition-colors
              ${
                !isAnnual
                  ? "text-white"
                  : "text-cine-muted/70"
              }
            `}
          >
            Monthly
          </span>
          <span
            className={`mt-0.5 block text-[11px] transition-colors
              ${
                !isAnnual
                  ? "text-white"
                  : "text-cine-muted/60"
              }
            `}
          >
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange("annual")}
          className="relative z-10 flex-1 px-2 py-1.5 text-right"
        >
          <span
            className={`block text-l font-semibold uppercase tracking-[0.16em] transition-colors 
              ${
                isAnnual
                  ? "text-white"
                  : "text-cine-muted/70"
              }
            `}
          >
            Annual
          </span>
          <span
            className={`mt-0.5 block text-[11px] transition-colors
              ${
                isAnnual
                  ? "text-white"
                  : "text-cine-muted/60"
              }
            `}
          >
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanToggle;
