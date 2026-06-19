import React, { useState, useMemo } from 'react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { enrollments, enrollmentFilters } from '../../data/enrollments.js';
import '../../styles/table.css';
import './Enrollments.css';

const ITEMS_PER_PAGE = 10;

function Enrollments() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        e.studentName.toLowerCase().includes(search.toLowerCase()) ||
        e.course.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status === 'all' || e.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="admin-page-content">
      <SectionHeader title="Enrollments" subtitle="Track all student enrollments and progress" />

      <div className="admin-table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search enrollments..."
            />
          </div>
          <div className="table-toolbar-right">
            <FilterBar
              filters={[{ key: 'status', options: enrollmentFilters.status }]}
              values={filters}
              onChange={(k, v) => { setFilters({ ...filters, [k]: v }); setCurrentPage(1); }}
            />
          </div>
        </div>

        {paginated.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enroll Date</th>
                <th>Progress</th>
                <th>Lessons</th>
                <th>Status</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="table-user-cell">
                      <div className="table-user-avatar">
                        {e.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="table-user-info">
                        <span className="table-user-name">{e.studentName}</span>
                        <span className="table-user-email">{e.studentEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>{e.course}</td>
                  <td>
                    {new Date(e.enrollDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="enrollments-progress-cell">
                    <ProgressBar value={e.progress} showLabel />
                  </td>
                  <td>{e.completedLessons}/{e.totalLessons}</td>
                  <td><Badge variant={e.status} dot>{e.status}</Badge></td>
                  <td>
                    {e.completionDate
                      ? new Date(e.completionDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No enrollments found" />
        )}

        <div className="table-footer">
          <span className="table-footer-info">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default Enrollments;
