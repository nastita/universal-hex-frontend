'use client';

import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';

interface AssetTradeProps {
  assetData: {
    symbol: string;
    priceUSD: string;
    icon?: string;
  };
}

export default function AssetTrade({ assetData }: AssetTradeProps) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [network, setNetwork] = useState('arbitrum');
  const [swapDirection, setSwapDirection] = useState<'buy' | 'sell'>('buy');

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    setToAmount(
      (
        Number.parseFloat(value) * Number.parseFloat(assetData.priceUSD)
      ).toFixed(2)
    );
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    setFromAmount(
      (
        Number.parseFloat(value) / Number.parseFloat(assetData.priceUSD)
      ).toFixed(8)
    );
  };

  const handleSwapDirection = () => {
    setSwapDirection((prev) => (prev === 'buy' ? 'sell' : 'buy'));
    // Swap the amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div>
      <div className='flex justify-end mb-6'>
        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className='w-[140px]'>
            <Image
              src={`/${network.toLowerCase()}.png`}
              alt={network}
              width={20}
              height={20}
              className='mr-2'
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='arbitrum'>Arbitrum</SelectItem>
            <SelectItem value='polygon'>Polygon</SelectItem>
            <SelectItem value='base'>Base</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-4'>
        <div className='bg-gray-900/50 rounded-lg p-4'>
          <div className='text-sm text-gray-400 mb-2'>
            {swapDirection === 'buy' ? 'Selling' : 'Buying'}
          </div>
          <div className='flex gap-4'>
            <Input
              type='number'
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder='0'
              className='text-2xl bg-transparent border-none focus:outline-none'
            />
            <Button variant='ghost' className='flex items-center gap-2'>
              <Image
                src={
                  swapDirection === 'buy' ? '/usdt.png' : `${assetData.icon}`
                }
                alt={swapDirection === 'buy' ? 'USDC' : assetData.symbol}
                width={24}
                height={24}
              />
              {swapDirection === 'buy' ? 'USDT' : assetData.symbol}
            </Button>
          </div>
          <div className='text-sm text-gray-400 mt-2'>Balance: 0</div>
        </div>

        <div className='flex justify-center'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-gray-800'
            onClick={handleSwapDirection}
          >
            <ArrowDownUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='bg-gray-900/50 rounded-lg p-4'>
          <div className='text-sm text-gray-400 mb-2'>
            {swapDirection === 'buy' ? 'Buying' : 'Selling'}
          </div>
          <div className='flex gap-4'>
            <Input
              type='number'
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder='0'
              className='text-2xl bg-transparent border-none focus:outline-none'
            />
            <Button variant='ghost' className='flex items-center gap-2'>
              <Image
                src={
                  swapDirection === 'buy' ? `${assetData.icon}` : '/usdt.png'
                }
                alt={swapDirection === 'buy' ? assetData.symbol : 'USDT'}
                width={24}
                height={24}
              />
              {swapDirection === 'buy' ? assetData.symbol : 'USDT'}
            </Button>
          </div>
          <div className='text-sm text-gray-400 mt-2'>Balance: 0</div>
        </div>
      </div>

      <Collapsible className='mt-6'>
        <CollapsibleTrigger className='flex items-center justify-between w-full'>
          <span className='text-sm font-medium'>More Details</span>
        </CollapsibleTrigger>
        <CollapsibleContent className='space-y-2 mt-4'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>Exchange Rate</span>
            <span>
              1 {assetData.symbol} = $
              {Number.parseFloat(assetData.priceUSD).toLocaleString()} USDT
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>Network cost</span>
            <span className='text-green-400'>Free</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>Estimated time</span>
            <span>10 seconds</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button className='w-full mt-6' size='lg'>
        Confirm Swap
      </Button>
    </div>
  );
}
