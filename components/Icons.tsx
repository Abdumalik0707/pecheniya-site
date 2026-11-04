// One icon family for the whole storefront: 24px grid, 2px rounded strokes,
// with small filled accents. Use these instead of emoji so the UI looks the
// same on every device and matches the brand.

import type { ReactNode } from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

function Svg({ size = 24, color = "currentColor", className, strokeWidth = 2, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}
    >
      {children}
    </svg>
  );
}

/* ── Brand / food ─────────────────────────────────────────── */

/** Cookie with a bite taken out and chocolate chips */
export function CookieIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Svg {...p}>
      <path d="M21 12.6A9 9 0 1 1 11.4 3a3 3 0 0 0 3.6 3.6 3 3 0 0 0 3.6 3.6 3 3 0 0 0 2.4 2.4Z" />
      <circle cx="8.5" cy="9.5" r="1.3" fill={c} stroke="none" />
      <circle cx="14.5" cy="14.5" r="1.3" fill={c} stroke="none" />
      <circle cx="9" cy="15.5" r="1.1" fill={c} stroke="none" />
      <circle cx="12.5" cy="10.8" r="0.8" fill={c} stroke="none" />
    </Svg>
  );
}

export function LeafIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
    </Svg>
  );
}

/** Chef hat */
export function ChefIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M17 21a1 1 0 0 0 1-1v-5.4a4 4 0 1 0-2.3-7.5 4 4 0 0 0-7.4 0A4 4 0 1 0 6 14.6V20a1 1 0 0 0 1 1Z" />
      <path d="M6 17h12" />
    </Svg>
  );
}

export function GiftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </Svg>
  );
}

/* ── Rating / highlights ──────────────────────────────────── */

export function StarIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Svg {...p} strokeWidth={1.5}>
      <path
        fill={c}
        d="M11.5 2.8a.6.6 0 0 1 1 0l2.6 5.3 5.8.8a.6.6 0 0 1 .3 1l-4.2 4.1 1 5.8a.6.6 0 0 1-.8.6L12 17.7l-5.2 2.7a.6.6 0 0 1-.8-.6l1-5.8-4.2-4.1a.6.6 0 0 1 .3-1l5.8-.8Z"
      />
    </Svg>
  );
}

export function SparkleIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Svg {...p}>
      <path fill={c} d="M10 3.5c.6 3.7 2.8 5.9 6.5 6.5-3.7.6-5.9 2.8-6.5 6.5-.6-3.7-2.8-5.9-6.5-6.5C7.2 9.4 9.4 7.2 10 3.5Z" />
      <path d="M19 15v4M17 17h4" />
    </Svg>
  );
}

export function BoltIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Svg {...p}>
      <path fill={c} d="M13.5 2.5 4.6 13a.6.6 0 0 0 .5 1H11l-1.3 7.2c-.1.6.6.9 1 .4L19.4 11a.6.6 0 0 0-.5-1H13l1.4-7.1c.1-.6-.6-.9-.9-.4Z" />
    </Svg>
  );
}

export function HeartIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Svg {...p}>
      <path fill={c} d="M19 14c1.5-1.4 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.1 3 5.5l7 7Z" />
    </Svg>
  );
}

export function TagIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" />
      <circle cx="7.5" cy="7.5" r="1.3" fill={p.color ?? "currentColor"} stroke="none" />
    </Svg>
  );
}

/* ── Delivery / commerce ──────────────────────────────────── */

export function TruckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.7a1 1 0 0 0-.2-.6l-3.5-4.3a1 1 0 0 0-.8-.4H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Svg>
  );
}

export function CartIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2 2h2.6l2.7 12.4a2 2 0 0 0 2 1.6h9.4a2 2 0 0 0 2-1.6L22 7H5.1" />
    </Svg>
  );
}

export function BoxIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M11 21.7a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7Z" />
      <path d="M12 22V12M3.3 7 12 12l8.7-5M7.5 4.3l9 5.1" />
    </Svg>
  );
}

export function ScaleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m16 16 3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1ZM2 16l3-8 3 8c-.9.6-1.9 1-3 1s-2.1-.4-3-1Z" />
      <path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </Svg>
  );
}

export function StoreIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M2 7 4.4 2.6A1 1 0 0 1 5.3 2h13.4a1 1 0 0 1 .9.6L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20v1a3 3 0 0 1-5 2.2 3 3 0 0 1-5 0 3 3 0 0 1-5 0A3 3 0 0 1 2 8Z" />
    </Svg>
  );
}

export function CashIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </Svg>
  );
}

export function CardIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20M6 15h4" />
    </Svg>
  );
}

export function ReceiptIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Svg>
  );
}

/** Order received (clipboard with tick) */
export function ClipboardCheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </Svg>
  );
}

/** Delivered (house with tick) */
export function HomeCheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 10.2a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6a2 2 0 0 1 .7 1.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="m9 14 2 2 4-4" />
    </Svg>
  );
}

/* ── People / contact ─────────────────────────────────────── */

export function UserIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="4.5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </Svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </Svg>
  );
}

/** Telegram */
export function SendIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21.2 3.2 2.9 10.3c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.7 5.5c.3.8 1.3 1 1.9.4l2.5-2.4 4.7 3.5c.7.5 1.6.1 1.8-.7l3.3-15.4c.2-1-.8-1.8-1.7-1.4Z" />
      <path d="m7.6 13.6 10-6.6-7.4 7.9" />
    </Svg>
  );
}

/** Instagram */
export function CameraIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill={p.color ?? "currentColor"} stroke="none" />
    </Svg>
  );
}

export function MapPinIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

/* ── Status / feedback ────────────────────────────────────── */

export function ShieldIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function CheckCircleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12 2.5 2.5 5-5" />
    </Svg>
  );
}

export function AlertIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </Svg>
  );
}

export function LoaderIcon(p: IconProps) {
  return (
    <Svg {...p} className={`icon-spin ${p.className ?? ""}`}>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </Svg>
  );
}

/* ── Navigation / actions ─────────────────────────────────── */

export function ArrowRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Svg>
  );
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export function ZoomIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
    </Svg>
  );
}

export function CopyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="8" y="8" width="13" height="13" rx="2.5" />
      <path d="M4 16a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3h9a2 2 0 0 1 2 2" />
    </Svg>
  );
}

export function UploadIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </Svg>
  );
}

export function LogoutIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </Svg>
  );
}

export function SunIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </Svg>
  );
}

export function MoonIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Svg>
  );
}
