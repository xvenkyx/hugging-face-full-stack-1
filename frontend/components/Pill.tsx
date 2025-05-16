interface PillProps {
  label: string;
  color?: string; // tailwind bg class
}

export default function Pill({ label, color = "bg-gray-300" }: PillProps) {
  return (
    <span className={`text-xs text-white px-2 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}
