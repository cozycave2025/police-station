'use client';

import { useState, useEffect } from 'react';

export default function NewsPage() {
  // Dummy news data for Guinea (replace with API call)
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Conakry Cultural Festival Celebrates Guinean Heritage',
      description: 'The 2025 Conakry Cultural Festival drew thousands to showcase traditional music, dance, and crafts at the Palais du Peuple.',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
      date: '2025-09-14',
      category: 'Culture',
    },
    {
      id: 2,
      title: 'New Solar Power Plant Opens in Kankan',
      description: 'A new solar power plant was inaugurated in Kankan, aiming to provide sustainable energy to over 50,000 households.',
      image: 'https://guinea.iom.int/sites/g/files/tmzbdl796/files/styles/max_1300x1300/public/stories/2023-05/0i1a9495.jpg?itok=SSMQHKHI',
      date: '2025-09-13',
      category: 'Infrastructure',
    },
    {
      id: 3,
      title: 'Guinea National Football Team Prepares for AFCON',
      description: 'The Syli National team began training in Conakry for the 2026 Africa Cup of Nations, boosting national pride.',
      image: 'https://guinea.iom.int/sites/g/files/tmzbdl796/files/styles/max_1300x1300/public/stories/2023-05/337519453_1283708708887892_3661657572976708681_n-enhanced-sr_0.jpg?itok=5qnCOasq',
      date: '2025-09-12',
      category: 'Sports',
    },
    {
      id: 4,
      title: 'Government Launches Free Education Program in Labé',
      description: 'A new initiative in Labé provides free primary education, aiming to increase school attendance across the region.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
      date: '2025-09-11',
      category: 'Education',
    },
   
   
    {
      id: 7,
      title: 'Conakry Port Expansion Project Approved',
      description: 'The government approved a plan to expand Conakry’s port, aiming to enhance trade and logistics.',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
      date: '2025-09-08',
      category: 'Infrastructure',
    },
    {
      id: 8,
      title: 'Guinea’s Music Scene Shines at International Festival',
      description: 'Guinean artists wowed audiences at an international music festival, promoting Mande music globally.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      date: '2025-09-07',
      category: 'Culture',
    },
    {
      id: 9,
      title: 'Youth Entrepreneurship Program Launched in Kindia',
      description: 'A new program in Kindia supports young entrepreneurs with training and funding to start businesses.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      date: '2025-09-06',
      category: 'Education',
    },
    
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simulate fetching news from an API
  useEffect(() => {
    // Replace with actual API call, e.g., fetch('/api/news')
    // const fetchNews = async () => {
    //   try {
    //     const res = await fetch('/api/news');
    //     const data = await res.json();
    //     setNews(data);
    //   } catch (err) {
    //     console.error('Error fetching news:', err);
    //   }
    // };
    // fetchNews();
  }, []);

  // Filter news based on selected category
  const filteredNews = selectedCategory === 'All' ? news : news.filter((article) => article.category === selectedCategory);

  return (
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
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {['All', 'Culture', 'Infrastructure', 'Sports', 'Education', 'Economy', 'Agriculture', 'Politics'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-green-100'
              } border border-gray-300 shadow-sm`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Headline */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Top Headline</h2>
        {news.length > 0 ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <img src={news[0].image} alt={news[0].title} className="w-full h-96 object-cover" />
            <div className="p-8">
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">{news[0].title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{news[0].description}</p>
              <p className="text-gray-500 text-sm">Published on {news[0].date} • {news[0].category}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No headline available</p>
        )}
      </section>

      {/* News Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">More News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(1).map((article) => (
            <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={article.image} alt={article.title} className="w-full h-60 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-3">{article.description}</p>
                <p className="text-gray-500 text-sm">Published on {article.date} • {article.category}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredNews.length <= 1 && (
          <p className="text-center text-gray-600 mt-8">No additional news in this category</p>
        )}
      </section>
    </div>
  );
}