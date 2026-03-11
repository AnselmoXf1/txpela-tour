// API de Localização de Moçambique
// Base URL: https://api.moz.melvinnunes.com/v1

const BASE_URL = 'https://api.moz.melvinnunes.com/v1';

export interface Province {
  code: string;
  designation: string;
}

export interface DistrictMunicipality {
  code: string;
  designation: string;
  type: string; // 'CM_DISTRICT' ou 'CM_MUNICIPALITY'
}

export interface ProvinceDetails {
  code: string;
  designation: string;
  districtsAndMunicipalities: DistrictMunicipality[];
}

export interface DistrictDetails {
  code: string;
  designation: string;
  administrativePosts: Array<{
    code: string;
    designation: string;
  }>;
}

export interface MunicipalityDetails {
  code: string;
  designation: string;
  townships: Array<{
    code: string;
    designation: string;
  }>;
}

export interface Locality {
  code: string;
  designation: string;
}

export interface Neighborhood {
  code: string;
  designation: string;
}

export interface Village {
  code: string;
  designation: string;
}

// Coordenadas aproximadas das províncias de Moçambique
// Códigos da API: 11=Cidade De Maputo, 10=Maputo, 9=Gaza, 8=Inhambane, 7=Sofala, 6=Manica, 5=Tete, 4=Zambézia, 3=Nampula, 2=Cabo Delgado, 1=Niassa
export const PROVINCE_COORDINATES: Record<string, [number, number]> = {
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

// Serviços da API
export const mozLocationApi = {
  // Obter todas as províncias
  getProvinces: async (): Promise<Province[]> => {
    const response = await fetch(`${BASE_URL}/provinces`);
    const { data } = await response.json();
    return data;
  },

  // Obter detalhes de uma província
  getProvinceDetails: async (provinceCode: string): Promise<ProvinceDetails> => {
    const response = await fetch(`${BASE_URL}/provinces/${provinceCode}`);
    const { data } = await response.json();
    return data;
  },

  // Obter detalhes de um distrito
  getDistrictDetails: async (districtCode: string): Promise<DistrictDetails> => {
    const response = await fetch(`${BASE_URL}/districts/${districtCode}`);
    const { data } = await response.json();
    return data;
  },

  // Obter detalhes de um município
  getMunicipalityDetails: async (municipalityCode: string): Promise<MunicipalityDetails> => {
    const response = await fetch(`${BASE_URL}/municipalities/${municipalityCode}`);
    const { data } = await response.json();
    return data;
  },

  // Obter localidades por código de posto administrativo ou bairro
  getLocalities: async (administrativePostOrTownshipCode: string): Promise<Locality[]> => {
    const response = await fetch(
      `${BASE_URL}/localities?administrativePostOrTownshipCode=${administrativePostOrTownshipCode}`
    );
    const { data } = await response.json();
    return data;
  },

  // Obter bairros por código de localidade
  getNeighborhoods: async (localityCode: string): Promise<Neighborhood[]> => {
    const response = await fetch(`${BASE_URL}/neighborhoods?localityCode=${localityCode}`);
    const { data } = await response.json();
    return data;
  },

  // Obter aldeias por código de bairro
  getVillages: async (neighborhoodCode: string): Promise<Village[]> => {
    const response = await fetch(`${BASE_URL}/villages?neighborhoodCode=${neighborhoodCode}`);
    const { data } = await response.json();
    return data;
  },

  // Buscar localização por nome (fuzzy search)
  searchLocation: async (query: string): Promise<any[]> => {
    // Primeiro buscar províncias
    const provinces = await mozLocationApi.getProvinces();
    const filteredProvinces = provinces.filter(p =>
      p.designation.toLowerCase().includes(query.toLowerCase())
    );

    // Para cada província, buscar detalhes
    const results = [];
    for (const province of filteredProvinces.slice(0, 5)) {
      const details = await mozLocationApi.getProvinceDetails(province.code);
      results.push({
        type: 'province',
        ...province,
        coordinates: PROVINCE_COORDINATES[province.code] || [-18.779, 35.015],
        details
      });
    }

    return results;
  },

  // Obter coordenadas para uma localização
  getCoordinates: (location: any): [number, number] => {
    if (location.coordinates) {
      return location.coordinates;
    }
    
    // Fallback para coordenadas da província
    if (location.code && PROVINCE_COORDINATES[location.code]) {
      return PROVINCE_COORDINATES[location.code];
    }
    
    // Coordenadas centrais de Moçambique
    return [-18.779, 35.015];
  },

  // Formatar nome da localização
  formatLocationName: (location: any): string => {
    if (location.type === 'province') {
      return `Província de ${location.designation}`;
    }
    if (location.type === 'district') {
      return `Distrito de ${location.designation}`;
    }
    if (location.type === 'municipality') {
      return `Município de ${location.designation}`;
    }
    return location.designation || 'Localização';
  },

  // Gerar popup HTML para o mapa
  generatePopupHtml: (location: any): string => {
    const name = mozLocationApi.formatLocationName(location);
    let html = `<div class="p-2">
      <h3 class="font-bold text-lg mb-2">${name}</h3>`;
    
    if (location.details?.districtsAndMunicipalities) {
      html += `<p class="text-sm text-gray-600 mb-2">
        ${location.details.districtsAndMunicipalities.length} distritos/municípios
      </p>`;
    }
    
    html += `<button 
        onclick="window.dispatchEvent(new CustomEvent('selectLocation', { detail: ${JSON.stringify(location)} }))"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Selecionar
      </button>
    </div>`;
    
    return html;
  },
};

// Hook para usar a API
export const useMozLocations = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const data = await mozLocationApi.getProvinces();
      setProvinces(data);
    } catch (err) {
      setError('Erro ao carregar províncias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    provinces,
    loading,
    error,
    refresh: loadProvinces,
  };
};

// Import React para o hook
import { useState, useEffect } from 'react';