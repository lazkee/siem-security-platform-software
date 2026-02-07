import { useState } from "react";

type Option = {
  label: string;
  value: string;
  type: "role" | "user";
};

type AnomaliesFilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  options: Option[];
};

export default function AnomaliesFilterSelect({
  value,
  onChange,
  onSelect,
  options,
}: AnomaliesFilterSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "Select Filter";

  const roleOptions = options.filter((o) => o.type === "role");
  const userOptions = options.filter((o) => o.type === "user");

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between border! border-[rgba(255,255,255,0.12)]! bg-[#2d2d2d] hover:bg-[#9ca3af]! text-white rounded-[10px]! w-[250px]! h-[40px]! px-3 cursor-pointer outline-none transition-colors"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width={16}
          height={16}
          fill="none"
          viewBox="0 0 24 24"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-[10px]! border! border-[rgba(255,255,255,0.12)]! bg-[#2d2d2d] rounded-[15px]! w-[260px]! z-20 shadow-xl">
          <ul 
            className="p-[6px]! list-none! text-[14px] font-[500] m-0 max-h-[300px] overflow-y-auto 
            scrollbar-thin scrollbar-thumb-[#5a5a5a] scrollbar-track-transparent"
          >
            {/* Roles Section */}
            {roleOptions.length > 0 && (
              <>
                <li className="px-[12px]! py-2 text-[#60cdff] text-xs font-bold uppercase tracking-wider border-b border-[#5a5a5a]">
                  Roles
                </li>
                {roleOptions.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      onSelect(opt.value);
                      setOpen(false);
                    }}
                    className="h-[40px] px-[12px]! flex items-center text-white cursor-pointer hover:bg-[#9ca3af]! transition-colors border-b border-[#5a5a5a]"
                  >
                    <span className="truncate">{opt.label}</span>
                  </li>
                ))}
              </>
            )}

            {/* Users Section */}
            {userOptions.length > 0 && (
              <>
                <li className="px-[12px]! py-2 text-[#60cdff] text-xs font-bold uppercase tracking-wider border-b border-[#5a5a5a]">
                  Users
                </li>
                {userOptions.map((opt, index) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      onSelect(opt.value);
                      setOpen(false);
                    }}
                    className={`h-[40px] px-[12px]! flex items-center text-white cursor-pointer hover:bg-[#9ca3af]! transition-colors
                    ${index !== userOptions.length - 1 ? "border-b border-[#5a5a5a]" : ""}`}
                  >
                    <span className="truncate">{opt.label}</span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
