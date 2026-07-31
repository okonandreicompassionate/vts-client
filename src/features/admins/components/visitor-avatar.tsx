interface VisitorAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
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

export function VisitorAvatar({ name, size = "md", className = "" }: VisitorAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromInitials(initials);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-base",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${bgColor} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
