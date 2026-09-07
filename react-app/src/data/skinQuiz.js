/**
 * Skin quiz — question flow, transcribed step-for-step (same steps, same
 * options) with only the surrounding copy reworded into ESTEQO's own voice.
 * Answers are collected against these `id`s and posted as-is to /api/quiz.
 */

export const QUIZ_STEPS = [
  {
    id: 'ageRange',
    section: 'Skin Type',
    type: 'single',
    layout: 'grid2',
    question: 'What is your age range?',
    options: ['17 or younger', '18–29', '30–44', '45+'],
  },
  {
    id: 'pregnantNursing',
    section: 'Skin Type',
    type: 'yesno',
    question: 'Are you pregnant or nursing?',
  },
  {
    id: 'fitzpatrick',
    section: 'Skin Type',
    type: 'levels',
    question: 'What is your Fitzpatrick level?',
    options: [
      { label: 'Level 1', shade: '#f1ddc9', text: 'Skin always burns, never tans, and is sensitive to UV exposure' },
      { label: 'Level 2', shade: '#e3c19e', text: 'Skin burns easily and tans minimally' },
      { label: 'Level 3', shade: '#cf9f6e', text: 'Skin burns moderately and tans gradually to light brown' },
      { label: 'Level 4', shade: '#a97445', text: 'Skin burns minimally and always tans well to moderately brown' },
      { label: 'Level 5', shade: '#7a4c2a', text: 'Skin rarely burns and tans profusely to dark' },
      { label: 'Level 6', shade: '#3c2414', text: 'Skin never burns, is deeply pigmented, and is least sensitive to UV exposure' },
    ],
  },
  {
    id: 'skinZones',
    section: 'Skin Type',
    type: 'sliders',
    question: "Tell us a little more about how each section of your skin generally feels.",
    zones: ['T-Zone', 'Cheeks', 'Chin'],
    levels: ['Dry', 'Normal', 'Congested/Breakouts', 'Oily'],
  },
  {
    id: 'ingredientReactions',
    section: 'Skin Sensitivity',
    type: 'multi',
    layout: 'grid3',
    prompt: 'Select all that apply.',
    question: 'Has your skin ever had a negative reaction to any of these ingredients?',
    options: [
      'Retinoids', 'Benzoyl Peroxide', 'Color Additives',
      'Essential Oils', 'Fragrances', 'Sulfates',
      'Nuts', 'Acid', 'Fruits',
    ],
    noneOption: 'None of the above',
  },
  {
    id: 'breakoutFrequency',
    section: 'Skin Sensitivity',
    type: 'single',
    layout: 'list',
    question: 'How often do you experience acne or breakouts?',
    options: [
      'I never/rarely experience breakouts.',
      'I breakout sometimes with several spots on my face.',
      'I breakout hormonally.',
      'I breakout very frequently with more than several spots on my face at any given time.',
    ],
  },
  {
    id: 'skincareConcerns',
    section: 'Skin Sensitivity',
    type: 'multi',
    layout: 'grid3',
    prompt: 'Select up to three.',
    maxSelect: 3,
    question: 'What are your main skincare concerns at the moment?',
    options: [
      'Rough and Bumpy Texture', 'Redness / Sensitivity / Irritation', 'Dehydration',
      'Acne / Breakouts', 'Rosacea', 'Dryness / Flakiness',
      'Hyperpigmentation', 'Fine Lines and Wrinkles', 'Facial Muscle Tightness',
    ],
  },
  {
    id: 'prescriptions',
    section: 'Current Skin Care',
    type: 'multi',
    layout: 'grid3',
    prompt: 'Select all that apply.',
    question: 'Are you on topical or oral prescriptions for your skin?',
    options: ['Retin-A', 'Tazorac', 'Spironolactone', 'Epiduo', 'Renova', 'Accutane'],
    noneOption: 'None of the above',
  },
  {
    id: 'currentProducts',
    section: 'Current Skin Care',
    type: 'multi',
    layout: 'grid3',
    prompt: 'Select all that apply.',
    question: 'Which of the following products do you use?',
    options: [
      'Cleanser', 'Corrective Serum', 'Preventative Serum',
      'Exfoliant', 'Toner', 'Sunscreen',
      'Moisturizer', 'Masks', 'Devices',
    ],
  },
  {
    id: 'routineGoal',
    section: 'Skin Care Goals',
    type: 'single',
    layout: 'grid3',
    question: 'What are you looking for in your skincare routine?',
    options: [
      { label: '3 steps', sub: 'Skincare Minimalist' },
      { label: '6 steps', sub: 'Skincare Midi' },
      { label: '7+ steps', sub: 'Skincare Maximalist' },
    ],
  },
];
