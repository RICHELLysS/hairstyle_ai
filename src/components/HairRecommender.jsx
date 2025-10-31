import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Lightbulb, Scissors, Clock, Star, Zap } from 'lucide-react';
import { useChromeAI } from '../hooks/useChromeAI';
import useLanguage from '../hooks/useLanguage';

/**
 * AI-powered hairstyle recommendation component
 * Generates personalized advice based on face shape and selected hairstyle
 */
const HairRecommender = ({ faceAnalysis, selectedHairstyle, onRecommendationGenerated }) => {
  const [recommendation, setRecommendation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const { t } = useLanguage();
  const { generateRecommendation: generateAISuggestion, isLoading } = useChromeAI();

  /**
   * Generates AI recommendation using face analysis and selected hairstyle
   */
  const handleGenerateRecommendation = useCallback(async () => {
    if (!faceAnalysis || !selectedHairstyle) {
      console.error('Missing required parameters:', { faceAnalysis, selectedHairstyle });
      setError(t('recommender.missingInfo', 'Missing necessary information, please ensure you have selected a hairstyle'));
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating recommendation with:', { faceAnalysis, selectedHairstyle });
      const result = await generateAISuggestion(faceAnalysis, selectedHairstyle);
      console.log('Recommendation result:', result);
      
      const recommendationText = typeof result === 'string' ? result : result.text;
      
      setRecommendation(recommendationText);
      if (onRecommendationGenerated) {
        onRecommendationGenerated(recommendationText);
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err.message || t('recommender.generationError', 'Error generating recommendation, please try again'));
    } finally {
      setIsGenerating(false);
    }
  }, [faceAnalysis, selectedHairstyle, generateAISuggestion, onRecommendationGenerated, t]);

  // Generate recommendation when dependencies are available
  useEffect(() => {
    if (faceAnalysis && selectedHairstyle && !recommendation) {
      handleGenerateRecommendation();
    }
  }, [faceAnalysis, selectedHairstyle, handleGenerateRecommendation, recommendation]);

  /**
   * Parses recommendation text into structured sections
   */
  const parseRecommendation = (text) => {
    if (!text || typeof text !== 'string') return null;

    const sections = {
      reason: '',
      maintenance: '',
      styling: '',
      caution: ''
    };

    try {
      const lines = text.split('\n').filter(line => line.trim());
      let currentSection = 'reason';
      
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        
        // Simple keyword matching logic
        if (lowerLine.includes('why') || lowerLine.includes('reason') || lowerLine.includes('suitable') || lowerLine.includes('适合')) {
          currentSection = 'reason';
        } else if (lowerLine.includes('maintenance') || lowerLine.includes('care') || lowerLine.includes('daily') || lowerLine.includes('打理')) {
          currentSection = 'maintenance';
        } else if (lowerLine.includes('styling') || lowerLine.includes('match') || lowerLine.includes('outfit') || lowerLine.includes('搭配')) {
          currentSection = 'styling';
        } else if (lowerLine.includes('caution') || lowerLine.includes('attention') || lowerLine.includes('avoid') || lowerLine.includes('注意')) {
          currentSection = 'caution';
        }

        if (currentSection && line.trim()) {
          sections[currentSection] += line + '\n';
        }
      });

      return sections;
    } catch (err) {
      console.error('Error parsing recommendation:', err);
      return null;
    }
  };

  const parsedRecommendation = parseRecommendation(recommendation);

  /**
   * Returns localized section title
   */
  const getSectionTitle = (section) => {
    const titles = {
      reason: t('recommender.sections.reason', 'Why It Suits You'),
      maintenance: t('recommender.sections.maintenance', 'Maintenance Tips'),
      styling: t('recommender.sections.styling', 'Styling Suggestions'),
      caution: t('recommender.sections.caution', 'Things to Note')
    };
    return titles[section];
  };

  /**
   * Returns icon for each section
   */
  const getSectionIcon = (section) => {
    const icons = {
      reason: <Star className="w-4 h-4 text-orange-600" />,
      maintenance: <Scissors className="w-4 h-4 text-orange-600" />,
      styling: <Sparkles className="w-4 h-4 text-orange-600" />,
      caution: <Lightbulb className="w-4 h-4 text-orange-600" />
    };
    return icons[section];
  };

  // Show prompt if required parameters are missing
  if (!faceAnalysis || !selectedHairstyle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t('recommender.title', 'AI Hairstyle Recommendation')}
          </h3>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-yellow-800 font-medium mb-2">
            {t('recommender.incompleteInfo', 'Incomplete Information')}
          </h4>
          <p className="text-yellow-700">
            {!faceAnalysis && !selectedHairstyle 
              ? t('recommender.completeAnalysisFirst', 'Please complete face analysis and select a hairstyle first') 
              : !faceAnalysis 
                ? t('recommender.completeAnalysis', 'Please complete face analysis first') 
                : t('recommender.selectHairstyle', 'Please select a hairstyle first')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img src="/scissors.png" alt="Logo" className="w-8 h-8" />
        <h3 className="text-lg font-semibold text-gray-800">
          {t('recommender.title', 'AI Hairstyle Recommendation')}
        </h3>
      </div>

      {/* Generation status */}
      {(isGenerating || isLoading) ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-orange-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
            <span>{t('recommender.generating', 'AI is generating personalized advice...')}</span>
          </div>
          
          {/* Loading animation */}
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">
              {t('recommender.generationFailed', 'Generation Failed')}
            </span>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={handleGenerateRecommendation}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            {t('common.tryAgain', 'Try Again')}
          </button>
        </div>
      ) : recommendation ? (
        <div className="space-y-6">
          {/* Structured recommendation */}
          {parsedRecommendation ? (
            <div className="space-y-4">
              {Object.entries(parsedRecommendation).map(([section, content]) => 
                content.trim() && (
                  <div key={section} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getSectionIcon(section)}
                      <h4 className="font-semibold text-gray-800">{getSectionTitle(section)}</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {content.trim()}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            /* Fallback to raw text display */
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {recommendation}
              </p>
            </div>
          )}
          
          {/* Technical information */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-normal">
                {t('recommender.feature', 'AI-generated advice based on face shape and hairstyle features')}
              </span>
            </div>
          </div>

          {/* Regenerate button */}
          <div className="text-center">
            <button
              onClick={handleGenerateRecommendation}
              className="flex items-center gap-2 mx-auto bg-orange-700 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {t('recommender.regenerate', 'Regenerate Recommendation')}
            </button>
          </div>
        </div>
      ) : (
        /* Initial state */
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-gray-600 font-medium mb-2">
            {t('recommender.ready', 'Ready to Generate Advice')}
          </h4>
          <p className="text-gray-500 text-sm mb-4">
            {t('recommender.basedOn', 'Based on your {faceShape} face shape and selected {hairstyle}', {
              faceShape: faceAnalysis.faceShape,
              hairstyle: selectedHairstyle.name
            })}
          </p>
          <button
            onClick={handleGenerateRecommendation}
            className="bg-orange-700 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors"
          >
            {t('recommender.generate', 'Generate AI Advice')}
          </button>
        </div>
      )}
    </div>
  );
};

export default HairRecommender;