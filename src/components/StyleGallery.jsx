import React, { useState, useMemo } from 'react';
import { Search, Filter, Heart, Star, Zap, CheckCircle2 } from 'lucide-react';
import { hairstyles, getRecommendedHairstyles, getAllTags, difficultyOptions, faceShapeDescriptions } from '../data/hairstyles';
import useLanguage from '../hooks/useLanguage';

const StyleGallery = ({ faceAnalysis, onHairstyleSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  
  const { t } = useLanguage();

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

    // 推荐程度过滤
    if (selectedRecommendation) {
      filtered = filtered.filter(style =>
        style.difficulty === selectedRecommendation
      );
    }

    return filtered;
  }, [searchTerm, selectedTags, selectedRecommendation]);

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

  // 获取推荐程度图标
  const getRecommendationIcon = (level) => {
    switch (level) {
      case 'Highly Recommended': return <Star className="w-3 h-3" />;
      case 'Recommended': return <CheckCircle2 className="w-3 h-3" />;
      case 'Moderate': return <Zap className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  // 获取推荐程度颜色
  const getRecommendationColor = (level) => {
    switch (level) {
      case 'Highly Recommended': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Recommended': return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Favorite Hairstyle
        </h2>
      </div>

      {/* 脸型信息卡片 - 改为橙色主题 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-2">
              Your Face Shape: {faceAnalysis.faceShape}
            </h3>
            <p className="text-orange-700 text-sm">
              {faceShapeDescriptions[faceAnalysis.faceShape]}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {recommendedHairstyles.length}
            </div>
            <div className="text-orange-600 text-sm">
              Recommended Styles
            </div>
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
            placeholder="Search hairstyle names, types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* 标签筛选 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Filter by tag:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 推荐程度筛选 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            <span>Filter by recommendation level:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRecommendation('')}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                !selectedRecommendation
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
              }`}
            >
              All
            </button>
            {difficultyOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedRecommendation(option.value)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                  selectedRecommendation === option.value
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                {getRecommendationIcon(option.value)}
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
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg hover:border-orange-300 group p-6"
            >
              {/* 移除图片区域，只保留文字内容 */}
              
              {/* 推荐标签 */}
              {isRecommended && (
                <div className="mb-3">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    Recommended
                  </div>
                </div>
              )}

              {/* 内容区域 */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {hairstyle.name}
                </h3>
                {/* 收藏按钮 */}
                <button
                  onClick={(e) => toggleFavorite(hairstyle.id, e)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {hairstyle.description}
              </p>

              {/* 推荐程度标签 */}
              <div className="mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit border ${getRecommendationColor(hairstyle.difficulty)}`}>
                  {getRecommendationIcon(hairstyle.difficulty)}
                  {hairstyle.difficulty}
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {hairstyle.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 特点 */}
              <div className="space-y-1">
                {hairstyle.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 空状态 */}
      {filteredHairstyles.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No matching hairstyles found
          </h3>
          <p className="text-gray-500">
            Try adjusting search or filter conditions
          </p>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredHairstyles.length} of {hairstyles.length} hairstyles
        {selectedTags.length > 0 && ` · ${selectedTags.length} tags selected`}
        {selectedRecommendation && ` · Recommendation: ${selectedRecommendation}`}
      </div>
    </div>
  );
};

export default StyleGallery;