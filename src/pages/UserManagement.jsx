import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Power, PowerOff, RefreshCcw, Trash2 } from 'lucide-react';
import { useAuth } from '../modules/auth/AuthContext.jsx';
import { activateUser, createUser, deactivateUser, deleteUser, fetchRoles, fetchUsers, updateUser } from '../api/usersApi.js';
import { StatusPill } from '../components/DataTable.jsx';
import './UserManagement.css';

const ELEVATED_ROLES = ['Admin', 'Manager'];

function emptyForm() {
  return { username: '', email: '', displayName: '', password: '', roleNames: [] };
}

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const myRoles = currentUser?.roles || [];
  const isAdmin = myRoles.includes('Admin');
  const canManageUsers = isAdmin || myRoles.includes('Manager');

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [usersResult, rolesResult] = await Promise.all([fetchUsers(1, 100), fetchRoles()]);
      setUsers(usersResult.items);
      setRoles(rolesResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManageUsers) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignableRoles = useMemo(
    () => roles.filter((r) => isAdmin || !ELEVATED_ROLES.includes(r.name)),
    [roles, isAdmin],
  );

  function openCreate() {
    setForm(emptyForm());
    setActionError('');
    setModal({ mode: 'create' });
  }

  function openEdit(u) {
    setForm({ username: u.username, email: u.email, displayName: u.displayName, password: '', roleNames: [...u.roles] });
    setActionError('');
    setModal({ mode: 'edit', user: u });
  }

  function toggleRole(name) {
    setForm((f) => ({
      ...f,
      roleNames: f.roleNames.includes(name) ? f.roleNames.filter((r) => r !== name) : [...f.roleNames, name],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setActionError('');
    try {
      if (modal.mode === 'create') {
        await createUser({
          username: form.username,
          email: form.email,
          password: form.password,
          displayName: form.displayName,
          primaryClientOrganizationId: null,
          roleNames: form.roleNames,
          clientOrganizationIds: [],
        });
      } else {
        await updateUser(modal.user.id, {
          email: form.email,
          displayName: form.displayName,
          roleNames: form.roleNames,
          clientOrganizationIds: modal.user.clientOrganizationIds || [],
        });
      }
      setModal(null);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(u) {
    setActionError('');
    try {
      if (u.isActive) await deactivateUser(u.id);
      else await activateUser(u.id);
      await load();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Delete user "${u.username}"? This cannot be undone from the UI.`)) return;
    setActionError('');
    try {
      await deleteUser(u.id);
      await load();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (!canManageUsers) {
    return (
      <section className="section">
        <h2>Access restricted</h2>
        <p>User management is available to Admin and Manager roles only.</p>
      </section>
    );
  }

  return (
    <section className="section user-management">
      <div className="module-hero">
        <div>
          <span className="module-kicker">Role Management</span>
          <h1>User Management</h1>
          <p>Create and manage staff accounts and role assignments. Changes apply immediately.</p>
        </div>
        <div className="module-actions">
          <button className="ghost-button" onClick={load}><RefreshCcw size={15} /> Refresh</button>
          <button className="primary-button" onClick={openCreate}><Plus size={15} /> Add User</button>
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}
      {actionError && !modal && <p className="field-error">{actionError}</p>}

      <div className="card">
        {loading ? (
          <p className="module-note">Loading users...</p>
        ) : (
          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Display Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.displayName}</td>
                    <td>{u.email}</td>
                    <td className="role-pills">
                      {u.roles.map((r) => <span key={r} className="pill pill-indigo">{r}</span>)}
                    </td>
                    <td><StatusPill value={u.isActive ? 'Active' : 'Inactive'} /></td>
                    <td>{u.lastLoginAtUtc ? new Date(u.lastLoginAtUtc).toLocaleString() : 'Never'}</td>
                    <td>
                      <div className="row-actions">
                        <button title="Edit" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                        <button title={u.isActive ? 'Deactivate' : 'Activate'} onClick={() => handleToggleActive(u)}>
                          {u.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                        </button>
                        {isAdmin && (
                          <button title="Delete" onClick={() => handleDelete(u)}><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={7}>No users yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="overlay-backdrop" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.mode === 'create' ? 'Add User' : `Edit ${modal.user.username}`}</h3>
            <form onSubmit={handleSubmit}>
              {modal.mode === 'create' && (
                <div className="field">
                  <label>Username</label>
                  <input required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field">
                <label>Display Name</label>
                <input required value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} />
              </div>
              {modal.mode === 'create' && (
                <div className="field">
                  <label>Password</label>
                  <input required type="password" minLength={12} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
                  <small>At least 12 characters.</small>
                </div>
              )}
              <div className="field">
                <label>Roles</label>
                <div className="role-checkboxes">
                  {assignableRoles.map((r) => (
                    <label key={r.id} className="role-checkbox">
                      <input type="checkbox" checked={form.roleNames.includes(r.name)} onChange={() => toggleRole(r.name)} />
                      {r.name}
                    </label>
                  ))}
                </div>
                {!isAdmin && <small>Only an Admin can assign the Admin or Manager role.</small>}
              </div>
              {actionError && <p className="field-error">{actionError}</p>}
              <div className="split">
                <button type="button" className="ghost-button" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={submitting || form.roleNames.length === 0}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
