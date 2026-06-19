import React, { useState, useMemo } from 'react';
import { Plus, Eye, Edit, Trash2, LayoutGrid, List, Star } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { courses, courseFilters } from '../../data/courses.js';
import '../../styles/table.css';
import '../../styles/buttons.css';
import '../../styles/cards.css';
import './Courses.css';

const ITEMS_PER_PAGE = 10;

function Courses() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', level: 'All Levels' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status === 'all' || c.status === filters.status;
      const matchesLevel = filters.level === 'All Levels' || c.level === filters.level;
      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="admin-page-content">
      <SectionHeader title="Courses" subtitle="Manage all courses on the platform">
        <div className="view-toggle">
          <button
            className={`view-toggle-btn${viewMode === 'table' ? ' active' : ''}`}
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <List size={15} />
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
        <button className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Course
        </button>
      </SectionHeader>

      {/* Toolbar */}
      <div className="courses-toolbar">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search courses..."
        />
        <FilterBar
          filters={[
            { key: 'status', options: courseFilters.status },
            { key: 'level', options: courseFilters.level },
          ]}
          values={filters}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="admin-table-wrapper">
          {paginatedCourses.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Level</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="course-emoji-cell">{c.emoji}</div>
                        <div className="table-user-info">
                          <span className="table-user-name">{c.title}</span>
                          <span className="table-user-email">₹{c.price.toLocaleString()} · {c.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td>{c.category}</td>
                    <td>{c.instructor}</td>
                    <td>
                      <Badge
                        variant={c.level === 'Advanced' ? 'high' : c.level === 'Intermediate' ? 'medium' : 'default'}
                      >
                        {c.level}
                      </Badge>
                    </td>
                    <td>{c.students.toLocaleString()}</td>
                    <td>
                      {c.rating > 0 ? (
                        <span className="course-rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating}
                        </span>
                      ) : '—'}
                    </td>
                    <td><Badge variant={c.status} dot>{c.status}</Badge></td>
                    <td className="col-actions">
                      <div className="table-actions">
                        <button
                          className="table-action-btn"
                          title="View"
                          onClick={() => { setSelectedCourse(c); setModalType('view'); }}
                        >
                          <Eye size={13} />
                        </button>
                        <button className="table-action-btn" title="Edit"><Edit size={13} /></button>
                        <button className="table-action-btn danger" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No courses found" />
          )}
          <div className="table-footer">
            <span className="table-footer-info">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)} of {filteredCourses.length}
            </span>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {paginatedCourses.length > 0 ? (
            <div className="courses-grid">
              {paginatedCourses.map((c, i) => (
                <div
                  key={c.id}
                  className="course-grid-card admin-card"
                  style={{ '--card-delay': `${i * 50}ms` }}
                >
                  <div className="course-grid-emoji">{c.emoji}</div>
                  <div className="course-grid-body">
                    <h3 className="course-grid-title">{c.title}</h3>
                    <p className="course-grid-desc">{c.description}</p>
                    <div className="course-grid-meta">
                      <span>{c.instructor}</span>
                      <span>·</span>
                      <span>{c.duration}</span>
                      <span>·</span>
                      <Badge variant={c.status} dot>{c.status}</Badge>
                    </div>
                    <div className="course-grid-footer">
                      <span className="course-grid-price">₹{c.price.toLocaleString()}</span>
                      <span className="course-grid-students">{c.students.toLocaleString()} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No courses found" />
          )}
          <div className="courses-pagination-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      )}

      {/* View Modal */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={() => setModalType(null)}
        title="Course Details"
        size="lg"
      >
        {selectedCourse && (
          <div className="course-modal-body">
            <div className="course-modal-emoji">{selectedCourse.emoji}</div>
            <h2 className="course-modal-title">{selectedCourse.title}</h2>
            <p className="course-modal-desc">{selectedCourse.description}</p>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <p className="modal-field-value">{selectedCourse.category}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Instructor</label>
                <p className="modal-field-value">{selectedCourse.instructor}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Level</label>
                <p className="modal-field-value">{selectedCourse.level}</p>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Price</label>
                <p className="modal-field-value">₹{selectedCourse.price.toLocaleString()}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Duration</label>
                <p className="modal-field-value">{selectedCourse.duration}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Lessons</label>
                <p className="modal-field-value">{selectedCourse.lessons}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Courses;
