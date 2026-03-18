export type Exercise = {
  name: string;
  sets: string;
  reps: string;
  technique: string;
  muscle: string;
  rest: string;
};

export type Session = {
  id: string;
  name: string;
  day: string;
  duration: string;
  exercises: Exercise[];
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
        name: 'Focus Biceps',
        day: 'Lundi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', sets: '4', reps: '10-12', technique: 'Coudes collés au corps.', muscle: 'Biceps', rest: '60s' },
          { name: 'Curl Marteau', sets: '3', reps: '12', technique: 'Prise neutre, contrôle la descente.', muscle: 'Biceps', rest: '60s' },
          { name: 'Curl Incliné', sets: '3', reps: '12', technique: 'Étirement maximal en bas.', muscle: 'Biceps', rest: '60s' },
          { name: 'Spider Curl', sets: '3', reps: '15', technique: 'Isolant, ne balance pas le corps.', muscle: 'Biceps', rest: '60s' }
        ]
      },
      {
        id: 'gb-2',
        name: 'Focus Triceps',
        day: 'Mercredi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Barre au front', sets: '4', reps: '10', technique: 'Coudes serrés vers l\'intérieur.', muscle: 'Triceps', rest: '90s' },
          { name: 'Extension Poulie', sets: '4', reps: '15', technique: 'Contracte fort en bas.', muscle: 'Triceps', rest: '60s' },
          { name: 'Dips Machine', sets: '3', reps: '12', technique: 'Buste droit pour focus triceps.', muscle: 'Triceps', rest: '60s' },
          { name: 'Extension Haltère', sets: '3', reps: '12', technique: 'Derrière la tête, bras vertical.', muscle: 'Triceps', rest: '60s' }
        ]
      },
      {
        id: 'gb-3',
        name: 'Bras Complets',
        day: 'Vendredi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Pupitre', sets: '3', reps: '12', technique: 'Focus pic du biceps.', muscle: 'Biceps', rest: '60s' },
          { name: 'Kickback Poulie', sets: '3', reps: '15', technique: 'Extension totale du bras.', muscle: 'Triceps', rest: '60s' },
          { name: 'Curl Inversé', sets: '3', reps: '15', technique: 'Travail des avant-bras.', muscle: 'Biceps/Avant-bras', rest: '60s' },
          { name: 'Pompes Diamant', sets: '3', reps: 'Max', technique: 'Mains en triangle.', muscle: 'Triceps', rest: '60s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Poulet', 'Oeufs', 'Beurre de cacahuète'],
      caloriesGoal: 'Prise de masse (+400 kcal)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Omelette 3 oeufs, avoine.", macros: "P: 30g | G: 50g | L: 15g" },
        { time: "12:30", name: "Déjeuner", description: "Poulet, riz, avocat.", macros: "P: 40g | G: 60g | L: 20g" },
        { time: "16:00", name: "Collation", description: "Whey, amandes.", macros: "P: 25g | G: 10g | L: 12g" },
        { time: "20:00", name: "Dîner", description: "Saumon, patate douce.", macros: "P: 35g | G: 40g | L: 18g" }
      ]
    }
  },
  {
    id: 'pectoraux',
    name: 'Programme Pectoraux',
    emoji: '🦍',
    sessions: [
      {
        id: 'pec-1',
        name: 'Push Lourd',
        day: 'Lundi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché', sets: '4', reps: '6-8', technique: 'Cage sortie, omoplates serrées.', muscle: 'Pectoraux', rest: '120s' },
          { name: 'Développé Incliné', sets: '3', reps: '8-10', technique: 'Barre vers le haut du torse.', muscle: 'Haut Pectoraux', rest: '90s' },
          { name: 'Dips Lestés', sets: '3', reps: '10', technique: 'Buste penché vers l\'avant.', muscle: 'Bas Pectoraux', rest: '90s' },
          { name: 'Développé Haltères', sets: '3', reps: '10', technique: 'Amplitude maximale.', muscle: 'Pectoraux', rest: '90s' }
        ]
      },
      {
        id: 'pec-2',
        name: 'Push Volume',
        day: 'Jeudi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Écartés Poulie', sets: '4', reps: '15', technique: 'Focus sur la contraction.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Machine Convergence', sets: '3', reps: '12', technique: 'Tension continue.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Crossover Bas', sets: '3', reps: '15', technique: 'Ramène les mains vers le haut.', muscle: 'Haut Pec', rest: '60s' },
          { name: 'Pompes Déclinées', sets: '3', reps: 'Max', technique: 'Pieds surélevés.', muscle: 'Haut Pec', rest: '60s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Dinde', 'Pâtes complètes', 'Brocolis'],
      caloriesGoal: 'Prise de masse propre',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Omelette, tartines complètes.", macros: "P: 25g | G: 45g | L: 12g" },
        { time: "12:30", name: "Déjeuner", description: "Bifteck, pâtes, légumes.", macros: "P: 45g | G: 70g | L: 15g" },
        { time: "16:00", name: "Collation", description: "Skyr, fruits rouges.", macros: "P: 20g | G: 20g | L: 2g" },
        { time: "20:00", name: "Dîner", description: "Thon, salade, riz.", macros: "P: 35g | G: 30g | L: 10g" }
      ]
    }
  },
  {
    id: 'dos-large',
    name: 'Programme Dos Large',
    emoji: '🦅',
    sessions: [
      {
        id: 'dos-1',
        name: 'Tirage Vertical',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Tractions Large', sets: '4', reps: 'Max', technique: 'Tire avec les coudes.', muscle: 'Grand dorsal', rest: '120s' },
          { name: 'Tirage Poitrine', sets: '3', reps: '12', technique: 'Buste légèrement incliné.', muscle: 'Dos', rest: '90s' },
          { name: 'Pull bras tendus', sets: '3', reps: '15', technique: 'Isolation du grand dorsal.', muscle: 'Grand dorsal', rest: '60s' },
          { name: 'Tirage Triangle', sets: '3', reps: '12', technique: 'Focus épaisseur.', muscle: 'Dos', rest: '90s' }
        ]
      },
      {
        id: 'dos-2',
        name: 'Tirage Horizontal',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Rowing Barre', sets: '4', reps: '8', technique: 'Dos bien plat, buste à 45°.', muscle: 'Milieu dos', rest: '120s' },
          { name: 'Rowing Haltère', sets: '3', reps: '10', technique: 'Un bras après l\'autre.', muscle: 'Dos', rest: '90s' },
          { name: 'Rowing Assis', sets: '3', reps: '12', technique: 'Serre les omoplates.', muscle: 'Dos', rest: '60s' },
          { name: 'Facepull', sets: '3', reps: '15', technique: 'Focus arrière épaule.', muscle: 'Trapèzes', rest: '60s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Saumon', 'Riz noir', 'Asperges'],
      caloriesGoal: 'Maintenance active',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Pain complet, cottage cheese.", macros: "P: 22g | G: 35g | L: 10g" },
        { time: "12:30", name: "Déjeuner", description: "Poulet, quinoa, brocolis.", macros: "P: 38g | G: 55g | L: 12g" },
        { time: "16:00", name: "Collation", description: "Amandes, pomme.", macros: "P: 6g | G: 25g | L: 14g" },
        { time: "20:00", name: "Dîner", description: "Poisson blanc, légumes verts.", macros: "P: 30g | G: 10g | L: 8g" }
      ]
    }
  },
  {
    id: 'full-body',
    name: 'Programme Full Body',
    emoji: '⚡',
    sessions: [
      {
        id: 'fb-1',
        name: 'Full Body A',
        day: 'Lundi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Barre', sets: '4', reps: '10', technique: 'Descente contrôlée.', muscle: 'Jambes', rest: '120s' },
          { name: 'Développé Couché', sets: '4', reps: '10', technique: 'Cage sortie.', muscle: 'Pectoraux', rest: '90s' },
          { name: 'Tractions', sets: '3', reps: 'Max', technique: 'Menton au dessus de la barre.', muscle: 'Dos', rest: '90s' },
          { name: 'Planche', sets: '3', reps: '1min', technique: 'Gainage maximal.', muscle: 'Abdos', rest: '60s' }
        ]
      },
      {
        id: 'fb-2',
        name: 'Full Body B',
        day: 'Mercredi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'SDT Jambes Tendues', sets: '3', reps: '12', technique: 'Dos plat, étirement ischios.', muscle: 'Ischios', rest: '120s' },
          { name: 'Développé Militaire', sets: '4', reps: '10', technique: 'Debout, gainage fort.', muscle: 'Épaules', rest: '90s' },
          { name: 'Rowing Haltère', sets: '3', reps: '12', technique: 'Tire avec le coude.', muscle: 'Dos', rest: '90s' },
          { name: 'Fentes Marchées', sets: '3', reps: '20 pas', technique: 'Genou proche du sol.', muscle: 'Jambes', rest: '90s' }
        ]
      },
      {
        id: 'fb-3',
        name: 'Full Body C',
        day: 'Vendredi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Presse à cuisses', sets: '4', reps: '12', technique: 'Pieds au milieu de la plateforme.', muscle: 'Quadriceps', rest: '90s' },
          { name: 'Chest Press', sets: '3', reps: '12', technique: 'Tension continue.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Tirage Vertical', sets: '3', reps: '12', technique: 'Focus largeur.', muscle: 'Dos', rest: '90s' },
          { name: 'Mollets Debout', sets: '4', reps: '15', technique: 'Extension maximale.', muscle: 'Mollets', rest: '60s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Oeufs', 'Flocons d\'avoine', 'Lentilles'],
      caloriesGoal: 'Maintenance',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Bowlcake avoine banane.", macros: "P: 20g | G: 40g | L: 10g" },
        { time: "12:30", name: "Déjeuner", description: "Lentilles, riz, Colin.", macros: "P: 30g | G: 50g | L: 8g" },
        { time: "16:00", name: "Collation", description: "Fruit, noix.", macros: "P: 5g | G: 20g | L: 15g" },
        { time: "20:00", name: "Dîner", description: "Salade complète, jambon cru.", macros: "P: 25g | G: 15g | L: 12g" }
      ]
    }
  },
  {
    id: 'jambes',
    name: 'Programme Jambes',
    emoji: '🍗',
    sessions: [
      {
        id: 'jam-1',
        name: 'Quad & Fessiers',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Arrière', sets: '4', reps: '10', technique: 'Descente lente, dos droit.', muscle: 'Quadriceps', rest: '120s' },
          { name: 'Presse 45°', sets: '3', reps: '12', technique: 'Pieds larges pour les fessiers.', muscle: 'Quadriceps/Fessiers', rest: '90s' },
          { name: 'Leg Extension', sets: '3', reps: '15', technique: 'Contraction en haut.', muscle: 'Quadriceps', rest: '60s' },
          { name: 'Abducteurs', sets: '3', reps: '20', technique: 'Travail du moyen fessier.', muscle: 'Fessiers', rest: '60s' }
        ]
      },
      {
        id: 'jam-2',
        name: 'Ischios & Mollets',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de terre Roumain', sets: '4', reps: '10', technique: 'Bascule du bassin.', muscle: 'Ischios', rest: '120s' },
          { name: 'Leg Curl Assis', sets: '4', reps: '12', technique: 'Tire fort vers le bas.', muscle: 'Ischios', rest: '60s' },
          { name: 'Mollets Presse', sets: '4', reps: '20', technique: 'Amplitude maximale.', muscle: 'Mollets', rest: '60s' },
          { name: 'Hips Thrust', sets: '4', reps: '10', technique: 'Contracte fort les fessiers.', muscle: 'Fessiers', rest: '90s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Patate douce', 'Boeuf 5%', 'Avocat'],
      caloriesGoal: 'Prise de masse (Focus énergie)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Pancakes protéinés.", macros: "P: 28g | G: 45g | L: 10g" },
        { time: "12:30", name: "Déjeuner", description: "Bifteck, patate douce.", macros: "P: 42g | G: 65g | L: 18g" },
        { time: "16:00", name: "Collation", description: "Fromage blanc, granola.", macros: "P: 20g | G: 25g | L: 5g" },
        { time: "20:00", name: "Dîner", description: "Poulet, riz, haricots.", macros: "P: 35g | G: 40g | L: 10g" }
      ]
    }
  },
  {
    id: 'abdos',
    name: 'Programme Abdos',
    emoji: '🛡️',
    sessions: [
      {
        id: 'abd-1',
        name: 'Abdos Force',
        day: 'Lundi',
        duration: '35 min',
        isRestDay: false,
        exercises: [
          { name: 'Crunch Poulie', sets: '4', reps: '15', technique: 'Enroule la colonne.', muscle: 'Grand droit', rest: '60s' },
          { name: 'Relevé de jambes', sets: '4', reps: '12', technique: 'Contrôle la descente.', muscle: 'Bas abdos', rest: '60s' },
          { name: 'Russian Twist', sets: '3', reps: '20', technique: 'Rotation du buste.', muscle: 'Obliques', rest: '45s' },
          { name: 'Ab Wheel', sets: '3', reps: '10', technique: 'Gainage strict.', muscle: 'Abdos', rest: '60s' }
        ]
      },
      {
        id: 'abd-2',
        name: 'Core Stability',
        day: 'Jeudi',
        duration: '30 min',
        isRestDay: false,
        exercises: [
          { name: 'Planche', sets: '3', reps: '1min', technique: 'Corps aligné.', muscle: 'Transverse', rest: '60s' },
          { name: 'Planche Latérale', sets: '3', reps: '45s/côté', technique: 'Hanches hautes.', muscle: 'Obliques', rest: '45s' },
          { name: 'Hollow Hold', sets: '3', reps: '45s', technique: 'Dos collé au sol.', muscle: 'Abdos', rest: '60s' },
          { name: 'Dead Bug', sets: '4', reps: '12', technique: 'Mouvement lent et contrôlé.', muscle: 'Abdos profonds', rest: '60s' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Thon', 'Épinards', 'Fromage blanc 0%'],
      caloriesGoal: 'Sèche (Déficit calorique)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Fromage blanc, framboises.", macros: "P: 18g | G: 15g | L: 1g" },
        { time: "12:30", name: "Déjeuner", description: "Thon, salade verte.", macros: "P: 32g | G: 5g | L: 8g" },
        { time: "16:00", name: "Collation", description: "1 pomme, thé vert.", macros: "P: 1g | G: 20g | L: 0g" },
        { time: "20:00", name: "Dîner", description: "Colin, brocolis.", macros: "P: 28g | G: 5g | L: 4g" }
      ]
    }
  }
];
