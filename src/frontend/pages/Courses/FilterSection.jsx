import React from "react";

function FilterSection({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  selectedLevel,
  setSelectedLevel,
  showOnlyFavorites,
  setShowOnlyFavorites,
  showOnlyEnrolled,
  setShowOnlyEnrolled,
  favoritesCount,
  enrolledCount,
}) {
  return (
    <div className="search-filter-container">
      <div className="search-sort-row">
        <div className="search-bar-wrapper">
          <svg
            className="search-icon-svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search courses, skills, tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-wrapper">
          <span className="sort-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="name">Alphabetical (A-Z)</option>
            <option value="duration">Duration (Shortest)</option>
          </select>
        </div>
      </div>

      <div className="filter-row">
        {/* Level Filter Chips */}
        <div className="filter-chips">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              className={`filter-chip ${selectedLevel === level ? "active" : ""}`}
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Favorites & Enrolled Toggles */}
        <div className="toggles-group">
          <div
            className="favorites-toggle-wrapper"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            <input
              type="checkbox"
              className="favorites-checkbox"
              checked={showOnlyFavorites}
              onChange={() => {}}
            />
            <span className="favorites-label">
              Favorites ({favoritesCount})
            </span>
          </div>

          <div
            className="favorites-toggle-wrapper"
            onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
          >
            <input
              type="checkbox"
              className="favorites-checkbox enrolled-checkbox"
              checked={showOnlyEnrolled}
              onChange={() => {}}
            />
            <span className="favorites-label">
              My Enrolled ({enrolledCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
