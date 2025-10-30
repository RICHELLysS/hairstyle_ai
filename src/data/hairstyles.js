export const hairstyles = [
    {
      id: 1,
      name: "波波头",
      image: "/hairstyles/bob.jpg",
      description: "经典短发，长度在耳朵和肩膀之间，适合多种脸型",
      suitableFaceShapes: ["椭圆形", "心形", "长形"],
      difficulty: "简单",
      maintenance: "低",
      tags: ["短发", "经典", "易打理"],
      features: ["修饰脸型", "显年轻", "适合职场"]
    },
    {
      id: 2,
      name: "长直发",
      image: "/hairstyles/long-straight.jpg",
      description: "自然垂顺的长直发，展现优雅气质",
      suitableFaceShapes: ["椭圆形", "长形", "心形"],
      difficulty: "中等",
      maintenance: "中等",
      tags: ["长发", "直发", "优雅"],
      features: ["显气质", "百搭", "适合多种场合"]
    },
    {
      id: 3,
      name: "大波浪",
      image: "/hairstyles/waves.jpg",
      description: "浪漫的大波浪卷发，增加发量和立体感",
      suitableFaceShapes: ["圆形", "方形", "长形"],
      difficulty: "中等",
      maintenance: "高",
      tags: ["卷发", "浪漫", "女人味"],
      features: ["增加发量", "修饰脸型", "时尚感强"]
    },
    {
      id: 4,
      name: "齐肩发",
      image: "/hairstyles/lob.jpg",
      description: "长度在肩膀位置的发型，兼具短发的干练和长发的柔美",
      suitableFaceShapes: ["椭圆形", "圆形", "心形"],
      difficulty: "简单",
      maintenance: "低",
      tags: ["中长发", "流行", "百搭"],
      features: ["时尚", "易打理", "适合多种年龄"]
    },
    {
      id: 5,
      name: "精灵短发",
      image: "/hairstyles/pixie.jpg",
      description: "超短发造型，突出面部轮廓，展现个性",
      suitableFaceShapes: ["椭圆形", "心形"],
      difficulty: "高",
      maintenance: "高",
      tags: ["超短发", "个性", "时尚"],
      features: ["突出五官", "显个性", "清爽利落"]
    },
    {
      id: 6,
      name: "法式刘海",
      image: "/hairstyles/french-bangs.jpg",
      description: "慵懒随性的刘海，搭配各种发型都能增加时尚感",
      suitableFaceShapes: ["圆形", "方形", "长形"],
      difficulty: "中等",
      maintenance: "中等",
      tags: ["刘海", "法式", "时尚"],
      features: ["修饰额头", "减龄", "增加时尚感"]
    },
    {
      id: 7,
      name: "层次长发",
      image: "/hairstyles/layered-long.jpg",
      description: "带有层次感的长发，增加发型动感和立体感",
      suitableFaceShapes: ["圆形", "方形", "椭圆形"],
      difficulty: "中等",
      maintenance: "中等",
      tags: ["长发", "层次", "立体"],
      features: ["增加动感", "修饰脸型", "显发量"]
    },
    {
      id: 8,
      name: "复古卷发",
      image: "/hairstyles/vintage-curl.jpg",
      description: "复古风格的小卷发，展现复古魅力",
      suitableFaceShapes: ["椭圆形", "长形"],
      difficulty: "高",
      maintenance: "高",
      tags: ["卷发", "复古", "个性"],
      features: ["复古风格", "显个性", "适合特殊场合"]
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
  
  // 根据标签筛选发型
  export const getHairstylesByTag = (tag) => {
    return hairstyles.filter(style => 
      style.tags.includes(tag)
    );
  };
  
  // 获取发型难度选项
  export const difficultyOptions = [
    { value: "简单", label: "简单易打理" },
    { value: "中等", label: "中等维护" },
    { value: "高", label: "高维护" }
  ];
  
  // 脸型描述信息
  export const faceShapeDescriptions = {
    "椭圆形": "标准脸型，适合几乎所有发型",
    "圆形": "脸部长宽相近，需要通过发型拉长脸型",
    "方形": "下颌角明显，需要通过发型柔化轮廓",
    "心形": "额头较宽，下巴较尖，需要平衡上下比例",
    "长形": "脸长明显大于脸宽，需要通过发型增加宽度"
  };