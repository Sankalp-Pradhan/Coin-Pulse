// 'use server'

// import qs from 'query-string';

// const BASE_URL = process.env.COINGECKO_BASE_URL
// const API_KEY = process.env.COINGECKO_API_KEY

// if (!BASE_URL) throw new Error('could not get base url')
// if (!API_KEY) throw new Error('could not get Api key')


// export async function fetcher<T>(
//     endpoint: string,
//     params?: QueryParams,
//     revalidate = 60,
// ): Promise<T> {
//     const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;


//     const url = qs.stringifyUrl({
//         url: `${BASE_URL}/${endpoint}`,
//         query: params,
//     }, { skipEmptyString: true, skipNull: true })

//     console.log('Fetching:', url); // Debug log


//     const response = await fetch(url, {
//         headers: {
//             "x-cg-pro-api-key": API_KEY,
//             "Content-Type": "application/json",

//         } as Record<string, string>,
//         next: { revalidate }
//     });
//     if (!response.ok) {
//         const errorBody: CoinGeckoErrorBody = await response.json()
//             .catch(() => ({}));

//         throw new Error(`API Error : ${response.status} : ${errorBody.error || response.statusText}`)

//     }
//     return response.json()
// }


'use server'

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL
const API_KEY = process.env.COINGECKO_API_KEY

if (!BASE_URL) throw new Error('could not get base url')
if (!API_KEY) throw new Error('could not get Api key')

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Add API key to query params for demo API
    const queryParams = {
        ...params,
        x_cg_demo_api_key: API_KEY,
    };

    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${cleanEndpoint}`,
        query: queryParams,
    }, { skipEmptyString: true, skipNull: true })

    // Fix: Add type assertion or conditional check
    console.log('Fetching:', API_KEY ? url.replace(API_KEY, 'API_KEY_HIDDEN') : url);

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate }
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json()
            .catch(() => ({}));

        throw new Error(`API Error : ${response.status} : ${errorBody.error || response.statusText}`)
    }

    return response.json()
}


export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null
): Promise<PoolData> {
    const fallback: PoolData = {
        id: "",
        address: "",
        name: "",
        network: "",
    };

    if (network && contractAddress) {
        const poolData = await fetcher<{ data: PoolData[] }>(
            `/onchain/networks/${network}/tokens/${contractAddress}/pools`
        );

        return poolData.data?.[0] ?? fallback;
    }

    try {
        const poolData = await fetcher<{ data: PoolData[] }>(
            "/onchain/search/pools",
            { query: id }
        );

        return poolData.data?.[0] ?? fallback;
    } catch {
        return fallback;
    }
}