import React, { useState, useRef } from 'react';
import { Upload, Camera, BarChart3, History, Eye, MapPin, Trash2, TreePine, Leaf } from 'lucide-react';

const CleanSight = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploads, setUploads] = useState([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Mock detection data for demonstration
  const mockDetections = [
    { id: 1, type: 'plastic_bottle', confidence: 0.92, bbox: [120, 80, 180, 220] },
    { id: 2, type: 'cigarette_butt', confidence: 0.85, bbox: [300, 150, 320, 180] },
    { id: 3, type: 'food_wrapper', confidence: 0.78, bbox: [200, 300, 280, 340] }
  ];

  const mockHeatmapData = [
    { location: 'Shimla Ridge', lat: 31.1048, lng: 77.1734, detections: 15 },
    { location: 'Manali Mall Road', lat: 32.2396, lng: 77.1887, detections: 8 },
    { location: 'Nainital Lake', lat: 29.3803, lng: 79.4636, detections: 12 },
    { location: 'Ooty Botanical Garden', lat: 11.4064, lng: 76.6932, detections: 6 },
    { location: 'Darjeeling Tiger Hill', lat: 27.0238, lng: 88.2636, detections: 20 }
  ];

  const handleFileUpload = async (files) => {
    setProcessing(true);
    
    for (const file of files) {
      const newUpload = {
        id: Date.now() + Math.random(),
        file: file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        uploadTime: new Date(),
        status: 'processing',
        detections: [],
        stats: { totalDetections: 0, confidence: 0 }
      };
      
      setUploads(prev => [newUpload, ...prev]);
      
      // Simulate API call to YOLO backend
      setTimeout(() => {
        const processedUpload = {
          ...newUpload,
          status: 'completed',
          detections: mockDetections,
          stats: {
            totalDetections: mockDetections.length,
            confidence: Math.round(mockDetections.reduce((acc, det) => acc + det.confidence, 0) / mockDetections.length * 100)
          }
        };
        
        setUploads(prev => prev.map(upload => 
          upload.id === newUpload.id ? processedUpload : upload
        ));
      }, 2000);
    }
    
    setProcessing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const DetectionOverlay = ({ upload }) => (
    <div className="relative">
      {upload.type === 'image' ? (
        <img src={upload.url} alt="Upload" className="w-full h-48 object-cover rounded-lg" />
      ) : (
        <video src={upload.url} className="w-full h-48 object-cover rounded-lg" controls />
      )}
      
      {upload.status === 'completed' && upload.detections.length > 0 && (
        <svg className="absolute inset-0 w-full h-48" viewBox="0 0 400 300">
          {upload.detections.map(detection => (
            <g key={detection.id}>
              <rect
                x={detection.bbox[0]}
                y={detection.bbox[1]}
                width={detection.bbox[2] - detection.bbox[0]}
                height={detection.bbox[3] - detection.bbox[1]}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                className="animate-pulse"
              />
              <rect
                x={detection.bbox[0]}
                y={detection.bbox[1] - 25}
                width="120"
                height="20"
                fill="#ef4444"
                rx="3"
              />
              <text
                x={detection.bbox[0] + 5}
                y={detection.bbox[1] - 10}
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {detection.type} {Math.round(detection.confidence * 100)}%
              </text>
            </g>
          ))}
        </svg>
      )}
      
      {upload.status === 'processing' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Analyzing...</p>
          </div>
        </div>
      )}
    </div>
  );

  const UploadTab = () => (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center transition-colors hover:border-green-400 hover:bg-green-50"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Images or Videos</h3>
        <p className="text-gray-600 mb-4">Drop files here or click to browse</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto gap-2">
          <Camera className="h-4 w-4" />
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />
      </div>

      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Detections
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uploads.slice(0, 6).map(upload => (
              <div key={upload.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
                <DetectionOverlay upload={upload} />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {upload.uploadTime.toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      upload.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      upload.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {upload.status}
                    </span>
                  </div>
                  {upload.status === 'completed' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {upload.stats.totalDetections} items detected
                      </span>
                      <span className="text-green-600 font-semibold">
                        {upload.stats.confidence}% avg confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="h-6 w-6" />
          Detection History
        </h2>
        <div className="text-sm text-gray-600">
          Total uploads: {uploads.length}
        </div>
      </div>

      {uploads.length === 0 ? (
        <div className="text-center py-12">
          <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No uploads yet</h3>
          <p className="text-gray-400">Start by uploading some images or videos for analysis</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {uploads.map(upload => (
            <div key={upload.id} className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
              <DetectionOverlay upload={upload} />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {upload.type === 'video' ? 'Video' : 'Image'} Analysis
                  </h4>
                  <span className="text-xs text-gray-500">
                    {upload.uploadTime.toLocaleString()}
                  </span>
                </div>
                
                {upload.status === 'completed' && upload.detections.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Detections:</span>
                      <span className="font-semibold">{upload.stats.totalDetections}</span>
                    </div>
                    <div className="space-y-1">
                      {upload.detections.map(detection => (
                        <div key={detection.id} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">
                            {detection.type.replace('_', ' ')}
                          </span>
                          <span className="text-green-600 font-medium">
                            {Math.round(detection.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {upload.status === 'completed' && upload.detections.length === 0 && (
                  <div className="text-center text-green-600 text-sm">
                    ✓ No litter detected - Clean area!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const InsightsTab = () => {
    const totalDetections = uploads.reduce((acc, upload) => acc + upload.stats.totalDetections, 0);
    const avgConfidence = uploads.length > 0 ? 
      Math.round(uploads.reduce((acc, upload) => acc + upload.stats.confidence, 0) / uploads.length) : 0;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Insights & Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8" />
              <div>
                <p className="text-green-100">Total Detections</p>
                <p className="text-3xl font-bold">{totalDetections}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8" />
              <div>
                <p className="text-blue-100">Total Uploads</p>
                <p className="text-3xl font-bold">{uploads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              <div>
                <p className="text-purple-100">Avg Confidence</p>
                <p className="text-3xl font-bold">{avgConfidence}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Litter Hotspots Heatmap
          </h3>
          
          <div className="space-y-3">
            {mockHeatmapData.map((spot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" style={{
                    opacity: Math.min(spot.detections / 20, 1)
                  }}></div>
                  <div>
                    <h4 className="font-medium text-gray-800">{spot.location}</h4>
                    <p className="text-sm text-gray-600">
                      Lat: {spot.lat.toFixed(4)}, Lng: {spot.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{spot.detections}</p>
                  <p className="text-xs text-gray-500">detections</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Areas with higher detection counts may need increased cleaning efforts or better waste disposal facilities.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detection Types</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['plastic_bottle', 'cigarette_butt', 'food_wrapper', 'paper_trash'].map((type, index) => {
              const count = uploads.reduce((acc, upload) => 
                acc + upload.detections.filter(det => det.type === type).length, 0);
              return (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Trash2 className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">CleanSight</h1>
                <p className="text-xs text-gray-600">AI-Powered Litter Detection</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TreePine className="h-5 w-5" />
              <span className="text-sm font-medium">Protecting Nature</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'upload', label: 'Upload & Detect', icon: Upload },
              { id: 'history', label: 'Detection History', icon: History },
              { id: 'insights', label: 'Insights', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'insights' && <InsightsTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2 text-sm">
              <Leaf className="h-4 w-4 text-green-500" />
              CleanSight - Making tourism spots cleaner, one detection at a time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanSight;