export type Exercise = {
  name: string;
  nameEn?: string;
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
    name: 'Programme Bras',
    emoji: '💪',
    sessions: [
      {
        id: 'gb-1',
        name: 'Biceps',
        day: 'Lundi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Barre EZ', nameEn: 'ez bar curl', sets: '4', reps: '10-12', technique: 'Coudes collés au corps, ne pas balancer le buste.', muscle: 'Biceps', rest: '60s', position: 'Debout, pieds écartés largeur épaules. Saisir la barre EZ en prise supination sur la partie courbée. Monter la barre jusqu\'aux épaules en gardant les coudes fixes. Redescendre lentement.' },
          { name: 'Curl Marteau', nameEn: 'hammer curl', sets: '3', reps: '12', technique: 'Prise neutre, contrôle la descente.', muscle: 'Biceps', rest: '60s', position: 'Debout, un haltère dans chaque main, paumes face aux cuisses. Monter alternativement chaque haltère vers l\'épaule sans tourner le poignet.' },
          { name: 'Curl Incliné', nameEn: 'incline dumbbell curl', sets: '3', reps: '12', technique: 'Étirement maximal en bas du mouvement.', muscle: 'Biceps', rest: '60s', position: 'Assis sur un banc incliné à 45°, bras ballants vers le sol. Monter les haltères en supinant le poignet en haut.' },
          { name: 'Curl Concentré', nameEn: 'concentration curl', sets: '3', reps: '15', technique: 'Coude appuyé contre la cuisse, isolation totale.', muscle: 'Biceps', rest: '45s', position: 'Assis, coude posé contre la face interne de la cuisse. Monter l\'haltère lentement en contractant fort le biceps.' }
        ],
        homeExercises: [
          { name: 'Curl Élastique', nameEn: 'band curl', sets: '4', reps: '15', technique: 'Maintenir la tension tout au long du mouvement.', muscle: 'Biceps', rest: '45s', position: 'Debout sur l\'élastique, saisir les extrémités. Monter les mains vers les épaules en gardant les coudes fixes.' },
          { name: 'Curl Marteau Bouteilles', nameEn: 'hammer curl', sets: '3', reps: '15', technique: 'Mouvement lent et contrôlé.', muscle: 'Biceps', rest: '45s', position: 'Utiliser deux bouteilles d\'eau pleines. Prise neutre, monter alternativement vers les épaules.' },
          { name: 'Curl Isométrique Table', nameEn: 'isometric bicep curl', sets: '3', reps: '30s', technique: 'Pousser fort vers le haut pendant toute la durée.', muscle: 'Biceps', rest: '45s', position: 'Placer les mains sous une table solide, coudes à 90°. Essayer de soulever la table en maintenant la contraction.' },
          { name: 'Pompes Prise Serrée', nameEn: 'close grip push up', sets: '3', reps: 'Max', technique: 'Mains sous les épaules, coudes le long du corps.', muscle: 'Biceps/Triceps', rest: '60s', position: 'Position de pompes avec les mains rapprochées sous la poitrine. Descendre lentement.' }
        ]
      },
      {
        id: 'gb-2',
        name: 'Triceps',
        day: 'Mercredi',
        duration: '45 min',
        isRestDay: false,
        exercises: [
          { name: 'Barre au Front', nameEn: 'ez bar skull crusher', sets: '4', reps: '10', technique: 'Coudes serrés vers l\'intérieur, ne pas les écarter.', muscle: 'Triceps', rest: '90s', position: 'Allongé sur un banc, bras verticaux tenant la barre EZ. Fléchir les coudes pour descendre la barre vers le front, puis pousser.' },
          { name: 'Extension Poulie Corde', nameEn: 'tricep rope pushdown', sets: '4', reps: '15', technique: 'Contracte fort en bas, ouvre les mains en fin de mouvement.', muscle: 'Triceps', rest: '60s', position: 'Face à la poulie haute, corde en mains. Coudes fixes près du corps. Pousser vers le bas en écartant la corde en fin de mouvement.' },
          { name: 'Dips Machine', nameEn: 'chest dip', sets: '3', reps: '12', technique: 'Buste droit pour isoler les triceps.', muscle: 'Triceps', rest: '60s', position: 'Assis à la machine, poignées en mains. Pousser vers le bas en gardant les coudes près du corps.' },
          { name: 'Extension Haltère Nuque', nameEn: 'dumbbell tricep overhead extension', sets: '3', reps: '12', technique: 'Garder le bras vertical, ne pas bouger le coude.', muscle: 'Triceps', rest: '60s', position: 'Debout ou assis, un haltère tenu à deux mains au-dessus de la tête. Descendre derrière la nuque en fléchissant les coudes.' }
        ],
        homeExercises: [
          { name: 'Dips sur Chaise', nameEn: 'bench dip', sets: '4', reps: 'Max', technique: 'Dos proche de la chaise, descendre bas.', muscle: 'Triceps', rest: '60s', position: 'Mains sur le bord d\'une chaise stable derrière soi, pieds au sol. Plier les coudes pour descendre les fesses vers le sol.' },
          { name: 'Pompes Diamant', nameEn: 'diamond push up', sets: '3', reps: 'Max', technique: 'Mains en triangle, coudes le long du corps.', muscle: 'Triceps', rest: '60s', position: 'Position de pompes, index et pouces se touchent pour former un losange. Descendre la poitrine vers les mains.' },
          { name: 'Extension Triceps Sol', nameEn: 'dumbbell tricep extension', sets: '3', reps: '15', technique: 'Coudes fixes, ne bouger que l\'avant-bras.', muscle: 'Triceps', rest: '45s', position: 'Allongé sur le dos, haltères ou bouteilles à la verticale. Fléchir les coudes pour descendre vers les tempes.' },
          { name: 'Dips entre Deux Chaises', nameEn: 'bench dip', sets: '3', reps: 'Max', technique: 'Corps droit, amplitude maximale.', muscle: 'Triceps', rest: '60s', position: 'Deux chaises stables face à face. Mains sur l\'une, pieds sur l\'autre. Fléchir les coudes.' }
        ]
      },
      {
        id: 'gb-3',
        name: 'Biceps & Triceps',
        day: 'Vendredi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Curl Pupitre', nameEn: 'dumbbell preacher curl', sets: '3', reps: '12', technique: 'Coude appuyé sur le pupitre, pas d\'élan.', muscle: 'Biceps', rest: '60s', position: 'Assis au pupitre, coude posé sur le coussin incliné. Monter l\'haltère en supinant le poignet.' },
          { name: 'Extension Poulie Corde', nameEn: 'tricep rope pushdown', sets: '3', reps: '15', technique: 'Extension totale du bras, ouvrir les mains.', muscle: 'Triceps', rest: '60s', position: 'Face à la poulie haute. Pousser la corde vers le bas en écartant les mains en fin de mouvement.' },
          { name: 'Curl Inversé', nameEn: 'reverse curl', sets: '3', reps: '15', technique: 'Prise pronation, travail des avant-bras.', muscle: 'Avant-bras', rest: '60s', position: 'Debout, barre tenue en prise pronation. Monter la barre comme un curl classique.' },
          { name: 'Pompes Diamant', nameEn: 'diamond push up', sets: '3', reps: 'Max', technique: 'Mains en triangle, coudes serrés.', muscle: 'Triceps', rest: '60s', position: 'Position de pompes avec les mains qui forment un triangle sous la poitrine.' }
        ],
        homeExercises: [
          { name: 'Curl Élastique', nameEn: 'band curl', sets: '3', reps: '15', technique: 'Tension constante sur tout le mouvement.', muscle: 'Biceps', rest: '45s', position: 'Debout sur l\'élastique. Monter les mains vers les épaules en gardant les coudes fixes.' },
          { name: 'Dips sur Chaise', nameEn: 'bench dip', sets: '3', reps: 'Max', technique: 'Amplitude maximale.', muscle: 'Triceps', rest: '60s', position: 'Mains sur le bord d\'une chaise derrière soi. Descendre les fesses vers le sol.' },
          { name: 'Curl Bouteilles Inversé', nameEn: 'reverse curl', sets: '3', reps: '15', technique: 'Poignet en pronation, mouvement lent.', muscle: 'Avant-bras', rest: '45s', position: 'Bouteilles tenues paume vers le bas. Monter comme un curl en gardant le poignet neutre.' },
          { name: 'Pompes Prise Large', nameEn: 'wide push up', sets: '3', reps: 'Max', technique: 'Mains larges, poitrine vers le sol.', muscle: 'Pectoraux/Triceps', rest: '60s', position: 'Mains plus larges que les épaules. Corps en planche. Descendre la poitrine au sol.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Poulet', 'Oeufs', 'Beurre de cacahuète'],
      caloriesGoal: 'Prise de masse (+400 kcal)',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Omelette 3 oeufs, avoine.', macros: 'P: 30g | G: 50g | L: 15g' },
        { time: '12:30', name: 'Déjeuner', description: 'Poulet, riz, avocat.', macros: 'P: 40g | G: 60g | L: 20g' },
        { time: '16:00', name: 'Collation', description: 'Whey, amandes.', macros: 'P: 25g | G: 10g | L: 12g' },
        { time: '20:00', name: 'Dîner', description: 'Saumon, patate douce.', macros: 'P: 35g | G: 40g | L: 18g' }
      ]
    }
  },
  {
    id: 'pectoraux',
    name: 'Programme Poitrine',
    emoji: '🦍',
    sessions: [
      {
        id: 'pec-1',
        name: 'Pectoraux - Force',
        day: 'Lundi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Développé Couché', nameEn: 'barbell bench press', sets: '4', reps: '6-8', technique: 'Omoplates serrées, cage thoracique sortie.', muscle: 'Pectoraux', rest: '120s', position: 'Allongé sur banc plat, pieds au sol. Descendre la barre jusqu\'aux pectoraux en contrôlant. Pousser en explosif.' },
          { name: 'Développé Incliné Haltères', nameEn: 'incline dumbbell press', sets: '3', reps: '8-10', technique: 'Focus sur le haut des pectoraux.', muscle: 'Haut Pectoraux', rest: '90s', position: 'Banc incliné à 30°. Haltères à hauteur des épaules. Pousser vers le haut en arc de cercle.' },
          { name: 'Dips Lestés', nameEn: 'chest dip', sets: '3', reps: '10', technique: 'Buste penché en avant pour cibler les pecs.', muscle: 'Bas Pectoraux', rest: '90s', position: 'Barres parallèles, pencher le buste à 30° en avant. Descendre jusqu\'à 90° de flexion du coude.' },
          { name: 'Écarté Haltères Plat', nameEn: 'dumbbell fly', sets: '3', reps: '12', technique: 'Amplitude maximale, légère flexion du coude.', muscle: 'Pectoraux', rest: '60s', position: 'Allongé sur banc plat. Haltères au-dessus de la poitrine. Descendre les bras en arc en gardant les coudes légèrement fléchis.' }
        ],
        homeExercises: [
          { name: 'Pompes Classiques', nameEn: 'push up', sets: '4', reps: 'Max', technique: 'Corps en planche parfaite, descendre bas.', muscle: 'Pectoraux', rest: '60s', position: 'Mains légèrement plus larges que les épaules. Corps aligné. Descendre la poitrine jusqu\'à 2cm du sol.' },
          { name: 'Pompes Déclinées', nameEn: 'decline push up', sets: '3', reps: 'Max', technique: 'Pieds surélevés, travail du haut des pecs.', muscle: 'Haut Pectoraux', rest: '60s', position: 'Pieds posés sur un canapé ou une chaise, mains au sol. Descendre la tête vers le sol.' },
          { name: 'Pompes Larges', nameEn: 'wide push up', sets: '3', reps: 'Max', technique: 'Mains très écartées pour ouvrir les pecs.', muscle: 'Pectoraux', rest: '60s', position: 'Mains très écartées, doigts pointés vers l\'extérieur. Descendre lentement.' },
          { name: 'Pompes Lentes', nameEn: 'push up', sets: '3', reps: '8', technique: '3 secondes descente, 1 seconde remontée.', muscle: 'Pectoraux', rest: '90s', position: 'Pompes classiques avec tempo lent. 3 secondes pour descendre, pause en bas.' }
        ]
      },
      {
        id: 'pec-2',
        name: 'Pectoraux - Volume',
        day: 'Jeudi',
        duration: '50 min',
        isRestDay: false,
        exercises: [
          { name: 'Écarté Poulie', nameEn: 'cable fly', sets: '4', reps: '15', technique: 'Focus sur la contraction en fin de mouvement.', muscle: 'Pectoraux', rest: '60s', position: 'Debout entre deux poulies hautes. Ramener les bras devant soi en arc en gardant les coudes légèrement fléchis.' },
          { name: 'Machine Convergente', nameEn: 'pec deck', sets: '3', reps: '12', technique: 'Tension continue, ne pas verrouiller les coudes.', muscle: 'Pectoraux', rest: '60s', position: 'Assis à la machine, poignées en mains. Pousser en avant en contractant les pectoraux.' },
          { name: 'Croisé Poulie Bas', nameEn: 'cable crossover', sets: '3', reps: '15', technique: 'Ramener les mains vers le haut pour le haut des pecs.', muscle: 'Haut Pectoraux', rest: '60s', position: 'Poulies basses, ramener les bras en diagonale vers le haut et vers le centre.' },
          { name: 'Pompes Déclinées', nameEn: 'decline push up', sets: '3', reps: 'Max', technique: 'Pieds surélevés, amplitude complète.', muscle: 'Haut Pectoraux', rest: '60s', position: 'Pieds sur un banc, mains au sol. Corps en diagonale, descendre la tête vers le sol.' }
        ],
        homeExercises: [
          { name: 'Pompes Surélevées', nameEn: 'elevated push up', sets: '4', reps: 'Max', technique: 'Mains sur un livre ou une marche.', muscle: 'Pectoraux', rest: '60s', position: 'Mains posées sur un livre épais ou une marche. Corps en planche. Descendre la poitrine.' },
          { name: 'Pompes Isométriques', nameEn: 'isometric push up', sets: '3', reps: '30s', technique: 'Rester en position basse, gainage fort.', muscle: 'Pectoraux', rest: '60s', position: 'En position basse de pompe, tenir la position 30 secondes sans descendre ni monter.' },
          { name: 'Pompes Explosives', nameEn: 'plyometric push up', sets: '3', reps: '10', technique: 'Pousser fort pour décoller les mains.', muscle: 'Pectoraux', rest: '90s', position: 'Pompes classiques en poussant de façon explosive pour que les mains décollent du sol.' },
          { name: 'Pompes Diamant', nameEn: 'diamond push up', sets: '3', reps: 'Max', technique: 'Mains en triangle sous la poitrine.', muscle: 'Triceps/Pectoraux', rest: '60s', position: 'Mains formant un triangle sous la poitrine. Descendre lentement.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Dinde', 'Pâtes complètes', 'Brocolis'],
      caloriesGoal: 'Prise de masse propre',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Omelette, tartines complètes.', macros: 'P: 25g | G: 45g | L: 12g' },
        { time: '12:30', name: 'Déjeuner', description: 'Bifteck, pâtes, légumes.', macros: 'P: 45g | G: 70g | L: 15g' },
        { time: '16:00', name: 'Collation', description: 'Skyr, fruits rouges.', macros: 'P: 20g | G: 20g | L: 2g' },
        { time: '20:00', name: 'Dîner', description: 'Thon, salade, riz.', macros: 'P: 35g | G: 30g | L: 10g' }
      ]
    }
  },
  {
    id: 'dos-large',
    name: 'Programme Dos',
    emoji: '🦬',
    sessions: [
      {
        id: 'dos-1',
        name: 'Dos - Largeur',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Tractions Larges', nameEn: 'pull up', sets: '4', reps: 'Max', technique: 'Tirer avec les coudes vers le bas, pas avec les mains.', muscle: 'Grand dorsal', rest: '120s', position: 'Suspendu à la barre, prise large pronation. Ramener les coudes vers les hanches en contractant le dos.' },
          { name: 'Tirage Poitrine Poulie', nameEn: 'lat pulldown', sets: '3', reps: '12', technique: 'Buste légèrement incliné en arrière.', muscle: 'Grand dorsal', rest: '90s', position: 'Assis à la poulie haute, prise large. Tirer la barre vers la poitrine en ramenant les coudes vers le bas.' },
          { name: 'Pull Bras Tendus', nameEn: 'straight arm pulldown', sets: '3', reps: '15', technique: 'Isolation du grand dorsal, bras presque tendus.', muscle: 'Grand dorsal', rest: '60s', position: 'Debout face à la poulie haute. Bras tendus, descendre la corde ou barre jusqu\'aux hanches.' },
          { name: 'Tirage Triangle', nameEn: 'seated cable row', sets: '3', reps: '12', technique: 'Serre les omoplates en fin de mouvement.', muscle: 'Dos', rest: '90s', position: 'Assis à la poulie basse, poignée triangle. Tirer vers le bas ventre en serrant les omoplates.' }
        ],
        homeExercises: [
          { name: 'Rowing sur Table', nameEn: 'inverted row', sets: '4', reps: '12', technique: 'Corps sous la table, tirer avec les coudes.', muscle: 'Grand dorsal', rest: '60s', position: 'Allongé sous une table solide, mains sur le bord. Tirer le corps vers le haut comme une traction inversée.' },
          { name: 'Superman', nameEn: 'superman', sets: '4', reps: '15', technique: 'Lever simultanément bras et jambes.', muscle: 'Dos', rest: '45s', position: 'Allongé sur le ventre, bras tendus devant. Lever simultanément les bras et les jambes en contractant le dos.' },
          { name: 'Good Morning', nameEn: 'good morning', sets: '3', reps: '15', technique: 'Dos droit, bascule depuis les hanches.', muscle: 'Dos/Ischios', rest: '60s', position: 'Debout, mains derrière la tête. Incliner le buste en avant depuis les hanches en gardant le dos droit.' },
          { name: 'Gainage Latéral', nameEn: 'side plank', sets: '3', reps: '30s', technique: 'Corps aligné, hanches hautes.', muscle: 'Obliques/Dos', rest: '45s', position: 'Sur le côté, appui sur un coude. Corps aligné de la tête aux pieds. Tenir la position.' }
        ]
      },
      {
        id: 'dos-2',
        name: 'Dos - Épaisseur',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Rowing Barre', nameEn: 'barbell bent over row', sets: '4', reps: '8', technique: 'Dos plat à 45°, tirer vers le bas ventre.', muscle: 'Milieu dos', rest: '120s', position: 'Debout, pieds écartés, buste incliné à 45°. Barre en prise large. Tirer vers le bas ventre en serrant les omoplates.' },
          { name: 'Rowing Haltère', nameEn: 'dumbbell bent over row', sets: '3', reps: '10', technique: 'Rotation du buste en fin de mouvement.', muscle: 'Dos', rest: '90s', position: 'Un genou et une main sur le banc pour le soutien. Tirer l\'haltère vers la hanche en gardant le coude près du corps.' },
          { name: 'Rowing Assis Poulie', nameEn: 'seated cable row', sets: '3', reps: '12', technique: 'Serre les omoplates, ne pas arrondir le dos.', muscle: 'Dos', rest: '60s', position: 'Assis à la poulie basse, pieds sur les appuis. Tirer vers le bas ventre en gardant le dos droit.' },
          { name: 'Tirage Visage', nameEn: 'face pull', sets: '3', reps: '15', technique: 'Tirer les mains vers le visage, coudes hauts.', muscle: 'Trapèzes', rest: '60s', position: 'Face à la poulie, corde en mains. Tirer vers le visage en écartant les coudes. Contrôler la descente.' }
        ],
        homeExercises: [
          { name: 'Rowing Élastique', nameEn: 'band row', sets: '4', reps: '15', technique: 'Serre les omoplates en fin de mouvement.', muscle: 'Dos', rest: '60s', position: 'Élastique fixé à hauteur de taille. Tirer vers le ventre en gardant les coudes près du corps.' },
          { name: 'Superman Alterné', nameEn: 'bird dog', sets: '3', reps: '12', technique: 'Bras droit + jambe gauche en même temps.', muscle: 'Dos', rest: '45s', position: 'À quatre pattes. Étendre simultanément le bras droit et la jambe gauche. Alterner.' },
          { name: 'Rowing Bouteilles', nameEn: 'dumbbell bent over row', sets: '3', reps: '12', technique: 'Incliner le buste, tirer avec les coudes.', muscle: 'Dos', rest: '60s', position: 'Debout, buste incliné à 45°. Bouteilles d\'eau en mains. Tirer vers les hanches.' },
          { name: 'Planche', nameEn: 'plank', sets: '3', reps: '45s', technique: 'Corps parfaitement aligné, abdos contractés.', muscle: 'Dos/Core', rest: '45s', position: 'Appui sur les avant-bras et les orteils. Corps aligné. Contracter les abdos et les fessiers.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Saumon', 'Riz noir', 'Asperges'],
      caloriesGoal: 'Maintenance active',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Pain complet, cottage cheese.', macros: 'P: 22g | G: 35g | L: 10g' },
        { time: '12:30', name: 'Déjeuner', description: 'Poulet, quinoa, brocolis.', macros: 'P: 38g | G: 55g | L: 12g' },
        { time: '16:00', name: 'Collation', description: 'Amandes, pomme.', macros: 'P: 6g | G: 25g | L: 14g' },
        { time: '20:00', name: 'Dîner', description: 'Poisson blanc, légumes verts.', macros: 'P: 30g | G: 10g | L: 8g' }
      ]
    }
  },
  {
    id: 'full-body',
    name: 'Programme Full Body',
    emoji: '💯',
    sessions: [
      {
        id: 'fb-1',
        name: 'Full Body A',
        day: 'Lundi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Barre', nameEn: 'barbell squat', sets: '4', reps: '10', technique: 'Dos droit, descendre jusqu\'à la parallèle.', muscle: 'Jambes', rest: '120s', position: 'Barre sur les trapèzes. Pieds écartés largeur épaules, orteils légèrement tournés vers l\'extérieur. Descendre en poussant les genoux vers l\'extérieur.' },
          { name: 'Développé Couché', nameEn: 'barbell bench press', sets: '4', reps: '10', technique: 'Cage thoracique sortie, omoplates serrées.', muscle: 'Pectoraux', rest: '90s', position: 'Allongé sur banc plat. Descendre la barre jusqu\'aux pectoraux en contrôlant. Pousser en expirant.' },
          { name: 'Tractions', nameEn: 'pull up', sets: '3', reps: 'Max', technique: 'Menton au-dessus de la barre, descente contrôlée.', muscle: 'Dos', rest: '90s', position: 'Suspendu à la barre, prise pronation. Tirer le corps vers le haut jusqu\'à ce que le menton passe la barre.' },
          { name: 'Gainage Planche', nameEn: 'plank', sets: '3', reps: '1min', technique: 'Corps parfaitement aligné, ne pas laisser les hanches monter.', muscle: 'Abdominaux', rest: '60s', position: 'Appui sur les avant-bras et les orteils. Corps aligné de la tête aux talons. Contracter les abdos.' }
        ],
        homeExercises: [
          { name: 'Squat Sauté', nameEn: 'jump squat', sets: '4', reps: '15', technique: 'Sauter en explosif, atterrir en douceur.', muscle: 'Jambes', rest: '90s', position: 'Descendre en squat puis sauter vers le haut en tendant les bras. Atterrir en amortissant avec les genoux fléchis.' },
          { name: 'Pompes', nameEn: 'push up', sets: '4', reps: 'Max', technique: 'Corps en planche, descendre la poitrine.', muscle: 'Pectoraux', rest: '60s', position: 'Mains légèrement plus larges que les épaules. Corps aligné. Descendre la poitrine jusqu\'à 2cm du sol.' },
          { name: 'Rowing sur Table', nameEn: 'inverted row', sets: '3', reps: '12', technique: 'Tirer avec les coudes vers les hanches.', muscle: 'Dos', rest: '60s', position: 'Allongé sous une table solide. Mains sur le bord de la table. Tirer le corps vers le haut.' },
          { name: 'Gainage Planche', nameEn: 'plank', sets: '3', reps: '45s', technique: 'Corps aligné, ne pas laisser les hanches tomber.', muscle: 'Abdominaux', rest: '45s', position: 'Appui sur les avant-bras. Corps en ligne droite. Maintenir la position.' }
        ]
      },
      {
        id: 'fb-2',
        name: 'Full Body B',
        day: 'Mercredi',
        duration: '65 min',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de Terre Jambes Tendues', nameEn: 'stiff leg deadlift', sets: '3', reps: '12', technique: 'Dos plat, descendre en sentant l\'étirement des ischios.', muscle: 'Ischio-jambiers', rest: '120s', position: 'Debout, barre devant soi. Baisser la barre le long des jambes en gardant le dos droit et les jambes quasi-tendues.' },
          { name: 'Développé Militaire', nameEn: 'barbell overhead press', sets: '4', reps: '10', technique: 'Debout, gainage fort, pas de cambure.', muscle: 'Épaules', rest: '90s', position: 'Debout, barre devant les épaules. Pousser vers le haut en verrouillant les genoux et en contractant les abdos.' },
          { name: 'Rowing Haltère', nameEn: 'dumbbell bent over row', sets: '3', reps: '12', technique: 'Tirer avec le coude, pas avec la main.', muscle: 'Dos', rest: '90s', position: 'Un genou sur le banc, même côté pour la main. L\'autre main tient l\'haltère. Tirer vers la hanche.' },
          { name: 'Fentes Marchées', nameEn: 'walking lunge', sets: '3', reps: '20 pas', technique: 'Genou arrière proche du sol, torse droit.', muscle: 'Jambes', rest: '90s', position: 'Debout, faire un grand pas en avant. Descendre le genou arrière vers le sol. Pousser avec le pied avant pour avancer.' }
        ],
        homeExercises: [
          { name: 'Pont Fessier', nameEn: 'glute bridge', sets: '3', reps: '20', technique: 'Contracter les fessiers en haut, descendre lentement.', muscle: 'Ischio-jambiers/Fessiers', rest: '45s', position: 'Allongé sur le dos, pieds au sol. Pousser les hanches vers le haut en contractant les fessiers. Tenir 1 seconde en haut.' },
          { name: 'Pike Push Up', nameEn: 'pike push up', sets: '4', reps: '12', technique: 'Fesses en l\'air, descendre la tête vers le sol.', muscle: 'Épaules', rest: '60s', position: 'Position de pompes avec les fesses très hautes (forme de V). Fléchir les coudes pour descendre la tête vers le sol.' },
          { name: 'Superman Alterné', nameEn: 'bird dog', sets: '3', reps: '12', technique: 'Bras et jambe opposés, tenir 2 secondes en haut.', muscle: 'Dos', rest: '45s', position: 'À quatre pattes. Étendre le bras droit et la jambe gauche. Tenir 2 secondes. Alterner.' },
          { name: 'Fentes Marchées', nameEn: 'walking lunge', sets: '3', reps: '20 pas', technique: 'Grand pas, genou arrière proche du sol.', muscle: 'Jambes', rest: '60s', position: 'Debout. Faire de grands pas en avant en descendant le genou arrière vers le sol. Alterner les jambes.' }
        ]
      },
      {
        id: 'fb-3',
        name: 'Full Body C',
        day: 'Vendredi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Presse à Cuisses', nameEn: 'leg press', sets: '4', reps: '12', technique: 'Pieds au milieu de la plateforme, ne pas verrouiller les genoux.', muscle: 'Quadriceps', rest: '90s', position: 'Assis dans la machine. Pieds au milieu de la plateforme. Pousser en tendant les jambes sans les verrouiller.' },
          { name: 'Développé Poitrine Machine', nameEn: 'chest press machine', sets: '3', reps: '12', technique: 'Tension continue, ne pas relâcher en haut.', muscle: 'Pectoraux', rest: '60s', position: 'Assis à la machine. Poignées à hauteur de poitrine. Pousser en avant en contractant les pectoraux.' },
          { name: 'Tirage Vertical Poulie', nameEn: 'lat pulldown', sets: '3', reps: '12', technique: 'Tirer vers la poitrine en ramenant les coudes vers le bas.', muscle: 'Dos', rest: '90s', position: 'Assis à la poulie haute. Prise large pronation. Tirer la barre vers la poitrine.' },
          { name: 'Mollets Debout', nameEn: 'standing calf raise', sets: '4', reps: '15', technique: 'Amplitude maximale, tenir 1 seconde en haut.', muscle: 'Mollets', rest: '60s', position: 'Debout sur un step ou le sol. Monter sur la pointe des pieds le plus haut possible. Descendre lentement.' }
        ],
        homeExercises: [
          { name: 'Squat Sumo', nameEn: 'sumo squat', sets: '4', reps: '20', technique: 'Pieds très écartés, orteils vers l\'extérieur.', muscle: 'Quadriceps/Fessiers', rest: '60s', position: 'Pieds deux fois plus écartés que la largeur des épaules. Descendre en poussant les genoux vers l\'extérieur.' },
          { name: 'Pompes Inclinées', nameEn: 'incline push up', sets: '3', reps: 'Max', technique: 'Mains sur une surface surélevée.', muscle: 'Pectoraux', rest: '60s', position: 'Mains posées sur un canapé ou une chaise. Corps en planche inclinée. Descendre la poitrine.' },
          { name: 'Rowing Élastique', nameEn: 'band row', sets: '3', reps: '15', technique: 'Tirer les coudes vers l\'arrière en serrant les omoplates.', muscle: 'Dos', rest: '60s', position: 'Élastique fixé à hauteur de taille. Tirer vers le ventre en serrant les omoplates.' },
          { name: 'Mollets Debout', nameEn: 'standing calf raise', sets: '4', reps: '20', technique: 'Monter haut, descendre bas, tenir 1 seconde en haut.', muscle: 'Mollets', rest: '45s', position: 'Debout sur une marche si possible. Monter sur la pointe des pieds. Descendre sous le niveau de la marche.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Oeufs', 'Flocons d\'avoine', 'Lentilles'],
      caloriesGoal: 'Maintenance',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Bowlcake avoine banane.', macros: 'P: 20g | G: 40g | L: 10g' },
        { time: '12:30', name: 'Déjeuner', description: 'Lentilles, riz, Colin.', macros: 'P: 30g | G: 50g | L: 8g' },
        { time: '16:00', name: 'Collation', description: 'Fruit, noix.', macros: 'P: 5g | G: 20g | L: 15g' },
        { time: '20:00', name: 'Dîner', description: 'Salade complète, jambon cru.', macros: 'P: 25g | G: 15g | L: 12g' }
      ]
    }
  },
  {
    id: 'jambes',
    name: 'Programme Jambes',
    emoji: '🦵',
    sessions: [
      {
        id: 'jam-1',
        name: 'Quadriceps & Fessiers',
        day: 'Lundi',
        duration: '60 min',
        isRestDay: false,
        exercises: [
          { name: 'Squat Arrière', nameEn: 'barbell squat', sets: '4', reps: '10', technique: 'Descente lente 3 secondes, dos bien droit.', muscle: 'Quadriceps', rest: '120s', position: 'Barre sur les trapèzes. Pieds écartés. Descendre lentement en poussant les genoux vers l\'extérieur. Remonter en explosif.' },
          { name: 'Presse 45°', nameEn: 'leg press', sets: '3', reps: '12', technique: 'Pieds larges et hauts pour cibler les fessiers.', muscle: 'Quadriceps/Fessiers', rest: '90s', position: 'Assis dans la presse. Pieds larges et en haut de la plateforme. Descendre jusqu\'à 90° puis pousser.' },
          { name: 'Extension Jambes', nameEn: 'leg extension', sets: '3', reps: '15', technique: 'Contraction maximale en haut, descente contrôlée.', muscle: 'Quadriceps', rest: '60s', position: 'Assis à la machine. Jambes sous le coussin. Tendre les jambes en contractant les quadriceps.' },
          { name: 'Hip Thrust Machine', nameEn: 'hip thrust', sets: '3', reps: '15', technique: 'Contracte fort les fessiers en haut.', muscle: 'Fessiers', rest: '60s', position: 'Épaules sur le banc, barre sur les hanches. Pousser les hanches vers le haut en contractant les fessiers.' }
        ],
        homeExercises: [
          { name: 'Squat Sauté', nameEn: 'jump squat', sets: '4', reps: '15', technique: 'Sauter en explosif, atterrir doucement.', muscle: 'Quadriceps', rest: '60s', position: 'Descendre en squat puis sauter vers le haut en tendant les bras. Atterrir en amortissant.' },
          { name: 'Fentes Statiques', nameEn: 'static lunge', sets: '3', reps: '12 par jambe', technique: 'Genou arrière proche du sol, torse droit.', muscle: 'Quadriceps/Fessiers', rest: '60s', position: 'Un grand pas en avant. Descendre le genou arrière vers le sol. Remonter et répéter.' },
          { name: 'Pont Fessier Unilatéral', nameEn: 'single leg glute bridge', sets: '3', reps: '12 par jambe', technique: 'Une jambe tendue, l\'autre pousse.', muscle: 'Fessiers', rest: '60s', position: 'Allongé sur le dos, une jambe fléchie au sol, l\'autre tendue. Pousser les hanches vers le haut.' },
          { name: 'Squat Sumo', nameEn: 'sumo squat', sets: '3', reps: '20', technique: 'Pieds très écartés, descendre bas.', muscle: 'Quadriceps/Fessiers', rest: '60s', position: 'Pieds très écartés, orteils vers l\'extérieur. Descendre en gardant le dos droit.' }
        ]
      },
      {
        id: 'jam-2',
        name: 'Ischio-jambiers & Mollets',
        day: 'Jeudi',
        duration: '55 min',
        isRestDay: false,
        exercises: [
          { name: 'Soulevé de Terre Roumain', nameEn: 'romanian deadlift', sets: '4', reps: '10', technique: 'Bascule du bassin, garder la barre près des jambes.', muscle: 'Ischio-jambiers', rest: '120s', position: 'Debout, barre devant soi. Baisser la barre le long des jambes en poussant les fesses en arrière. Sentir l\'étirement des ischios.' },
          { name: 'Curl Jambes Assis', nameEn: 'seated leg curl', sets: '4', reps: '12', technique: 'Tirer fort vers le bas, descente lente.', muscle: 'Ischio-jambiers', rest: '60s', position: 'Assis à la machine. Jambes sous le coussin. Tirer vers le bas en fléchissant les genoux.' },
          { name: 'Mollets à la Presse', nameEn: 'calf press', sets: '4', reps: '20', technique: 'Amplitude maximale, tenir 1 seconde en haut.', muscle: 'Mollets', rest: '60s', position: 'Plateforme de la presse contre la pointe des pieds. Pousser pour monter et descendre lentement.' },
          { name: 'Hip Thrust', nameEn: 'barbell hip thrust', sets: '4', reps: '10', technique: 'Contracte fort les fessiers en haut, tenir 2 secondes.', muscle: 'Fessiers', rest: '90s', position: 'Épaules sur un banc, barre sur les hanches. Pousser les hanches vers le haut. Tenir 2 secondes.' }
        ],
        homeExercises: [
          { name: 'Good Morning', nameEn: 'good morning', sets: '4', reps: '15', technique: 'Dos plat, bascule depuis les hanches.', muscle: 'Ischio-jambiers', rest: '60s', position: 'Debout, mains derrière la tête. Incliner le buste en avant en gardant le dos droit. Sentir l\'étirement.' },
          { name: 'Nordic Curl', nameEn: 'nordic hamstring curl', sets: '3', reps: '8', technique: 'Descendre lentement, revenir en poussant.', muscle: 'Ischio-jambiers', rest: '90s', position: 'À genoux, pieds bloqués sous un meuble. Descendre le buste vers le sol lentement en résistant.' },
          { name: 'Mollets Debout', nameEn: 'standing calf raise', sets: '4', reps: '25', technique: 'Sur une marche, amplitude totale.', muscle: 'Mollets', rest: '45s', position: 'Debout sur le bord d\'une marche. Monter sur la pointe des pieds. Descendre sous le niveau.' },
          { name: 'Pont Fessier', nameEn: 'glute bridge', sets: '4', reps: '20', technique: 'Tenir 2 secondes en haut, descente lente.', muscle: 'Fessiers', rest: '45s', position: 'Allongé sur le dos, pieds au sol. Pousser les hanches vers le haut. Tenir 2 secondes.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Patate douce', 'Boeuf 5%', 'Avocat'],
      caloriesGoal: 'Prise de masse (Focus énergie)',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Pancakes protéinés.', macros: 'P: 28g | G: 45g | L: 10g' },
        { time: '12:30', name: 'Déjeuner', description: 'Bifteck, patate douce.', macros: 'P: 42g | G: 65g | L: 18g' },
        { time: '16:00', name: 'Collation', description: 'Fromage blanc, granola.', macros: 'P: 20g | G: 25g | L: 5g' },
        { time: '20:00', name: 'Dîner', description: 'Poulet, riz, haricots.', macros: 'P: 35g | G: 40g | L: 10g' }
      ]
    }
  },
  {
    id: 'abdos',
    name: 'Programme Abdos',
    emoji: '🔥',
    sessions: [
      {
        id: 'abd-1',
        name: 'Abdos - Force',
        day: 'Lundi',
        duration: '35 min',
        isRestDay: false,
        exercises: [
          { name: 'Crunch Poulie', nameEn: 'cable crunch', sets: '4', reps: '15', technique: 'Enrouler la colonne vertébrale, ne pas tirer avec le cou.', muscle: 'Grand droit', rest: '60s', position: 'À genoux face à la poulie haute. Corde derrière la nuque. Enrouler le buste vers les genoux.' },
          { name: 'Relevé de Jambes', nameEn: 'hanging leg raise', sets: '4', reps: '12', technique: 'Contrôle la descente, ne pas laisser tomber les jambes.', muscle: 'Bas abdominaux', rest: '60s', position: 'Suspendu à la barre ou allongé. Monter les jambes tendues à 90°. Descendre lentement.' },
          { name: 'Torsion Russe', nameEn: 'russian twist', sets: '3', reps: '20', technique: 'Rotation du buste, ne pas bouger les hanches.', muscle: 'Obliques', rest: '45s', position: 'Assis, pieds levés ou au sol. Tenir un poids. Tourner le buste d\'un côté puis de l\'autre.' },
          { name: 'Roue Abdominale', nameEn: 'ab wheel rollout', sets: '3', reps: '10', technique: 'Gainage strict, ne pas creuser le dos.', muscle: 'Abdominaux', rest: '60s', position: 'À genoux, roue en mains. Dérouler vers l\'avant en gardant le dos droit. Revenir en contractant les abdos.' }
        ],
        homeExercises: [
          { name: 'Crunch Classique', nameEn: 'crunch', sets: '4', reps: '25', technique: 'Expirer en montant, ne pas tirer sur le cou.', muscle: 'Grand droit', rest: '45s', position: 'Allongé sur le dos, pieds au sol. Mains derrière la tête. Enrouler le buste vers les genoux.' },
          { name: 'Relevé de Jambes Sol', nameEn: 'leg raise', sets: '4', reps: '15', technique: 'Jambes quasi-tendues, descendre lentement.', muscle: 'Bas abdominaux', rest: '45s', position: 'Allongé sur le dos, mains sous les fesses. Monter les jambes à 90° puis descendre sans toucher le sol.' },
          { name: 'Torsion Russe', nameEn: 'russian twist', sets: '3', reps: '20', technique: 'Pieds levés pour plus de difficulté.', muscle: 'Obliques', rest: '45s', position: 'Assis, pieds levés du sol. Pencher légèrement le buste en arrière. Tourner d\'un côté à l\'autre.' },
          { name: 'Planche', nameEn: 'plank', sets: '3', reps: '1min', technique: 'Corps aligné, ne pas laisser les hanches monter.', muscle: 'Abdominaux', rest: '60s', position: 'Appui sur les avant-bras et les orteils. Corps parfaitement aligné. Contracter les abdos.' }
        ]
      },
      {
        id: 'abd-2',
        name: 'Abdos - Stabilité',
        day: 'Jeudi',
        duration: '30 min',
        isRestDay: false,
        exercises: [
          { name: 'Gainage Planche', nameEn: 'plank', sets: '3', reps: '1min', technique: 'Corps aligné, ne pas laisser les hanches monter.', muscle: 'Transverse', rest: '60s', position: 'Appui sur les avant-bras et les orteils. Corps en ligne droite. Contracter les abdos et les fessiers.' },
          { name: 'Gainage Latéral', nameEn: 'side plank', sets: '3', reps: '45s par côté', technique: 'Hanches hautes, corps aligné.', muscle: 'Obliques', rest: '45s', position: 'Sur le côté, appui sur un avant-bras. Corps aligné. Lever les hanches. Tenir.' },
          { name: 'Hollow Hold', nameEn: 'hollow body hold', sets: '3', reps: '45s', technique: 'Dos collé au sol, bras et jambes levés.', muscle: 'Abdominaux', rest: '60s', position: 'Allongé sur le dos. Lever bras et jambes en gardant le dos collé au sol. Creuser les abdos.' },
          { name: 'Dead Bug', nameEn: 'dead bug', sets: '4', reps: '12', technique: 'Mouvement lent et contrôlé, dos au sol.', muscle: 'Abdominaux profonds', rest: '60s', position: 'Allongé sur le dos, bras vers le plafond, jambes à 90°. Descendre simultanément bras droit et jambe gauche.' }
        ],
        homeExercises: [
          { name: 'Planche Bras Tendus', nameEn: 'plank', sets: '3', reps: '45s', technique: 'Bras tendus, corps aligné.', muscle: 'Transverse', rest: '45s', position: 'Position de pompes. Bras tendus. Corps en planche parfaite. Tenir.' },
          { name: 'Gainage Latéral', nameEn: 'side plank', sets: '3', reps: '30s par côté', technique: 'Hanches hautes, ne pas laisser tomber.', muscle: 'Obliques', rest: '30s', position: 'Sur le côté, appui sur un avant-bras. Lever les hanches. Corps aligné.' },
          { name: 'Mountain Climbers', nameEn: 'mountain climber', sets: '3', reps: '30s', technique: 'Ramener les genoux rapidement vers la poitrine.', muscle: 'Abdominaux', rest: '45s', position: 'Position de pompes. Ramener alternativement chaque genou vers la poitrine rapidement.' },
          { name: 'Dead Bug', nameEn: 'dead bug', sets: '4', reps: '10', technique: 'Dos collé au sol en permanence.', muscle: 'Abdominaux profonds', rest: '45s', position: 'Allongé sur le dos. Bras vers le plafond, jambes à 90°. Descendre bras droit et jambe gauche ensemble.' }
        ]
      }
    ],
    nutrition: {
      keyFoods: ['Thon', 'Épinards', 'Fromage blanc 0%'],
      caloriesGoal: 'Sèche (Déficit calorique)',
      meals: [
        { time: '08:00', name: 'Petit Déjeuner', description: 'Fromage blanc, framboises.', macros: 'P: 18g | G: 15g | L: 1g' },
        { time: '12:30', name: 'Déjeuner', description: 'Thon, salade verte.', macros: 'P: 32g | G: 5g | L: 8g' },
        { time: '16:00', name: 'Collation', description: '1 pomme, thé vert.', macros: 'P: 1g | G: 20g | L: 0g' },
        { time: '20:00', name: 'Dîner', description: 'Colin, brocolis.', macros: 'P: 28g | G: 5g | L: 4g' }
      ]
    }
  }
];