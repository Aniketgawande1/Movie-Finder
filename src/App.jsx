import React, { useState, useEffect } from 'react';
import { Search, Film, Star, Calendar, Clock, Award, ChevronLeft, Loader } from 'lucide-react';

export default function MovieFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialState, setIsInitialState] = useState(true);
  
  // Use your own API key when implementing
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '55b491b1';
  
  const searchMovies = async () => {
    if (searchTerm.trim() === '') {
      setError('Please enter a movie title');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setIsInitialState(false);
      
      // Log the API call for debugging
      const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
      console.log('API Request:', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.Response === 'True') {
        setMovies(data.Search);
        setError('');
      } else {
        setMovies([]);
        setError(data.Error || 'No movies found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getMovieDetails = async (imdbID) => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        setSelectedMovie(data);
      } else {
        setError('Failed to fetch movie details');
      }
    } catch (err) {
      setError('Error loading movie details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies();
    }
  };
  
  const goBackToResults = () => {
    setSelectedMovie(null);
  };
  
  // Functions to generate random gradient backgrounds for movie cards without posters
  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-r from-purple-500 to-indigo-500',
      'bg-gradient-to-r from-blue-500 to-teal-500',
      'bg-gradient-to-r from-red-500 to-pink-500',
      'bg-gradient-to-r from-yellow-400 to-orange-500',
      'bg-gradient-to-r from-green-400 to-blue-500',
      'bg-gradient-to-r from-pink-500 to-purple-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };
  
  // Function to render stars based on rating
  const renderRatingStars = (rating) => {
    if (!rating || rating === 'N/A') return null;
    
    // Convert to number out of 10 if it's in format "X.X/10"
    let numRating = 0;
    if (rating.includes('/')) {
      const parts = rating.split('/');
      numRating = parseFloat(parts[0]);
      if (parts[1] === '100') numRating = numRating / 10;
    } else {
      // Try to parse as a float directly
      numRating = parseFloat(rating);
    }
    
    // If still not a valid number, return null
    if (isNaN(numRating)) return null;
    
    // Normalize to a scale of 5
    const starsCount = Math.round(numRating / 2);
    
    return (
      <div className="flex mt-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < starsCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10 pt-6">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Movie Finder
          </h1>
          <p className="text-gray-300 text-lg">Discover thousands of movies and their details</p>
        </header>
        
        <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-900/20 p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a movie..."
                className="pl-10 w-full p-4 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/40 border border-red-700 text-red-200 rounded-xl flex items-center">
              <div className="mr-3 flex-shrink-0 bg-red-800 rounded-full p-1">
                <svg className="h-4 w-4 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {isInitialState && (
          <div className="flex flex-col items-center justify-center py-16">
            <Film size={80} className="text-purple-400 mb-6 opacity-50" />
            <h3 className="text-2xl font-medium text-gray-400 mb-3">Ready to explore movies?</h3>
            <p className="text-gray-500 text-center max-w-md">
              Enter a movie title above and discover information about your favorite films.
            </p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-white bg-purple-700 shadow">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Searching for movies...
            </div>
          </div>
        )}
        
        {!loading && !selectedMovie && movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-purple-400 mr-2">Results</span>
              <span className="text-gray-400">for "{searchTerm}"</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div 
                  key={movie.imdbID}
                  onClick={() => getMovieDetails(movie.imdbID)}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-900/30 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 group border border-gray-700 hover:border-purple-500/50"
                >
                  <div className="relative overflow-hidden" style={{ height: "360px" }}>
                    {movie.Poster && movie.Poster !== 'N/A' ? (
                      <img 
                        src={movie.Poster} 
                        alt={movie.Title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                        onError={(e) => {
                          e.target.parentNode.className = `${getRandomGradient()} flex items-center justify-center h-full`;
                          e.target.outerHTML = '<div class="text-white text-center p-4"><span class="text-6xl block mb-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path></svg></span>' + movie.Title + '</div>';
                        }}
                      />
                    ) : (
                      <div className={`${getRandomGradient()} flex items-center justify-center h-full`}>
                        <div className="text-white text-center p-4">
                          <span className="text-6xl block mb-2">
                            <Film />
                          </span>
                          {movie.Title}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-lg font-bold text-white">{movie.Title}</p>
                        <div className="flex items-center text-gray-300 text-sm mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>{movie.Year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{movie.Title}</h3>
                    <p className="text-gray-400 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {movie.Year}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mr-2">
                        {movie.Type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedMovie && (
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="relative">
              {/* Hero backdrop - blurred movie poster as background */}
              <div className="absolute inset-0 overflow-hidden">
                {selectedMovie.Poster && selectedMovie.Poster !== 'N/A' ? (
                  <img 
                    src={selectedMovie.Poster} 
                    alt="" 
                    className="w-full h-full object-cover filter blur-md scale-110 opacity-30"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900"></div>
              </div>
              
              {/* Header with back button */}
              <div className="relative p-6 flex items-center">
                <button 
                  onClick={goBackToResults}
                  className="p-2 rounded-full bg-gray-800/80 hover:bg-purple-600 transition-colors mr-4"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl md:text-3xl font-bold">{selectedMovie.Title}</h2>
              </div>
              
              {/* Main content */}
              <div className="relative md:flex">
                {/* Poster column */}
                <div className="md:w-1/3 p-6 flex justify-center md:justify-end">
                  <div className="relative group">
                    {selectedMovie.Poster && selectedMovie.Poster !== 'N/A' ? (
                      <img 
                        src={selectedMovie.Poster} 
                        alt={selectedMovie.Title} 
                        className="w-64 md:w-80 rounded-xl shadow-2xl shadow-purple-900/20 border-2 border-gray-700 group-hover:border-purple-500/50 transition-all duration-300"
                        onError={(e) => {
                          e.target.parentNode.className = `${getRandomGradient()} flex items-center justify-center h-96 w-64 md:w-80 rounded-xl shadow-2xl`;
                          e.target.outerHTML = '<div class="text-white text-center p-4"><span class="text-6xl block mb-4"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path></svg></span>No Poster Available</div>';
                        }}
                      />
                    ) : (
                      <div className={`${getRandomGradient()} flex items-center justify-center h-96 w-64 md:w-80 rounded-xl shadow-2xl`}>
                        <div className="text-white text-center p-4">
                          <span className="text-6xl block mb-4">
                            <Film />
                          </span>
                          No Poster Available
                        </div>
                      </div>
                    )}
                    {selectedMovie.imdbRating && selectedMovie.imdbRating !== 'N/A' && (
                      <div className="absolute -top-4 -right-4 bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-2 border-yellow-600">
                        <div className="text-center">
                          <div className="font-bold text-gray-900 text-lg leading-none">{selectedMovie.imdbRating}</div>
                          <div className="text-yellow-800 text-xs">IMDb</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Details column */}
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {selectedMovie.Year && selectedMovie.Year !== 'N/A' && (
                      <span className="flex items-center gap-1 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        <Calendar size={14} />
                        {selectedMovie.Year}
                      </span>
                    )}
                    {selectedMovie.Rated && selectedMovie.Rated !== 'N/A' && (
                      <span className="bg-red-900/60 text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedMovie.Rated}
                      </span>
                    )}
                    {selectedMovie.Runtime && selectedMovie.Runtime !== 'N/A' && (
                      <span className="flex items-center gap-1 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        <Clock size={14} />
                        {selectedMovie.Runtime}
                      </span>
                    )}
                  </div>
                  
                  {selectedMovie.Genre && selectedMovie.Genre !== 'N/A' && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.Genre.split(', ').map((genre, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-purple-900/40 text-purple-200 rounded-full text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedMovie.Plot && selectedMovie.Plot !== 'N/A' && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-3 text-purple-300">Plot</h3>
                      <p className="text-gray-300 leading-relaxed">{selectedMovie.Plot}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedMovie.Director && selectedMovie.Director !== 'N/A' && (
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-purple-300">Director</h3>
                        <p className="text-gray-300">{selectedMovie.Director}</p>
                      </div>
                    )}
                    
                    {selectedMovie.Writer && selectedMovie.Writer !== 'N/A' && (
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-purple-300">Writer</h3>
                        <p className="text-gray-300">{selectedMovie.Writer}</p>
                      </div>
                    )}
                    
                    {selectedMovie.Actors && selectedMovie.Actors !== 'N/A' && (
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold mb-2 text-purple-300">Cast</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMovie.Actors.split(', ').map((actor, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedMovie.Awards && selectedMovie.Awards !== 'N/A' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/30 to-amber-900/10 rounded-xl border border-yellow-800/50">
                      <div className="flex items-start">
                        <Award size={24} className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg font-bold mb-1 text-yellow-400">Awards</h3>
                          <p className="text-yellow-200/80">{selectedMovie.Awards}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedMovie.Ratings && selectedMovie.Ratings.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold mb-3 text-purple-300">Ratings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {selectedMovie.Ratings.map((rating, index) => (
                          <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-purple-500/50 transition-colors">
                            <h4 className="font-medium text-gray-300 mb-2">{rating.Source}</h4>
                            <div className="flex items-center">
                              {rating.Source === 'Internet Movie Database' && (
                                <div className="flex">
                                  {renderRatingStars(rating.Value)}
                                </div>
                              )}
                              <p className="text-2xl font-bold text-white ml-auto">{rating.Value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedMovie.Released && selectedMovie.Released !== 'N/A' && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Released</h4>
                        <p className="text-white">{selectedMovie.Released}</p>
                      </div>
                    )}
                    
                    {selectedMovie.BoxOffice && selectedMovie.BoxOffice !== 'N/A' && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Box Office</h4>
                        <p className="text-white">{selectedMovie.BoxOffice}</p>
                      </div>
                    )}
                    
                    {selectedMovie.Production && selectedMovie.Production !== 'N/A' && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Production</h4>
                        <p className="text-white">{selectedMovie.Production}</p>
                      </div>
                    )}
                    
                    {selectedMovie.Country && selectedMovie.Country !== 'N/A' && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Country</h4>
                        <p className="text-white">{selectedMovie.Country}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-12 py-6 text-center text-gray-500">
        <p>Movie data provided by OMDB API</p>
      </footer>
    </div>
  );
}