interface VisitorAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  src?: string;
}

function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function getColorFromInitials(initials: string): string {
  const colors = [
    "bg-blue-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
  ];

  const charCode = initials.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

export function Avatar({ name, size = "md", className = "", src }: VisitorAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromInitials(initials);

  const sizeClasses = {
    sm: "h-7 w-7 text-[11.5px]",
    md: "h-8 w-8 text-sm",
    lg: "h-14 w-14 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-medium text-white ${bgColor} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
