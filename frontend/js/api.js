// ── CONFIGURAÇÃO ──────────────────────────────────────────
const API = 'http://localhost:3000';

// ── AUTH HELPERS ──────────────────────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Redireciona para login se não estiver autenticado
function requireAuth() {
  if (!isLoggedIn()) window.location.href = 'login.html';
}

// ── FETCH HELPERS ─────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

// ── HEADER DINÂMICO ───────────────────────────────────────
// Atualiza botões do header de acordo com estado de login
function initHeader() {
  const user = getUser();
  const accountBtn = document.getElementById('btn-account');
  const sellBtn = document.getElementById('btn-sell');

  if (!accountBtn) return;

  if (user) {
    accountBtn.title = user.nome;
    accountBtn.onclick = () => window.location.href = 'minha-conta.html';
    if (sellBtn) {
      sellBtn.href = 'anunciar.html';
      sellBtn.textContent = '+ Vender';
    }
  } else {
    accountBtn.onclick = () => window.location.href = 'login.html';
    if (sellBtn) {
      sellBtn.href = 'login.html';
    }
  }

  // Botão de logout (aparece no header quando logado)
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    if (user) {
      logoutBtn.style.display = 'flex';
      logoutBtn.onclick = logout;
    } else {
      logoutBtn.style.display = 'none';
    }
  }
}

// ── FORMATAÇÃO ────────────────────────────────────────────
function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  return `${days}d atrás`;
}

// ── CARROSSEL ─────────────────────────────────────────────
function scrollCarousel(btn, dir) {
  const track = btn.closest('.carousel-wrapper').querySelector('.carousel-track');
  track.scrollBy({ left: dir * 440, behavior: 'smooth' });
}

// ── WISHLIST TOGGLE (estático, sem backend ainda) ─────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.textContent = btn.textContent.trim() === '🤍' ? '❤️' : '🤍';
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => btn.style.transform = '', 200);
    });
  });

  initHeader();
});

// ── SACOLA (localStorage) ─────────────────────────────────
function getSacola() {
  const s = localStorage.getItem('sacola');
  return s ? JSON.parse(s) : [];
}

function addToSacola(produto) {
  const sacola = getSacola();
  const jaExiste = sacola.find(i => i.id === produto.id);
  if (!jaExiste) {
    sacola.push({
      id:       produto.id,
      title:    produto.title,
      price:    produto.price,
      vendedor: produto.user?.nome || '',
      imagem:   produto.imagens?.[0]?.image_url || null
    });
    localStorage.setItem('sacola', JSON.stringify(sacola));
  }
  return !jaExiste;
}

function sacolaCount() {
  return getSacola().length;
}
