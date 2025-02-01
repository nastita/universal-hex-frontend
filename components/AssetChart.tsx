'use client';

import { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Button } from '@/components/ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AssetChartProps {
  assetData: {
    priceDataPoints: { timestamp: number; priceUSD: string }[];
    priceUSD: string;
  };
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export default function AssetChart({
  assetData,
  timeRange,
  setTimeRange,
}: AssetChartProps) {
  const [selectedPrice, setSelectedPrice] = useState<{
    price: string;
    change: { value: string; percentage: string };
  }>(() => ({
    price: assetData.priceUSD,
    change: { value: '0', percentage: '0' },
  }));

  const currentPriceRef = useRef({
    price: assetData.priceUSD,
    change: { value: '0', percentage: '0' },
  });

  const sortedDataPoints = [...assetData.priceDataPoints].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const chartData = {
    labels: sortedDataPoints.map((point) =>
      new Date(point.timestamp * 1000).toLocaleString()
    ),
    datasets: [
      {
        label: 'Price',
        data: sortedDataPoints.map((point) =>
          Number.parseFloat(point.priceUSD)
        ),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const price = context.raw;
            const basePrice = Number.parseFloat(assetData.priceUSD);
            const change = price - basePrice;
            const changePercentage = (change / basePrice) * 100;

            currentPriceRef.current = {
              price: price.toString(),
              change: {
                value: change.toFixed(2),
                percentage: changePercentage.toFixed(2),
              },
            };

            requestAnimationFrame(() => {
              setSelectedPrice(currentPriceRef.current);
            });

            return `Price: $${price.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    onHover: (_: any, elements: any[]) => {
      if (elements.length === 0) {
        currentPriceRef.current = {
          price: assetData.priceUSD,
          change: { value: '0', percentage: '0' },
        };
        requestAnimationFrame(() => {
          setSelectedPrice(currentPriceRef.current);
        });
      }
    },
  };

  const isPositiveChange = Number.parseFloat(selectedPrice.change.value) >= 0;
  const changeColor = isPositiveChange ? 'text-green-400' : 'text-red-400';

  return (
    <div>
      <div className='mb-8'>
        <div className='text-4xl font-bold mb-2'>
          ${Number.parseFloat(selectedPrice.price).toLocaleString()}
        </div>
        <div className='flex items-center gap-2'>
          <span className={changeColor}>
            $
            {Math.abs(Number.parseFloat(selectedPrice.change.value)).toFixed(2)}
          </span>
          <span className={changeColor}>
            ({isPositiveChange ? '+' : '-'}
            {Math.abs(Number.parseFloat(selectedPrice.change.percentage))}%)
          </span>
        </div>
      </div>

      <div className='flex gap-2 mb-4'>
        {['1D', '1W', '1M', '1Y'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'secondary'}
            size='sm'
            onClick={() => setTimeRange(range)}
            className='px-4'
          >
            {range}
          </Button>
        ))}
      </div>
      <div className='h-[300px]'>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
