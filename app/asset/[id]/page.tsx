'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AssetChart from '../../../components/AssetChart';
import AssetTrade from '../../../components/AssetTrade';
import Image from 'next/image';
import { AssetDataDetailed, useHexApi } from '../../../hooks/use-hex-api';

export default function AssetPage() {
  const router = useRouter();
  const { id } = useParams();
  const [timeRange, setTimeRange] = useState('1D');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetData, setAssetData] = useState<AssetDataDetailed | null>(null);
  const { getAssetDetails } = useHexApi();

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssetDetails(id as string, '24h');
        setAssetData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch asset data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssetData();
    }
  }, [id, getAssetDetails]);

  const copyAddress = () => {
    navigator.clipboard.writeText(id as string);
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading asset data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    );
  }

  if (!assetData) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>No asset data available</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <Button
            variant='ghost'
            className='mb-6'
            onClick={() => router.back()}
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>

          <div className='flex items-center gap-4 mb-6'>
            <Image
              src={assetData.icon || '/placeholder.svg'}
              alt={assetData.name}
              width={48}
              height={48}
            />
            <div>
              <h1 className='text-2xl font-semibold'>{assetData.name}</h1>
              <div className='text-gray-400'>{assetData.symbol}</div>
            </div>
          </div>

          <div className='flex items-center gap-2 mb-8 text-sm'>
            <span className='text-gray-400'>Token Address:</span>
            <code className='text-gray-300'>
              {assetData.id.slice(0, 8)}...{assetData.id.slice(-6)}
            </code>
            <Button variant='ghost' size='icon' onClick={copyAddress}>
              <Copy className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='sm' className='ml-auto'>
              Add to wallet
            </Button>
          </div>

          <AssetChart
            assetData={{
              ...assetData,
              priceDataPoints: assetData.priceDataPoints.map((point) => ({
                ...point,
                timestamp: Number(point.timestamp),
              })),
            }}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />

          <div className='mt-8 bg-gray-800/50 rounded-lg p-6'>
            <p className='text-gray-300 mb-6'>{assetData.description}</p>
            {assetData.links && assetData.links.length > 0 && (
              <div className='mb-6'>
                <h3 className='text-sm font-medium mb-3'>Links</h3>
                <div className='flex flex-wrap gap-3'>
                  {assetData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 hover:bg-gray-700 rounded-full text-sm transition-colors'
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-gray-400 text-sm'>Market Cap</div>
                <div className='font-semibold'>$2.08T</div>
              </div>
              <div>
                <div className='text-gray-400 text-sm'>Price Change (1D)</div>
                <div className='font-semibold text-green-400'>+2.71%</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='bg-gray-800/50 rounded-lg p-6'>
            <AssetTrade assetData={assetData} />
          </div>
        </div>
      </div>
    </div>
  );
}
