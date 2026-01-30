'use server'

import { error } from 'console';
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


    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params,
    }, { skipEmptyString: true, skipNull: true })

    console.log('Fetching:', url); // Debug log


    const response = await fetch(url, {
        headers: {
            "x-cg-pro-api-key": API_KEY,
            "Content-Type": "application/json",

        } as Record<string, string>,
        next: { revalidate }
    });
    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json()
            .catch(() => ({}));

        throw new Error(`API Error : ${response.status} : ${errorBody.error || response.statusText}`)

    }
    return response.json()
}