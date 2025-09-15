// API utility functions for CleanSight
// Configure your YOLO backend API endpoints here

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const MAX_FILE_SIZE = process.env.REACT_APP_MAX_FILE_SIZE || 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = process.env.REACT_APP_SUPPORTED_FORMATS?.split(',') || [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm'
];

/**
 * Validates uploaded file
 * @param {File} file - The uploaded file
 * @returns {Object} - Validation result
 */
export const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }
  
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    errors.push(`Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Uploads file to YOLO API for litter detection
 * @param {File} file - The file to analyze
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Detection results
 */
export const uploadForDetection = async (file, onProgress) => {
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/detect`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Expected response format from YOLO API:
    // {
    //   success: true,
    //   detections: [
    //     {
    //       id: 1,
    //       type: 'plastic_bottle',
    //       confidence: 0.92,
    //       bbox: [x1, y1, x2, y2]
    //     }
    //   ],
    //   processing_time: 1.23,
    //   image_dimensions: { width: 1920, height: 1080 }
    // }
    
    return result;
  } catch (error) {
    console.error('Detection API error:', error);
    throw new Error(`Detection failed: ${error.message}`);
  }
};

/**
 * Mock detection function for development/testing
 * Remove this when integrating with real API
 */
export const mockDetection = async (file) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock detection results
  const mockDetections = [
    {
      id: 1,
      type: 'plastic_bottle',
      confidence: 0.92,
      bbox: [120, 80, 180, 220]
    },
    {
      id: 2,
      type: 'cigarette_butt',
      confidence: 0.85,
      bbox: [300, 150, 320, 180]
    },
    {
      id: 3,
      type: 'food_wrapper',
      confidence: 0.78,
      bbox: [200, 300, 280, 340]
    }
  ];

  return {
    success: true,
    detections: Math.random() > 0.3 ? mockDetections : [], // 70% chance of finding litter
    processing_time: 1.5 + Math.random() * 2,
    image_dimensions: { width: 800, height: 600 }
  };
};

/**
 * Save detection results to local storage
 * @param {Object} detection - Detection result to save
 */
export const saveDetectionResult = (detection) => {
  try {
    const saved = JSON.parse(localStorage.getItem('cleansight_detections') || '[]');
    saved.unshift({ ...detection, timestamp: Date.now() });
    
    // Keep only last 100 detections
    const trimmed = saved.slice(0, 100);
    localStorage.setItem('cleansight_detections', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save detection result:', error);
  }
};

/**
 * Get saved detection results from local storage
 * @returns {Array} - Array of saved detections
 */
export const getSavedDetections = () => {
  try {
    return JSON.parse(localStorage.getItem('cleansight_detections') || '[]');
  } catch (error) {
    console.error('Failed to load saved detections:', error);
    return [];
  }
};

/**
 * Clear all saved detection results
 */
export const clearSavedDetections = () => {
  try {
    localStorage.removeItem('cleansight_detections');
  } catch (error) {
    console.error('Failed to clear saved detections:', error);
  }
};

/**
 * Get detection statistics
 * @param {Array} detections - Array of detection results
 * @returns {Object} - Statistics object
 */
export const getDetectionStats = (detections) => {
  if (!detections.length) {
    return {
      totalUploads: 0,
      totalDetections: 0,
      averageConfidence: 0,
      detectionsByType: {},
      cleanImages: 0
    };
  }

  const totalUploads = detections.length;
  const totalDetections = detections.reduce((sum, detection) => 
    sum + (detection.detections?.length || 0), 0);
  
  const allDetections = detections.flatMap(d => d.detections || []);
  const averageConfidence = allDetections.length > 0 
    ? allDetections.reduce((sum, det) => sum + det.confidence, 0) / allDetections.length
    : 0;

  const detectionsByType = allDetections.reduce((acc, detection) => {
    acc[detection.type] = (acc[detection.type] || 0) + 1;
    return acc;
  }, {});

  const cleanImages = detections.filter(d => !d.detections?.length).length;

  return {
    totalUploads,
    totalDetections,
    averageConfidence: Math.round(averageConfidence * 100),
    detectionsByType,
    cleanImages
  };
};

export default {
  uploadForDetection,
  mockDetection,
  validateFile,
  saveDetectionResult,
  getSavedDetections,
  clearSavedDetections,
  getDetectionStats
};