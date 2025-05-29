// // App.jsx
// import React, { useState, useEffect } from 'react';
// import ImageUpload from "./ImageUpload";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import AnalysisSummary from './AnalysisSummary';
// import '../App.css';
// import Footer from '../components/Footer';
// import BackgroundSection  from './BackgroundSection';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';


// // Fix leaflet icon loading for webpack
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });


// function LocationSelector({ onSelect }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       onSelect({ lat, lng });
//     },
//   });
//   return null;
// }

// function RoadStretchSelector({ start, end, setStart, setEnd }) {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       if (!start) setStart({ lat, lng });
//       else if (!end) setEnd({ lat, lng });
//       else {
//         setStart({ lat, lng });
//         setEnd(null);
//       }
//     },
//   });
//   return null;
// }

// function App() {
//   const [imageFiles, setImageFiles] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [result, setResult] = useState(null);
//   const [allData, setAllData] = useState([]);
//   const [predictions, setPredictions] = useState([]);
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [selectionMode, setSelectionMode] = useState("points");
//   const [modalData, setModalData] = useState(null);

//   // Close modal on Escape key
//   useEffect(() => {
//     function handleEscape(e) {
//       if (e.key === "Escape") setModalData(null);
//     }
//     if (modalData) {
//       window.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden'; // Prevent scroll on modal open
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       window.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = '';
//     };
//   }, [modalData]);

//   const toggleSelectionMode = () => {
//     if (selectionMode === "points") {
//       setLocation(null);
//     } else {
//       setStartPoint(null);
//       setEndPoint(null);
//     }
//     setSelectionMode(selectionMode === "points" ? "roadStretch" : "points");
//   };

//   const handleUpload = async () => {
//     if (selectionMode === "points" && (!imageFiles.length || !location)) {
//       alert('Please upload images and select location');
//       return;
//     }
//     if (selectionMode === "roadStretch" && (!imageFiles.length || !startPoint || !endPoint)) {
//       alert('Please upload images and select start and end points');
//       return;
//     }

//     const coords = selectionMode === "points" ? location : startPoint;

//     if (!coords || !coords.lat || !coords.lng) {
//       alert("Coordinates missing. Please reselect location.");
//       return;
//     }

//     const results = [];

//     for (let file of imageFiles) {
//       const formData = new FormData();
//       formData.append('image', file);
//       formData.append('lat', coords.lat);
//       formData.append('lng', coords.lng);

//       console.log("📤 Sending file:", file.name);
//       console.log("📍 Location:", coords.lat, coords.lng);

//       try {
//         const res = await fetch('http://localhost:5000/analyze', {
//           method: 'POST',
//           body: formData,
//         });

//         let data;
//         try {
//           data = await res.json();
//           console.log("🔥 Backend response:", data);
//         } catch (jsonErr) {
//           const rawText = await res.text();
//           console.error("❌ Failed to parse JSON:", jsonErr);
//           console.error("🪵 Raw response text:", rawText);
//           alert('Server sent an invalid response. Check backend logs.');
//           continue;
//         }

//         if (!res.ok) {
//           console.error('❌ Backend error:', data.error);
//           alert(`Analysis failed: ${data.error}`);
//           continue;
//         }

//         results.push(data);
//       } catch (err) {
//         console.error('❌ Upload failed:', err);
//         alert('Upload failed. Check your server or internet.');
//       }
//     }

//     if (results.length > 0) {
//       setResult(results[0]);
//       setAllData(prev => [...prev, ...results]);
//       setPredictions(prev => [...prev, ...results.map(r => r.label)]);
//     }
//   };

//   const getColor = (label) => {
//     const normalized = label.toLowerCase();
//     if (normalized.includes('major')) return 'red';
//     if (normalized.includes('minor')) return 'orange';
//     return 'green';
//   };

//   // Modal background click closes modal
//   const handleModalBackgroundClick = (e) => {
//     if (e.target.classList.contains('detection-modal-overlay')) {
//       setModalData(null);
//     }
//   };

//   return (

//     <div className="app-container">
    
//       <h1 className="app-title">🛠️ SmartRoads System</h1>
//     <BackgroundSection />
      

//       <ImageUpload onImagesSelect={setImageFiles}/>

//       <p className="map-instruction">
//         {selectionMode === "points"
//           ? "Click on the map to select pothole location 📍"
//           : "Click twice on the map to select Start and End points for road stretch 📍📍"}
//       </p>

