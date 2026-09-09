import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "direction",
    title: "Creative Direction",
    summary: "The vision and the language before the first pixel.",
    capabilities: ["Brand strategy", "Art direction", "Naming", "Positioning"],
  },
  {
    id: "brand",
    title: "Brand Experience",
    summary: "Identity systems designed to be remembered.",
    capabilities: ["Visual identity", "Design systems", "Guidelines", "Editorial"],
  },
  {
    id: "motion",
    title: "Motion Design",
    summary: "Narrative through movement, intentional and controlled.",
    capabilities: ["Film", "Kinetic type", "Title design", "Sound"],
  },
  {
    id: "spatial",
    title: "Digital & Spatial",
    summary: "Immersive web, WebGL and real-time experiences.",
    capabilities: ["Creative development", "WebGL / 3D", "Interaction", "Performance"],
  },
];
