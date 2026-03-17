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
        name: 'Séance Bras A',
        day: 'Lundi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', sets: '4', reps: '10-12', technique: 'Coudes collés.', muscle: 'Biceps', rest: '60s' },
          { name: 'Extension Triceps', sets: '4', reps: '12-15', technique: 'Extension complète.', muscle: 'Triceps', rest: '60s' },
          { name: 'Curl Marteau', sets: '3', reps: '12', technique: 'Prise neutre.', muscle: 'Biceps', rest: '60s' },
          { name: 'Dips Banc', sets: '3', reps: '15', technique: 'Descente contrôlée.', muscle: 'Triceps', rest: '60s' },
          { name: 'Curl Incliné', sets: '3', reps: '12', technique: 'Étirement maximal.', muscle: 'Biceps', rest: '60s' }
        ]
      },
      { id: 'gb-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'gb-3',
        name: 'Séance Bras B',
        day: 'Mercredi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Barre au front', sets: '4', reps: '10', technique: 'Coudes serrés.', muscle: 'Triceps', rest: '90s' },
          { name: 'Kickback Haltère', sets: '3', reps: '15', technique: 'Bras fixe.', muscle: 'Triceps', rest: '60s' },
          { name: 'Spider Curl', sets: '3', reps: '12', technique: 'Isoler le biceps.', muscle: 'Biceps', rest: '60s' },
          { name: 'Extension Poulie', sets: '4', reps: '15', technique: 'Contracter fort.', muscle: 'Triceps', rest: '60s' }
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
        name: 'Séance Pecs A',
        day: 'Lundi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché', sets: '4', reps: '8-10', technique: 'Cage sortie.', muscle: 'Pectoraux', rest: '120s' },
          { name: 'Développé Incliné', sets: '3', reps: '10-12', technique: 'Focus haut pec.', muscle: 'Haut Pectoraux', rest: '90s' },
          { name: 'Écartés Poulie', sets: '3', reps: '15', technique: 'Serrer fort.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Pompes Diamant', sets: '3', reps: 'Max', technique: 'Mains serrées.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Dips Buste Penché', sets: '3', reps: '10', technique: 'Coudes ouverts.', muscle: 'Bas Pectoraux', rest: '90s' }
        ]
      },
      { id: 'pec-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'pec-3',
        name: 'Séance Pecs B',
        day: 'Mercredi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Chest Press', sets: '3', reps: '12', technique: 'Tension continue.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Écartés Haltères', sets: '3', reps: '12', technique: 'Ampleur contrôlée.', muscle: 'Pectoraux', rest: '60s' },
          { name: 'Crossover Bas', sets: '3', reps: '15', technique: 'Finir en haut.', muscle: 'Haut Pec', rest: '60s' },
          { name: 'Pompes lestées', sets: '3', reps: '15', technique: 'Gainage strict.', muscle: 'Pectoraux', rest: '60s' }
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
        name: 'Séance Dos A',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Tractions Large', sets: '4', reps: 'Max', technique: 'Menton barre.', muscle: 'Grand dorsal', rest: '120s' },
          { name: 'Tirage Vertical', sets: '3', reps: '12', technique: 'Coudes hanches.', muscle: 'Dos', rest: '90s' },
          { name: 'Rowing Haltère', sets: '3', reps: '10', technique: 'Dos plat.', muscle: 'Dos', rest: '60s' },
          { name: 'Pull bras tendus', sets: '3', reps: '15', technique: 'Isolation.', muscle: 'Grand dorsal', rest: '60s' },
          { name: 'Facepull', sets: '3', reps: '15', technique: 'Arrière épaule.', muscle: 'Trapèzes', rest: '60s' }
        ]
      },
      { id: 'dos-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'dos-3',
        name: 'Séance Dos B',
        day: 'Mercredi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de terre', sets: '3', reps: '8', technique: 'Gainage max.', muscle: 'Dos complet', rest: '180s' },
          { name: 'Rowing Barre T', sets: '4', reps: '10', technique: 'Tirer avec coudes.', muscle: 'Milieu dos', rest: '90s' },
          { name: 'Rowing Assis', sets: '3', reps: '12', technique: 'Omoplates serrées.', muscle: 'Milieu dos', rest: '60s' },
          { name: 'Extensions Lombaires', sets: '3', reps: '15', technique: 'Contrôlé.', muscle: 'Lombaires', rest: '60s' }
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
        name: 'Séance Full Body A',
        day: 'Lundi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Barre', sets: '4', reps: '10', technique: 'Dos droit.', muscle: 'Jambes', rest: '120s' },
          { name: 'DC Barre', sets: '4', reps: '10', technique: 'Contrôler.', muscle: 'Pectoraux', rest: '90s' },
          { name: 'Tractions', sets: '3', reps: 'Max', technique: 'Amplitude.', muscle: 'Dos', rest: '90s' },
          { name: 'Dips', sets: '3', reps: '12', technique: 'Buste droit.', muscle: 'Haut corps', rest: '60s' },
          { name: 'Planche', sets: '3', reps: '1min', technique: 'Gainage.', muscle: 'Abdos', rest: '60s' }
        ]
      },
      { id: 'fb-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'fb-3',
        name: 'Séance Full Body B',
        day: 'Mercredi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de terre', sets: '3', reps: '8', technique: 'Dos plat.', muscle: 'Chaîne post', rest: '120s' },
          { name: 'Presse à cuisses', sets: '3', reps: '12', technique: 'Pas d\'extension max.', muscle: 'Jambes', rest: '90s' },
          { name: 'D. Incliné Haltères', sets: '3', reps: '10', technique: 'Focus haut pec.', muscle: 'Pectoraux', rest: '90s' },
          { name: 'Rowing Barre', sets: '3', reps: '10', technique: 'Tirer vers hanches.', muscle: 'Dos', rest: '90s' }
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
        name: 'Séance Jambes A',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Arrière', sets: '4', reps: '10', technique: 'Descente lente.', muscle: 'Quadriceps', rest: '120s' },
          { name: 'Presse 45°', sets: '3', reps: '12', technique: 'Pieds larges.', muscle: 'Quadriceps', rest: '90s' },
          { name: 'Fentes Haltères', sets: '3', reps: '20 pas', technique: 'Genou 90°.', muscle: 'Jambes', rest: '60s' },
          { name: 'Leg Extension', sets: '3', reps: '15', technique: 'Pause en haut.', muscle: 'Quadriceps', rest: '60s' },
          { name: 'Mollets Debout', sets: '4', reps: '20', technique: 'Amplitude max.', muscle: 'Mollets', rest: '60s' }
        ]
      },
      { id: 'jam-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'jam-3',
        name: 'Séance Jambes B',
        day: 'Mercredi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Leg Curl Assis', sets: '4', reps: '12', technique: 'Isoler derrière.', muscle: 'Ischios', rest: '60s' },
          { name: 'Hips Thrust', sets: '4', reps: '10', technique: 'Contraction fessier.', muscle: 'Fessiers', rest: '90s' },
          { name: 'SDT Jambes Tendues', sets: '3', reps: '12', technique: 'Étirement.', muscle: 'Ischios', rest: '90s' },
          { name: 'Abducteurs Machine', sets: '3', reps: '20', technique: 'Tension.', muscle: 'Fessiers', rest: '60s' }
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
        name: 'Séance Abdos A',
        day: 'Lundi',
        duration: '30 min',
        isRestDay: false,
        exercises: [
          { name: 'Crunch Poulie', sets: '4', reps: '15', technique: 'Enrouler.', muscle: 'Grand droit', rest: '60s' },
          { name: 'Relevé de jambes', sets: '4', reps: '12', technique: 'Lent.', muscle: 'Bas abdos', rest: '60s' },
          { name: 'Planche', sets: '3', reps: '1min', technique: 'Gainage.', muscle: 'Abdos profonds', rest: '60s' },
          { name: 'Russian Twist', sets: '3', reps: '20', technique: 'Rotation.', muscle: 'Obliques', rest: '45s' },
          { name: 'Mountain Climbers', sets: '3', reps: '45s', technique: 'Rapide.', muscle: 'Abdos/Cardio', rest: '45s' }
        ]
      },
      { id: 'abd-2', name: 'Repos', day: 'Mardi', duration: '-', isRestDay: true, exercises: [] },
      {
        id: 'abd-3',
        name: 'Séance Abdos B',
        day: 'Mercredi',
        duration: '35 min',
        isRestDay: false,
        exercises: [
          { name: 'Dead Bug', sets: '4', reps: '12/côté', technique: 'Dos collé.', muscle: 'Abdos profonds', rest: '60s' },
          { name: 'Planche Latérale', sets: '3', reps: '45s/côté', technique: 'Hanches hautes.', muscle: 'Obliques', rest: '60s' },
          { name: 'Hollow Hold', sets: '3', reps: '45s', technique: 'Gainage total.', muscle: 'Abdos', rest: '60s' },
          { name: 'Ab Wheel', sets: '3', reps: '10', technique: 'Dos plat.', muscle: 'Abdos', rest: '60s' }
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
