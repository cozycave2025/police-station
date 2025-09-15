'use client';
import Header from '@/components/header';
import { useState, useEffect } from 'react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [headlineNews, setHeadlineNews] = useState(null);
  const itemsPerPage = 5;

  // Fetch news from API
  const fetchNews = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      if (response.ok) {
        if (reset) {
          setNews(data.news);
          setDisplayedNews(data.news);
        } else {
          setNews(prev => [...prev, ...data.news]);
          setDisplayedNews(prev => [...prev, ...data.news]);
        }
        setHasMore(data.hasMore);
        
        // Set headline news (first news item with type 'headline' or first item)
        if (reset || !headlineNews) {
          const headline = data.news.find(item => item.type === 'headline') || data.news[0];
          setHeadlineNews(headline);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  // Handle load more functionality
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNews(nextPage, false);
  };

  // Filter news based on selected category
  const filteredNews = selectedCategory === 'All' ? displayedNews : displayedNews.filter((article) => article.category === selectedCategory);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="relative h-[450px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Guinée News Today</h1>
          <p className="text-xl md:text-2xl text-white opacity-80 max-w-2xl text-center">
            Your source for the latest news and updates from Guinea
          </p>
        </div>
      </section>

      {/* Category Filter */}
      

      {/* Headline */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Top Headline</h2>
        {headlineNews ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <img src={headlineNews.image} alt={headlineNews.title} className="w-full h-96 object-cover" />
            <div className="p-8">
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">{headlineNews.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{headlineNews.description}</p>
              <p className="text-gray-500 text-sm">Published on {headlineNews.createdAt} • {headlineNews.category}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No headline available</p>
        )}
      </section>

      {/* News Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(0, 5).map((article) => (
            <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={article.image} alt={article.title} className="w-full h-60 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-3">{article.description}</p>
                <p className="text-gray-500 text-sm">Published on {article.createdAt} • {article.category}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMore && filteredNews.length >= 5 && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More News'}
            </button>
          </div>
        )}
        
        {filteredNews.length === 0 && !loading && (
          <p className="text-center text-gray-600 mt-8">No news available in this category</p>
        )}
      </section>
    </div>
    </>
  );
}