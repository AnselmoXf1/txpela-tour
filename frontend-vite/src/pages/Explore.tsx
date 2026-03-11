import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { pontosTuristicosService, PontoTuristico, getLatLng, calculateAverageRating } from '../services/api';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Explore() {
  const [points, setPoints] = useState<PontoTuristico[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<PontoTuristico[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      const response = await pontosTuristicosService.getAll();
      setPoints(response.data);
      setFilteredPoints(response.data);
    } catch (err) {
      console.error('Failed to fetch points:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = points;

    if (searchQuery) {
      result = result.filter((p) =>
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'Todos') {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    setFilteredPoints(result);
  }, [searchQuery, selectedCategory, points]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredPoints(points);
      return;
    }

    try {
      const response = await pontosTuristicosService.search(searchQuery);
      setFilteredPoints(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const categories = ['Todos', ...Array.from(new Set(points.map((p) => p.categoria)))];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar lugares..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-ocean/50"
            />
          </form>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-ocean text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List View (Sidebar) */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 overflow-y-auto border-r border-gray-200 hidden md:block">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-ocean border-t-transparent"></div>
              </div>
            ) : filteredPoints.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Nenhum lugar encontrado.
              </div>
            ) : (
              filteredPoints.map((point) => {
                const avgRating = calculateAverageRating(point.reviews);
                const imageUrl = point.imagens[0]?.url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400';
                
                return (
                  <Link to={`/point/${point._id}`} key={point._id} className="block group">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                      <div className="h-32 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={point.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{point.nome}</h3>
                          {avgRating > 0 && (
                            <span className="text-xs bg-ocean/10 text-ocean px-2 py-1 rounded-md font-bold flex items-center gap-1">
                              <Star size={12} className="fill-sun text-sun" />
                              {avgRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{point.descricao}</p>
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                          <MapPin size={12} />
                          {point.categoria}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 relative z-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
            </div>
          ) : (
            <MapContainer
              center={[-23.8650, 35.3833]} // Inhambane coordinates
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
              />
              {filteredPoints.map((point) => {
                const [lat, lng] = getLatLng(point);
                const imageUrl = point.imagens[0]?.url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200';
                
                return (
                  <Marker
                    key={point._id}
                    position={[lat, lng]}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <img src={imageUrl} alt={point.nome} className="w-full h-24 object-cover rounded-t-lg mb-2" />
                        <h3 className="font-bold text-lg">{point.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{point.descricao}</p>
                        <span className="inline-block bg-tropical/10 text-tropical px-2 py-1 rounded-md text-xs font-bold mb-2">
                          {point.categoria}
                        </span>
                        <br />
                        <Link to={`/point/${point._id}`} className="text-ocean font-bold text-sm hover:underline">
                          Ver Detalhes →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
