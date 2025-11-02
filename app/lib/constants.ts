export const ISSUE_TYPES = [
  "POTHOLE", "DAMAGED_SURFACE", "OBSTRUCTION_DEBRIS", "FLOODING_WATER_ISSUE", "DAMAGED_SIGNAGE", "OTHER"
] as const;

export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;

// A helper for displaying user-friendly labels
export const LABELS: Record<string, string> = {
  POTHOLE: "Pothole",
  DAMAGED_SURFACE: "Damaged Surface",
  OBSTRUCTION_DEBRIS: "Obstruction / Debris",
  FLOODING_WATER_ISSUE: "Flooding / Water Issue",
  DAMAGED_SIGNAGE: "Damaged Signage",
  OTHER: "Other",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High / Urgent",
};
