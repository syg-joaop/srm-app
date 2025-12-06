export interface Supplier {
  id: string;
  name: string;
  fantasy: string;
  city: string;
  lastLoad: string;
  daysWithoutLoad: number;
  status: "active" | "inactive" | "alert";
  hasAlert: boolean;
  latitude?: number;
  longitude?: number;
  hasCoordinates: boolean;
}
