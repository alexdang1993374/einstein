import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";

import { IRoutes, ITools } from "@/types";

export const routes: IRoutes[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-emerald-500",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-green-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const tools: ITools[] = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/music",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/video",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
];

interface ITestimonial {
  name: string;
  avatar: string;
  title: string;
  description: string;
}

export const testimonials: ITestimonial[] = [
  {
    name: "Benjamin",
    avatar: "B",
    title: "Software Engineer",
    description:
      "This is a great tool for creating content. It is easy to use and has a lot of features.",
  },
  {
    name: "Andy",
    avatar: "A",
    title: "Designer",
    description: "The image generator is awesome!",
  },
  {
    name: "Cameron",
    avatar: "C",
    title: "Lawyer",
    description:
      "This tool helps me get busy work done quickly and makes me so efficient!",
  },
  {
    name: "Yuki",
    avatar: "Y",
    title: "Teacher",
    description: "I love this AI tool!",
  },
];

export const MAX_FREE_COUNTS = 5;
