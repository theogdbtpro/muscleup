
'use server';
/**
 * @fileOverview Un flux Genkit pour analyser les progrès de l'utilisateur.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeProgressInputSchema = z.object({
  history: z.array(z.any()),
  profile: z.object({
    objective: z.string(),
    level: z.string(),
  }),
});
export type AnalyzeProgressInput = z.infer<typeof AnalyzeProgressInputSchema>;

const AnalyzeProgressOutputSchema = z.object({
  analysis: z.string().describe('L\'analyse des progrès.'),
});
export type AnalyzeProgressOutput = z.infer<typeof AnalyzeProgressOutputSchema>;

const analyzeProgressPrompt = ai.definePrompt({
  name: 'analyzeProgressPrompt',
  input: { schema: AnalyzeProgressInputSchema },
  output: { schema: AnalyzeProgressOutputSchema },
  prompt: `Tu es un expert en analyse de performance sportive. 
Analyse l'historique de séances suivant pour un utilisateur ayant pour objectif "{{{profile.objective}}}" et un niveau "{{{profile.level}}}".

Historique :
{{{json history}}}

Retourne une analyse en 3-4 phrases en français comprenant :
1. Les points positifs de son activité.
2. Les axes d'amélioration.
3. Un conseil concret pour la semaine suivante.
Sois encourageant et professionnel.`,
});

export async function analyzeUserProgress(input: AnalyzeProgressInput): Promise<AnalyzeProgressOutput> {
  const { output } = await analyzeProgressPrompt(input);
  return output!;
}
