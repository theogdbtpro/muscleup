
'use server';
/**
 * @fileOverview Un flux Genkit pour obtenir des conseils techniques sur un exercice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExerciseAdviceInputSchema = z.object({
  exerciseName: z.string(),
  level: z.string(),
  objective: z.string(),
});
export type ExerciseAdviceInput = z.infer<typeof ExerciseAdviceInputSchema>;

const ExerciseAdviceOutputSchema = z.object({
  advice: z.string().describe('Le conseil technique précis et motivant.'),
});
export type ExerciseAdviceOutput = z.infer<typeof ExerciseAdviceOutputSchema>;

const exerciseAdvicePrompt = ai.definePrompt({
  name: 'exerciseAdvicePrompt',
  input: { schema: ExerciseAdviceInputSchema },
  output: { schema: ExerciseAdviceOutputSchema },
  prompt: `Tu es un coach de musculation expert. 
Donne un conseil technique précis en 2-3 phrases pour l'exercice "{{{exerciseName}}}" pour un athlète de niveau "{{{level}}}" qui a pour objectif "{{{objective}}}".
Sois concret, utilise des termes techniques précis et reste motivant. Réponds en français.`,
});

export async function getExerciseAdvice(input: ExerciseAdviceInput): Promise<ExerciseAdviceOutput> {
  const { output } = await exerciseAdvicePrompt(input);
  return output!;
}
