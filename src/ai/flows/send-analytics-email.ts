'use server';

/**
 * @fileOverview Generates and "sends" an analytics email to a list of recipients.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { format, subDays } from 'date-fns';

const AnalyticsDataSchema = z.object({
  totalAlerts: z.number(),
  alertsBySeverity: z.record(z.number()),
  alertsLast7Days: z.record(z.number()),
  mostRecentAlert: z.object({
    title: z.string(),
    location: z.string(),
    timestamp: z.string(),
  }).optional(),
});

const SendAnalyticsEmailInputSchema = z.object({
  recipientEmails: z.array(z.string().email()),
  analytics: AnalyticsDataSchema,
});

const SendAnalyticsEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  sentEmails: z.number(),
});

export type SendAnalyticsEmailInput = z.infer<typeof SendAnalyticsEmailInputSchema>;
export type SendAnalyticsEmailOutput = z.infer<typeof SendAnalyticsEmailOutputSchema>;

export async function sendAnalyticsEmail(input: SendAnalyticsEmailInput): Promise<SendAnalyticsEmailOutput> {
  return sendAnalyticsEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendAnalyticsEmailPrompt',
  input: { schema: SendAnalyticsEmailInputSchema },
  output: { schema: z.object({ subject: z.string(), body: z.string() }) },
  prompt: `You are an AI assistant for AlertNet, a micro-disaster reporting platform.
Your task is to generate a compelling and informative email body for a global notification.
The email should summarize the latest disaster analytics.

Use the provided analytics data to craft the email.
- Start with a clear and engaging subject line.
- The body should be in HTML format.
- Present the key statistics in a clean, readable way (e.g., using lists or bold text).
- Highlight the total number of alerts, the breakdown by severity, and the trend over the last 7 days.
- If there's a recent alert, mention it as an example of recent activity.
- End with a call to action, encouraging users to stay vigilant and report any new incidents.
- Be professional, slightly urgent, but reassuring.

Analytics Data:
- Total Alerts: {{{analytics.totalAlerts}}}
- Alerts by Severity:
  - Low: {{{analytics.alertsBySeverity.Low}}}
  - Medium: {{{analytics.alertsBySeverity.Medium}}}
  - High: {{{analytics.alertsBySeverity.High}}}
- Alerts in Last 7 Days: {{#each analytics.alertsLast7Days}} {{{@key}}}: {{{.}}} {{/each}}
- Most Recent Alert:
  - Title: {{{analytics.mostRecentAlert.title}}}
  - Location: {{{analytics.mostRecentAlert.location}}}
  - Timestamp: {{{analytics.mostRecentAlert.timestamp}}}
`,
});

const sendAnalyticsEmailFlow = ai.defineFlow(
  {
    name: 'sendAnalyticsEmailFlow',
    inputSchema: SendAnalyticsEmailInputSchema,
    outputSchema: SendAnalyticsEmailOutputSchema,
  },
  async (input) => {
    const { output: emailContent } = await prompt(input);

    if (!emailContent) {
      return {
        success: false,
        message: 'Failed to generate email content.',
        sentEmails: 0,
      };
    }

    // In a real application, you would integrate with an email sending service like SendGrid, Resend, or AWS SES.
    // For this demo, we will just log the action to the console.
    console.log('--- SIMULATING EMAIL SEND ---');
    console.log(`Subject: ${emailContent.subject}`);
    console.log(`Recipients: ${input.recipientEmails.join(', ')}`);
    // console.log(`Body (HTML):\n${emailContent.body}`);
    console.log('-----------------------------');

    return {
      success: true,
      message: `Successfully generated and simulated sending email to ${input.recipientEmails.length} recipients.`,
      sentEmails: input.recipientEmails.length,
    };
  }
);
