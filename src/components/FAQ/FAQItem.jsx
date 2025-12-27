const FAQItem = ({ id, question, answer, isOpen, onToggle }) => {
  const buttonId = `faq-button-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="bg-cine-highlight/5 border border-white/10">
      <button
        id={buttonId}
        type="button"
        className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="text-white text-lg sm:text-xl font-medium">
          {question}
        </span>

        {/* Plus that rotates into an X (Netflix-style) */}
        <span
          aria-hidden="true"
          className={
            isOpen
              ? "relative h-5 w-5 shrink-0 transition-transform duration-200 rotate-45"
              : "relative h-5 w-5 shrink-0 transition-transform duration-200"
          }
        >
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/80" />
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white/80" />
        </span>
      </button>

      {/* Answer panel (animated) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={
          isOpen
            ? "grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out"
            : "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out"
        }
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-6 pb-6 pt-5 text-white/80 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
