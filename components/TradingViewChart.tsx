import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType, PriceScaleMode } from "lightweight-charts";
import { generateOHLCData } from "@/lib/utils";


 
interface TradingViewChartProps {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceData: any; // Pre-fetched price data
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ priceData }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Initialize the chart
  useEffect(() => {
    if (chartContainerRef.current) {
      // Create the chart only once
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          textColor: "#d1d4dc",
          background : { type: ColorType.Solid, color: '#000000' }// Light text color
        },
        grid: {
          vertLines: {
            color: "#444444",
          },
          horzLines: {
            color: "#444444",
          },
        },
        crosshair: {
          vertLine: {
            color: "#758696",
            width: 1,
          },
          horzLine: {
            color: "#758696",
            width: 1,
          },
        },
        rightPriceScale: {
          borderColor: "#555555",
          autoScale: true,
          mode: PriceScaleMode.Normal, // Default mode
        },
        timeScale: {
          borderColor: "#555555",
        },
      });

      // Store chart instance
      chartInstanceRef.current = chart;

      // Create candlestick series and store the instance
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#4fff44", // Bullish color (Green)
        borderUpColor: "#4fff44", // Border for bullish candles
        wickUpColor: "#4fff44", // Wick color for bullish candles
        downColor: "#ff4976", // Bearish color (Red)
        borderDownColor: "#ff4976", // Border for bearish candles
        priceFormat: {
            type: 'price',
            precision: 15, // Number of decimal places to display
            minMove: 0.000000000000001,    // Smallest price movement (scaled)
        },
        wickDownColor: "#ff4976", // Wick color for bearish candles
      });

      candlestickSeriesRef.current = candlestickSeries;

      // Fit chart content
      chart.timeScale().fitContent();
    }

    // Cleanup on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Update the chart data when priceData changes
  useEffect(() => {
    if (candlestickSeriesRef.current && priceData.length > 0) {
      // Format the price data for the chart (convert timestamp to milliseconds)
      const ohlc = generateOHLCData(priceData,15);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = ohlc.map((entry: any) => ({
        time: entry.time , // Already in seconds, no need to multiply by 1000
        open: parseFloat(entry.open) ,
        high: parseFloat(entry.high),
        low: parseFloat(entry.low) ,
        close: parseFloat(entry.close),
      }));

      // Set data to the chart
      candlestickSeriesRef.current.setData(formattedData as CandlestickData[]); // Explicit cast to CandlestickData type
    }
  }, [priceData]); // Only update when priceData changes

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px", position: "relative" }}
    />
  );
};

export default TradingViewChart;
