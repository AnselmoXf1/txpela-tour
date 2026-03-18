import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { mozLocationApi, Province, PROVINCE_COORDINATES } from '../services/mozLocationApi';

// Fix Leaflet default icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

interface MozambiqueMapProps {
  onLocationSelect?: (location: any) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  showProvinces?: boolean;
  interactive?: boolean;
  height?: string;
  showStyleSelector?: boolean;
  points?: Array<{
    id: string;
    nome: string;
    localizacao: { coordinates: [number, number] };
    categoria: string;
  }>;
}

// Estilos de mapa disponíveis
const MAP_STYLES = {
  voyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  light: {
    name: 'Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  satellite: {
    name: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  }
};

const MozambiqueMap: React.FC<MozambiqueMapProps> = ({
  onLocationSelect,
  initialCenter = [-18.665, 35.529],
  initialZoom = 6,
  showProvinces = true,
  interactive = true,
  height = '500px',
  showStyleSelector = false,
  points = [],
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('voyager');

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const provincesData = await mozLocationApi.getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error('Erro ao carregar províncias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceClick = async (province: Province) => {
    try {
      const details = await mozLocationApi.getProvinceDetails(province.code);
      const provinceWithDetails = { ...province, details };
      setSelectedProvince(provinceWithDetails);
      
      if (onLocationSelect) {
        onLocationSelect({
          ...province,
          coordinates: PROVINCE_COORDINATES[province.code] || [-18.779, 35.015],
          details
        });
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da província:', error);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        if (interactive) {
          console.log('Map clicked at:', e.latlng);
        }
      },
    });
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: height || '500px' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ height: height || '500px' }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="h-full w-full rounded-lg shadow-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={MAP_STYLES[mapStyle].url}
          attribution={MAP_STYLES[mapStyle].attribution}
          maxZoom={19}
        />
        
        <MapEvents />
        
        {/* Províncias como marcadores */}
        {showProvinces && provinces.map((province) => {
          const coords = PROVINCE_COORDINATES[province.code];
          if (!coords) return null;
          
          return (
            <Marker
              key={province.code}
              position={coords}
              eventHandlers={{
                click: () => handleProvinceClick(province)
              }}
              icon={L.divIcon({
                html: `<div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ${province.designation}
                </div>`,
                className: 'custom-div-icon',
                iconSize: [60, 30],
                iconAnchor: [30, 15],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{province.designation}</h3>
                  <button
                    onClick={() => handleProvinceClick(province)}
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Painel de informações */}
      {selectedProvince && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-[1000]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{selectedProvince.designation}</h3>
            <button
              onClick={() => setSelectedProvince(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {selectedProvince.details && (
            <div className="mt-2">
              <h4 className="font-semibold mb-2">Distritos e Municípios:</h4>
              <div className="space-y-1">
                {selectedProvince.details.districtsAndMunicipalities?.map((item: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600">
                    {item.designation} ({item.type})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          <span className="text-sm">Província</span>
        </div>
        <p className="text-xs text-gray-500">Clique em uma província para ver detalhes</p>
      </div>
    </div>
  );
};

export default MozambiqueMap;