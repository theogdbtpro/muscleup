
'use server';
/**
 * @fileOverview Un flux Genkit pour le chat interactif avec le coach.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CoachChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
  profile: z.object({
    objective: z.string(),
    level: z.string(),
    frequency: z.string(),
  }),
});
export type CoachChatInput = z.infer<typeof CoachChatInputSchema>;

const CoachChatOutputSchema = z.object({
  response: z.string().describe('La réponse du coach.'),
});
export type CoachChatOutput = z.infer<typeof CoachChatOutputSchema>;

const coachChatPrompt = ai.definePrompt({
  name: 'coachChatPrompt',
  input: { schema: CoachChatInputSchema },
  output: { schema: CoachChatOutputSchema },
  prompt: `Tu es MuscleUp Coach, un coach de musculation bienveillant et expert. 
L'utilisateur a l'objectif suivant : "{{{profile.objective}}}", est de niveau "{{{profile.level}}}" et s'entraîne {{{profile.frequency}}} fois par semaine.

Historique de la conversation :
{{#each history}}
{{role}}: {{content}}
{{/each}}

Question de l'utilisateur : "{{{message}}}"

Réponds toujours en français, de façon concise, experte et motivante. Si la question n'est pas liée à la musculation ou au sport, ramène poliment la conversation vers le fitness.`,
});

export async function getCoachResponse(input: CoachChatInput): Promise<CoachChatOutput> {
  const { output } = await coachChatPrompt(input);
  return output!;
}
