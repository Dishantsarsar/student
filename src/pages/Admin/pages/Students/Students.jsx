import React, { useState, useMemo } from 'react';
import { Plus, Eye, Edit, UserX, Trash2 } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { students, studentFilters } from '../../data/students.js';
import '../../styles/table.css';
import '../../styles/buttons.css';
import '../../styles/forms.css';
import './Students.css';


const ITEMS_PER_PAGE = 10;

function Students() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status === 'all' || s.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openModal = (student, type) => {
    setSelectedStudent(student);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalType(null);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="admin-page-content">
      <SectionHeader title="Students" subtitle="Manage all registered students">
        <button className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Student
        </button>
      </SectionHeader>

      <div className="admin-table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search students..."
            />
          </div>
          <div className="table-toolbar-right">
            <FilterBar
              filters={[{ key: 'status', options: studentFilters.status }]}
              values={filters}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {paginatedStudents.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Phone</th>
                <th>Courses</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="table-user-cell">
                      <div className="table-user-avatar">{getInitials(s.name)}</div>
                      <div className="table-user-info">
                        <span className="table-user-name">{s.name}</span>
                        <span className="table-user-email">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{s.phone}</td>
                  <td>{s.enrolledCount}</td>
                  <td className="students-progress-cell">
                    <ProgressBar value={s.progress} showLabel />
                  </td>
                  <td><Badge variant={s.status} dot>{s.status}</Badge></td>
                  <td>{formatDate(s.joinDate)}</td>
                  <td className="col-actions">
                    <div className="table-actions">
                      <button className="table-action-btn" title="View" onClick={() => openModal(s, 'view')}><Eye size={13} /></button>
                      <button className="table-action-btn" title="Edit" onClick={() => openModal(s, 'edit')}><Edit size={13} /></button>
                      <button className="table-action-btn" title="Suspend" onClick={() => openModal(s, 'suspend')}><UserX size={13} /></button>
                      <button className="table-action-btn danger" title="Delete" onClick={() => openModal(s, 'delete')}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No students found" description="Try adjusting your search or filters." />
        )}

        <div className="table-footer">
          <span className="table-footer-info">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={modalType === 'view'} onClose={closeModal} title="Student Details" size="md">
        {selectedStudent && (
          <div className="modal-student-view">
            <div className="modal-student-header">
              <div className="table-user-avatar modal-avatar">{getInitials(selectedStudent.name)}</div>
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.email}</p>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Phone</label>
                <p className="modal-field-value">{selectedStudent.phone}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <Badge variant={selectedStudent.status} dot>{selectedStudent.status}</Badge>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Enrolled Courses</label>
              <p className="modal-field-value">{selectedStudent.courses.join(', ')}</p>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Overall Progress</label>
              <ProgressBar value={selectedStudent.progress} showLabel />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Join Date</label>
                <p className="modal-field-value">{selectedStudent.joinDate}</p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Last Active</label>
                <p className="modal-field-value">{selectedStudent.lastActive}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        title="Edit Student"
        size="md"
        footer={<><button className="admin-btn admin-btn-secondary" onClick={closeModal}>Cancel</button><button className="admin-btn admin-btn-primary" onClick={closeModal}>Save Changes</button></>}
      >
        {selectedStudent && (
          <div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">Full Name</label><input className="admin-input" defaultValue={selectedStudent.name} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Email</label><input className="admin-input" defaultValue={selectedStudent.email} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label className="admin-form-label">Phone</label><input className="admin-input" defaultValue={selectedStudent.phone} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Status</label>
                <select className="admin-select" defaultValue={selectedStudent.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        title="Delete Student"
        size="sm"
        footer={<><button className="admin-btn admin-btn-secondary" onClick={closeModal}>Cancel</button><button className="admin-btn admin-btn-danger" onClick={closeModal}>Delete</button></>}
      >
        <p className="modal-confirm-text">Are you sure you want to delete <strong>{selectedStudent?.name}</strong>? This action cannot be undone.</p>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        isOpen={modalType === 'suspend'}
        onClose={closeModal}
        title="Suspend Student"
        size="sm"
        footer={<><button className="admin-btn admin-btn-secondary" onClick={closeModal}>Cancel</button><button className="admin-btn admin-btn-warning" onClick={closeModal}>Suspend</button></>}
      >
        <p className="modal-confirm-text">Are you sure you want to suspend <strong>{selectedStudent?.name}</strong>? They will lose access to all courses.</p>
      </Modal>
    </div>
  );
}

export default Students;
