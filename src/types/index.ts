export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  imageUrl: string;
  imageHint: string;
  reportedBy: string;
  timestamp: Date;
  isVerified: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  isCustom?: boolean;
}
