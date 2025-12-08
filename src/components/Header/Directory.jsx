const Directory = ({ layout = "horizontal" }) => {
  const baseClasses =
    "text-lg content-center gap-8 font-medium text-[clamp(0.875rem,2vw,1rem)]";

  const layoutClasses =
    layout === "horizontal"
      ? "flex items-center gap-8"
      : "flex flex-col items-start gap-3";

  return (
    <div>
      <ul className={`${layoutClasses} ${baseClasses}`}>
        <li>
          <h3>
            <a href="">Movies</a>
          </h3>
        </li>
        <li>
          <h3>
            <a href="">TV Shows</a>
          </h3>
        </li>
        <li>
          <h3>
            <a href="">Animated</a>
          </h3>
        </li>
      </ul>
    </div>
  );
};

export default Directory;
