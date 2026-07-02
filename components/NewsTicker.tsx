import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Newspaper, Activity } from 'lucide-react';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface NewsItem {
  headline: string;
  url: string;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    headline: "VectraSim Suite launched featuring browser-based multi-engine robotics simulation.",
    url: "https://github.com/Yashs2024"
  },
  {
    headline: "IEEE Spectrum reports breakthrough in reinforcement learning for quadrotor swarm coordination.",
    url: "https://spectrum.ieee.org"
  },
  {
    headline: "ROS 2 Jazzy Jalisco gains widespread adoption in next-gen industrial automated guided vehicles (AGVs).",
    url: "https://www.ros.org"
  },
  {
    headline: "NASA's JPL tests next-generation autonomous navigation algorithms for multi-terrain surface exploration.",
    url: "https://www.jpl.nasa.gov"
  },
  {
    headline: "Industrial automation sector sees 25% surge in intelligent edge sorting systems deployment.",
    url: "https://www.controleng.com"
  }
];

const NewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!ai) {
        setNews(FALLBACK_NEWS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Find the latest top 5 news headlines about robotics, AI, and technology. Return them as a JSON array of objects with "headline" and "url" properties. Ensure the URLs are real and valid.',
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ['headline', 'url']
              }
            }
          }
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          setNews(parsed);
        } else {
          setNews(FALLBACK_NEWS);
        }
      } catch (error) {
        console.warn('Failed to fetch live news from Gemini (quota or connection limit reached). Falling back to cached intel feed.', error);
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh hourly
    const interval = setInterval(fetchNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && news.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-space-900 border-t border-cyan-900/50 text-cyan-400 text-xs font-mono py-2 px-4 z-50 flex items-center">
        <Activity className="w-4 h-4 mr-2 animate-pulse" />
        <span>FETCHING LATEST ROBOTICS INTEL...</span>
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-space-900 border-t border-cyan-900/50 text-gray-300 text-xs font-mono py-2 z-50 flex items-center overflow-hidden">
      <div className="flex items-center px-4 bg-space-900 z-10 border-r border-cyan-900/50 shadow-[5px_0_10px_rgba(0,0,0,0.5)]">
        <Newspaper className="w-4 h-4 mr-2 text-cyan-400" />
        <span className="font-bold text-cyan-400 whitespace-nowrap">LIVE FEED</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {news.map((item, index) => (
            <React.Fragment key={index}>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors mx-4"
              >
                {item.headline}
              </a>
              <span className="text-cyan-800 mx-2">///</span>
            </React.Fragment>
          ))}
          {/* Duplicate for seamless loop */}
          {news.map((item, index) => (
            <React.Fragment key={`dup-${index}`}>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors mx-4"
              >
                {item.headline}
              </a>
              <span className="text-cyan-800 mx-2">///</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
