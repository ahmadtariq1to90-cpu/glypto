import { LucideIcon } from "lucide-react";

export type ToolCategory = "Text" | "Image" | "Audio" | "Video" | "Utility";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  color: string;
  image?: string;
  isNew?: boolean;
}

export type ToolView = "home" | "chat" | "image-gen" | "all-tools" | string;
