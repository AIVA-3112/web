import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Scan, AlertCircle } from 'lucide-react';
import { cardAPI } from '../utils/api';

const CardScanning: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsScanning(true);
      setError(null);
      setLoading(true);
      
      // Call the real API to scan the card
      const result = await cardAPI.scanCard(file);
      
      // Set the scanned data
      setScannedData(result.cardData);
      setIsScanning(false);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to scan card: ' + (err.message || 'Unknown error'));
      setIsScanning(false);
      setLoading(false);
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err: any) {
      setError('Failed to access camera: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            handleFileUpload(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold text-white">Card Scanning</h1>
        </div>

        {/* Card Scanning Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Scan ID/Passport Card</h2>
              <p className="text-gray-600">Upload or capture an image of your ID/passport for automatic data extraction</p>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Camera Section */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center text-lg">
                  <Camera className="mr-2 h-5 w-5" />
                  Scan with Camera
                </h3>
                
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    {streamRef.current ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Camera className="mx-auto h-12 w-12 mb-2" />
                        <p>Camera feed will appear here</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    {!streamRef.current ? (
                      <button
                        onClick={startCamera}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </button>
                    ) : (
                      <button
                        onClick={captureImage}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium"
                      >
                        <Scan className="mr-2 h-4 w-4" />
                        Capture & Scan
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Upload Section */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center text-lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Card Image
                </h3>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={triggerFileSelect}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1 font-medium">Click to upload card image</p>
                  <p className="text-sm text-gray-500">Supports JPG, PNG, PDF (Max 10MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Scanning Indicator */}
            {isScanning && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-700 font-medium">Scanning card with Azure Document Intelligence...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Scanned Data Form */}
        {scannedData && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Scan className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Scanned Card Data</h2>
                <p className="text-gray-600">Review and edit the extracted information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={scannedData.name || ''}
                  onChange={(e) => setScannedData({...scannedData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                <input
                  type="text"
                  value={scannedData.passportNumber || ''}
                  onChange={(e) => setScannedData({...scannedData, passportNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value={scannedData.nationality || ''}
                  onChange={(e) => setScannedData({...scannedData, nationality: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                <input
                  type="text"
                  value={scannedData.sex || ''}
                  onChange={(e) => setScannedData({...scannedData, sex: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={scannedData.birthDate || ''}
                  onChange={(e) => setScannedData({...scannedData, birthDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={scannedData.expiryDate || ''}
                  onChange={(e) => setScannedData({...scannedData, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Display any additional fields that were extracted */}
              {Object.entries(scannedData).map(([key, value]) => {
                // Skip the fields we've already displayed
                if (['name', 'passportNumber', 'nationality', 'sex', 'birthDate', 'expiryDate'].includes(key)) {
                  return null;
                }
                
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={value as string || ''}
                      onChange={(e) => setScannedData({...scannedData, [key]: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex space-x-3">
              <button
                onClick={() => setScannedData(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardScanning;