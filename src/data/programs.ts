export type Exercise = {
  name: string;
  sets: string;
  reps: string;
  technique: string;
  muscle: string;
  rest: string;
  position: string;
};

export type Session = {
  id: string;
  name: string;
  day: string;
  duration: string;
  exercises: Exercise[];
  homeExercises?: Exercise[];
  isRestDay: boolean;
};

export type Meal = {
  time: string;
  name: string;
  description: string;
  macros: string;
};

export type NutritionInfo = {
  keyFoods: string[];
  caloriesGoal: string;
  meals: Meal[];
};

export type Program = {
  id: string;
  name: string;
  emoji: string;
  sessions: Session[];
  nutrition: NutritionInfo;
};

export const PROGRAMS: Program[] = [
  {
    id: 'gros-bras',
    name: 'Programme Gros Bras',
    emoji: '💪',
    sessions: [
      {
        id: 'gb-1',
        name: 'Séance Biceps',
        day: 'Lundi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', sets: '4', reps: '10-12', technique: 'Coudes collés au corps.', muscle: 'Biceps', rest: '60s', position: 'Debout, pieds écartés largeur épaules. Saisir la barre EZ en prise supination. Monter la barre en fléchissant les coudes.' },
          { name: 'Curl Marteau', sets: '3', reps: '12', technique: 'Prise neutre.', muscle: 'Biceps', rest: '60s', position: 'Debout, un haltère dans chaque main, paumes face aux cuisses.' },
          { name: 'Curl Incliné', sets: '3', reps: '12', technique: 'Étirement maximal.', muscle: 'Biceps', rest: '60s', position: 'Assis sur un banc incliné à 45°. Bras ballants vers le sol.' }
        ],
        homeExercises: [
          { name: 'Curl Elastique', sets: '4', reps: '15', technique: 'Tension constante.', muscle: 'Biceps', rest: '45s', position: 'Debout sur l\'élastique, saisir les extrémités. Monter les mains vers les épaules.' },
          { name: 'Curl Marteau (Bouteilles)', sets: '3', reps: '15', technique: 'Mouvement lent.', muscle: 'Biceps', rest: '45s', position: 'Utiliser deux bouteilles d\'eau comme haltères. Prise neutre.' },
          { name: 'Curl Isométrique (Table)', sets: '3', reps: '30s', technique: 'Pousser fort vers le haut.', muscle: 'Biceps', rest: '45s', position: 'Placer les mains sous une table lourde, coudes à 90°. Essayer de soulever la table.' }
        ]
      },
      {
        id: 'gb-2',
        name: 'Séance Triceps',
        day: 'Mercredi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Barre au front', sets: '4', reps: '10', technique: 'Coudes serrés.', muscle: 'Triceps', rest: '90s', position: 'Allongé sur un banc, bras verticaux tenant la barre EZ. Descendre vers le front.' },
          { name: 'Extension Poulie', sets: '4', reps: '15', technique: 'Contracte fort en bas.', muscle: 'Triceps', rest: '60s', position: 'Face à la poulie haute, barre droite en mains. Pousser vers le bas.' }
        ],
        homeExercises: [
          { name: 'Dips sur Chaise', sets: '4', reps: 'Max', technique: 'Dos proche de la chaise.', muscle: 'Triceps', rest: '60s', position: 'Mains sur le bord d\'une chaise stable, pieds au sol. Descendre les fesses vers le sol.' },
          { name: 'Pompes Diamant', sets: '3', reps: 'Max', technique: 'Mains en triangle.', muscle: 'Triceps', rest: '60s', position: 'Position de pompes, index et pouces se touchent.' }
        ]
      }
    ],
    nutrition: { keyFoods: ['Poulet', 'Oeufs', 'Beurre de cacahuète'], caloriesGoal: 'Prise de masse (+400 kcal)', meals: [] }
  },
  {
    id: 'pectoraux',
    name: 'Programme Pectoraux',
    emoji: '🦍',
    sessions: [
      {
        id: 'pec-1',
        name: 'Séance Force',
        day: 'Lundi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché', sets: '4', reps: '6-8', technique: 'Omoplates serrées.', muscle: 'Pectoraux', rest: '120s', position: 'Allongé sur le banc. Descendre la barre jusqu\'aux pectoraux.' },
          { name: 'Développé Incliné', sets: '3', reps: '8-10', technique: 'Focus haut pecs.', muscle: 'Haut Pectoraux', rest: '90s', position: 'Banc incliné à 30°. Descendre vers les clavicules.' }
        ],
        homeExercises: [
          { name: 'Pompes Classiques', sets: '4', reps: 'Max', technique: 'Corps bien droit.', muscle: 'Pectoraux', rest: '60s', position: 'Mains au sol plus larges que les épaules. Descendre la poitrine.' },
          { name: 'Pompes Déclinées', sets: '3', reps: 'Max', technique: 'Pieds surélevés.', muscle: 'Haut Pectoraux', rest: '60s', position: 'Mains au sol, pieds sur un canapé ou une chaise.' }
        ]
      }
    ],
    nutrition: { keyFoods: ['Dinde', 'Pâtes complètes'], caloriesGoal: 'Prise de masse propre', meals: [] }
  },
  {
    id: 'full-body',
    name: 'Programme Full Body',
    emoji: '⚡',
    sessions: [
      {
        id: 'fb-1',
        name: 'Séance Corps Entier',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Barre', sets: '4', reps: '10', technique: 'Dos droit.', muscle: 'Jambes', rest: '120s', position: 'Barre sur les trapèzes. Descendre jusqu\'à la parallèle.' },
          { name: 'Développé Couché', sets: '4', reps: '10', technique: 'Cage sortie.', muscle: 'Pectoraux', rest: '90s', position: 'Allongé sur banc plat. Pousser la barre.' }
        ],
        homeExercises: [
          { name: 'Squat Poids du Corps', sets: '4', reps: '20', technique: 'Talons au sol.', muscle: 'Jambes', rest: '60s', position: 'Debout, descendre les fesses en arrière comme pour s\'asseoir.' },
          { name: 'Pompes', sets: '4', reps: 'Max', technique: 'Gainage fort.', muscle: 'Pectoraux', rest: '60s', position: 'Mains au sol, descendre la poitrine vers le bas.' }
        ]
      }
    ],
    nutrition: { keyFoods: ['Oeufs', 'Avoine'], caloriesGoal: 'Maintenance', meals: [] }
  }
];
