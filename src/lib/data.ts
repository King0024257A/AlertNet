import type { Alert, EmergencyContact } from '@/types';

export const alerts: Alert[] = [
  {
    id: '1',
    title: 'Minor Kitchen Fire',
    description: 'A small fire broke out in a kitchen but was quickly contained. No injuries reported, minor smoke damage.',
    location: '123 Maple St, Springfield',
    severity: 'Low',
    imageUrl: 'https://picsum.photos/seed/fire1/600/400',
    imageHint: 'house fire',
    reportedBy: 'Jane Doe',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isVerified: true,
  },
  {
    id: '2',
    title: 'Flooded Underpass on 5th Ave',
    description: 'Heavy rainfall has caused the underpass on 5th Avenue to flood. The road is currently impassable for small vehicles.',
    location: '5th Avenue Underpass',
    severity: 'Medium',
    imageUrl: 'https://picsum.photos/seed/flood1/600/400',
    imageHint: 'street flood',
    reportedBy: 'John Smith',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isVerified: true,
  },
  {
    id: '3',
    title: 'Large Pothole on Main Street',
    description: 'A very large and deep pothole has formed on Main Street near the town square, posing a risk to traffic.',
    location: 'Main Street, near Town Square',
    severity: 'Low',
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    imageHint: 'road pothole',
    reportedBy: 'Emily White',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isVerified: true,
  },
  {
    id: '4',
    title: 'Fallen Tree on Park Path',
    description: 'A large oak tree has fallen across the main walking path in Central Park after strong winds.',
    location: 'Central Park',
    severity: 'Low',
    imageUrl: 'https://picsum.photos/seed/tree1/600/400',
    imageHint: 'fallen tree',
    reportedBy: 'Mike Brown',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isVerified: true,
  },
  {
    id: '5',
    title: 'Downed Power Line',
    description: 'A power line is down on Elm Street due to the recent storm. The area has been cordoned off.',
    location: 'Elm Street & 2nd Ave',
    severity: 'High',
    imageUrl: 'https://picsum.photos/seed/powerline1/600/400',
    imageHint: 'downed powerline',
    reportedBy: 'Admin',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isVerified: true,
  },
];

export const emergencyContacts: EmergencyContact[] = [
  { id: '1', name: 'National Emergency Helpline', phone: '112' },
  { id: '2', name: 'Police', phone: '100' },
  { id: '3', name: 'Fire', phone: '101' },
  { id: '4', name: 'Ambulance', phone: '102' },
  { id: '5', name: 'Disaster Management Services', phone: '108' },
  { id: '6', name: 'Women Helpline', phone: '1091' },
  { id: '7', name: 'Child Helpline', phone: '1098' },
  { id: '8', name: 'LPG Leak Helpline', phone: '1906' },
];
