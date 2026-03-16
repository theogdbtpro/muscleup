export type Exercise = {
  name: string;
  sets: string;
  reps: string;
  technique: string;
  muscle: string;
};

export type Session = {
  day: string;
  exercises: Exercise[];
  isRestDay: boolean;
};

export type NutritionInfo = {
  keyFoods: string[];
  caloriesGoal: string;
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
    name: 'Gros bras',
    emoji: '💪',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', sets: '4', reps: '10-12', technique: 'Garder les coudes collés au corps.', muscle: 'Biceps' },
          { name: 'Extension Triceps Poulie', sets: '4', reps: '12-15', technique: 'Contraction maximale en bas.', muscle: 'Triceps' },
          { name: 'Curl Marteau', sets: '3', reps: '12', technique: 'Prise neutre pour le brachial.', muscle: 'Biceps/Avant-bras' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Dips', sets: '4', reps: '8-10', technique: 'Buste droit pour cibler les triceps.', muscle: 'Triceps' },
          { name: 'Curl Incliné', sets: '3', reps: '10', technique: 'Étirement maximal du biceps.', muscle: 'Biceps' },
          { name: 'Kickback Haltère', sets: '3', reps: '15', technique: 'Bras parallèle au sol.', muscle: 'Triceps' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      {
        day: 'Vendredi',
        isRestDay: false,
        exercises: [
          { name: 'Curl Concentré', sets: '3', reps: '12', technique: 'Dos bien fixe.', muscle: 'Biceps' },
          { name: 'Barre au front', sets: '4', reps: '10', technique: 'Coudes serrés.', muscle: 'Triceps' }
        ]
      },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Poulet', 'Beurre de cacahuète', 'Riz complet'],
      caloriesGoal: 'Prise de masse (+300 à 500 kcal)'
    }
  },
  {
    id: 'pectoraux',
    name: 'Pectoraux',
    emoji: '🦍',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché', sets: '4', reps: '8-10', technique: 'Sortir la cage thoracique.', muscle: 'Pectoraux' },
          { name: 'Développé Incliné Haltères', sets: '3', reps: '10-12', technique: 'Contrôler la descente.', muscle: 'Haut Pectoraux' },
          { name: 'Écartés Poulie Haute', sets: '3', reps: '15', technique: 'Serrer fort en fin de mouvement.', muscle: 'Pectoraux' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Pompes lestées', sets: '4', reps: 'Max', technique: 'Gainage complet.', muscle: 'Pectoraux' },
          { name: 'Chest Press', sets: '3', reps: '12', technique: 'Mouvement fluide.', muscle: 'Pectoraux' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Dips buste penché', sets: '4', reps: '10', technique: 'Coudes vers l\'extérieur.', muscle: 'Bas Pectoraux' },
          { name: 'Pull over haltère', sets: '3', reps: '12', technique: 'Bras légèrement fléchis.', muscle: 'Pectoraux/Serratus' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Dinde', 'Avocat', 'Pâtes complètes'],
      caloriesGoal: 'Prise de masse (Surplus calorique)'
    }
  },
  {
    id: 'dos-large',
    name: 'Dos large',
    emoji: '🦅',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Tractions Large', sets: '4', reps: 'Max', technique: 'Amener le menton au-dessus de la barre.', muscle: 'Grand dorsal' },
          { name: 'Tirage Vertical', sets: '3', reps: '12', technique: 'Dos bien droit, tirer avec les coudes.', muscle: 'Dos' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Rowing Barre T', sets: '4', reps: '10', technique: 'Dos plat, genoux fléchis.', muscle: 'Épaisseur du dos' },
          { name: 'Tirage Horizontal Poulie', sets: '3', reps: '12', technique: 'Resserrer les omoplates.', muscle: 'Milieu du dos' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Pull-down bras tendus', sets: '3', reps: '15', technique: 'Isolation du grand dorsal.', muscle: 'Dos' },
          { name: 'Lombaires', sets: '3', reps: '20', technique: 'Mouvement contrôlé.', muscle: 'Bas du dos' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Saumon', 'Cottage cheese', 'Quinoa'],
      caloriesGoal: 'Prise de masse (Optimisation anabolique)'
    }
  },
  {
    id: 'full-body',
    name: 'Full body',
    emoji: '⚡',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Squat', sets: '4', reps: '10', technique: 'Descente sous la parallèle.', muscle: 'Jambes' },
          { name: 'Développé Couché', sets: '4', reps: '10', technique: 'Cage sortie.', muscle: 'Pectoraux' },
          { name: 'Rowing Haltère', sets: '3', reps: '12', technique: 'Dos fixe.', muscle: 'Dos' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de terre', sets: '3', reps: '8', technique: 'Dos parfaitement plat.', muscle: 'Postérieur' },
          { name: 'Développé Militaire', sets: '3', reps: '10', technique: 'Gainage abdos.', muscle: 'Épaules' },
          { name: 'Tractions', sets: '3', reps: 'Max', technique: 'Amplitude complète.', muscle: 'Dos' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Fentes Haltères', sets: '3', reps: '12', technique: 'Pas bien grand.', muscle: 'Jambes' },
          { name: 'Dips', sets: '3', reps: '12', technique: 'Buste droit.', muscle: 'Haut du corps' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Oeufs entiers', 'Flocons d\'avoine', 'Légumes verts'],
      caloriesGoal: 'Maintenance ou Recomposition'
    }
  },
  {
    id: 'jambes',
    name: 'Jambes',
    emoji: '🍗',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Leg Press', sets: '4', reps: '12-15', technique: 'Ne pas verrouiller les genoux.', muscle: 'Quadriceps' },
          { name: 'Leg Extension', sets: '3', reps: '15', technique: 'Contraction lente.', muscle: 'Quadriceps' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Leg Curl Assis', sets: '4', reps: '12', technique: 'Dos collé au siège.', muscle: 'Ischios' },
          { name: 'Stiff Leg Deadlift', sets: '3', reps: '10', technique: 'Sentir l\'étirement.', muscle: 'Ischios/Fessiers' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Mollets debout', sets: '4', reps: '20', technique: 'Amplitude totale.', muscle: 'Mollets' },
          { name: 'Gobelet Squat', sets: '3', reps: '15', technique: 'Dos droit.', muscle: 'Jambes' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Boeuf haché 5%', 'Patate douce', 'Noix'],
      caloriesGoal: 'Prise de masse (Focus énergie)'
    }
  },
  {
    id: 'abdos',
    name: 'Abdos',
    emoji: '🛡️',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Crunch Poulie Haute', sets: '4', reps: '15', technique: 'Enrouler la colonne.', muscle: 'Grand droit' },
          { name: 'Relevé de jambes', sets: '4', reps: '12', technique: 'Bassin vers le haut.', muscle: 'Bas abdos' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Planche', sets: '4', reps: '1min', technique: 'Corps aligné, ne pas cambrer.', muscle: 'Gainage' },
          { name: 'Russian Twist', sets: '3', reps: '20', technique: 'Rotation contrôlée.', muscle: 'Obliques' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Hollow Hold', sets: '3', reps: '45s', technique: 'Bas du dos au sol.', muscle: 'Abdos profonds' },
          { name: 'Mountain Climbers', sets: '3', reps: '30s', technique: 'Rapide et gainé.', muscle: 'Cardio/Abdos' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Thon', 'Épinards', 'Fromage blanc 0%'],
      caloriesGoal: 'Sèche (Déficit calorique)'
    }
  }
];
