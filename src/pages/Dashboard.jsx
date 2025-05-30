// Dashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Divider } from 'primereact/divider';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet icon loading for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Constants
const API_ENDPOINT = 'http://localhost:5000/analyze';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

const roadTypes = [
  { name: 'Highway', value: 'highway', color: 'bg-red-100 text-red-800' },
  { name: 'Primary Road', value: 'primary', color: 'bg-orange-100 text-orange-800' },
  { name: 'Secondary Road', value: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Tertiary Road', value: 'tertiary', color: 'bg-green-100 text-green-800' },
  { name: 'Residential', value: 'residential', color: 'bg-blue-100 text-blue-800' },
  { name: 'Unpaved', value: 'unpaved', color: 'bg-gray-100 text-gray-800' }
];

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776030.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Helper Functions
const getColorForLabel = (label) => {
  const normalized = label?.toLowerCase() || '';
  if (normalized.includes('major')) return 'red';
  if (normalized.includes('minor')) return 'orange';
  return 'green';
};

const renderStars = (count) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <i 
          key={i} 
          className={`pi ${i < count ? 'pi-star-fill text-yellow-500' : 'pi-star text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// Components
const LocationMarker = ({ points, setPoints, selectionMode, allData, setModalData, setCoordinatePopup }) => {
  useMapEvents({
    click(e) {
      if (selectionMode === 'single') {
        setPoints([e.latlng]);
      } else {
        if (points.length < 2) {
          setPoints([...points, e.latlng]);
        } else {
          setPoints([points[0], e.latlng]);
        }
      }
      setCoordinatePopup({
        visible: true,
        position: e.latlng,
        content: `Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`
      });
    },
  });

  const handleMarkerClick = (entry) => {
    setModalData(entry);
  };

  return (
    <>
      {points.length > 0 && (
        <Marker position={points[0]} icon={startIcon}>
          <Popup className="font-sans">
            <div className="text-sm font-medium">Start Point</div>
            <div className="text-xs">Lat: {points[0].lat.toFixed(6)}</div>
            <div className="text-xs">Lng: {points[0].lng.toFixed(6)}</div>
          </Popup>
        </Marker>
      )}
      {points.length > 1 && (
        <>
          <Marker position={points[1]} icon={endIcon}>
            <Popup className="font-sans">
              <div className="text-sm font-medium">End Point</div>
              <div className="text-xs">Lat: {points[1].lat.toFixed(6)}</div>
              <div className="text-xs">Lng: {points[1].lng.toFixed(6)}</div>
            </Popup>
          </Marker>
          <Polyline 
            positions={points} 
            color="#3B82F6" 
            weight={4}
            dashArray="5, 5"
          />
        </>
      )}
      {allData.map((entry, i) => (
        <Marker
          key={i}
          position={[entry.location.lat, entry.location.lng]}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="background:${getColorForLabel(entry.label)};width:20px;height:20px;border-radius:50%"></div>`,
          })}
          eventHandlers={{
            click: () => handleMarkerClick(entry),
          }}
        />
      ))}
    </>
  );
};

const CoordinatePopup = ({ popup, setCoordinatePopup }) => {
  if (!popup.visible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-200 flex items-center">
      <div className="mr-3">
        <i className="pi pi-map-marker text-blue-500"></i>
      </div>
      <div>
        <p className="text-sm font-medium">{popup.content}</p>
      </div>
      <button 
        className="ml-3 text-gray-500 hover:text-gray-700"
        onClick={() => setCoordinatePopup({...popup, visible: false})}
      >
        <i className="pi pi-times"></i>
      </button>
    </div>
  );
};

