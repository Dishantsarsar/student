import React, { useState, useMemo } from 'react';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { reviews, reviewFilters } from '../../data/reviews.js';
import '../../styles/table.css';
import '../../styles/cards.css';
import './Reviews.css';


const ITEMS_PER_PAGE = 8;

function Reviews() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', rating: 'All Ratings' });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.course.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status === 'all' || r.status === filters.status;
      const matchesRating = filters.rating === 'All Ratings' || r.rating === parseInt(filters.rating[0]);
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < rating ? '#f59e0b' : 'transparent'}
        color={i < rating ? '#f59e0b' : 'var(--admin-text-muted)'}
      />
    ));

  return (
    <div className="admin-page-content">
      <SectionHeader title="Reviews" subtitle="Moderate student reviews and ratings" />

      <div className="reviews-toolbar">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search reviews..."
        />
        <FilterBar
          filters={[
            { key: 'status', options: reviewFilters.status },
            { key: 'rating', options: reviewFilters.rating },
          ]}
          values={filters}
          onChange={(k, v) => { setFilters({ ...filters, [k]: v }); setCurrentPage(1); }}
        />
      </div>

      {paginated.length > 0 ? (
        <div className="reviews-grid">
          {paginated.map((r) => (
            <div key={r.id} className="admin-card review-card">
              <div className="review-card-header">
                <div className="review-card-author">
                  <div className="table-user-avatar review-avatar">
                    {r.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="review-author-name">{r.studentName}</div>
                    <div className="review-author-course">{r.course}</div>
                  </div>
                </div>
                <Badge variant={r.status} dot>{r.status}</Badge>
              </div>

              <div className="review-stars">{renderStars(r.rating)}</div>

              <p className="review-comment">"{r.comment}"</p>

              <div className="review-card-footer">
                <span className="review-date">{r.date}</span>
                <div className="table-actions" style={{ opacity: 1 }}>
                  {r.status === 'pending' && (
                    <button className="table-action-btn success" title="Approve"><Check size={13} /></button>
                  )}
                  <button className="table-action-btn" title="Hide"><EyeOff size={13} /></button>
                  <button className="table-action-btn danger" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No reviews found" />
      )}

      <div className="reviews-pagination">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default Reviews;
