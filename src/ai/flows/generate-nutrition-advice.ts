'use server';
/**
 * @fileOverview Ce fichier contient un flux Genkit pour générer des conseils nutritionnels personnalisés
 * basés sur l'objectif de musculation de l'utilisateur.
 *
 * - generateNutritionAdvice - La fonction qui déclenche le flux de génération de conseils nutritionnels.
 * - GenerateNutritionAdviceInput - Le type d'entrée pour la fonction generateNutritionAdvice.
 * - GenerateNutritionAdviceOutput - Le type de sortie pour la fonction generateNutritionAdvice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNutritionAdviceInputSchema = z.object({
  objective: z.string().describe('L\'objectif de musculation choisi par l\'utilisateur (ex: Gros bras, Pectoraux, etc.).'),
});
export type GenerateNutritionAdviceInput = z.infer<typeof GenerateNutritionAdviceInputSchema>;

const GenerateNutritionAdviceOutputSchema = z.object({
  proteinRecommendation: z.string().describe('Recommandation en protéines adaptée à l\'objectif de musculation.'),
  keyFoods: z.array(z.string()).describe('Liste d\'aliments clés à privilégier pour atteindre l\'objectif.'),
  mealTimingSuggestions: z.string().describe('Suggestions de timing des repas pour optimiser la performance et la récupération.'),
});
export type GenerateNutritionAdviceOutput = z.infer<typeof GenerateNutritionAdviceOutputSchema>;

const nutritionAdvicePrompt = ai.definePrompt({
  name: 'nutritionAdvicePrompt',
  input: { schema: GenerateNutritionAdviceInputSchema },
  output: { schema: GenerateNutritionAdviceOutputSchema },
  prompt: `Tu es un coach nutritionnel expert en musculation et tu dois fournir des conseils personnalisés en français.

Fournis des conseils nutritionnels personnalisés pour l'objectif de musculation suivant : "{{{objective}}}".

Ton conseil doit inclure:
1. Une recommandation de protéines claire et chiffrée.
2. Une liste d'aliments clés à intégrer à l'alimentation.
3. Des suggestions précises de timing des repas pour optimiser la performance et la récupération.

Assure-toi que la réponse soit formatée en JSON, correspondant exactement au schéma suivant:
{{jsonSchema output}}`,
});

const generateNutritionAdviceFlow = ai.defineFlow(
  {
    name: 'generateNutritionAdviceFlow',
    inputSchema: GenerateNutritionAdviceInputSchema,
    outputSchema: GenerateNutritionAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await nutritionAdvicePrompt(input);
    return output!;
  }
);

export async function generateNutritionAdvice(input: GenerateNutritionAdviceInput): Promise<GenerateNutritionAdviceOutput> {
  return generateNutritionAdviceFlow(input);
}
