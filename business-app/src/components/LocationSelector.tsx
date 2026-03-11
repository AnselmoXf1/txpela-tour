import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronDown, X } from 'lucide-react';
import MozambiqueMap from './MozambiqueMap';

interface LocationSelectorProps {
  onLocationSelect: (location: any) => void;
  initialLocation?: any;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [localities, setLocalities] = useState<any[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Carregar províncias
  useEffect(() => {
    loadProvinces();
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    if (initialLocation) {
      // TODO: Carregar dados baseados na localização inicial
    }
  }, [initialLocation]);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.moz.melvinnunes.com/v1/provinces');
      const { data } = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Erro ao carregar províncias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceSelect = async (province: any) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedLocality(null);
    setDistricts([]);
    setLocalities([]);

    try {
      const response = await fetch(`https://api.moz.melvinnunes.com/v1/provinces/${province.code}`);
      const { data } = await response.json();
      
      const districtItems = data.districtsAndMunicipalities
        .filter((item: any) => item.type === 'CM_DISTRICT')
        .map((item: any) => ({
          ...item,
          province: province.designation
        }));
      
      setDistricts(districtItems);
      
      // Notificar seleção
      onLocationSelect({
        type: 'province',
        ...province,
        coordinates: getProvinceCoordinates(province.code)
      });
    } catch (error) {
      console.error('Erro ao carregar distritos:', error);
    }
  };

  const handleDistrictSelect = async (district: any) => {
    setSelectedDistrict(district);
    setSelectedLocality(null);
    setLocalities([]);

    try {
      const response = await fetch(`https://api.moz.melvinnunes.com/v1/districts/${district.code}`);
      const { data } = await response.json();
      
      // Notificar seleção
      onLocationSelect({
        type: 'district',
        ...district,
        province: selectedProvince.designation,
        administrativePosts: data.administrativePosts
      });
    } catch (error) {
      console.error('Erro ao carregar distrito:', error);
    }
  };

  const handleLocalitySelect = (locality: any) => {
    setSelectedLocality(locality);
    
    // Notificar seleção completa
    onLocationSelect({
      type: 'locality',
      ...locality,
      province: selectedProvince.designation,
      district: selectedDistrict.designation,
      fullAddress: `${locality.designation}, ${selectedDistrict.designation}, ${selectedProvince.designation}`
    });
  };

  const getProvinceCoordinates = (code: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      '11': [-25.9692, 32.5732], // Cidade De Maputo
      '10': [-25.9692, 32.5732], // Maputo Província
      '9': [-23.8617, 35.3833], // Gaza
      '8': [-23.8735, 35.3886], // Inhambane
      '7': [-24.7444, 34.7689], // Sofala
      '6': [-19.1494, 33.4294], // Manica
      '5': [-16.1564, 33.5864], // Tete
      '4': [-15.0333, 40.7333], // Zambézia
      '3': [-14.9167, 40.6667], // Nampula
      '2': [-12.9733, 40.5178], // Cabo Delgado
      '1': [-12.7822, 39.5528], // Niassa
    };
    
    return coordinates[code] || [-18.779, 35.015];
  };

  const handleMapLocationSelect = (location: any) => {
    // Buscar província correspondente
    const province = provinces.find(p => p.code === location.code);
    if (province) {
      handleProvinceSelect(province);
    }
    
    setShowMap(false);
  };

  const clearSelection = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocality(null);
    setDistricts([]);
    setLocalities([]);
    onLocationSelect(null);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-800">Localização do Negócio</h3>
        </div>
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          <MapPin size={16} />
          {showMap ? 'Esconder Mapa' : 'Ver no Mapa'}
        </button>
      </div>

      {/* Mapa Interativo */}
      {showMap && (
        <div className="border rounded-lg overflow-hidden">
          <MozambiqueMap
            onLocationSelect={handleMapLocationSelect}
            interactive={true}
            showProvinces={true}
          />
        </div>
      )}

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar província, distrito ou localidade..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Seletor Hierárquico */}
      <div className="space-y-4">
        {/* Província */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Província
          </label>
          <div className="relative">
            <select
              value={selectedProvince?.code || ''}
              onChange={(e) => {
                const province = provinces.find(p => p.code === e.target.value);
                if (province) handleProvinceSelect(province);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              disabled={loading}
            >
              <option value="">Selecione uma província</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.designation}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Distrito */}
        {selectedProvince && districts.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito
            </label>
            <div className="relative">
              <select
                value={selectedDistrict?.code || ''}
                onChange={(e) => {
                  const district = districts.find(d => d.code === e.target.value);
                  if (district) handleDistrictSelect(district);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Selecione um distrito</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.designation}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        )}

        {/* Localidade */}
        {selectedDistrict && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localidade
            </label>
            <div className="relative">
              <select
                value={selectedLocality?.code || ''}
                onChange={(e) => {
                  const locality = localities.find(l => l.code === e.target.value);
                  if (locality) handleLocalitySelect(locality);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Selecione uma localidade</option>
                {localities.map((locality) => (
                  <option key={locality.code} value={locality.code}>
                    {locality.designation}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Localização Selecionada */}
      {(selectedProvince || selectedDistrict || selectedLocality) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Localização Selecionada</h4>
              <div className="text-sm text-blue-700">
                {selectedLocality && (
                  <p>{selectedLocality.designation}, </p>
                )}
                {selectedDistrict && (
                  <p>{selectedDistrict.designation}, </p>
                )}
                {selectedProvince && (
                  <p>{selectedProvince.designation}</p>
                )}
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Endereço Manual */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Endereço Completo (opcional)
        </label>
        <textarea
          placeholder="Ex: Rua da Independência, Nº 123, Bairro Central"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Adicione detalhes como nome da rua, número, ponto de referência, etc.
        </p>
      </div>

      {/* Botão de Ajuda */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin size={16} />
        <p>
          Não encontra sua localização? Use o mapa para selecionar ou entre em contato.
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;