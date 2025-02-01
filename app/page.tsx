'use client';

import { useEffect, useState } from 'react';
import AssetCard from '../components/AssetCard';
import { useHexApi, AssetDataWith24hPriceChange } from '../hooks/use-hex-api';

export default function Home() {
  const [assets, setAssets] = useState<AssetDataWith24hPriceChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAllAssets } = useHexApi();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAllAssets();
        setAssets(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch assets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <main className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading assets...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='container mx-auto px-4 py-8'>
        <div className='text-center text-red-500'>{error}</div>
      </main>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        Welcome to Universal HEX
        <span className='block text-xl font-normal text-purple-400 mt-2'>
          The Hybrid Exchange Bridging CEX and DEX
        </span>
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </main>
  );
}