const DetectionModal = ({ modalData, setModalData }) => {
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('detection-modal-overlay')) {
      setModalData(null);
    }
  };

  if (!modalData) return null;

  return (
    <div className="detection-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         onClick={handleBackgroundClick}>
      <div className="detection-modal bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-auto">
        <button className="close-btn absolute top-4 right-4 text-2xl" 
                onClick={() => setModalData(null)}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{modalData.label}</h2>
        {modalData.image_url && (
          <img
            src={modalData.image_url}
            alt={modalData.label}
            className="modal-image w-full h-auto mb-4 rounded"
          />
        )}
        <p className="mb-2">
          <strong className="font-medium">Location: </strong>
          {modalData.location ? `${modalData.location.lat.toFixed(6)}, ${modalData.location.lng.toFixed(6)}` : "Unknown"}
        </p>
        <p className="mb-2">
          <strong className="font-medium">Detected At: </strong>
          {modalData.created_at || "Unknown"}
        </p>
        {modalData.confidence && (
          <p className="mb-2">
            <strong className="font-medium">Confidence: </strong>
            {Math.round(modalData.confidence * 100)}%
          </p>
        )}
      </div>
    </div>
  );
};

const FileUploadTemplate = {
  item: (file, props) => (
    <div className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 bg-white hover:bg-gray-50 transition-colors">
      <div className="relative flex-shrink-0">
        <img 
          alt={file.name} 
          src={file.objectURL} 
          className="w-16 h-16 object-cover rounded"
        />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
          {props.formatSize}
        </span>
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{file.type.split('/')[1]?.toUpperCase()}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {Math.floor(Math.random() * 1000)}m resolution
          </span>
        </div>
      </div>
      <Button
        type="button"
        icon="pi pi-times"
        className="p-button-text p-button-rounded p-button-danger"
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove(e);
        }}
        tooltip="Remove"
        tooltipOptions={{ position: 'left' }}
      />
    </div>
  ),
  empty: () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <i className="pi pi-cloud-upload text-4xl text-blue-500 mb-3"></i>
      <p className="font-medium text-gray-700">Drag & drop road images here</p>
      <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
      <p className="text-xs text-gray-400 mt-3">Supports JPG, PNG up to 5MB</p>
    </div>
  )
};

