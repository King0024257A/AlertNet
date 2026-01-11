import { config } from 'dotenv';
config();

import '@/ai/flows/verify-disaster-image.ts';
import '@/ai/flows/send-analytics-email.ts';
