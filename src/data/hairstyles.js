export const hairstyles = [
  {
    id: 1,
    name: "Bob Cut",
    image: "/hairstyles/bob.jpg",
    description: "Classic short hair, length between ears and shoulders, suitable for various face shapes",
    suitableFaceShapes: ["Oval", "Heart", "Long"],
    difficulty: "Easy",
    maintenance: "Low",
    tags: ["Short", "Classic", "Easy Maintenance"],
    features: ["Face shape modification", "Youthful look", "Suitable for workplace"]
  },
  {
    id: 2,
    name: "Long Straight",
    image: "/hairstyles/long-straight.jpg",
    description: "Naturally smooth long straight hair, showing elegant temperament",
    suitableFaceShapes: ["Oval", "Long", "Heart"],
    difficulty: "Medium",
    maintenance: "Medium",
    tags: ["Long", "Straight", "Elegant"],
    features: ["Elegant temperament", "Versatile", "Suitable for various occasions"]
  },
  {
    id: 3,
    name: "Wavy Hair",
    image: "/hairstyles/waves.jpg",
    description: "Romantic wavy hair, increasing hair volume and three-dimensional sense",
    suitableFaceShapes: ["Round", "Square", "Long"],
    difficulty: "Medium",
    maintenance: "High",
    tags: ["Curly", "Romantic", "Feminine"],
    features: ["Increase hair volume", "Modify face shape", "Strong fashion sense"]
  },
  {
    id: 4,
    name: "Lob Cut",
    image: "/hairstyles/lob.jpg",
    description: "Hair length at shoulder position, combining the crispness of short hair and the softness of long hair",
    suitableFaceShapes: ["Oval", "Round", "Heart"],
    difficulty: "Easy",
    maintenance: "Low",
    tags: ["Medium Length", "Popular", "Versatile"],
    features: ["Fashionable", "Easy maintenance", "Suitable for various ages"]
  },
  {
    id: 5,
    name: "Pixie Cut",
    image: "/hairstyles/pixie.jpg",
    description: "Ultra-short hairstyle, highlighting facial contours, showing personality",
    suitableFaceShapes: ["Oval", "Heart"],
    difficulty: "Hard",
    maintenance: "High",
    tags: ["Ultra Short", "Personality", "Fashion"],
    features: ["Highlight facial features", "Show personality", "Refreshing and neat"]
  },
  {
    id: 6,
    name: "French Bangs",
    image: "/hairstyles/french-bangs.jpg",
    description: "Casual and casual bangs, adding fashion sense with various hairstyles",
    suitableFaceShapes: ["Round", "Square", "Long"],
    difficulty: "Medium",
    maintenance: "Medium",
    tags: ["Bangs", "French", "Fashion"],
    features: ["Modify forehead", "Anti-aging", "Increase fashion sense"]
  },
  {
    id: 7,
    name: "Layered Long Hair",
    image: "/hairstyles/layered-long.jpg",
    description: "Long hair with a sense of layers, increasing the dynamics and three-dimensional sense of the hairstyle",
    suitableFaceShapes: ["Round", "Square", "Oval"],
    difficulty: "Medium",
    maintenance: "Medium",
    tags: ["Long", "Layered", "Three-dimensional"],
    features: ["Increase dynamics", "Modify face shape", "Show hair volume"]
  },
  {
    id: 8,
    name: "Vintage Curls",
    image: "/hairstyles/vintage-curl.jpg",
    description: "Small curly hair in retro style, showing retro charm",
    suitableFaceShapes: ["Oval", "Long"],
    difficulty: "Hard",
    maintenance: "High",
    tags: ["Curly", "Vintage", "Personality"],
    features: ["Retro style", "Show personality", "Suitable for special occasions"]
  }
];

// 根据脸型推荐发型
export const getRecommendedHairstyles = (faceShape) => {
  return hairstyles.filter(style => 
    style.suitableFaceShapes.includes(faceShape)
  );
};

// 获取所有标签
export const getAllTags = () => {
  const allTags = new Set();
  hairstyles.forEach(style => {
    style.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags);
};

// 获取发型难度选项
export const difficultyOptions = [
  { value: "Easy", label: "Easy Maintenance" },
  { value: "Medium", label: "Medium Maintenance" },
  { value: "Hard", label: "High Maintenance" }
];

// 脸型描述信息
export const faceShapeDescriptions = {
  "Oval": "Standard face shape, suitable for almost all hairstyles",
  "Round": "Face length and width are similar, need to elongate face shape through hairstyle",
  "Square": "Obvious jaw angle, need to soften contours through hairstyle",
  "Heart": "Wider forehead, sharper chin, need to balance upper and lower proportions",
  "Long": "Face length is significantly greater than face width, need to increase width through hairstyle"
};