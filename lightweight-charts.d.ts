
// lightweight-charts.d.ts
// Add this file to your project root or types folder

declare module 'lightweight-charts' {
  export interface IChartApi {
    addCandlestickSeries(options?: any): any;
    addLineSeries(options?: any): any;
    addAreaSeries(options?: any): any;
    addBarSeries(options?: any): any;
    addHistogramSeries(options?: any): any;
    timeScale(): any;
    priceScale(priceScaleId?: string): any;
    applyOptions(options: any): void;
    remove(): void;
    resize(width: number, height: number): void;
    takeScreenshot(): any;
    subscribeClick(handler: any): void;
    subscribeCrosshairMove(handler: any): void;
    subscribeVisibleTimeRangeChange(handler: any): void;
    unsubscribeClick(handler: any): void;
    unsubscribeCrosshairMove(handler: any): void;
    unsubscribeVisibleTimeRangeChange(handler: any): void;
  }

  export enum ColorType {
    Solid = 'solid',
    VerticalGradient = 'gradient',
  }

  export function createChart(container: HTMLElement, options?: any): IChartApi;
}