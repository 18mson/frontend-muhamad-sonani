"use client";

import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, MapPin, Ship, Package, Calculator, Percent, DollarSign } from 'lucide-react';
import { fetchCountries, fetchPorts, fetchItems, Country, Port, Item } from '@/fetch/api';


export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const [discount, setDiscount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const [countrySearch, setCountrySearch] = useState('');
  const [portSearch, setPortSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPortDropdown, setShowPortDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadPorts(selectedCountry.id_negara);
      setSelectedPort(null);
      setSelectedItem(null);
      setItems([]);
      setPrice(0);
      setTotal(0);
      setDiscount(0);
    }
  }, [selectedCountry]);

  const loadPorts = async (countryId: number) => {
    setLoadingPorts(true);
    setError(null);
    try {
      const portsData = await fetchPorts(countryId);
      setPorts(portsData);
    } catch (error) {
      setError('Failed to load ports. Please try again.');
      console.error('Error loading ports:', error);
    } finally {
      setLoadingPorts(false);
    }
  };

  useEffect(() => {
    if (selectedPort) {
      loadItems(selectedPort.id_pelabuhan);
      setSelectedItem(null);
      setPrice(0);
      setTotal(0);
    }
  }, [selectedPort]);

  const loadItems = async (portId: number) => {
    setLoadingItems(true);
    setError(null);
    try {
      const itemsData = await fetchItems(portId);
      setItems(itemsData);
    } catch (error) {
      setError('Failed to load items. Please try again.');
      console.error('Error loading items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadCountries = async () => {
    setLoadingCountries(true);
    setError(null);
    try {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    } catch (error) {
      setError('Failed to load countries. Please try again.');
      console.error('Error loading countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.nama_negara.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.kode_negara.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredPorts = ports.filter(port =>
    port.nama_pelabuhan.toLowerCase().includes(portSearch.toLowerCase())
  );

  const filteredItems = items.filter(item =>
    item.nama_barang.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const onChangeDiscount = (value: number) => {
    setDiscount(value);
    if (selectedItem) {
      const discountAmount = (value / 100) * selectedItem.harga;
      setTotal(selectedItem.harga - discountAmount);
    }
  };

  const onChangePrice = (value: number) => {
    setPrice(value);
    if (selectedItem) {
      const discountAmount = (discount / 100) * value;
      setTotal(value - discountAmount);
    }
  };

  const renderLoading = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const renderForm = () => {
    return (
      <div className="grid grid-cols-1 gap-8">
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Negara
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedCountry ? `${selectedCountry.kode_negara} - ${selectedCountry.nama_negara}` : countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setShowCountryDropdown(true);
              }}
              onFocus={() => {
                setShowCountryDropdown(true)
                setShowPortDropdown(false);
                setShowItemDropdown(false);
              }}
              placeholder="Pilih negara..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showCountryDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto animate-slide-down">
                {filteredCountries.map((country) => (
                  <div
                    key={country.kode_negara}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedCountry(country);
                      setCountrySearch('');
                      setShowCountryDropdown(false);
                    }}
                  >
                    <span className="font-medium text-blue-600">{country.kode_negara}</span> - {country.nama_negara}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Ship className="inline w-4 h-4 mr-2" />
            Pelabuhan
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedPort ? selectedPort.nama_pelabuhan : portSearch}
              onChange={(e) => {
                setPortSearch(e.target.value);
                setShowPortDropdown(true);
              }}
              onFocus={() => {
                setShowPortDropdown(true)
                setShowCountryDropdown(false);
                setShowItemDropdown(false);
              }}
              placeholder="Pilih pelabuhan..."
              disabled={!selectedCountry}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-blue-300"
            />
            {loadingPorts ? (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            
            {showPortDropdown && !loadingPorts && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto animate-slide-down">
                {filteredPorts.length && filteredPorts.map((port) => (
                  <div
                    key={port.id_pelabuhan}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedPort(port);
                      setPortSearch('');
                      setShowPortDropdown(false);
                      setDiscount(0);
                    }}
                  >
                    {port.nama_pelabuhan}
                  </div>
                ))}
              </div>
            )}
          </div>
          {loadingPorts && (
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memuat data pelabuhan...
            </div>
          )}
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Package className="inline w-4 h-4 mr-2" />
            Barang
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedItem ? `${selectedItem.id_barang} - ${selectedItem.nama_barang}` : itemSearch}
              onChange={(e) => {
                setItemSearch(e.target.value);
                setShowItemDropdown(true);
              }}
              onFocus={() => setShowItemDropdown(true)}
              placeholder="Pilih barang..."
              disabled={!selectedPort}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-blue-300"
            />
            {loadingItems ? (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            
            {showItemDropdown && !loadingItems && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto animate-slide-down">
                {filteredItems && filteredItems.map((item) => (
                  <div
                    key={item.id_barang}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedItem(item);
                      setItemSearch('');
                      setDiscount(item.diskon || 0);
                      setPrice(item.harga);
                      setTotal(item.harga - (item.diskon || 0) * item.harga / 100);
                      setShowItemDropdown(false);
                    }}
                  >
                    <span className="font-medium text-blue-600">{item.id_barang}</span> - {item.nama_barang}
                  </div>
                ))}
              </div>
            )}
          </div>
          {loadingItems && (
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memuat data barang...
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi Barang
          </label>
          <div className="relative">
            <textarea
              value={selectedItem?.description || ''}
              readOnly
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none transition-all duration-200"
              placeholder="Deskripsi barang akan muncul setelah memilih barang..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Percent className="inline w-4 h-4 mr-2" />
            Diskon (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => {
              const value = Math.max(0, Math.min(100, parseInt(e.target.value, 10)));
              onChangeDiscount(value);
            }}
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="inline w-4 h-4 mr-2" />
            Harga
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatCurrency(price || 0)}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                onChangePrice(value);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 transition-all duration-200"
              placeholder="Rp 0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calculator className="inline w-4 h-4 mr-2" />
            Total
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatCurrency(total || 0)}
              readOnly
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg bg-green-50 text-green-800 font-semibold text-lg transition-all duration-200"
              placeholder="Rp 0"
            />
          </div>
        </div>
      </div>
    </div>
    )
  }

  const renderPage = () => {
    if (loadingCountries) {
      return renderLoading();
    }
    if (error) {
      return (
        <div className="text-red-500 text-center">
          {error}
        </div>
      );
    }
    if (countries.length === 0) {
      return (
        <div className="text-gray-500 text-center">
          Tidak ada negara yang tersedia.
        </div>
      );
    }
    return renderForm();
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl">
        {renderPage()}
      </div>
    </div>
  );
}
