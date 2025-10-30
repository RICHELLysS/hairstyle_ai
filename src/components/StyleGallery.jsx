import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { hairstyles, getRecommendedHairstyles, getAllTags, difficultyOptions, faceShapeDescriptions } from '../data/hairstyles';

const StyleGallery = ({ faceAnalysis, onHairstyleSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  // 获取推荐发型
  const recommendedHairstyles = useMemo(() => {
    return getRecommendedHairstyles(faceAnalysis.faceShape);
  }, [faceAnalysis.faceShape]);

  // 过滤发型
  const filteredHairstyles = useMemo(() => {
    let filtered = [...hairstyles];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(style =>
        style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        style.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        style.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(style =>
        selectedTags.every(tag => style.tags.includes(tag))
      );
    }

    // 难度过滤
    if (selectedDifficulty) {
      filtered = filtered.filter(style =>
        style.difficulty === selectedDifficulty
      );
    }

    return filtered;
  }, [searchTerm, selectedTags, selectedDifficulty]);

  // 切换标签选择
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 切换收藏
  const toggleFavorite = (hairstyleId, event) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hairstyleId)) {
        newFavorites.delete(hairstyleId);
      } else {
        newFavorites.add(hairstyleId);
      }
      return newFavorites;
    });
  };

  // 获取所有可用标签
  const allTags = getAllTags();

  // 获取难度图标
  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case '简单': return <Zap className="w-3 h-3" />;
      case '中等': return <Clock className="w-3 h-3" />;
      case '高': return <Filter className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'text-green-600 bg-green-50';
      case '中等': return 'text-yellow-600 bg-yellow-50';
      case '高': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">第三步：选择喜欢的发型</h2>
        <p className="text-blue-700 text-sm mt-1">
           Based on your {faceAnalysis.faceShape} face shape, these hairstyles are recommended for you.
           AI analyzes facial features to suggest the most flattering styles.
  </p>
      </div>

      {/* 脸型信息卡片 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-purple-800 mb-2">
              您的脸型: {faceAnalysis.faceShape}
            </h3>
            <p className="text-purple-700 text-sm">
              {faceShapeDescriptions[faceAnalysis.faceShape]}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {recommendedHairstyles.length}
            </div>
            <div className="text-purple-600 text-sm">推荐发型</div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索发型名称、类型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* 标签筛选 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>按标签筛选:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 难度筛选 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>按难度筛选:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('')}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                !selectedDifficulty
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
              }`}
            >
              全部
            </button>
            {difficultyOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedDifficulty(option.value)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                  selectedDifficulty === option.value
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                {getDifficultyIcon(option.value)}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 发型网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHairstyles.map(hairstyle => {
          const isRecommended = recommendedHairstyles.some(rec => rec.id === hairstyle.id);
          const isFavorite = favorites.has(hairstyle.id);

          return (
            <div
              key={hairstyle.id}
              onClick={() => onHairstyleSelect(hairstyle)}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg hover:border-purple-300 group"
            >
              {/* 图片区域 */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={hairstyle.image}
                  alt={hairstyle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* 推荐标签 */}
                {isRecommended && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      推荐
                    </div>
                  </div>
                )}

                {/* 收藏按钮 */}
                <button
                  onClick={(e) => toggleFavorite(hairstyle.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* 难度标签 */}
                <div className="absolute bottom-3 left-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDifficultyColor(hairstyle.difficulty)}`}>
                    {getDifficultyIcon(hairstyle.difficulty)}
                    {hairstyle.difficulty}
                  </div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {hairstyle.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {hairstyle.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {hairstyle.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 特点 */}
                <div className="space-y-1">
                  {hairstyle.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 空状态 */}
      {filteredHairstyles.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">未找到匹配的发型</h3>
          <p className="text-gray-500">尝试调整搜索条件或筛选条件</p>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-sm text-gray-500">
        显示 {filteredHairstyles.length} 个发型中的 {filteredHairstyles.length} 个
        {selectedTags.length > 0 && ` · ${selectedTags.length} 个标签选中`}
        {selectedDifficulty && ` · 难度: ${selectedDifficulty}`}
      </div>
    </div>
  );
};

export default StyleGallery;