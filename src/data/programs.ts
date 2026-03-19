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
          { 
            name: 'Curl Barre EZ', 
            sets: '4', 
            reps: '10-12', 
            technique: 'Coudes collés au corps.', 
            muscle: 'Biceps', 
            rest: '60s',
            position: 'Debout, pieds écartés largeur épaules. Saisir la barre EZ en prise supination sur la partie courbée. Monter la barre en fléchissant les coudes jusqu\'aux épaules sans balancer le buste. Redescendre lentement. Erreur : écarter les coudes.'
          },
          { 
            name: 'Curl Marteau', 
            sets: '3', 
            reps: '12', 
            technique: 'Prise neutre, contrôle la descente.', 
            muscle: 'Biceps', 
            rest: '60s',
            position: 'Debout, un haltère dans chaque main, paumes face aux cuisses. Monter les haltères simultanément en gardant la prise neutre. Contracter fort en haut. Erreur : s\'aider de l\'élan du dos.'
          },
          { 
            name: 'Curl Incliné', 
            sets: '3', 
            reps: '12', 
            technique: 'Étirement maximal en bas.', 
            muscle: 'Biceps', 
            rest: '60s',
            position: 'Assis sur un banc incliné à 45°. Bras ballants vers le sol. Effectuer un curl en gardant les coudes fixes vers l\'arrière. L\'étirement en bas est crucial. Erreur : ramener les coudes vers l\'avant.'
          },
          { 
            name: 'Curl Concentré', 
            sets: '3', 
            reps: '15', 
            technique: 'Isolant, ne balance pas le corps.', 
            muscle: 'Biceps', 
            rest: '60s',
            position: 'Assis sur un banc, buste penché. Appuyer le coude contre l\'intérieur de la cuisse. Monter l\'haltère vers l\'épaule opposée. Contrôler la descente. Erreur : décoller le coude de la jambe.'
          }
        ]
      },
      {
        id: 'gb-2',
        name: 'Séance Triceps',
        day: 'Mercredi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Barre au front', 
            sets: '4', 
            reps: '10', 
            technique: 'Coudes serrés vers l\'intérieur.', 
            muscle: 'Triceps', 
            rest: '90s',
            position: 'Allongé sur un banc, bras verticaux tenant la barre EZ. Descendre la barre vers le front en pliant uniquement les coudes. Remonter en tendant les bras. Erreur : écarter les coudes vers l\'extérieur.'
          },
          { 
            name: 'Extension Poulie', 
            sets: '4', 
            reps: '15', 
            technique: 'Contracte fort en bas.', 
            muscle: 'Triceps', 
            rest: '60s',
            position: 'Face à la poulie haute, barre droite en mains. Coudes fixés aux côtes. Pousser la barre vers le bas jusqu\'à extension complète des bras. Remonter jusqu\'à la poitrine. Erreur : bouger les coudes d\'avant en arrière.'
          },
          { 
            name: 'Dips Machine', 
            sets: '3', 
            reps: '12', 
            technique: 'Buste droit pour focus triceps.', 
            muscle: 'Triceps', 
            rest: '60s',
            position: 'Assis sur la machine, mains sur les poignées. Pousser vers le bas en gardant le dos bien droit contre le dossier. Freiner la remontée. Erreur : hausser les épaules ou se pencher trop en avant.'
          },
          { 
            name: 'Extension Haltère', 
            sets: '3', 
            reps: '12', 
            technique: 'Derrière la tête, bras vertical.', 
            muscle: 'Triceps', 
            rest: '60s',
            position: 'Assis ou debout, tenir un haltère à deux mains au-dessus de la tête. Descendre l\'haltère derrière la nuque en pliant les coudes. Remonter vers le plafond. Erreur : creuser le bas du dos.'
          }
        ]
      },
      {
        id: 'gb-3',
        name: 'Bras Complets',
        day: 'Vendredi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Curl Pupitre', 
            sets: '3', 
            reps: '12', 
            technique: 'Focus pic du biceps.', 
            muscle: 'Biceps', 
            rest: '60s',
            position: 'Bras posés sur le pupitre Larry Scott. Tendre les bras presque totalement sans verrouiller. Monter la barre vers le visage en gardant les aisselles calées. Erreur : décoller le buste du pupitre.'
          },
          { 
            name: 'Extension Poulie Corde', 
            sets: '3', 
            reps: '15', 
            technique: 'Extension totale du bras.', 
            muscle: 'Triceps', 
            rest: '60s',
            position: 'Face à la poulie, saisir la corde. Pousser vers le bas et écarter les mains en fin de mouvement pour accentuer la contraction. Erreur : ne pas faire l\'écartement final.'
          },
          { 
            name: 'Curl Inversé', 
            sets: '3', 
            reps: '15', 
            technique: 'Travail des avant-bras.', 
            muscle: 'Avant-bras', 
            rest: '60s',
            position: 'Debout, saisir la barre en prise pronation (paumes vers le sol). Monter la barre comme un curl classique. Travail intense des avant-bras garanti. Erreur : fléchir les poignets.'
          },
          { 
            name: 'Pompes Diamant', 
            sets: '3', 
            reps: 'Max', 
            technique: 'Mains en triangle.', 
            muscle: 'Triceps', 
            rest: '60s',
            position: 'Position de pompes, index et pouces se touchant pour former un diamant au sol. Descendre la poitrine vers les mains. Coudes proches du corps. Erreur : laisser les hanches tomber.'
          }
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
        name: 'Séance Force',
        day: 'Lundi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Développé Couché', 
            sets: '4', 
            reps: '6-8', 
            technique: 'Cage sortie, omoplates serrées.', 
            muscle: 'Pectoraux', 
            rest: '120s',
            position: 'Allongé sur le banc, pieds au sol. Saisir la barre plus large que les épaules. Descendre jusqu\'au milieu des pectoraux. Pousser en expirant. Erreur : décoller les fessiers du banc.'
          },
          { 
            name: 'Développé Incliné', 
            sets: '3', 
            reps: '8-10', 
            technique: 'Barre vers le haut du torse.', 
            muscle: 'Haut Pectoraux', 
            rest: '90s',
            position: 'Banc incliné à 30-45°. Descendre la barre vers le haut de la poitrine (clavicules). Pousser à la verticale. Erreur : rebondir la barre sur la cage thoracique.'
          },
          { 
            name: 'Dips Lestés', 
            sets: '3', 
            reps: '10', 
            technique: 'Buste penché vers l\'avant.', 
            muscle: 'Bas Pectoraux', 
            rest: '90s',
            position: 'Aux barres parallèles. Se pencher en avant pour engager les pecs. Descendre jusqu\'à ce que les bras soient parallèles au sol. Remonter. Erreur : rester trop droit (travail triceps).'
          },
          { 
            name: 'Développé Haltères', 
            sets: '3', 
            reps: '10', 
            technique: 'Amplitude maximale.', 
            muscle: 'Pectoraux', 
            rest: '90s',
            position: 'Allongé sur banc plat. Descendre les haltères sur les côtés de la poitrine pour un étirement maximal. Remonter en rapprochant les haltères. Erreur : cogner les haltères en haut.'
          }
        ]
      },
      {
        id: 'pec-2',
        name: 'Séance Volume',
        day: 'Jeudi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Écartés Poulie', 
            sets: '4', 
            reps: '15', 
            technique: 'Focus sur la contraction.', 
            muscle: 'Pectoraux', 
            rest: '60s',
            position: 'Debout entre les poulies hautes. Bras légèrement fléchis. Ramener les mains l\'une vers l\'autre devant soi. Serrer les pecs en fin de mouvement. Erreur : tendre les bras complètement.'
          },
          { 
            name: 'Machine Convergente', 
            sets: '3', 
            reps: '12', 
            technique: 'Tension continue.', 
            muscle: 'Pectoraux', 
            rest: '60s',
            position: 'Assis sur la machine. Pousser les poignées en gardant le dos collé. Ne pas verrouiller les coudes en haut pour garder la tension. Erreur : décoller les épaules du dossier.'
          },
          { 
            name: 'Croisé Poulie Bas', 
            sets: '3', 
            reps: '15', 
            technique: 'Ramène les mains vers le haut.', 
            muscle: 'Haut Pectoraux', 
            rest: '60s',
            position: 'Poulies en position basse. Ramener les poignées vers le haut et l\'intérieur, niveau menton. Focus sur le haut des pecs. Erreur : s\'aider d\'un mouvement de balancier.'
          },
          { 
            name: 'Pompes Déclinées', 
            sets: '3', 
            reps: 'Max', 
            technique: 'Pieds surélevés.', 
            muscle: 'Haut Pectoraux', 
            rest: '60s',
            position: 'Mains au sol, pieds sur un banc. Corps bien droit. Descendre la poitrine vers le sol. Coudes à 45°. Erreur : laisser le bas du dos se creuser.'
          }
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
          { 
            name: 'Tractions Larges', 
            sets: '4', 
            reps: 'Max', 
            technique: 'Tire avec les coudes.', 
            muscle: 'Grand dorsal', 
            rest: '120s',
            position: 'Suspendu à la barre, mains larges. Tirer le corps vers le haut en ramenant les coudes vers les hanches. Poitrine vers la barre. Erreur : arrondir le haut du dos.'
          },
          { 
            name: 'Tirage Poitrine', 
            sets: '3', 
            reps: '12', 
            technique: 'Buste légèrement incliné.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Assis à la machine de tirage vertical. Saisir la barre large. Tirer vers le haut des pectoraux en serrant les omoplates. Erreur : tirer la barre derrière la nuque.'
          },
          { 
            name: 'Pull Bras Tendus', 
            sets: '3', 
            reps: '15', 
            technique: 'Isolation du grand dorsal.', 
            muscle: 'Grand dorsal', 
            rest: '60s',
            position: 'Face à la poulie haute, bras tendus devant soi. Tirer la barre vers les cuisses sans plier les bras. Ressentir l\'étirement en haut. Erreur : plier les coudes.'
          },
          { 
            name: 'Tirage Triangle', 
            sets: '3', 
            reps: '12', 
            technique: 'Focus épaisseur.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Assis au tirage horizontal, poignée triangle. Tirer vers le bas de l\'abdomen en gardant le dos droit. Épaules basses. Erreur : basculer le buste trop en arrière.'
          }
        ]
      },
      {
        id: 'dos-2',
        name: 'Tirage Horizontal',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Rowing Barre', 
            sets: '4', 
            reps: '8', 
            technique: 'Dos bien plat, buste à 45°.', 
            muscle: 'Milieu dos', 
            rest: '120s',
            position: 'Debout, jambes fléchies, buste penché. Tirer la barre vers le nombril en gardant les coudes proches du corps. Omoplates serrées. Erreur : arrondir le bas du dos.'
          },
          { 
            name: 'Rowing Haltère', 
            sets: '3', 
            reps: '10', 
            technique: 'Un bras après l\'autre.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Une main et un genou sur un banc. Tirer l\'haltère vers la hanche avec l\'autre main. Dos parallèle au banc. Erreur : hausser l\'épaule lors du tirage.'
          },
          { 
            name: 'Rowing Assis', 
            sets: '3', 
            reps: '12', 
            technique: 'Serre les omoplates.', 
            muscle: 'Dos', 
            rest: '60s',
            position: 'Assis à la machine rowing, prise neutre. Tirer vers soi en ouvrant la cage thoracique. Contrôler le retour en étirant bien. Erreur : utiliser le mouvement des jambes.'
          },
          { 
            name: 'Tirage Visage', 
            sets: '3', 
            reps: '15', 
            technique: 'Focus arrière épaule.', 
            muscle: 'Trapèzes', 
            rest: '60s',
            position: 'Corde à la poulie haute. Tirer vers le front en écartant les mains de chaque côté du visage. Coudes hauts. Erreur : tirer vers le bas.'
          }
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
        name: 'Séance Corps Entier A',
        day: 'Lundi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Squat Barre', 
            sets: '4', 
            reps: '10', 
            technique: 'Descente contrôlée.', 
            muscle: 'Jambes', 
            rest: '120s',
            position: 'Barre sur les trapèzes, pieds largeur épaules. Descendre jusqu\'à la parallèle en gardant le dos droit. Pousser sur les talons. Erreur : genoux qui rentrent vers l\'intérieur.'
          },
          { 
            name: 'Développé Couché', 
            sets: '4', 
            reps: '10', 
            technique: 'Cage sortie.', 
            muscle: 'Pectoraux', 
            rest: '90s',
            position: 'Allongé sur banc plat. Descendre la barre au contact de la poitrine. Remonter en tendant les bras sans claquer les coudes. Erreur : tête qui se décolle du banc.'
          },
          { 
            name: 'Tractions', 
            sets: '3', 
            reps: 'Max', 
            technique: 'Menton au dessus de la barre.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Saisie de la barre fixe. Tirer le corps verticalement jusqu\'à ce que le menton dépasse la barre. Descente contrôlée. Erreur : ne pas faire l\'amplitude complète.'
          },
          { 
            name: 'Gainage Planche', 
            sets: '3', 
            reps: '1min', 
            technique: 'Gainage maximal.', 
            muscle: 'Abdominaux', 
            rest: '60s',
            position: 'En appui sur les avant-bras et les orteils. Corps parfaitement aligné. Contracter fessiers et abdos. Erreur : fesses trop hautes ou dos creux.'
          }
        ]
      },
      {
        id: 'fb-2',
        name: 'Séance Corps Entier B',
        day: 'Mercredi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Soulevé de Terre Jambes Tendues', 
            sets: '3', 
            reps: '12', 
            technique: 'Dos plat, étirement ischios.', 
            muscle: 'Ischio-jambiers', 
            rest: '120s',
            position: 'Haltères devant soi, jambes presque tendues. Descendre les haltères le long des jambes en poussant les fesses en arrière. Remonter. Erreur : arrondir le dos pour descendre plus bas.'
          },
          { 
            name: 'Développé Militaire', 
            sets: '4', 
            reps: '10', 
            technique: 'Debout, gainage fort.', 
            muscle: 'Épaules', 
            rest: '90s',
            position: 'Barre devant les clavicules. Pousser vers le plafond en gardant le corps bien fixe. Tête qui avance légèrement en haut. Erreur : s\'aider d\'une impulsion des jambes.'
          },
          { 
            name: 'Rowing Haltère', 
            sets: '3', 
            reps: '12', 
            technique: 'Tire avec le coude.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Appuyé sur un banc, buste horizontal. Tirer l\'haltère vers la taille. Bien relâcher l\'épaule en bas pour étirer. Erreur : rotation excessive du buste.'
          },
          { 
            name: 'Fentes Marchées', 
            sets: '3', 
            reps: '20 pas', 
            technique: 'Genou proche du sol.', 
            muscle: 'Jambes', 
            rest: '90s',
            position: 'Faire un grand pas en avant. Descendre le genou arrière vers le sol. Garder le buste fier. Alterner les jambes en avançant. Erreur : pencher le haut du corps en avant.'
          }
        ]
      },
      {
        id: 'fb-3',
        name: 'Séance Corps Entier C',
        day: 'Vendredi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Presse à Cuisses', 
            sets: '4', 
            reps: '12', 
            technique: 'Pieds au milieu de la plateforme.', 
            muscle: 'Quadriceps', 
            rest: '90s',
            position: 'Assis, pieds écartés largeur épaules sur le plateau. Descendre lentement vers la poitrine. Repousser sans verrouiller les genoux. Erreur : décoller le bas du dos du siège.'
          },
          { 
            name: 'Développé Poitrine Machine', 
            sets: '3', 
            reps: '12', 
            technique: 'Tension continue.', 
            muscle: 'Pectoraux', 
            rest: '60s',
            position: 'Réglage de la hauteur du siège. Pousser les poignées devant soi. Garder les coudes à hauteur de poitrine. Erreur : claquer les poids lors du retour.'
          },
          { 
            name: 'Tirage Vertical', 
            sets: '3', 
            reps: '12', 
            technique: 'Focus largeur.', 
            muscle: 'Dos', 
            rest: '90s',
            position: 'Prise large à la barre. Tirer vers le haut de la poitrine. Imaginer ramener les coudes dans les poches arrière. Erreur : utiliser l\'élan du corps.'
          },
          { 
            name: 'Mollets Debout', 
            sets: '4', 
            reps: '15', 
            technique: 'Extension maximale.', 
            muscle: 'Mollets', 
            rest: '60s',
            position: 'Sur une marche, talons dans le vide. Monter le plus haut possible sur la pointe des pieds. Descendre sous le niveau de la marche. Erreur : sauter ou rebondir.'
          }
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
        name: 'Quadriceps et Fessiers',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Squat Arrière', 
            sets: '4', 
            reps: '10', 
            technique: 'Descente lente, dos droit.', 
            muscle: 'Quadriceps', 
            rest: '120s',
            position: 'Barre en appui sur les trapèzes. Descendre en brisant la parallèle des genoux. Garder le regard vers l\'horizon. Erreur : laisser les talons décoller du sol.'
          },
          { 
            name: 'Presse 45°', 
            sets: '3', 
            reps: '12', 
            technique: 'Pieds larges pour les fessiers.', 
            muscle: 'Quadriceps/Fessiers', 
            rest: '90s',
            position: 'Positionner les pieds en haut de la plateforme pour engager plus les fessiers. Descendre jusqu\'à ce que les jambes forment un angle droit. Erreur : mettre les mains sur les genoux.'
          },
          { 
            name: 'Extension Jambes', 
            sets: '3', 
            reps: '15', 
            technique: 'Contraction en haut.', 
            muscle: 'Quadriceps', 
            rest: '60s',
            position: 'Assis à la machine Leg Extension. Ajuster le rouleau sur le bas des tibias. Tendre les jambes au maximum. Marquer un temps d\'arrêt en haut. Erreur : s\'aider des bras sur les poignées.'
          },
          { 
            name: 'Abducteurs', 
            sets: '3', 
            reps: '20', 
            technique: 'Travail du moyen fessier.', 
            muscle: 'Fessiers', 
            rest: '60s',
            position: 'Assis sur la machine à abducteurs. Écarter les jambes le plus possible. Se pencher légèrement en avant pour mieux isoler le moyen fessier. Erreur : claquer les poids lors du retour.'
          }
        ]
      },
      {
        id: 'jam-2',
        name: 'Ischio-jambiers et Mollets',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Soulevé de Terre Roumain', 
            sets: '4', 
            reps: '10', 
            technique: 'Bascule du bassin.', 
            muscle: 'Ischio-jambiers', 
            rest: '120s',
            position: 'Debout, barre en mains. Descendre la barre le long des cuisses en poussant les hanches vers l\'arrière. Arrêter quand l\'étirement est maximal. Erreur : descendre la barre trop loin en arrondissant le dos.'
          },
          { 
            name: 'Curl Jambes Assis', 
            sets: '4', 
            reps: '12', 
            technique: 'Tire fort vers le bas.', 
            muscle: 'Ischio-jambiers', 
            rest: '60s',
            position: 'Assis, jambes sur le boudin. Ramener les talons vers les fesses. Bien plaquer les cuisses contre le siège. Erreur : décoller les fesses du siège durant l\'effort.'
          },
          { 
            name: 'Mollets à la Presse', 
            sets: '4', 
            reps: '20', 
            technique: 'Amplitude maximale.', 
            muscle: 'Mollets', 
            rest: '60s',
            position: 'Pieds en bas du plateau de la presse. Uniquement les orteils sur le plateau. Pousser vers l\'extension complète. Erreur : ne pas descendre assez bas (étirement).'
          },
          { 
            name: 'Hip Thrust', 
            sets: '4', 
            reps: '10', 
            technique: 'Contracte fort les fessiers.', 
            muscle: 'Fessiers', 
            rest: '90s',
            position: 'Haut du dos sur un banc, barre sur les hanches. Monter le bassin vers le plafond en contractant les fessiers. Regard fixe devant soi. Erreur : cambrer le dos en fin de mouvement.'
          }
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
        name: 'Abdominaux Force',
        day: 'Lundi',
        duration: '35 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Crunch Poulie', 
            sets: '4', 
            reps: '15', 
            technique: 'Enroule la colonne.', 
            muscle: 'Grand droit', 
            rest: '60s',
            position: 'A genoux devant la poulie haute, corde en mains derrière la nuque. Enrouler le buste vers les genoux en contractant les abdos. Garder les hanches fixes. Erreur : tirer avec les bras.'
          },
          { 
            name: 'Relevé de Jambes', 
            sets: '4', 
            reps: '12', 
            technique: 'Contrôle la descente.', 
            muscle: 'Bas abdominaux', 
            rest: '60s',
            position: 'Suspendu à la barre fixe ou allongé. Lever les jambes tendues jusqu\'à l\'horizontale. Redescendre sans toucher le sol pour garder la tension. Erreur : balancer le corps.'
          },
          { 
            name: 'Torsion Russe', 
            sets: '3', 
            reps: '20', 
            technique: 'Rotation du buste.', 
            muscle: 'Obliques', 
            rest: '45s',
            position: 'Assis, jambes légèrement fléchies et décollées du sol. Faire pivoter le haut du corps de gauche à droite en touchant le sol avec un poids. Erreur : bouger uniquement les bras sans le buste.'
          },
          { 
            name: 'Roue Abdominale', 
            sets: '3', 
            reps: '10', 
            technique: 'Gainage strict.', 
            muscle: 'Abdominaux', 
            rest: '60s',
            position: 'A genoux, roue devant soi. Faire rouler vers l\'avant le plus loin possible sans creuser le dos. Revenir en contractant fort les abdos. Erreur : laisser le bas du dos se cambrer.'
          }
        ]
      },
      {
        id: 'abd-2',
        name: 'Gainage et Stabilité',
        day: 'Jeudi',
        duration: '30 min',
        isRestDay: false,
        exercises: [
          { 
            name: 'Gainage Planche', 
            sets: '3', 
            reps: '1min', 
            technique: 'Corps aligné.', 
            muscle: 'Transverse', 
            rest: '60s',
            position: 'Appui sur les coudes. Corps droit comme une planche. Regarder le sol. Contracter tout le corps pour stabiliser. Erreur : lever les fesses trop haut.'
          },
          { 
            name: 'Gainage Latéral', 
            sets: '3', 
            reps: '45s/côté', 
            technique: 'Hanches hautes.', 
            muscle: 'Obliques', 
            rest: '45s',
            position: 'Appui sur un seul coude et le côté du pied. Garder le corps aligné sur le plan vertical. Monter les hanches vers le haut. Erreur : laisser les hanches tomber vers le sol.'
          },
          { 
            name: 'Gainage Creux', 
            sets: '3', 
            reps: '45s', 
            technique: 'Dos collé au sol.', 
            muscle: 'Abdominaux', 
            rest: '60s',
            position: 'Allongé sur le dos. Décoller les épaules et les jambes. Le bas du dos doit rester impérativement plaqué au sol. Erreur : laisser le bas du dos se décoller.'
          },
          { 
            name: 'Dead Bug', 
            sets: '4', 
            reps: '12', 
            technique: 'Mouvement lent et contrôlé.', 
            muscle: 'Abdominaux profonds', 
            rest: '60s',
            position: 'Sur le dos, jambes à 90°, bras vers le plafond. Descendre simultanément bras droit et jambe gauche. Revenir. Alterner. Erreur : bouger trop vite sans contrôle.'
          }
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