// Main Component
const RoadAnalyzerDashboard = () => {
  // State
  const [images, setImages] = useState([]);
  const [points, setPoints] = useState([]);
  const [selectionMode, setSelectionMode] = useState('single');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [mapHeight, setMapHeight] = useState('400px');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [allData, setAllData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [coordinatePopup, setCoordinatePopup] = useState({
    visible: false,
    position: null,
    content: ''
  });
  
  // Refs
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setMapHeight(window.innerWidth < 768 ? '300px' : '400px');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setModalData(null);
        setCoordinatePopup({...coordinatePopup, visible: false});
      }
    }
    if (modalData || coordinatePopup.visible) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [modalData, coordinatePopup.visible]);

  // Event Handlers
  const onUpload = (e) => {
    setImages(e.files);
    showToast('success', 'Upload Successful', `${e.files.length} images added`);
  };

  const onTemplateRemove = (file, callback) => {
    callback();
    const newImages = images.filter(f => f.name !== file.name);
    setImages(newImages);
    showToast('warn', 'Removed', `${file.name} was removed (${newImages.length} remaining)`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast('warn', 'Search Error', 'Please enter a location to search');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${NOMINATIM_API}?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`);
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length > 0) {
        const firstResult = data[0];
        const newCenter = {
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon)
        };
        
        if (mapRef.current) {
          mapRef.current.flyTo(newCenter, 14);
        }
        
        showToast('success', 'Location Found', `Showing results for ${firstResult.display_name}`);
      } else {
        showToast('info', 'No Results', 'No locations found for your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('error', 'Search Error', 'Failed to search for location');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result) => {
    const newCenter = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
    
    if (mapRef.current) {
      mapRef.current.flyTo(newCenter, 16);
    }
    
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleAnalyze = async () => {
    if (!validateAnalysisInputs()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);
    
    try {
      const results = await analyzeImages();
      if (results.length > 0) {
        processAnalysisResults(results);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      showToast('error', 'Analysis Error', 'Failed to complete analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateAnalysisInputs = () => {
    if (images.length === 0) {
      showToast('error', 'Error', 'Please upload at least one image');
      return false;
    }

    if (points.length === 0) {
      showToast('error', 'Error', 'Please select at least one point on the map');
      return false;
    }

    if (selectionMode === 'both' && points.length < 2) {
      showToast('error', 'Error', 'Please select both start and end points');
      return false;
    }

    return true;
  };

  const analyzeImages = async () => {
    const coords = selectionMode === 'single' ? points[0] : points[0];
    const results = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      try {
        const data = await analyzeSingleImage(file, coords);
        if (data) {
          results.push(data);
          setProgress(((i + 1) / images.length) * 100);
        }
      } catch (error) {
        console.error(`Error analyzing image ${file.name}:`, error);
      }
    }

    return results;
  };

  const analyzeSingleImage = async (file, coords) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('lat', coords.lat);
    formData.append('lng', coords.lng);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      showToast('error', 'Analysis Error', error.message || 'Failed to analyze image');
      return null;
    }
  };

  const processAnalysisResults = (results) => {
    const randomRoadType = roadTypes[Math.floor(Math.random() * roadTypes.length)];
    const result = {
      ...results[0],
      roadType: randomRoadType,
      quality: Math.floor(Math.random() * 5) + 1,
      length: (Math.random() * 10 + 1).toFixed(2),
      condition: Math.random() > 0.5 ? 'Good' : 'Needs Maintenance',
      features: [
        Math.random() > 0.5 ? 'Markings Visible' : 'Faded Markings',
        Math.random() > 0.5 ? 'No Potholes' : 'Some Potholes',
        Math.random() > 0.5 ? 'Clear Shoulders' : 'Narrow Shoulders'
      ].filter((_, i) => i < 2 || Math.random() > 0.5),
      imagesAnalyzed: images.length,
      coordinates: points
    };
    
    setAnalysisResult(result);
    setAllData(prev => [...prev, ...results]);
    setPredictions(prev => [...prev, ...results.map(r => r.label)]);
    showAnalysisComplete(result);
  };

  // UI Helpers
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const showAnalysisComplete = (result) => {
    showToast('success', 'Analysis Complete!', 
      <div className="space-y-1">
        <p>{result.imagesAnalyzed} images analyzed</p>
        <p>Road Type: {result.roadType.name}</p>
        <p>Condition: {result.condition}</p>
      </div>
    );
  };

  const clearAllData = () => {
    setImages([]);
    setPoints([]);
    setAnalysisResult(null);
    setAllData([]);
    setPredictions([]);
    setSearchQuery('');
    setSearchResults([]);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
    showToast('info', 'Cleared', 'All data has been reset');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toast ref={toast} position="top-right" />
      
      <DetectionModal modalData={modalData} setModalData={setModalData} />
      <CoordinatePopup popup={coordinatePopup} setCoordinatePopup={setCoordinatePopup} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SmartRoads System</h1>
          <p className="text-gray-600">Upload road images, select points, and analyze road conditions</p>
        </header>

        {/* Project Setup Card */}
        <Card className="mb-6 shadow-sm rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <InputText 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                placeholder="Road Analysis Project"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Analysis Mode</label>
              <Dropdown 
                options={[
                  {name: 'Basic Road Analysis', value: 'basic'},
                  {name: 'Advanced Pavement Analysis', value: 'pavement'},
                  {name: 'Traffic Flow Estimation', value: 'traffic'}
                ]} 
                placeholder="Select Analysis Type"
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button 
                label="Save Project" 
                icon="pi pi-save" 
                className="p-button-outlined w-full"
              />
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          <TabPanel header="Data Input">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Image Upload Section */}
              <Card className="shadow-sm rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Road Images</h2>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </span>
                </div>
                
                <FileUpload
                  ref={fileUploadRef}
                  name="image"
                  url="http://localhost:5000/upload"
                  multiple
                  accept="image/*"
                  maxFileSize={5000000}
                  onUpload={onUpload}
                  onRemove={onTemplateRemove}
                  onError={() => showToast('error', 'Upload Error', 'Failed to upload files')}
                  emptyTemplate={FileUploadTemplate.empty}
                  itemTemplate={FileUploadTemplate.item}
                  chooseOptions={{
                    icon: 'pi pi-images',
                    iconOnly: false,
                    className: 'p-button-outlined p-button-primary',
                    label: 'Browse Files'
                  }}
                  uploadOptions={{
                    icon: 'pi pi-cloud-upload',
                    iconOnly: false,
                    className: 'p-button-success',
                    label: 'Upload All',
                    disabled: images.length === 0
                  }}
                  cancelOptions={{
                    icon: 'pi pi-times',
                    iconOnly: false,
                    className: 'p-button-danger',
                    label: 'Clear All',
                    disabled: images.length === 0
                  }}
                  className="w-full"
                />
              </Card>

              {/* Map Section */}
              <Card className="shadow-sm rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Road Segment Selection</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Mode:</span>
                    <ToggleButton 
                      onLabel="Two Points" 
                      offLabel="Single Point" 
                      onIcon="pi pi-map-marker" 
                      offIcon="pi pi-map-marker"
                      checked={selectionMode === 'both'} 
                      onChange={(e) => {
                        setSelectionMode(e.value ? 'both' : 'single');
                        if (!e.value) {
                          setPoints(points.slice(0, 1));
                        }
                      }} 
                      className="w-32"
                    />
                  </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <InputText
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a location..."
                    className="w-full pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <Button
                    icon="pi pi-search"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-button-text"
                    onClick={handleSearch}
                    loading={isSearching}
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {searchResults.map((result, i) => (
                        <div
                          key={i}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSearchResultClick(result)}
                        >
                          <p className="font-medium">{result.display_name}</p>
                          <p className="text-xs text-gray-500">{result.type}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative z-0" style={{ height: mapHeight }}>
                  <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker 
                      points={points} 
                      setPoints={setPoints} 
                      selectionMode={selectionMode}
                      allData={allData}
                      setModalData={setModalData}
                      setCoordinatePopup={setCoordinatePopup}
                    />
                  </MapContainer>
                  
                  <div className="absolute bottom-4 left-4 z-[1000] flex space-x-2">
                    <Button 
                      icon="pi pi-crosshairs" 
                      className="p-button-rounded p-button-text bg-white shadow"
                      tooltip="Use current location"
                      tooltipOptions={{ position: 'right' }}
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const newPos = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                          };
                          if (selectionMode === 'single') {
                            setPoints([newPos]);
                          } else {
                            if (points.length === 0) {
                              setPoints([newPos]);
                            } else {
                              setPoints([points[0], newPos]);
                            }
                          }
                          mapRef.current.flyTo(newPos, 15);
                        });
                      }}
                    />
                    <Button 
                      icon="pi pi-trash" 
                      className="p-button-rounded p-button-text bg-white shadow"
                      tooltip="Clear points"
                      tooltipOptions={{ position: 'right' }}
                      onClick={() => setPoints([])}
                      disabled={points.length === 0}
                    />
                  </div>
                </div>
                
                {points.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Start Point</p>
                        <p className="font-mono text-sm">
                          {points[0].lat.toFixed(6)}, {points[0].lng.toFixed(6)}
                        </p>
                      </div>
                      {points.length > 1 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">End Point</p>
                          <p className="font-mono text-sm">
                            {points[1].lat.toFixed(6)}, {points[1].lng.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button 
                      label="Copy Coordinates" 
                      icon="pi pi-copy" 
                      className="p-button-text p-button-sm w-full text-blue-600"
                      onClick={() => {
                        const coords = points.map(p => `${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`).join(' to ');
                        navigator.clipboard.writeText(coords);
                        showToast('info', 'Copied!', 'Coordinates copied to clipboard');
                      }}
                    />
                  </div>
                )}
              </Card>
            </div>
          </TabPanel>
          
          <TabPanel header="Analysis Results">
            {analysisResult ? (
              <div className="mt-4 space-y-6">
                <Card className="shadow-sm rounded-xl border border-gray-100">
                  <h3 className="font-medium text-lg mb-4">Road Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Road Type</p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${analysisResult.roadType.color}`}>
                        {analysisResult.roadType.name}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Quality Rating</p>
                      <div className="mt-1">
                        {renderStars(analysisResult.quality)}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Estimated Length</p>
                      <p className="text-xl font-semibold mt-1">{analysisResult.length} km</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="shadow-sm rounded-xl border border-gray-100">
                  <h3 className="font-medium text-lg mb-4">Detailed Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Condition Assessment</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Condition</span>
                          <span className={`text-sm font-medium ${
                            analysisResult.condition === 'Good' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {analysisResult.condition}
                          </span>
                        </div>
                        <ProgressBar 
                          value={analysisResult.condition === 'Good' ? 80 : 35} 
                          showValue={false}
                          className="h-2"
                          color={analysisResult.condition === 'Good' ? '#10B981' : '#F59E0B'}
                        />
                      </div>
                      
                      <Divider />
                      
                      <h4 className="font-medium text-gray-700 mb-2">Key Features</h4>
                      <ul className="space-y-2">
                        {analysisResult.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Visual Summary</h4>
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center p-4">
                          <i className="pi pi-image text-4xl text-gray-400 mb-2"></i>
                          <p className="text-gray-500">Road analysis visualization</p>
                          <p className="text-xs text-gray-400 mt-1">{images.length} images processed</p>
                        </div>
                      </div>
                      
                      <Divider />
                      
                      <div className="space-y-2">
                        <Button 
                          label="Export Report" 
                          icon="pi pi-file-pdf" 
                          className="p-button-outlined w-full"
                        />
                        <Button 
                          label="View on Map" 
                          icon="pi pi-map" 
                          className="p-button-outlined w-full"
                          onClick={() => {
                            setActiveTab(0);
                            if (points.length > 0 && mapRef.current) {
                              mapRef.current.flyTo(points[0], 15);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Predictions Summary */}
                {predictions.length > 0 && (
                  <Card className="shadow-sm rounded-xl border border-gray-100">
                    <h3 className="font-medium text-lg mb-4">Detections Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Total Detections</p>
                        <p className="text-xl font-semibold mt-1">{predictions.length}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Major Issues</p>
                        <p className="text-xl font-semibold mt-1">
                          {predictions.filter(p => p.toLowerCase().includes('major')).length}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Minor Issues</p>
                        <p className="text-xl font-semibold mt-1">
                          {predictions.filter(p => p.toLowerCase().includes('minor')).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <i className="pi pi-chart-bar text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Analysis Results</h3>
                <p className="text-gray-500 max-w-md">
                  Run an analysis first to see detailed results about the road conditions and characteristics.
                </p>
                <Button 
                  label="Go to Data Input" 
                  icon="pi pi-arrow-left" 
                  className="p-button-text mt-4"
                  onClick={() => setActiveTab(0)}
                />
              </div>
            )}
          </TabPanel>
        </TabView>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {images.length} {images.length === 1 ? 'image' : 'images'} selected
              </span>
              {points.length > 0 && (
                <span className="text-sm font-medium text-gray-700">
                  • {points.length} {points.length === 1 ? 'point' : 'points'} selected
                </span>
              )}
              {allData.length > 0 && (
                <span className="text-sm font-medium text-gray-700">
                  • {allData.length} {allData.length === 1 ? 'detection' : 'detections'} found
                </span>
              )}
            </div>
            
            <div className="flex space-x-3 w-full md:w-auto">
              <Button 
                label="Clear All" 
                icon="pi pi-trash" 
                className="p-button-outlined p-button-danger"
                onClick={clearAllData}
                disabled={(images.length === 0 && points.length === 0 && allData.length === 0) || isAnalyzing}
              />
              <Button 
                label={isAnalyzing ? `Analyzing (${progress}%)` : 'Analyze'} 
                icon={isAnalyzing ? 'pi pi-spinner pi-spin' : 'pi pi-play'} 
                className="p-button-primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing || images.length === 0 || points.length === 0 || 
                  (selectionMode === 'both' && points.length < 2)}
              />
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="mt-2">
              <ProgressBar 
                value={progress} 
                showValue={false} 
                className="h-2" 
                color={progress < 50 ? '#3B82F6' : progress < 80 ? '#8B5CF6' : '#10B981'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadAnalyzerDashboard;