import { useLanguage } from '../hooks/useLanguage';

/**
 * Hairstyle data factory function with internationalization support
 * Creates localized hairstyle data using provided translation function
 */
export const createHairstyles = (t) => [
  {
    id: 1,
    name: t('hairstyle.bob.name', 'Bob Cut'),
    image: "/hairstyles/bob.jpg",
    description: t('hairstyle.bob.description', 'Classic short hair, length between ears and shoulders, suitable for various face shapes'),
    suitableFaceShapes: ["Oval", "Heart", "Long"],
    difficulty: t('difficulty.easy', 'Easy'),
    maintenance: t('maintenance.low', 'Low'),
    tags: [
      t('hairstyle.tag.short', 'Short'),
      t('hairstyle.tag.classic', 'Classic'),
      t('hairstyle.tag.easyMaintenance', 'Easy Maintenance')
    ],
    features: [
      t('hairstyle.bob.feature1', 'Face shape modification'),
      t('hairstyle.bob.feature2', 'Youthful look'),
      t('hairstyle.bob.feature3', 'Suitable for workplace')
    ]
  },
  {
    id: 2,
    name: t('hairstyle.longStraight.name', 'Long Straight'),
    image: "/hairstyles/long-straight.jpg",
    description: t('hairstyle.longStraight.description', 'Naturally smooth long straight hair, showing elegant temperament'),
    suitableFaceShapes: ["Oval", "Long", "Heart"],
    difficulty: t('difficulty.medium', 'Medium'),
    maintenance: t('maintenance.medium', 'Medium'),
    tags: [
      t('hairstyle.tag.long', 'Long'),
      t('hairstyle.tag.straight', 'Straight'),
      t('hairstyle.tag.elegant', 'Elegant')
    ],
    features: [
      t('hairstyle.longStraight.feature1', 'Elegant temperament'),
      t('hairstyle.longStraight.feature2', 'Versatile'),
      t('hairstyle.longStraight.feature3', 'Suitable for various occasions')
    ]
  },
  {
    id: 3,
    name: t('hairstyle.wavy.name', 'Wavy Hair'),
    image: "/hairstyles/waves.jpg",
    description: t('hairstyle.wavy.description', 'Romantic wavy hair, increasing hair volume and three-dimensional sense'),
    suitableFaceShapes: ["Round", "Square", "Long"],
    difficulty: t('difficulty.medium', 'Medium'),
    maintenance: t('maintenance.high', 'High'),
    tags: [
      t('hairstyle.tag.curly', 'Curly'),
      t('hairstyle.tag.romantic', 'Romantic'),
      t('hairstyle.tag.feminine', 'Feminine')
    ],
    features: [
      t('hairstyle.wavy.feature1', 'Increase hair volume'),
      t('hairstyle.wavy.feature2', 'Modify face shape'),
      t('hairstyle.wavy.feature3', 'Strong fashion sense')
    ]
  },
  {
    id: 4,
    name: t('hairstyle.lob.name', 'Lob Cut'),
    image: "/hairstyles/lob.jpg",
    description: t('hairstyle.lob.description', 'Hair length at shoulder position, combining the crispness of short hair and the softness of long hair'),
    suitableFaceShapes: ["Oval", "Round", "Heart"],
    difficulty: t('difficulty.easy', 'Easy'),
    maintenance: t('maintenance.low', 'Low'),
    tags: [
      t('hairstyle.tag.mediumLength', 'Medium Length'),
      t('hairstyle.tag.popular', 'Popular'),
      t('hairstyle.tag.versatile', 'Versatile')
    ],
    features: [
      t('hairstyle.lob.feature1', 'Fashionable'),
      t('hairstyle.lob.feature2', 'Easy maintenance'),
      t('hairstyle.lob.feature3', 'Suitable for various ages')
    ]
  },
  {
    id: 5,
    name: t('hairstyle.pixie.name', 'Pixie Cut'),
    image: "/hairstyles/pixie.jpg",
    description: t('hairstyle.pixie.description', 'Ultra-short hairstyle, highlighting facial contours, showing personality'),
    suitableFaceShapes: ["Oval", "Heart"],
    difficulty: t('difficulty.hard', 'Hard'),
    maintenance: t('maintenance.high', 'High'),
    tags: [
      t('hairstyle.tag.ultraShort', 'Ultra Short'),
      t('hairstyle.tag.personality', 'Personality'),
      t('hairstyle.tag.fashion', 'Fashion')
    ],
    features: [
      t('hairstyle.pixie.feature1', 'Highlight facial features'),
      t('hairstyle.pixie.feature2', 'Show personality'),
      t('hairstyle.pixie.feature3', 'Refreshing and neat')
    ]
  },
  {
    id: 6,
    name: t('hairstyle.frenchBangs.name', 'French Bangs'),
    image: "/hairstyles/french-bangs.jpg",
    description: t('hairstyle.frenchBangs.description', 'Casual and casual bangs, adding fashion sense with various hairstyles'),
    suitableFaceShapes: ["Round", "Square", "Long"],
    difficulty: t('difficulty.medium', 'Medium'),
    maintenance: t('maintenance.medium', 'Medium'),
    tags: [
      t('hairstyle.tag.bangs', 'Bangs'),
      t('hairstyle.tag.french', 'French'),
      t('hairstyle.tag.fashion', 'Fashion')
    ],
    features: [
      t('hairstyle.frenchBangs.feature1', 'Modify forehead'),
      t('hairstyle.frenchBangs.feature2', 'Anti-aging'),
      t('hairstyle.frenchBangs.feature3', 'Increase fashion sense')
    ]
  },
  {
    id: 7,
    name: t('hairstyle.layeredLong.name', 'Layered Long Hair'),
    image: "/hairstyles/layered-long.jpg",
    description: t('hairstyle.layeredLong.description', 'Long hair with a sense of layers, increasing the dynamics and three-dimensional sense of the hairstyle'),
    suitableFaceShapes: ["Round", "Square", "Oval"],
    difficulty: t('difficulty.medium', 'Medium'),
    maintenance: t('maintenance.medium', 'Medium'),
    tags: [
      t('hairstyle.tag.long', 'Long'),
      t('hairstyle.tag.layered', 'Layered'),
      t('hairstyle.tag.threeDimensional', 'Three-dimensional')
    ],
    features: [
      t('hairstyle.layeredLong.feature1', 'Increase dynamics'),
      t('hairstyle.layeredLong.feature2', 'Modify face shape'),
      t('hairstyle.layeredLong.feature3', 'Show hair volume')
    ]
  },
  {
    id: 8,
    name: t('hairstyle.vintageCurls.name', 'Vintage Curls'),
    image: "/hairstyles/vintage-curl.jpg",
    description: t('hairstyle.vintageCurls.description', 'Small curly hair in retro style, showing retro charm'),
    suitableFaceShapes: ["Oval", "Long"],
    difficulty: t('difficulty.hard', 'Hard'),
    maintenance: t('maintenance.high', 'High'),
    tags: [
      t('hairstyle.tag.curly', 'Curly'),
      t('hairstyle.tag.vintage', 'Vintage'),
      t('hairstyle.tag.personality', 'Personality')
    ],
    features: [
      t('hairstyle.vintageCurls.feature1', 'Retro style'),
      t('hairstyle.vintageCurls.feature2', 'Show personality'),
      t('hairstyle.vintageCurls.feature3', 'Suitable for special occasions')
    ]
  }
];

