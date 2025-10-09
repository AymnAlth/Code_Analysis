import { CodeReviewResult } from '../types';

const STORAGE_KEY = 'code-review-results';
const MAX_STORED_RESULTS = 50; // الحد الأقصى للنتائج المحفوظة

/**
 * حفظ نتيجة مراجعة
 */
export function saveReviewResult(result: CodeReviewResult): void {
  try {
    const existingResults = getStoredResults();
    const updatedResults = [result, ...existingResults.slice(0, MAX_STORED_RESULTS - 1)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('فشل في حفظ النتيجة:', error);
  }
}

/**
 * الحصول على النتائج المحفوظة
 */
export function getStoredResults(): CodeReviewResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const results = JSON.parse(stored);
      // تحويل التاريخ من string إلى Date
      return results.map((result: any) => ({
        ...result,
        timestamp: new Date(result.timestamp)
      }));
    }
  } catch (error) {
    console.error('فشل في تحميل النتائج:', error);
  }
  return [];
}

/**
 * حذف نتيجة معينة
 */
export function deleteReviewResult(id: string): void {
  try {
    const results = getStoredResults();
    const filteredResults = results.filter(result => result.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResults));
  } catch (error) {
    console.error('فشل في حذف النتيجة:', error);
  }
}

/**
 * مسح جميع النتائج
 */
export function clearAllResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('فشل في مسح النتائج:', error);
  }
}

/**
 * البحث في النتائج
 */
export function searchResults(query: string): CodeReviewResult[] {
  const results = getStoredResults();
  const lowerQuery = query.toLowerCase();
  
  return results.filter(result =>
    result.filename.toLowerCase().includes(lowerQuery) ||
    result.language.toLowerCase().includes(lowerQuery) ||
    result.summary.toLowerCase().includes(lowerQuery)
  );
}

/**
 * فلترة النتائج حسب اللغة
 */
export function filterResultsByLanguage(language: string): CodeReviewResult[] {
  const results = getStoredResults();
  return results.filter(result => result.language === language);
}

/**
 * الحصول على إحصائيات النتائج
 */
export function getResultsStats() {
  const results = getStoredResults();
  
  const languageStats = results.reduce((acc, result) => {
    acc[result.language] = (acc[result.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgScore = results.length > 0 
    ? results.reduce((sum, result) => sum + result.overallScore, 0) / results.length
    : 0;

  return {
    totalReviews: results.length,
    languages: languageStats,
    averageScore: Math.round(avgScore * 10) / 10,
    lastReview: results[0]?.timestamp || null
  };
}