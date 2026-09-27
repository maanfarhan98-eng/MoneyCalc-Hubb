import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  decimals?: number;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR ' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'DJF ', decimals: 0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF ' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R ' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  // Extended currencies supported by architecture
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr ' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr ' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł ' },
];

/**
 * Allows dynamic extension of the supported currency registry
 */
export function registerCurrency(newCurrency: CurrencyOption) {
  if (!CURRENCIES.some((c) => c.code === newCurrency.code)) {
    CURRENCIES.push(newCurrency);
  }
}

interface CurrencyContextType {
  currency: CurrencyOption;
  setCurrencyCode: (code: string) => void;
  formatMoney: (amount: number, overrideDecimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: CURRENCIES[0],
  setCurrencyCode: () => {},
  formatMoney: () => '',
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moneycalc_currency') || 'USD';
    }
    return 'USD';
  });

  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const setCurrencyCode = (code: string) => {
    setCurrencyCodeState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('moneycalc_currency', code);
    }
  };

  /**
   * Formats a monetary number with the selected currency symbol.
   * DOES NOT convert exchange rates: maintains 1:1 numerical integrity as requested.
   */
  const formatMoney = (amount: number, overrideDecimals?: number): string => {
    const dec = overrideDecimals !== undefined ? overrideDecimals : (currency.decimals ?? 2);
    if (isNaN(amount) || !isFinite(amount)) {
      return `${currency.symbol}${dec > 0 ? '0.' + '0'.repeat(dec) : '0'}`;
    }

    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formattedNumber = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });

    return isNegative ? `-${currency.symbol}${formattedNumber}` : `${currency.symbol}${formattedNumber}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
