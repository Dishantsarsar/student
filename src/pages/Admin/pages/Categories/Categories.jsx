import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { categories } from '../../data/categories.js';
import '../../styles/cards.css';
import '../../styles/buttons.css';
import '../../styles/forms.css';
import './Categories.css';

function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const openEdit = (cat) => { setEditCategory(cat); setModalOpen(true); };
  const openAdd = () => { setEditCategory(null); setModalOpen(true); };

  return (
    <div className="admin-page-content">
      <SectionHeader title="Categories" subtitle="Manage course categories">
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Category
        </button>
      </SectionHeader>

      <div className="categories-grid">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className="admin-card category-card"
            style={{ '--card-delay': `${i * 50}ms` }}
          >
            <div className="category-card-header">
              <div className="category-card-left">
                <div className="category-icon-wrap" style={{ background: `${cat.color}18` }}>
                  <span className="category-icon-emoji">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="category-name">{cat.name}</h3>
                  <Badge variant={cat.status} dot>{cat.status}</Badge>
                </div>
              </div>
              <div className="table-actions" style={{ opacity: 1 }}>
                <button className="table-action-btn" title="Edit" onClick={() => openEdit(cat)}>
                  <Edit size={13} />
                </button>
                <button className="table-action-btn danger" title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="category-desc">{cat.description}</p>

            <div className="category-card-footer">
              <span className="category-course-count">
                <strong>{cat.courseCount}</strong> Courses
              </span>
              <span className="cat-color-dot" style={{ background: cat.color }} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? 'Edit Category' : 'Add Category'}
        size="md"
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={() => setModalOpen(false)}>Save</button>
          </>
        }
      >
        <div className="admin-form-group">
          <label className="admin-form-label">Category Name</label>
          <input className="admin-input" defaultValue={editCategory?.name || ''} placeholder="Enter category name" />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea className="admin-textarea" defaultValue={editCategory?.description || ''} placeholder="Enter description" />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Icon (Emoji)</label>
            <input className="admin-input" defaultValue={editCategory?.icon || ''} placeholder="e.g. 💻" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select className="admin-select" defaultValue={editCategory?.status || 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Categories;
