import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useBusiness } from '../context/BusinessContext';
import { businessService } from '../services/api';
import { MapPin, Save } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function Location() {
  const { business, updateBusiness } = useBusiness();
  const [position, setPosition] = useState<[number, number]>([
    -8.7619, // Luanda default
    13.4527
  ]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (business?.location) {
      const [lng, lat] = business.location.coordinates;
      setPosition([lat, lng]);
      setAddress(business.location.address || '');
    }
  }, [business]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await businessService.updateLocation(position[0], position[1], address);
      await updateBusiness({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MapPin size={32} />
          Localização do Negócio
        </h1>
        <p className="text-gray-600 mt-2">Clique no mapa para marcar a localização</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Rua da Missão, Luanda"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 h-96 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>Latitude: {position[0].toFixed(6)}</p>
            <p>Longitude: {position[1].toFixed(6)}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading || !address}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Localização'}
          </button>
        </div>

        {success && (
          <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            Localização salva com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}
