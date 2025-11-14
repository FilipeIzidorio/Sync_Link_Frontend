export const Switch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`w-10 h-5 flex items-center rounded-full transition px-1 ${
      checked ? "bg-primary" : "bg-slate-400"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow transition ${
        checked ? "translate-x-5" : ""
      }`}
    ></div>
  </button>
);
