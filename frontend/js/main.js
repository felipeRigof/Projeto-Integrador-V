// ── CARROSSEL ──
function scrollCarousel(btn, dir) {
  const track = btn.closest('.carousel-wrapper').querySelector('.carousel-track');
  track.scrollBy({ left: dir * 440, behavior: 'smooth' });
}

const API_URL = 'http://localhost:3000';

const bgColors = [
  '#F0E6D3', '#E8D5C4', '#D9E8D3',
  '#E8D9D9', '#DDD9E8', '#E8E4D3',
  '#F2EAD3'
];

function criaCardProduto(produto, index) {
  const bg = bgColors[index % bgColors.length];
  const preco = produto.price ? `R$ ${parseFloat(produto.price).toFixed(2).replace(',', '.')}` : 'Doação';

  return `
    <div class="product-card">
      <div class="product-img" style="background" : ${bg};>
        <button class="wishlist-btn">🤍</button>
      </div>

      <div class="product-info">
        <div class="product-category">${produto.category || 'Sem categoria'}</div>
        <div class="product-name">${produto.title}</div>
        <div class="product-seller">por @${produto.user?.nome || 'vendedor'}</div>
        <div class="product-footer">
          <span class="product-price">${preco}</span>
          <span class="product-size">${produto.conditions || 'Unico'}</span>
        </div>
      </div>
    </div>
  `;
}

async function carregaProduto() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    const produtos = await response.json();

    console.log('produtos:', produtos);

    const carrocel = document.querySelectorAll('.carousel-track');
    console.log('carrosseis encontrados:', carrocel.length);

    if (produtos.length === 0) return;

    carrocel[0].innerHTML = produtos
      .slice(0, 6)
      .map((p, i) => criaCardProduto(p, i))
      .join('');

    if (carrocel[1]) {
      carrocel[1].innerHTML = produtos
        .slice(0, 5)
        .map((p, i) => criaCardProduto(p, i + 3))
        .join('');
    }

    ativaWishlist();
  } catch (err) {
    console.log('Erro ao carregar produtos: ', err);
  }
}

/* ── WISHLIST TOGGLE ── */
function ativaWishlist() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => btn.style.transform = '', 200);
    });
  });
}

carregaProduto();