'use server';

/**
 * @fileOverview Verifies if an uploaded image represents a real micro-disaster using GenAI.
 *
 * - verifyDisasterImage - A function that handles the disaster image verification process.
 * - VerifyDisasterImageInput - The input type for the verifyDisasterImage function.
 * - VerifyDisasterImageOutput - The return type for the verifyDisasterImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyDisasterImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential micro-disaster, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The user-provided description of the image.'),
});
export type VerifyDisasterImageInput = z.infer<typeof VerifyDisasterImageInputSchema>;

const VerifyDisasterImageOutputSchema = z.object({
  isDisaster: z.boolean().describe('Whether or not the image represents a real micro-disaster.'),
  reason: z.string().describe('The AI\u0027s reasoning for its determination.'),
  title: z.string().describe('A short, descriptive title for the disaster.'),
  severity: z.enum(['Low', 'Medium', 'High']).describe('The severity of the disaster.'),
  description: z.string().describe('A detailed description of the disaster.'),
});
export type VerifyDisasterImageOutput = z.infer<typeof VerifyDisasterImageOutputSchema>;

export async function verifyDisasterImage(input: VerifyDisasterImageInput): Promise<VerifyDisasterImageOutput> {
  return verifyDisasterImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyDisasterImagePrompt',
  input: {schema: VerifyDisasterImageInputSchema},
  output: {schema: VerifyDisasterImageOutputSchema},
  prompt: `You are an expert in identifying micro-disasters from images and descriptions.

You will analyze the provided image and description to determine if it represents a real micro-disaster event.

Consider factors such as the severity of the situation, the presence of visible damage or disruption, and the likelihood of a genuine emergency.

Based on your analysis, set the isDisaster output field to true if you believe it is a real micro-disaster, and false otherwise.

If it is a disaster, generate a concise title, a detailed description, and a severity level ('Low', 'Medium', 'High').

Explain your reasoning for your determination in the reason output field.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const verifyDisasterImageFlow = ai.defineFlow(
  {
    name: 'verifyDisasterImageFlow',
    inputSchema: VerifyDisasterImageInputSchema,
    outputSchema: VerifyDisasterImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
