// ═══════════════════════════════════════════════
//  AASAI TECH — Shared Utilities
// ═══════════════════════════════════════════════
const API = 'https://fypouhme3gqldqk6sk75b75udy0ltonb.lambda-url.ap-southeast-2.on.aws'

// ── Auth helpers ──
function getToken() { return localStorage.getItem('aasai_token') }
function setToken(t) { localStorage.setItem('aasai_token', t) }
function clearToken() { localStorage.removeItem('aasai_token') }

async function apiFetch(path, opts = {}) {
  const token = getToken()
  return fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...(opts.headers || {})
    }
  })
}

// ── Toast ──
function toast(msg, type = 'success') {
  let el = document.getElementById('toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'toast'
    el.style.cssText = `
      position:fixed;top:24px;right:24px;left:auto;
      padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;
      z-index:99999;transform:translateY(-80px);opacity:0;
      transition:all .35s cubic-bezier(.22,1,.36,1);
      display:flex;align-items:center;gap:9px;max-width:340px;
      box-shadow:0 8px 32px rgba(0,0,0,.18);
      font-family:'DM Sans',sans-serif;letter-spacing:-.01em;
    `
    document.body.appendChild(el)
  }
  el.className = ''
  if (type === 'success') {
    el.style.background = '#1a1a24'
    el.style.color = '#f0f0f8'
    el.style.border = '1px solid rgba(67,233,123,.35)'
    el.innerHTML = `<svg width="16" height="16" fill="none" stroke="#43e97b" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> ${msg}`
  } else if (type === 'error') {
    el.style.background = '#1a1a24'
    el.style.color = '#f0f0f8'
    el.style.border = '1px solid rgba(248,113,113,.35)'
    el.innerHTML = `<svg width="16" height="16" fill="none" stroke="#f87171" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${msg}`
  } else {
    el.style.background = '#1a1a24'
    el.style.color = '#f0f0f8'
    el.style.border = '1px solid rgba(108,99,255,.35)'
    el.innerHTML = `<svg width="16" height="16" fill="none" stroke="#6c63ff" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${msg}`
  }
  el.style.transform = 'translateY(0)'
  el.style.opacity = '1'
  clearTimeout(el._timer)
  el._timer = setTimeout(() => {
    el.style.transform = 'translateY(-80px)'
    el.style.opacity = '0'
  }, 3200)
}

// ── Page loader overlay ──
function showPageLoader() {
  let el = document.getElementById('page-loader')
  if (!el) {
    el = document.createElement('div')
    el.id = 'page-loader'
    el.style.cssText = `
      position:fixed;inset:0;z-index:9998;background:rgba(10,10,15,.7);
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(4px);
      transition:opacity .2s;
    `
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <div style="width:40px;height:40px;border:2.5px solid #2a2a38;border-top-color:#6c63ff;border-radius:50%;animation:spin .7s linear infinite;box-shadow:0 0 20px rgba(108,99,255,.3);"></div>
        <div id="page-loader-label" style="color:#7a7a9a;font-size:13px;font-family:'DM Sans',sans-serif;letter-spacing:.02em;"></div>
      </div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `
    document.body.appendChild(el)
  }
  el.style.display = 'flex'
  el.style.opacity = '1'
}
function setPageLoaderLabel(t) {
  const el = document.getElementById('page-loader-label')
  if (el) el.textContent = t
}
function hidePageLoader() {
  const el = document.getElementById('page-loader')
  if (!el) return
  el.style.opacity = '0'
  setTimeout(() => { if (el) el.style.display = 'none' }, 220)
}

// ── Button loading state ──
function btnLoading(btn, label) {
  btn.disabled = true
  btn._origHtml = btn.innerHTML
  btn.innerHTML = `<svg width="14" height="14" style="animation:spin .7s linear infinite;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ${label || 'Loading…'}`
}
function btnReset(btn) {
  btn.disabled = false
  if (btn._origHtml) btn.innerHTML = btn._origHtml
}

// ── Utils ──
function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return (n || 0).toString()
}
function hexToRgb(hex) {
  try { return `${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}` }
  catch { return '108, 99, 255' }
}
function isValidHex(h) { return /^#[0-9a-fA-F]{6}$/.test(h) }
function escHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago'
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago'
  return new Date(dateStr).toLocaleDateString()
}

// ── Nav active link ──
function setActiveNav(pageId) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId)
  })
}

