'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, formatPercentage } from '@/lib/utils';

interface SearchCoin {
    id: string;
    symbol: string;
    name: string;
    thumb?: string;
    large?: string;
    market_cap_rank?: number;
}

interface TrendingCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
}

// Fallback trending coins in case API fails
const FALLBACK_TRENDING: TrendingCoin[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 97000,
        price_change_percentage_24h: 2.5,
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3500,
        price_change_percentage_24h: 1.8,
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        current_price: 180,
        price_change_percentage_24h: 5.2,
    },
    {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        current_price: 0.95,
        price_change_percentage_24h: -1.2,
    },
    {
        id: 'ripple',
        symbol: 'XRP',
        name: 'XRP',
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        current_price: 2.5,
        price_change_percentage_24h: 3.4,
    },
];

export function SearchModal() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchCoin[]>([]);
    const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>(FALLBACK_TRENDING);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingTrending, setIsLoadingTrending] = useState(false);
    const router = useRouter();

    // Fetch trending coins on mount
    useEffect(() => {
        const fetchTrending = async () => {
            setIsLoadingTrending(true);
            try {
                const response = await fetch('/api/coins/trending');
                
                if (!response.ok) {
                    console.error('Trending API failed:', response.status);
                    // Keep using fallback data
                    return;
                }
                
                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    setTrendingCoins(data.slice(0, 5));
                } else {
                    console.log('Empty trending data, using fallback');
                }
            } catch (error) {
                console.error('Failed to fetch trending coins:', error);
                // Keep using fallback data
            } finally {
                setIsLoadingTrending(false);
            }
        };

        if (open && trendingCoins === FALLBACK_TRENDING) {
            fetchTrending();
        }
    }, [open, trendingCoins]);

    // Search coins
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/coins/search?q=${encodeURIComponent(searchQuery)}`);
                
                if (!response.ok) {
                    console.error('Search API failed:', response.status);
                    setSearchResults([]);
                    return;
                }
                
                const data = await response.json();
                setSearchResults(data.coins || []);
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCoinClick = (coinId: string) => {
        setOpen(false);
        setSearchQuery('');
        router.push(`/coins/${coinId}`);
    };

    // Keyboard shortcut (Ctrl/Cmd + K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const showTrending = !searchQuery.trim();
    const displayCoins = showTrending ? trendingCoins : searchResults;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="nav-link flex items-center gap-2">
                    Search
                    <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </DialogTrigger>

            <DialogContent className="bg-dark-400 max-w-2xl mx-auto p-0 gap-0 border-dark-400">
                {/* Search Input */}
                <div className="relative border-b border-dark-400">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-purple-100" />
                    <Input
                        placeholder="Search for a token by name or symbol"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-dark-500 pl-12 pr-32 h-14 text-base placeholder:text-purple-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                    />
                    <Button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-400 text-dark-900 h-10"
                        onClick={() => {
                            if (displayCoins.length > 0) {
                                handleCoinClick(displayCoins[0].id);
                            }
                        }}
                    >
                        <Search className="size-4 mr-2" />
                        Search
                    </Button>
                </div>

                {/* Results */}
                <div className="bg-dark-500 max-h-96 overflow-y-auto">
                    {/* Heading */}
                    <div className="px-4 py-3 border-b border-dark-400">
                        <p className="text-sm text-purple-100 font-medium">
                            {showTrending ? 'Trending assets' : `Search results (${displayCoins.length})`}
                        </p>
                    </div>

                    {/* Coin List */}
                    {displayCoins.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-purple-100">
                                {isSearching ? 'Searching...' : showTrending && isLoadingTrending ? 'Loading trending coins...' : 'No results found'}
                            </p>
                        </div>
                    ) : showTrending ? (
                        // Trending coins display
                        <div className="divide-y divide-dark-400">
                            {trendingCoins.map((coin) => {
                                const isTrendingUp = coin.price_change_percentage_24h > 0;
                                return (
                                    <button
                                        key={coin.id}
                                        onClick={() => handleCoinClick(coin.id)}
                                        className="w-full px-4 py-3 hover:bg-dark-400 transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={coin.image}
                                                alt={coin.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div className="text-left">
                                                <p className="font-semibold text-white group-hover:text-green-500 transition-colors">
                                                    {coin.name}
                                                </p>
                                                <p className="text-sm text-purple-100 uppercase">
                                                    ({coin.symbol})
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <p className="font-semibold text-white">
                                                ${coin.current_price.toLocaleString()}
                                            </p>
                                            <div
                                                className={cn(
                                                    'flex items-center gap-1 font-medium min-w-20 justify-end',
                                                    isTrendingUp ? 'text-green-400' : 'text-red-500'
                                                )}
                                            >
                                                {isTrendingUp ? (
                                                    <TrendingUp className="size-4" />
                                                ) : (
                                                    <TrendingDown className="size-4" />
                                                )}
                                                {formatPercentage(Math.abs(coin.price_change_percentage_24h))}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        // Search results display
                        <div className="divide-y divide-dark-400">
                            {searchResults.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => handleCoinClick(coin.id)}
                                    className="w-full px-4 py-3 hover:bg-dark-400 transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        {coin.thumb && (
                                            <Image
                                                src={coin.thumb}
                                                alt={coin.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        )}
                                        <div className="text-left">
                                            <p className="font-semibold text-white group-hover:text-green-500 transition-colors">
                                                {coin.name}
                                            </p>
                                            <p className="text-sm text-purple-100 uppercase">
                                                {coin.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    {coin.market_cap_rank && (
                                        <div className="text-purple-100 text-sm">
                                            Rank #{coin.market_cap_rank}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}