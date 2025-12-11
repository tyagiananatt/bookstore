import React from 'react';
import './GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onGenreChange }) => {
  const allGenres = ['All', ...genres];

  return (
    <div className="genre-filter">
      <label className="filter-label">Filter by Genre:</label>
      <div className="genre-buttons">
        {allGenres.map((genre) => (
          <button
            key={genre}
            className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;

