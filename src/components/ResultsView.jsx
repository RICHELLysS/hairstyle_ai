import React, { useState, useEffect } from 'react';
import { Download, Share2, RotateCcw, Star, Calendar, Bookmark, User } from 'lucide-react';
import HairRecommender from './HairRecommender';
import { useStorage } from '../hooks/useStorage';
import useLanguage from '../hooks/useLanguage';

/**
 * Results display component showing analysis results and recommendations
 * Provides sharing, downloading, and restart functionality
 */
const ResultsView = ({
  userImage,
  faceAnalysis,
  selectedHairstyle,
  onRecommendationGenerated,
  onRestart
}) => {
  const [userImageUrl, setUserImageUrl] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const { saveHistory } = useStorage();
  const { t } = useLanguage();

  // Create user image URL for display
  useEffect(() => {
    if (userImage) {
      const url = URL.createObjectURL(userImage);
      setUserImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [userImage]);

  /**
   * Handles recommendation generation completion
   */
  const handleRecommendationGenerated = (rec) => {
    setRecommendation(rec);
    if (onRecommendationGenerated) {
      onRecommendationGenerated(rec);
    }

    // Save to history
    saveHistory({
      timestamp: new Date().toISOString(),
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      recommendation: rec,
      userImage: userImageUrl
    });
  };

  /**
   * Shares results via Web Share API or clipboard fallback
   */
  const handleShare = async () => {
    const shareData = {
      title: t('results.shareTitle', 'AI Hairstyle Recommendation'),
      text: t('results.shareText', 'Based on my {faceShape} face shape, AI recommended {hairstyle} hairstyle!', {
        faceShape: faceAnalysis.faceShape,
        hairstyle: selectedHairstyle.name
      }),
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = t('results.clipboardText', 'My {faceShape} face shape is suitable for {hairstyle} hairstyle!\n\n{recommendation}...', {
        faceShape: faceAnalysis.faceShape,
        hairstyle: selectedHairstyle.name,
        recommendation: recommendation?.substring(0, 100)
      });
      navigator.clipboard.writeText(text).then(() => {
        alert(t('results.copiedToClipboard', 'Recommendation copied to clipboard!'));
      });
    }
  };

  /**
   * Downloads results as text file
   */
  const handleDownload = () => {
    const content = t('results.downloadContent', `
AI Hairstyle Recommendation Report
${'='.repeat(50)}

Face Analysis: {faceShape}
Recommended Hairstyle: {hairstyle}
Recommendation Time: {timestamp}

Detailed Advice:
{recommendation}

Features:
{features}

Suitable Face Shapes:
{suitableShapes}

Maintenance Difficulty: {difficulty}
    `, {
      faceShape: faceAnalysis.faceShape,
      hairstyle: selectedHairstyle.name,
      timestamp: new Date().toLocaleString(),
      recommendation: recommendation,
      features: selectedHairstyle.features.join(', '),
      suitableShapes: selectedHairstyle.suitableFaceShapes?.join(', ') || t('results.notAvailable', 'N/A'),
      difficulty: selectedHairstyle.difficulty
    }).trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = t('results.downloadFilename', 'Hairstyle-Recommendation-{hairstyle}.txt', {
      hairstyle: selectedHairstyle.name
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('results.title', 'Hairstyle Recommendation')}
        </h2>
        <p className="text-gray-600">
          {t('results.subtitle', 'Personalized hairstyle plan generated based on AI analysis')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: User info and hairstyle details */}
        <div className="lg:col-span-1 space-y-6">
          {/* User photo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              {t('results.yourPhoto', 'Your Photo')}
            </h3>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-orange-200">
              {userImageUrl && (
                <img
                  src={userImageUrl}
                  alt={t('results.photoAlt', 'User photo')}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Face analysis results */}
          <div className="bg-white rounded-xl border border-orange-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              {t('results.faceAnalysis', 'Face Analysis')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('results.detectedFaceShape', 'Detected Face Shape')}</span>
                <span className="font-medium text-gray-800">{faceAnalysis.faceShape}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('analysis.confidence', 'Confidence')}</span>
                <span className="font-medium text-gray-800">{faceAnalysis.features.confidence}</span>
              </div>
              <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                {faceAnalysis.description}
              </div>
            </div>
          </div>

          {/* Selected hairstyle information */}
          <div className="bg-white rounded-xl border border-orange-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-orange-600" />
              {t('results.selectedHairstyle', 'Selected Hairstyle')}
            </h3>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-gray-800 text-lg mb-2">
                  {selectedHairstyle.name}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedHairstyle.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('results.recommendationLevel', 'Recommendation Level')}</span>
                    <span className="font-medium text-gray-800">{selectedHairstyle.difficulty}</span>
                  </div>
                  
                  {selectedHairstyle.suitableFaceShapes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('results.suitableFaceShapes', 'Suitable Face Shapes')}</span>
                      <span className="font-medium text-gray-800">
                        {selectedHairstyle.suitableFaceShapes.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedHairstyle.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs border border-orange-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: AI recommendations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-orange-200 p-6 h-full">
            <HairRecommender
              faceAnalysis={faceAnalysis}
              selectedHairstyle={selectedHairstyle}
              onRecommendationGenerated={handleRecommendationGenerated}
            />
          </div>
        </div>
      </div>

      {/* Important notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-black-800 mb-2">
          <Star className="w-4 h-4" />
          <span className="font-medium">{t('results.notice', 'Notice')}</span>
        </div>
        <ul className="text-black-700 text-sm space-y-1">
          <li>• {t('results.note1', 'This recommendation is generated based on AI analysis and is for reference only')}</li>
          <li>• {t('results.note4', 'Your photos and data analysis are processed completely locally to protect your privacy')}</li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-400 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" />
          {t('results.download', 'Download Recommendation')}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors shadow-md"
        >
          <Share2 className="w-4 h-4" />
          {t('results.share', 'Share Results')}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-white-600 text-black px-6 py-3 rounded-full border-gray-300 hover:bg-gray-50 transition-colors shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          {t('navigation.restart', 'Start Over')}
        </button>
      </div>
    </div>
  );
};

export default ResultsView;