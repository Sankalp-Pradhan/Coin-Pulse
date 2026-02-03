import Image from "next/image"
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";

import DataTable from "../components/DataTable"

import { Heading1, TrendingDown, TrendingUp } from "lucide-react";
import { fetcher } from "@/lib/coingecko.actions";
import { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import CategoriesFallback, { CoinOverviewFallback, TrendingCoinsFallback } from "@/components/home/Fallback"
import Categories from "@/components/home/Categories";

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Price', cellClassName: 'price-cell', cell: (coin) => coin.item.data.price
  },

  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;

      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} />
          <p>{item.name}</p>
        </Link>
      )
    }
  },

  {
    header: "24h Change",
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
          <p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
          </p>
        </div>
      )

    }
  }
]

export default async function Home() {
  return (
    <main className="main-container">
      <section className="home-grid ">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>


      <section className="w-full mt-7 space-y-4 ">
        <Suspense fallback={<CategoriesFallback/>}>
          <Categories  />
        </Suspense>
      </section>



    </main>
  )
}