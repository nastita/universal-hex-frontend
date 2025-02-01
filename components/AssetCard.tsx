import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    symbol: string;
    icon?: string;
    priceUSD: string;
    priceChangePercentage24h: string;
    totalValueLockedUSD: string;
    volume: string;
  };
}

export default function AssetCard({ asset }: AssetCardProps) {
  const priceChange = Number.parseFloat(asset.priceChangePercentage24h);
  const priceChangeColor = priceChange >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className='bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-purple-500/20 transition-shadow'>
      <div className='flex items-center mb-4'>
        <Image
          src={asset.icon || '/placeholder.svg'}
          alt={asset.name}
          width={32}
          height={32}
          className='mr-3'
        />
        <div>
          <h3 className='text-lg font-semibold'>{asset.name}</h3>
          <p className='text-sm text-gray-400'>{asset.symbol}</p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-sm text-gray-400'>Price</p>
          <p className='text-lg font-bold'>
            $
            {Number.parseFloat(asset.priceUSD).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className={`text-sm ${priceChangeColor}`}>
            {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-400'>TVL</p>
          <p className='text-lg font-bold'>
            $
            {Number.parseFloat(asset.totalValueLockedUSD).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>
        </div>
      </div>
      <div className='mb-4'>
        <p className='text-sm text-gray-400'>24h Volume</p>
        <p className='text-lg font-bold'>
          {Number.parseFloat(asset.volume).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          {asset.symbol}
        </p>
      </div>
      <Link href={`/asset/${asset.id}`} passHref>
        <Button className='w-full bg-purple-600 hover:bg-purple-700 text-white'>
          Trade {asset.symbol}
        </Button>
      </Link>
    </div>
  );
}
