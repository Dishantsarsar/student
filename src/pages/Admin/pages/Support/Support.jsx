import React, { useState, useMemo } from 'react';
import { Send } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Drawer from '../../components/Drawer/Drawer.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { supportTickets, supportFilters } from '../../data/support.js';
import '../../styles/table.css';
import '../../styles/forms.css';

const ITEMS_PER_PAGE = 8;

function Support() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'All Priorities' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = useMemo(() => {
    return supportTickets.filter((t) => {
      const matchesSearch =
        t.studentName.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filters.status === 'all' || t.status === filters.status;
      const matchesPriority = filters.priority === 'All Priorities' || t.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openTicket = (t) => {
    setSelectedTicket(t);
    setReplyText('');
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleString('en-IN', {
      hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
    });

  return (
    <div className="admin-page-content">
      <SectionHeader title="Support" subtitle="Manage student support tickets" />

      <div className="admin-table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search tickets..."
            />
          </div>
          <div className="table-toolbar-right">
            <FilterBar
              filters={[
                { key: 'status', options: supportFilters.status },
                { key: 'priority', options: supportFilters.priority },
              ]}
              values={filters}
              onChange={(k, v) => { setFilters({ ...filters, [k]: v }); setCurrentPage(1); }}
            />
          </div>
        </div>

        {paginated.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th className="col-actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr key={t.id}>
                  <td className="table-mono">{t.id}</td>
                  <td>
                    <div className="table-user-info">
                      <span className="table-user-name">{t.studentName}</span>
                      <span className="table-user-email">{t.studentEmail}</span>
                    </div>
                  </td>
                  <td className="cell-truncate" style={{ maxWidth: '200px' }}>{t.subject}</td>
                  <td><Badge variant="default">{t.category}</Badge></td>
                  <td><Badge variant={t.priority} dot>{t.priority}</Badge></td>
                  <td><Badge variant={t.status} dot>{t.status}</Badge></td>
                  <td>
                    {new Date(t.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </td>
                  <td className="col-actions">
                    <div className="table-actions">
                      <button
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                        onClick={() => openTicket(t)}
                      >
                        Reply
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No tickets found" />
        )}

        <div className="table-footer">
          <span className="table-footer-info">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Right-side Drawer for ticket reply */}
      <Drawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `Ticket: ${selectedTicket.id}` : ''}
        width="460px"
      >
        {selectedTicket && (
          <>
            {/* Ticket meta */}
            <div className="drawer-section">
              <div className="drawer-section-title">Ticket Info</div>
              <h4 style={{ color: 'var(--admin-text-primary)', marginBottom: '6px', fontSize: '15px' }}>
                {selectedTicket.subject}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--admin-text-tertiary)', marginBottom: '10px' }}>
                {selectedTicket.studentName} · {selectedTicket.studentEmail}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant={selectedTicket.priority} dot>{selectedTicket.priority}</Badge>
                <Badge variant={selectedTicket.status} dot>{selectedTicket.status}</Badge>
              </div>
            </div>

            {/* Messages thread */}
            <div className="drawer-section" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <div className="drawer-section-title">Conversation</div>
              {selectedTicket.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`drawer-message ${msg.sender === 'admin' ? 'drawer-message--admin' : 'drawer-message--student'}`}
                >
                  <div className="drawer-message-meta">
                    {msg.sender} · {formatTime(msg.timestamp)}
                  </div>
                  <div className="drawer-message-text">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <div className="drawer-section" style={{ borderBottom: 'none' }}>
              <div className="drawer-section-title">Reply</div>
              <div className="drawer-reply">
                <textarea
                  className="admin-textarea"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ minHeight: '72px' }}
                />
                <button
                  className="admin-btn admin-btn-primary"
                  style={{ alignSelf: 'flex-end', flexShrink: 0 }}
                  onClick={() => setSelectedTicket(null)}
                >
                  <Send size={15} /> Send
                </button>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}

export default Support;
