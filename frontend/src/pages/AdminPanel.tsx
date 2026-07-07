import { useEffect, useState } from 'react';
import { fireApi } from '../api/fireApi';
import type { FireIncident, FireIncidentInput } from '../types';
import FireTable from '../components/FireTable';
import FireFormModal from '../components/FireFormModal';

export default function AdminPanel() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FireIncident | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<FireIncident | null>(null);

  async function loadIncidents() {
    setLoading(true);
    try {
      const data = await fireApi.getAll();
      setIncidents(data);
    } catch {
      setError('Could not load wildfire records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(incident: FireIncident) {
    setEditing(incident);
    setModalOpen(true);
  }

  async function handleSubmit(payload: FireIncidentInput) {
    if (editing) {
      await fireApi.update(editing.id, payload);
    } else {
      await fireApi.create(payload);
    }
    setModalOpen(false);
    await loadIncidents();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await fireApi.remove(pendingDelete.id);
    setPendingDelete(null);
    await loadIncidents();
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Admin panel</h1>
          <p>Add, update, or remove wildfire incident records.</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          + Add incident
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <div className="page-loading">Loading records…</div>
      ) : (
        <FireTable incidents={incidents} editable onEdit={openEdit} onDelete={setPendingDelete} />
      )}

      {modalOpen && (
        <FireFormModal initial={editing} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      )}

      {pendingDelete && (
        <div className="modal-backdrop" onClick={() => setPendingDelete(null)}>
          <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Remove this incident?</h2>
            </div>
            <div className="modal__body">
              <p>
                This will permanently delete <strong>{pendingDelete.locationName}</strong> from the system.
              </p>
              <div className="modal__footer">
                <button className="btn btn--ghost" onClick={() => setPendingDelete(null)}>
                  Cancel
                </button>
                <button className="btn btn--danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
