
import { type ReactNode } from 'react';

export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface Activities {
  transport_method?: string;
  commute_distance?: string;
  flights_month?: string;
  home_type?: string;
  heating_type?: string;
  electricity_source?: string;
  diet_type?: string;
  meal_ratio?: string;
  food_waste?: string;
}

export interface Emissions {
  transport: number;
  energy: number;
  food: number;
}

export interface Tip {
  category: string;
  tip: string;
  impact: string;
  difficulty: string;
}
