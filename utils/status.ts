import { CheckCircle, Activity, AlertCircle, Clock } from "lucide-react-native";

export const STATUS_ICON = {
  completed: { icon: CheckCircle, color: "#10B981" },
  current: { icon: Activity, color: "#3B82F6" },
  "your-turn": { icon: AlertCircle, color: "#EF4444" },
  default: { icon: Clock, color: "#6B7280" },
};

export const STATUS_COLOR = {
  completed: "bg-green-100 text-green-600",
  current: "bg-blue-100 text-blue-600",
  "your-turn": "bg-red-100 text-red-600",
  default: "bg-gray-100 text-gray-600",
};
