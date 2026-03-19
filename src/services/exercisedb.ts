
/**
 * @fileOverview Service pour récupérer des GIFs d'exercices via l'API ExerciseDB.
 */

export async function searchExerciseGif(exerciseName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.exercisedb.io/exercises/name/${encodeURIComponent(exerciseName.toLowerCase())}?limit=1`,
      { 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0 && data[0].gifUrl) {
      // Transformation simple de l'URL si nécessaire (souvent HTTPS)
      return data[0].gifUrl;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la recherche du GIF:", error);
    return null;
  }
}
