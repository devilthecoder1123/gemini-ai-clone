import { useState, useEffect } from 'react';
import { Country } from '../types';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        if (!response.ok) throw new Error('Failed to fetch countries');
        
        const data: Country[] = await response.json();
        const filteredCountries = data
          .filter(country => country.idd?.root)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        setCountries(filteredCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};