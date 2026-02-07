'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CoinDetailsData } from '@/types';

interface ETHConverterProps {
  coin: CoinDetailsData;
}

const currencies = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'gbp', label: 'GBP', symbol: '£' },
  { value: 'jpy', label: 'JPY', symbol: '¥' },
  { value: 'btc', label: 'BTC', symbol: '₿' },
];

export function ETHConverter({ coin }: ETHConverterProps) {
  const [amount, setAmount] = useState<string>('1');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // Fetch exchange rates for the coin
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd,eur,gbp,jpy,btc`
        );

        if (!response.ok) {
          throw new Error(
            `Exchange rate fetch failed: ${response.status} ${response.statusText}`
          );
        }
        
        const data = await response.json();

        if (data[coin.id]) {
          setExchangeRates(data[coin.id]);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to market_data if API fails
        setExchangeRates({
          usd: coin.market_data.current_price.usd,
          eur: coin.market_data.current_price.eur || 0,
          gbp: coin.market_data.current_price.gbp || 0,
          jpy: coin.market_data.current_price.jpy || 0,
          btc: coin.market_data.current_price.btc || 0,
        });
      }
    };

    fetchExchangeRates();
  }, [coin.id, coin.market_data.current_price]);

  // Calculate converted amount
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const rate = exchangeRates[selectedCurrency] || 0;
    const converted = numAmount * rate;
    setConvertedAmount(converted);
  }, [amount, selectedCurrency, exchangeRates]);

  const getCurrencySymbol = () => {
    return currencies.find(c => c.value === selectedCurrency)?.symbol || '$';
  };

  const formatConvertedAmount = () => {
    if (selectedCurrency === 'btc') {
      return convertedAmount.toFixed(8);
    }
    return convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div id="converter">
      <h4>{coin.symbol.toUpperCase()} Converter</h4>

      <div className="panel">
        <div className="input-wrapper">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            placeholder="0.00"
            min="0"
            step="any"
          />
          <div className="coin-info">
            <p>{coin.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />
          <ArrowDownUp className="icon" />
        </div>

        <div className="output-wrapper">
          <p>{formatConvertedAmount()}</p>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="select-trigger">
              <SelectValue className="select-value" />
            </SelectTrigger>
            <SelectContent data-converter className="select-content">
              {currencies.map((currency) => (
                <SelectItem
                  key={currency.value}
                  value={currency.value}
                  className="select-item"
                >
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}