// ── eKart Shared Navigation ───────────────────────────────────────────────────
// CSS is in nav.css (static link tag in each page's <head>)
// Sidebar HTML is hardcoded in each page — this file only handles:
//   1. Auth check + data fetch
//   2. Populating the sidebar user chip + store selector
//   3. Removing the skeleton + showing real content

async function renderNav(activePage, onStoreChange) {

  // ── 1. Auth check ─────────────────────────────────────────────────────────
  if (!getToken()) { location.replace('/'); return }

  // ── 2. Fetch user + stores ────────────────────────────────────────────────
  let user, stores
  try {
    ;[user, stores] = await Promise.all([apiFetch('/auth/me'), apiFetch('/stores')])
  } catch { location.replace('/'); return }

  // ── 3. Resolve current store ──────────────────────────────────────────────
  let currentStoreId = sessionStorage.getItem('ekart_current_store') || stores[0]?._id || ''
  if (!stores.find(s => s._id === currentStoreId) && stores.length) {
    currentStoreId = stores[0]._id
    sessionStorage.setItem('ekart_current_store', currentStoreId)
  }

  // ── 4. Populate sidebar user chip ─────────────────────────────────────────
  const avatarEl = document.getElementById('nav-avatar')
  if (avatarEl) {
    avatarEl.innerHTML = user.avatar
      ? `<img src="${user.avatar}" alt="">`
      : (user.name || 'U')[0].toUpperCase()
  }
  const nameEl = document.getElementById('nav-user-name')
  if (nameEl) nameEl.textContent = user.name || 'User'
  const emailEl = document.getElementById('nav-user-email')
  if (emailEl) emailEl.textContent = user.email || ''

  // ── 5. Populate store selector ────────────────────────────────────────────
  if (activePage !== 'stores') {
    const sel = document.getElementById('store-selector')
    if (sel && stores.length) {
      sel.innerHTML = stores.map(s =>
        `<option value="${s._id}"${s._id === currentStoreId ? ' selected' : ''}>${s.name}</option>`
      ).join('')
      sel.onchange = (e) => {
        sessionStorage.setItem('ekart_current_store', e.target.value)
        if (typeof onStoreChange === 'function') onStoreChange(e.target.value)
      }
    }
    // Hide store selector row if no stores
    if (!stores.length) {
      document.getElementById('store-select-wrap')?.style.setProperty('display', 'none')
    }
  }

  // ── 6. Swap skeleton → real content ──────────────────────────────────────
  const skel = document.getElementById('page-skeleton')
  const real = document.getElementById('page-content')
  if (skel) skel.style.display = 'none'
  if (real) real.style.display = 'block'

  // ── 7. Wire modal close + store change ───────────────────────────────────
  window.handleStoreChange = (id) => {
    sessionStorage.setItem('ekart_current_store', id)
    if (typeof onStoreChange === 'function') onStoreChange(id)
  }
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open')
  })

  return { user, stores, currentStoreId }
}

// ── Shared helpers ────────────────────────────────────────────────────────────
function getCurrentStoreId() { return sessionStorage.getItem('ekart_current_store') || '' }
function setTopbarActions(html) { const el = document.getElementById('topbar-actions'); if (el) el.innerHTML = html }
function openModal(id)  { document.getElementById(id)?.classList.add('open') }
function closeModal(id) { document.getElementById(id)?.classList.remove('open') }

function statusBadge(status) {
  const m = {
    active:'badge-green', delivered:'badge-green', published:'badge-green',
    pending:'badge-yellow', draft:'badge-yellow',
    confirmed:'badge-purple', processing:'badge-purple',
    shipped:'badge-blue',
    cancelled:'badge-red', archived:'badge-red'
  }
  return `<span class="badge ${m[status] || 'badge-gray'}">${status}</span>`
}

function toast(msg, type = 'success') {
  let t = document.getElementById('ek-toast')
  if (!t) { t = document.createElement('div'); t.id = 'ek-toast'; document.body.appendChild(t) }
  const c = {
    success: 'background:#0f2318;border:1px solid rgba(52,211,153,.35);color:#34d399',
    error:   'background:#2a0f0f;border:1px solid rgba(248,113,113,.35);color:#f87171',
    info:    'background:#0f1128;border:1px solid rgba(108,99,255,.35);color:#a78bfa'
  }
  t.style.cssText = `position:fixed;bottom:24px;right:24px;padding:13px 18px;border-radius:11px;font-size:13.5px;font-family:Outfit,sans-serif;font-weight:600;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,.4);max-width:320px;transition:opacity .25s;${c[type] || c.success}`
  t.textContent = msg; t.style.opacity = '1'
  clearTimeout(t._t)
  t._t = setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 260) }, 3200)
}
