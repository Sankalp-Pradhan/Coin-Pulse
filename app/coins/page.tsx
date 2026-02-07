
import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import { cn, formatPercentage, formatCurrency } from "@/lib/utils";
import DataTable from "@/components/DataTable";
import CoinsPagination from "@/components/ui/coinsPagination";
import { CoinMarketData, DataTableColumn, NextPageProps } from "@/types";

const Coins = async ({ searchParams }: NextPageProps) => {
    const { page } = await searchParams;
    const perPage = 10;
    const currentPage = Number(page) || 1;


    let coinsData: CoinMarketData[] = [];
    try {
        coinsData = await fetcher<CoinMarketData[]>("/coins/markets", {
            vs_currency: "usd",
            order: "market_cap_desc",
            sparkline: "false",
            price_change_percentage: "24h",
            per_page: perPage,
            page: currentPage,
        });
    } catch (error) {
        console.error("Failed to fetch coins data:", error);
    }

    const hasMorePages = coinsData.length === perPage;

    // ✅ FIXED: Better logic for total pages
    const estimatedTotalPages = hasMorePages ? currentPage + 10 : currentPage;

    const columns: DataTableColumn<CoinMarketData>[] = [
        {
            header: "Rank",
            cellClassName: "rank-cell",
            cell: (coin) => (
                <>
                    #{coin.market_cap_rank}
                </>
            ),
        },
        {
            header: "Token",
            cellClassName: "token-cell",
            cell: (coin) => (
                <div className="token-info">
                    <Image src={coin.image} alt={coin.name} width={36} height={36} />
                    <p>
                        {coin.name} ({coin.symbol.toUpperCase()})
                    </p>
                </div>
            ),
        },
        {
            header: "Price",
            cellClassName: "price-cell",
            cell: (coin) => formatCurrency(coin.current_price),
        },
        {
            header: "24h Change",
            cellClassName: "change-cell",
            cell: (coin) => {
                const change = coin.price_change_percentage_24h;
                const isTrendingUp = change > 0;
                const isTrendingDown = change < 0;
                return (
                    <span
                        className={cn("change-value", {
                            "text-green-600": isTrendingUp,
                            "text-red-500": isTrendingDown,
                        })}
                    >
                        {isTrendingUp && "+"}
                        {formatPercentage(change)}
                    </span>
                );
            },
        },
        {
            header: "Market Cap",
            cellClassName: "market-cap-cell",
            cell: (coin) => formatCurrency(coin.market_cap),
        },
    ];

    return (
        <main id="coins-page">
            <div className="content">
                <h4>All Coins</h4>

                <DataTable<CoinMarketData>
                    columns={columns}
                    data={coinsData}
                    rowKey={(coin) => coin.id}
                />

                <CoinsPagination
                    currentPage={currentPage}
                    totalPages={estimatedTotalPages}
                    hasMorePages={hasMorePages}
                />
            </div>
        </main>
    );
};

export default Coins;