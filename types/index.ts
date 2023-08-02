import { LucideIcon } from "lucide-react";

export interface IRoutes {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export interface ITools {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href: string;
}
