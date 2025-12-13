// SmoothBackground.jsx
import { useEffect, useState } from "react";

const SmoothBackground = ({
  imageUrl,
  containerClassName = "",
  bgClassName = "",
  overlayClassName = "",
  contentClassName = "",
  children,
}) => {
  const [displayedUrl, setDisplayedUrl] = useState(imageUrl);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;
    if (imageUrl === displayedUrl) return;

    setIsTransitioning(true);

    const timeout = setTimeout(() => {
      setDisplayedUrl(imageUrl);
      setIsTransitioning(false);
    }, 250); // half of the 500ms bg duration

    return () => clearTimeout(timeout);
  }, [imageUrl, displayedUrl]);

  return (
    <section className={containerClassName}>
      {/* Background */}
      <div
        className={`
          ${bgClassName}
          transition-all duration-500 ease-out
          ${isTransitioning ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"}
        `}
        style={
          displayedUrl
            ? { backgroundImage: `url(${displayedUrl})` }
            : undefined
        }
      />

      {/* Optional overlay */}
      {overlayClassName && <div className={overlayClassName} />}

      {/* Content */}
      <div
        className={`
          ${contentClassName}
          transition-all duration-300 ease-out
          ${
            isTransitioning
              ? "opacity-0 translate-y-1"
              : "opacity-100 translate-y-0"
          }
        `}
      >
        {children}
      </div>
    </section>
  );
};

export default SmoothBackground;
