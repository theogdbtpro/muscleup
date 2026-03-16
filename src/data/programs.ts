
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

export type Meal = {
  time: string;
  name: string;
  description: string;
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
    name: 'Gros bras',
    emoji: '💪',
    sessions: [
      {
        day: 'Lundi',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', sets: '4', reps: '10-12', technique: 'Garder les coudes collés au corps.', muscle: 'Biceps' },
          { name: 'Extension Triceps Poulie', sets: '4', reps: '12-15', technique: 'Contraction maximale en bas.', muscle: 'Triceps' },
          { name: 'Curl Marteau', sets: '3', reps: '12', technique: 'Prise neutre pour le brachial.', muscle: 'Biceps/Avant-bras' },
          { name: 'Dips entre deux bancs', sets: '3', reps: '15', technique: 'Descendre les fessiers proche du banc.', muscle: 'Triceps' },
          { name: 'Curl Concentré', sets: '3', reps: '12', technique: 'Isoler le mouvement, dos fixe.', muscle: 'Biceps' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Dips Lestés', sets: '4', reps: '8-10', technique: 'Buste droit pour cibler les triceps.', muscle: 'Triceps' },
          { name: 'Curl Incliné', sets: '3', reps: '10', technique: 'Étirement maximal du biceps.', muscle: 'Biceps' },
          { name: 'Kickback Haltère', sets: '3', reps: '15', technique: 'Bras parallèle au sol.', muscle: 'Triceps' },
          { name: 'Curl Poulie Basse', sets: '4', reps: '12', technique: 'Tension continue sur tout le mouvement.', muscle: 'Biceps' },
          { name: 'Extension Corde derrière tête', sets: '3', reps: '12', technique: 'Ouvrir les mains en fin de mouvement.', muscle: 'Triceps' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      {
        day: 'Vendredi',
        isRestDay: false,
        exercises: [
          { name: 'Barre au front', sets: '4', reps: '10', technique: 'Coudes serrés.', muscle: 'Triceps' },
          { name: 'Spider Curl', sets: '3', reps: '12', technique: 'Bras ballants sur le banc incliné.', muscle: 'Biceps' },
          { name: 'Pompes mains serrées', sets: '3', reps: 'Max', technique: 'Coudes le long du corps.', muscle: 'Triceps' },
          { name: 'Curl Inversé Barre', sets: '3', reps: '12', technique: 'Cibler le long supinateur.', muscle: 'Avant-bras' },
          { name: 'Extension unilatérale haltère', sets: '3', reps: '12', technique: 'Stabiliser l\'épaule avec l\'autre main.', muscle: 'Triceps' }
        ]
      },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Poulet', 'Beurre de cacahuète', 'Riz complet'],
      caloriesGoal: 'Prise de masse (+300 à 500 kcal)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Omelette 3 oeufs, flocons d'avoine, 1 banane." },
        { time: "12:30", name: "Déjeuner", description: "Poulet grillé, riz basmati, brocolis, huile d'olive." },
        { time: "16:00", name: "Collation (Pré-workout)", description: "Fromage blanc, poignée d'amandes, 1 pomme." },
        { time: "20:00", name: "Dîner", description: "Pavé de saumon, patate douce, haricots verts." }
      ]
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
          { name: 'Écartés Poulie Haute', sets: '3', reps: '15', technique: 'Serrer fort en fin de mouvement.', muscle: 'Pectoraux' },
          { name: 'Chest Press Machine', sets: '3', reps: '12', technique: 'Mouvement fluide et contrôlé.', muscle: 'Pectoraux' },
          { name: 'Pompes Déclinées', sets: '3', reps: 'Max', technique: 'Pieds surélevés.', muscle: 'Haut Pectoraux' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché Haltères', sets: '4', reps: '10', technique: 'Amplitude maximale.', muscle: 'Pectoraux' },
          { name: 'Dips buste penché', sets: '3', reps: '12', technique: 'Coudes vers l\'extérieur.', muscle: 'Bas Pectoraux' },
          { name: 'Écartés Haltères Incliné', sets: '3', reps: '12', technique: 'Ne pas trop descendre pour préserver l\'épaule.', muscle: 'Haut Pectoraux' },
          { name: 'Pull over haltère', sets: '3', reps: '12', technique: 'Bras légèrement fléchis.', muscle: 'Pectoraux/Serratus' },
          { name: 'Pompes larges', sets: '3', reps: 'Max', technique: 'Garder le corps bien gainé.', muscle: 'Pectoraux' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Développé Incliné Barre', sets: '4', reps: '8', technique: 'Viser le haut des pectoraux.', muscle: 'Haut Pectoraux' },
          { name: 'Machine à Écartés (Pec Deck)', sets: '3', reps: '15', technique: 'Focus sur la contraction.', muscle: 'Pectoraux' },
          { name: 'Pompes Diamant', sets: '3', reps: 'Max', technique: 'Mains serrées en triangle.', muscle: 'Pectoraux/Triceps' },
          { name: 'Crossover Poulie Basse', sets: '3', reps: '15', technique: 'Tirer vers le haut.', muscle: 'Haut Pectoraux' },
          { name: 'Développé Décliné', sets: '3', reps: '10', technique: 'Cibler la partie inférieure.', muscle: 'Bas Pectoraux' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Dinde', 'Avocat', 'Pâtes complètes'],
      caloriesGoal: 'Prise de masse (Surplus calorique)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Pain complet grillé, oeufs pochés, avocat." },
        { time: "12:30", name: "Déjeuner", description: "Steak haché 5%, pâtes complètes, ratatouille." },
        { time: "16:00", name: "Collation", description: "Whey protéine, 1 banane, quelques noix." },
        { time: "20:00", name: "Dîner", description: "Filet de dinde, quinoa, épinards à la crème." }
      ]
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
          { name: 'Tirage Vertical Poulie', sets: '3', reps: '12', technique: 'Tirer avec les coudes.', muscle: 'Dos' },
          { name: 'Rowing Haltère unilatéral', sets: '3', reps: '10', technique: 'Dos plat, ramener l\'haltère vers la hanche.', muscle: 'Grand dorsal' },
          { name: 'Pull-down bras tendus', sets: '3', reps: '15', technique: 'Isolation du grand dorsal.', muscle: 'Dos' },
          { name: 'Rowing inversé', sets: '3', reps: '12', technique: 'Garder le corps droit comme une planche.', muscle: 'Dos' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Rowing Barre T', sets: '4', reps: '10', technique: 'Dos plat, genoux fléchis.', muscle: 'Épaisseur du dos' },
          { name: 'Tirage Horizontal Poulie', sets: '3', reps: '12', technique: 'Resserrer les omoplates.', muscle: 'Milieu du dos' },
          { name: 'Facepull Poulie Haute', sets: '3', reps: '15', technique: 'Tirer vers le front, coudes hauts.', muscle: 'Arrière épaule' },
          { name: 'Lombaires au banc', sets: '3', reps: '15', technique: 'Mouvement contrôlé.', muscle: 'Bas du dos' },
          { name: 'Shrugs Haltères', sets: '3', reps: '12', technique: 'Haussement pur des épaules.', muscle: 'Trapèzes' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Soulevé de terre', sets: '3', reps: '8', technique: 'Dos parfaitement droit.', muscle: 'Chaîne postérieure' },
          { name: 'Tirage poitrine prise serrée', sets: '4', reps: '10', technique: 'Se pencher légèrement en arrière.', muscle: 'Dos' },
          { name: 'Rowing Machine assis', sets: '3', reps: '12', technique: 'Étirement complet du dos.', muscle: 'Dos' },
          { name: 'Good Mornings', sets: '3', reps: '12', technique: 'Léger fléchissement des genoux.', muscle: 'Bas du dos' },
          { name: 'Tirage vertical prise neutre', sets: '3', reps: '12', technique: 'Focus sur le grand dorsal inférieur.', muscle: 'Dos' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Saumon', 'Cottage cheese', 'Quinoa'],
      caloriesGoal: 'Prise de masse (Optimisation anabolique)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Muesli sans sucre, lait végétal, fruits rouges." },
        { time: "12:30", name: "Déjeuner", description: "Saumon au four, riz noir, asperges." },
        { time: "16:00", name: "Collation", description: "Skyr nature, miel, 1 barre protéinée." },
        { time: "20:00", name: "Dîner", description: "Omelette aux champignons, salade composée, quinoa." }
      ]
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
          { name: 'Rowing Haltère', sets: '3', reps: '12', technique: 'Dos fixe.', muscle: 'Dos' },
          { name: 'Développé Militaire', sets: '3', reps: '10', technique: 'Gainage abdos.', muscle: 'Épaules' },
          { name: 'Planche', sets: '3', reps: '1min', technique: 'Alignement parfait.', muscle: 'Abdos' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de terre', sets: '3', reps: '8', technique: 'Dos parfaitement plat.', muscle: 'Postérieur' },
          { name: 'Tractions', sets: '3', reps: 'Max', technique: 'Amplitude complète.', muscle: 'Dos' },
          { name: 'Fentes Haltères', sets: '3', reps: '12', technique: 'Pas bien grand.', muscle: 'Jambes' },
          { name: 'Dips', sets: '3', reps: '12', technique: 'Buste droit.', muscle: 'Haut du corps' },
          { name: 'Relevé de jambes', sets: '3', reps: '15', technique: 'Mouvement lent.', muscle: 'Abdos' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Presse à Cuisses', sets: '3', reps: '15', technique: 'Pousser avec les talons.', muscle: 'Jambes' },
          { name: 'Développé Incliné Haltères', sets: '3', reps: '12', technique: 'Contrôle total.', muscle: 'Pectoraux' },
          { name: 'Tirage Vertical', sets: '3', reps: '12', technique: 'Coudes vers le bas.', muscle: 'Dos' },
          { name: 'Élévations Latérales', sets: '3', reps: '15', technique: 'Léger fléchissement des coudes.', muscle: 'Épaules' },
          { name: 'Mountain Climbers', sets: '3', reps: '45s', technique: 'Rythme soutenu, dos plat.', muscle: 'Cardio/Abdos' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Oeufs entiers', 'Flocons d\'avoine', 'Légumes verts'],
      caloriesGoal: 'Maintenance ou Recomposition',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Porridge aux flocons d'avoine, graines de chia." },
        { time: "12:30", name: "Déjeuner", description: "Colin, semoule, purée de légumes." },
        { time: "16:00", name: "Collation", description: "Fruit frais, poignée de noix de cajou." },
        { time: "20:00", name: "Dîner", description: "Salade de pois chiches, feta, poulet froid." }
      ]
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
          { name: 'Leg Extension', sets: '3', reps: '15', technique: 'Contraction lente.', muscle: 'Quadriceps' },
          { name: 'Fentes Marchées', sets: '3', reps: '20 pas', technique: 'Garder le buste droit.', muscle: 'Fessiers/Jambes' },
          { name: 'Mollets assis', sets: '4', reps: '15', technique: 'Amplitude maximale.', muscle: 'Mollets' },
          { name: 'Presse à mollets', sets: '3', reps: '15', technique: 'Pause en haut du mouvement.', muscle: 'Mollets' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Leg Curl Assis', sets: '4', reps: '12', technique: 'Dos collé au siège.', muscle: 'Ischios' },
          { name: 'Stiff Leg Deadlift', sets: '3', reps: '10', technique: 'Sentir l\'étirement.', muscle: 'Ischios/Fessiers' },
          { name: 'Gobelet Squat', sets: '3', reps: '15', technique: 'Dos droit.', muscle: 'Jambes' },
          { name: 'Adducteurs machine', sets: '3', reps: '15', technique: 'Mouvement fluide.', muscle: 'Adducteurs' },
          { name: 'Abducteurs machine', sets: '3', reps: '15', technique: 'Focus sur le moyen fessier.', muscle: 'Fessiers' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Squat Barre', sets: '4', reps: '10', technique: 'Regard loin devant.', muscle: 'Jambes' },
          { name: 'Hips Thrust', sets: '3', reps: '12', technique: 'Serrer les fessiers en haut.', muscle: 'Fessiers' },
          { name: 'Mollets debout', sets: '4', reps: '20', technique: 'Amplitude totale.', muscle: 'Mollets' },
          { name: 'Hack Squat', sets: '3', reps: '12', technique: 'Pieds bien à plat.', muscle: 'Quadriceps' },
          { name: 'Sissy Squat', sets: '3', reps: 'Max', technique: 'Contrôler la descente.', muscle: 'Quadriceps' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Boeuf haché 5%', 'Patate douce', 'Noix'],
      caloriesGoal: 'Prise de masse (Focus énergie)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Pancakes à la banane et flocons d'avoine." },
        { time: "12:30", name: "Déjeuner", description: "Bolognaise maison (boeuf 5%), pâtes, parmesan." },
        { time: "16:00", name: "Collation", description: "Fromage blanc, granola, miel." },
        { time: "20:00", name: "Dîner", description: "Pavé de thon, patates douces rôties, salade." }
      ]
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
          { name: 'Relevé de jambes', sets: '4', reps: '12', technique: 'Bassin vers le haut.', muscle: 'Bas abdos' },
          { name: 'Planche Dynamique', sets: '3', reps: '1min', technique: 'Monter et descendre sur les coudes.', muscle: 'Gainage' },
          { name: 'Crunch Bicyclette', sets: '3', reps: '20', technique: 'Toucher le genou opposé.', muscle: 'Obliques' },
          { name: 'Russian Twist avec poids', sets: '3', reps: '20', technique: 'Rotation du buste complète.', muscle: 'Obliques' }
        ]
      },
      { day: 'Mardi', isRestDay: true, exercises: [] },
      {
        day: 'Mercredi',
        isRestDay: false,
        exercises: [
          { name: 'Planche', sets: '4', reps: '1min', technique: 'Corps aligné, ne pas cambrer.', muscle: 'Gainage' },
          { name: 'Russian Twist', sets: '3', reps: '20', technique: 'Rotation contrôlée.', muscle: 'Obliques' },
          { name: 'Sit-ups', sets: '3', reps: '15', technique: 'Mouvement fluide sans élan.', muscle: 'Abdos' },
          { name: 'Planche latérale', sets: '3', reps: '45s/côté', technique: 'Hanches bien hautes.', muscle: 'Obliques' },
          { name: 'Dead Bug', sets: '3', reps: '12 par côté', technique: 'Bas du dos collé au sol.', muscle: 'Abdos profonds' }
        ]
      },
      { day: 'Jeudi', isRestDay: true, exercises: [] },
      { day: 'Vendredi', isRestDay: false, exercises: [
          { name: 'Hollow Hold', sets: '3', reps: '45s', technique: 'Bas du dos au sol.', muscle: 'Abdos profonds' },
          { name: 'Mountain Climbers', sets: '3', reps: '30s', technique: 'Rapide et gainé.', muscle: 'Cardio/Abdos' },
          { name: 'L-Sit (sol ou barres)', sets: '3', reps: '15s', technique: 'Bras tendus, jambes tendues.', muscle: 'Abdos/Stabilité' },
          { name: 'Toes to bar', sets: '3', reps: '10', technique: 'Contrôler la descente.', muscle: 'Bas abdos' },
          { name: 'Enroulement de bassin', sets: '3', reps: '15', technique: 'Mouvement lent et contrôlé.', muscle: 'Bas abdos' }
      ] },
      { day: 'Samedi', isRestDay: true, exercises: [] },
      { day: 'Dimanche', isRestDay: true, exercises: [] }
    ],
    nutrition: {
      keyFoods: ['Thon', 'Épinards', 'Fromage blanc 0%'],
      caloriesGoal: 'Sèche (Déficit calorique)',
      meals: [
        { time: "08:00", name: "Petit Déjeuner", description: "Fromage blanc 0%, framboises, 2 galettes de riz." },
        { time: "12:30", name: "Déjeuner", description: "Thon au naturel, salade verte, tomates, 1/2 avocat." },
        { time: "16:00", name: "Collation", description: "1 pomme, 1 thé vert." },
        { time: "20:00", name: "Dîner", description: "Filet de poisson blanc, brocolis vapeur, citron." }
      ]
    }
  }
];