// ── Apply background theme ──
const BG_THEMES = [
  {id:'dark',bg:'#0a0a0f',bgRgb:'10,10,15',surface:'#111118',surface2:'#1a1a24',border:'#2a2a38',text:'#f0f0f8',muted:'#7a7a9a'},
  {id:'light',bg:'#f5f5fa',bgRgb:'245,245,250',surface:'#ffffff',surface2:'#ededf5',border:'#e0e0ec',text:'#1a1a2e',muted:'#6868a0'},
  {id:'midnight',bg:'#05050d',bgRgb:'5,5,13',surface:'#0d0d1a',surface2:'#12122a',border:'#1e1e30',text:'#e8e8ff',muted:'#6868a0'},
  {id:'slate',bg:'#0f172a',bgRgb:'15,23,42',surface:'#1e293b',surface2:'#263044',border:'#334155',text:'#f1f5f9',muted:'#64748b'},
  {id:'white',bg:'#ffffff',bgRgb:'255,255,255',surface:'#f8f8fc',surface2:'#f0f0f8',border:'#e4e4f0',text:'#1a1a2e',muted:'#6868a0'},
]
function applyBgTheme(themeId, customHex) {
  const root = document.documentElement
  if (themeId === 'custom') {
    const hex = customHex || '#0a0a0f'
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
    const isDark = (r*0.299 + g*0.587 + b*0.114) < 128
    const shift = (h, o) => { let rv=Math.min(255,Math.max(0,parseInt(h.slice(1,3),16)+o)), gv=Math.min(255,Math.max(0,parseInt(h.slice(3,5),16)+o)), bv=Math.min(255,Math.max(0,parseInt(h.slice(5,7),16)+o)); return '#'+[rv,gv,bv].map(x=>x.toString(16).padStart(2,'0')).join('') }
    root.style.setProperty('--bg', hex)
    root.style.setProperty('--bg-rgb', `${r},${g},${b}`)
    root.style.setProperty('--surface', isDark ? shift(hex,10) : shift(hex,-10))
    root.style.setProperty('--surface2', isDark ? shift(hex,20) : shift(hex,-20))
    root.style.setProperty('--border', isDark ? shift(hex,35) : shift(hex,-35))
    root.style.setProperty('--text', isDark ? '#f0f0f8' : '#1a1a2e')
    root.style.setProperty('--muted', isDark ? '#7a7a9a' : '#6868a0')
  } else {
    const t = BG_THEMES.find(x => x.id === themeId)
    if (!t) return
    root.style.setProperty('--bg', t.bg)
    root.style.setProperty('--bg-rgb', t.bgRgb)
    root.style.setProperty('--surface', t.surface)
    root.style.setProperty('--surface2', t.surface2)
    root.style.setProperty('--border', t.border)
    root.style.setProperty('--text', t.text)
    root.style.setProperty('--muted', t.muted)
  }
  // Persist to localStorage for instant apply on next page load
  localStorage.setItem('aasai_bg_theme', themeId)
  if (customHex) localStorage.setItem('aasai_bg_custom', customHex)
}

// Apply theme instantly from localStorage (before API call, no flash)
;(function() {
  const t = localStorage.getItem('aasai_bg_theme')
  const c = localStorage.getItem('aasai_bg_custom')
  if (t) applyBgTheme(t, c)
  const accent = localStorage.getItem('aasai_accent')
  if (accent) applyAccent(accent)
})()


const BRAND_COLORS = ['#6c63ff','#7c3aed','#2563eb','#0891b2','#0d9488','#16a34a','#ca8a04','#ea580c','#dc2626','#db2777','#c8972a','#64748b','#ff6584','#43e97b','#f7971e']

function applyAccent(hex) {
  if (!isValidHex(hex)) return
  document.documentElement.style.setProperty('--accent', hex)
  document.documentElement.style.setProperty('--accent-rgb', hexToRgb(hex))
  localStorage.setItem('aasai_accent', hex)
}

// ── Guard: redirect if not authed ──
async function requireAuthPage() {
  const token = getToken()
  if (!token) { window.location.replace('index.html'); return null }
  try {
    const res = await fetch(`${API}/auth/me`, { headers: { Authorization: 'Bearer ' + token } })
    if (!res.ok) throw new Error()
    const user = await res.json()
    // Apply saved accent
    if (user.dashboard_accent) applyAccent(user.dashboard_accent)
    // Apply saved background theme
    if (user.dashboard_bg_theme) applyBgTheme(user.dashboard_bg_theme, user.dashboard_bg_custom || '#0a0a0f')
    return user
  } catch {
    clearToken()
    window.location.replace('index.html')
    return null
  }
}

// ── Render sidebar user chip ──
function renderUserChip(user) {
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const avatarEl = document.getElementById('user-avatar')
  if (avatarEl) {
    if (user.avatar) avatarEl.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
    else avatarEl.textContent = initials
  }
  const nameEl = document.getElementById('user-name')
  if (nameEl) nameEl.textContent = user.name || user.email
  const planEl = document.getElementById('user-plan')
  if (planEl) planEl.textContent = user.plan === 'pro' ? '⭐ Enterprise' : '🆓 Free Plan'
}

// ── Mobile sidebar ──
function initMobileSidebar() {
  const mobBtn = document.getElementById('mob-menu-btn')
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  if (!mobBtn || !sidebar) return
  mobBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open')
    overlay && overlay.classList.toggle('open')
    mobBtn.classList.toggle('open')
  })
  if (overlay) overlay.addEventListener('click', closeSidebar)
}
function closeSidebar() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  const mobBtn = document.getElementById('mob-menu-btn')
  sidebar && sidebar.classList.remove('open')
  overlay && overlay.classList.remove('open')
  mobBtn && mobBtn.classList.remove('open')
}

function logout() {
  clearToken()
  window.location.replace('index.html')
}