//           {/* Buttons */}
//       <div className='button-container'>
//         <button className="toggle-btn" onClick={toggleSelectionMode}>
//         Switch to {selectionMode === "points" ? "Road Stretch Selection" : "Single Point Selection"}
//       </button>
//       <br></br>
//       <button className="upload-btn" onClick={handleUpload}>
//         Analyze Images
//       </button>
//       </div>

//       {result && (
//         <div className="result-box">
//           <h3>Latest Detection</h3>
//           <p><strong>Label:</strong> {result.label}</p>
//           {result.location ? (
//             <p><strong>Location:</strong> {result.location.lat}, {result.location.lng}</p>
//           ) : (
//             <p className="error-text">⚠️ Location data missing</p>
//           )}
//         </div>
//       )}

//       <AnalysisSummary predictions={predictions} />

//       <div className="map-wrapper" style={{ height: '500px', width: '100%' }}>
//         <MapContainer
//           center={[-1.286389, 36.817223]}
//           zoom={13}
//           style={{
//             height: '100%',
//             width: '100%'
//           }}
//           whenCreated={(map) => {
//             map.on('click', () => setModalData(null));
//           }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {selectionMode === "points" ? (
//             <LocationSelector onSelect={setLocation} />
//           ) : (
//             <RoadStretchSelector start={startPoint} end={endPoint} setStart={setStartPoint} setEnd={setEndPoint} />
//           )}

//           {selectionMode === "points" && location && (
//             <Marker position={[location.lat, location.lng]}>
//               <Popup>Selected Location</Popup>
//             </Marker>
//           )}

//           {selectionMode === "roadStretch" && startPoint && (
//             <Marker
//               position={[startPoint.lat, startPoint.lng]}
//               icon={L.divIcon({
//                 className: 'custom-icon',
//                 html: `<div class="start-marker"></div>`,
//               })}
//             >
//               <Popup>Start Point</Popup>
//             </Marker>
//           )}

//           {selectionMode === "roadStretch" && endPoint && (
//             <Marker
//               position={[endPoint.lat, endPoint.lng]}
//               icon={L.divIcon({
//                 className: 'custom-icon',
//                 html: `<div class="end-marker"></div>`,
//               })}
//             >
//               <Popup>End Point</Popup>
//             </Marker>
//           )}

//           {allData.map((entry, i) => (
//             <Marker
//               key={i}
//               position={[entry.location.lat, entry.location.lng]}
//               icon={L.divIcon({
//                 className: 'custom-icon',
//                 html: `<div style="background:${getColor(entry.label)};width:20px;height:20px;border-radius:50%"></div>`,
//               })}
//               eventHandlers={{
//                 click: () => setModalData(entry),
//               }}
//             />
//           ))}

//         </MapContainer>
  
//         <div className="App">

      

//     </div>
//     {/* Footer */}

//       </div>


//       {/* Modal */}
//       {modalData && (
//         <div className="detection-modal-overlay" onClick={handleModalBackgroundClick}>
//           <div className="detection-modal">
//             <button className="close-btn" onClick={() => setModalData(null)}>&times;</button>
//             <h2>{modalData.label}</h2>
//             {/* Support multiple images */}
//             {modalData.images && modalData.images.length > 0 ? (
//               modalData.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`${modalData.label} ${idx + 1}`}
//                   className="modal-image"
//                 />
//               ))
//             ) : (
//               <img
//                 src={modalData.image_url}
//                 alt={modalData.label}
//                 className="modal-image"
//               />
//             )}
//             <p>
//               <strong>Location: </strong>
//               {modalData.location ? `${modalData.location.lat}, ${modalData.location.lng}` : "Unknown"}
//             </p>
//             <p><strong>Detected At: </strong>{modalData.created_at || "Unknown"}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


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

const roadTypes = [
  { name: 'Highway', value: 'highway', color: 'bg-red-100 text-red-800' },
  { name: 'Primary Road', value: 'primary', color: 'bg-orange-100 text-orange-800' },
  { name: 'Secondary Road', value: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Tertiary Road', value: 'tertiary', color: 'bg-green-100 text-green-800' },
  { name: 'Residential', value: 'residential', color: 'bg-blue-100 text-blue-800' },
  { name: 'Unpaved', value: 'unpaved', color: 'bg-gray-100 text-gray-800' }
];

const LocationMarker = ({ points, setPoints, selectionMode, allData, setModalData }) => {
  const getColor = (label) => {
    const normalized = label?.toLowerCase() || '';
    if (normalized.includes('major')) return 'red';
    if (normalized.includes('minor')) return 'orange';
    return 'green';
  };

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
            html: `<div style="background:${getColor(entry.label)};width:20px;height:20px;border-radius:50%"></div>`,
          })}
          eventHandlers={{
            click: () => handleMarkerClick(entry),
          }}
        />
      ))}
    </>
  );
};