/**
 * Filters hairstyles by face shape compatibility
 * @param {string} faceShape - User's detected face shape
 * @param {Function} t - Translation function
 * @returns {Array} Filtered list of suitable hairstyles
 */
export const getRecommendedHairstyles = (faceShape, t) => {
  const hairstyles = createHairstyles(t);
  return hairstyles.filter(style => 
    style.suitableFaceShapes.includes(faceShape)
  );
};

/**
 * Extracts all unique tags from hairstyle collection
 * @param {Function} t - Translation function
 * @returns {Array} Unique tag list
 */
export const getAllTags = (t) => {
  const hairstyles = createHairstyles(t);
  const allTags = new Set();
  hairstyles.forEach(style => {
    style.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags);
};

/**
 * Provides localized difficulty level options
 * @param {Function} t - Translation function
 * @returns {Array} Difficulty options with labels
 */
export const getDifficultyOptions = (t) => [
  { value: t('difficulty.easy', 'Easy'), label: t('difficulty.easyMaintenance', 'Easy Maintenance') },
  { value: t('difficulty.medium', 'Medium'), label: t('difficulty.mediumMaintenance', 'Medium Maintenance') },
  { value: t('difficulty.hard', 'Hard'), label: t('difficulty.highMaintenance', 'High Maintenance') }
];

/**
 * Face shape descriptions for user guidance
 * @param {Function} t - Translation function
 * @returns {Object} Face shape descriptions keyed by shape
 */
export const getFaceShapeDescriptions = (t) => ({
  "Oval": t('faceShape.Oval', 'Standard face shape, suitable for almost all hairstyles'),
  "Round": t('faceShape.Round', 'Face length and width are similar, need to elongate face shape through hairstyle'),
  "Square": t('faceShape.Square', 'Obvious jaw angle, need to soften contours through hairstyle'),
  "Heart": t('faceShape.Heart', 'Wider forehead, sharper chin, need to balance upper and lower proportions'),
  "Long": t('faceShape.Long', 'Face length is significantly greater than face width, need to increase width through hairstyle')
});

/**
 * Custom hook providing hairstyle data with internationalization
 * @returns {Object} Hairstyle data and utility functions
 */
export const useHairstyles = () => {
  const { t } = useLanguage();
  
  return {
    hairstyles: createHairstyles(t),
    getRecommendedHairstyles: (faceShape) => getRecommendedHairstyles(faceShape, t),
    getAllTags: () => getAllTags(t),
    difficultyOptions: getDifficultyOptions(t),
    faceShapeDescriptions: getFaceShapeDescriptions(t)
  };
};