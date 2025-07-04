import axios from 'axios';

const API_BASE_URL = '/api/proxy';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Country {
  id_negara: number;
  nama_negara: string;
  kode_negara: string;
}

export interface Port {
  id_pelabuhan: number;
  nama_pelabuhan: string;
  id_negara: number;
}

export interface Item {
  id_barang: number;
  nama_barang: string;
  description: string;
  id_pelabuhan: number;
  harga: number;
  diskon?: number;
}

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await api.get('/negaras');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries');
  }
};

export const fetchPorts = async (countryId: number): Promise<Port[]> => {
    console.log(`Fetching ports for country ID: ${countryId}`);
  try {
    const filter = JSON.stringify({ where: { id_negara: countryId } });
    const response = await api.get(`/pelabuhans?filter=${encodeURIComponent(filter)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ports:', error);
    throw new Error('Failed to fetch ports');
  }
};

export const fetchItems = async (portId: number): Promise<Item[]> => {
  try {
    const filter = JSON.stringify({ where: { id_pelabuhan: portId } });
    const response = await api.get(`/barangs?filter=${encodeURIComponent(filter)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error('Failed to fetch items');
  }
};

export default api;