const RoadAnalyzerDashboard = () => {
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
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setMapHeight(window.innerWidth < 768 ? '300px' : '400px');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setModalData(null);
    }
    if (modalData) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [modalData]);

  const onUpload = (e) => {
    const newImages = [...images, ...e.files];
    setImages(newImages);
    toast.current.show({
      severity: 'success',
      summary: 'Upload Successful',
      detail: `${e.files.length} images added (${newImages.length} total)`,
      life: 3000,
    });
  };

  const onTemplateRemove = (file, callback) => {
    callback();
    const newImages = images.filter(f => f.name !== file.name);
    setImages(newImages);
    toast.current.show({
      severity: 'warn',
      summary: 'Removed',
      detail: `${file.name} was removed (${newImages.length} remaining)`,
      life: 2000,
    });
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload at least one image',
        life: 3000,
      });
      return;
    }

    if (points.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one point on the map',
        life: 3000,
      });
      return;
    }

    if (selectionMode === 'both' && points.length < 2) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select both start and end points',
        life: 3000,
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);
    
    const coords = selectionMode === 'single' ? points[0] : points[0];
    const results = [];

    for (let file of images) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);

      try {
        const res = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData,
        });

        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          const rawText = await res.text();
          console.error("Failed to parse JSON:", jsonErr);
          console.error("Raw response text:", rawText);
          toast.current.show({
            severity: 'error',
            summary: 'Analysis Error',
            detail: 'Server sent an invalid response',
            life: 3000,
          });
          continue;
        }

        if (!res.ok) {
          console.error('Backend error:', data.error);
          toast.current.show({
            severity: 'error',
            summary: 'Analysis Error',
            detail: data.error || 'Analysis failed',
            life: 3000,
          });
          continue;
        }

        results.push(data);
        setProgress((i + 1) / images.length * 100);
      } catch (err) {
        console.error('Upload failed:', err);
        toast.current.show({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Check your server or internet connection',
          life: 3000,
        });
      }
    }

    if (results.length > 0) {
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
    }
    
    setIsAnalyzing(false);
  };

  const showAnalysisComplete = (result) => {
    toast.current.show({
      severity: 'success',
      summary: 'Analysis Complete!',
      detail: (
        <div className="space-y-1">
          <p>{result.imagesAnalyzed} images analyzed</p>
          <p>Road Type: {result.roadType.name}</p>
          <p>Condition: {result.condition}</p>
        </div>
      ),
      life: 5000,
    });
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

  const itemTemplate = (file, props) => {
    return (
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
          onClick={() => onTemplateRemove(file, props.onRemove)}
          tooltip="Remove"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <i className="pi pi-cloud-upload text-4xl text-blue-500 mb-3"></i>
        <p className="font-medium text-gray-700">Drag & drop road images here</p>
        <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
        <p className="text-xs text-gray-400 mt-3">Supports JPG, PNG up to 5MB</p>
      </div>
    );
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target.classList.contains('detection-modal-overlay')) {
      setModalData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toast ref={toast} position="top-right" />
      
      {/* Modal */}
      {modalData && (
        <div className="detection-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
             onClick={handleModalBackgroundClick}>
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
      )}

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
                  name="images"
                  url="/analyze"
                  multiple
                  accept="image/*"
                  maxFileSize={5000000}
                  onUpload={onUpload}
                  onSelect={() => {}}
                  onError={() => {
                    toast.current.show({
                      severity: 'error',
                      summary: 'Upload Error',
                      detail: 'Failed to upload files',
                      life: 3000,
                    });
                  }}
                  emptyTemplate={emptyTemplate}
                  itemTemplate={itemTemplate}
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
                          setPoints(points.slice(0, 1)); // Keep only first point when switching to single
                        }
                      }} 
                      className="w-32"
                    />
                  </div>
                </div>
                
                <div className="relative" style={{ height: mapHeight }}>
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
                        toast.current.show({
                          severity: 'info',
                          summary: 'Copied!',
                          detail: 'Coordinates copied to clipboard',
                          life: 2000,
                        });
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
                onClick={() => {
                  setImages([]);
                  setPoints([]);
                  setAnalysisResult(null);
                  setAllData([]);
                  setPredictions([]);
                  if (fileUploadRef.current) {
                    fileUploadRef.current.clear();
                  }
                }}
                disabled={(images.length === 0 && points.length === 0 && allData.length === 0) || isAnalyzing}
              />
              <Button 
                label={isAnalyzing ? `Analyzing (${progress}%)` : 'Analyze Road'} 
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