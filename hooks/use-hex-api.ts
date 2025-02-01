import axios from 'axios';
import { useCallback, useMemo } from 'react';

// Interface definitions mirroring backend DTOs
export interface AssetLink {
  name: string;
  url: string;
}

export interface AssetData {
  decimals: string;
  id: string;
  name: string;
  poolCount: string;
  symbol: string;
  totalSupply: string;
  totalValueLocked: string;
  totalValueLockedUSD: string;
  icon?: string;
  txCount: string;
  volume: string;
  volumeUSD: string;
  priceUSD: string;
}

export interface AssetDataWith24hPriceChange extends AssetData {
  priceChangePercentage24h: string;
}

export interface PriceDataPoint {
  timestamp: string;
  priceUSD: string;
}

export interface AssetDataDetailed extends AssetData {
  links?: AssetLink[];
  description?: string;
  priceDataPoints: PriceDataPoint[];
}

export type TimeRange = '24h' | '1w' | '1m' | '3m' | '6m' | '1y';

export const useHexApi = () => {
  const baseURL = process.env.NEXT_PUBLIC_HEX_API_URL || 'http://localhost:3001';
  const api = useMemo(() => axios.create({ baseURL }), [baseURL]);

  const getAllAssets = useCallback(async (): Promise<AssetDataWith24hPriceChange[]> => {
    const { data } = await api.get<AssetDataWith24hPriceChange[]>('/assets');
    return data;
  }, [api]);

  const getAssetDetails = useCallback(
    async (address: string, range: TimeRange = '24h'): Promise<AssetDataDetailed> => {
      const { data } = await api.get<AssetDataDetailed>(
        `/assets/${address}`,
        { params: { range } }
      );
      return data;
    },
    [api]
  );

  return {
    getAllAssets,
    getAssetDetails,
  };
};
