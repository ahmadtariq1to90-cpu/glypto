import { LucideIcon } from "lucide-react";

export type ToolCategory = "Text" | "Image" | "Audio" | "Video" | "Utility" | "Social" | "Productivity" | "Content" | "Design" | "Marketing" | "Development";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  color: string;
  image?: string;
  isNew?: boolean;
}

export type ToolView = "home" | "chat" | "image-gen" | "all-tools" | string;
