// ===================== NAV =====================
const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  siteNav.classList.toggle('solid', window.scrollY > 60);
});

const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ===================== REVEAL ON SCROLL =====================
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ===================== COUNTDOWN =====================
const weddingDate = new Date('2026-11-20T17:00:00-03:00').getTime();
function updateCountdown(){
  const now = new Date().getTime();
  const diff = weddingDate - now;
  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-min'),
    s: document.getElementById('cd-sec'),
  };
  if (diff <= 0){
    els.d.textContent = '00'; els.h.textContent = '00'; els.m.textContent = '00'; els.s.textContent = '00';
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);
  els.d.textContent = String(days).padStart(2,'0');
  els.h.textContent = String(hours).padStart(2,'0');
  els.m.textContent = String(mins).padStart(2,'0');
  els.s.textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===================== RSVP FORM =====================
const toggles = document.querySelectorAll('.rsvp-toggle');
const confirmacaoInput = document.getElementById('confirmacaoInput');
toggles.forEach(btn => {
  btn.addEventListener('click', () => {
    toggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    confirmacaoInput.value = btn.dataset.val;
  });
});

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(rsvpForm);
  const nome = (data.get('nome') || '').toString().trim().split(' ')[0] || 'amigo(a)';
  document.getElementById('successName').textContent = nome;
  rsvpForm.style.display = 'none';
  rsvpSuccess.classList.add('show');
});
*/
// ===================== RSVP FORM =====================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyf4Dn9S302W2NwXbF96Cbgmkh4ta_iwESPxoo5cbRVQNyeAwHN3F7Su311QVbS2xXNPA/exec";

const toggles = document.querySelectorAll('.rsvp-toggle');
const confirmacaoInput = document.getElementById('confirmacaoInput');

toggles.forEach(btn => {
  btn.addEventListener('click', () => {
    toggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    confirmacaoInput.value = btn.dataset.val;
  });
});

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const submitBtn = rsvpForm.querySelector('.rsvp-submit');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Feedback visual de envio
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'ENVIANDO...';

  const formData = new FormData(rsvpForm);
  const payload = {
    nome: formData.get('nome'),
    confirmacao: formData.get('confirmacao'),
    adultos: formData.get('adultos'),
    acompanhante: formData.get('acompanhante'),
    criancas: formData.get('criancas'),
    nomeCriancas: formData.get('nomeCriancas'),
    observacoes: formData.get('observacoes')
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Evita problemas de CORS com o Apps Script
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    const nomePrimeiro = (payload.nome || '').toString().trim().split(' ')[0] || 'amigo(a)';
    document.getElementById('successName').textContent = nomePrimeiro;
    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('show');
  })
  .catch((error) => {
    console.error('Erro ao enviar:', error);
    alert('Houve um erro ao enviar sua confirmação. Por favor, tente novamente.');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  });
});
// ===================== GIFTS =====================
const gifts = [
{c:'casa',n:'Toalhas de Rosto Bordadas',d:'Detalhe delicado para o banheiro do casal.',p:251,k:'towels,embroidery'},
{c:'casa',n:'Tapete para a Sala',d:'Conforto e charme para o ambiente principal da casa.',p:284,k:'rug,livingroom'},
{c:'casa',n:'Aparelho de Jantar Completo',d:'Peça central da mesa posta da casa nova.',p:267,k:'dinnerware,tableset'},
{c:'casa',n:'Chaleira Elétrica Inox',d:'Detalhe simples que vira ritual diário.',p:203,k:'kettle,steel'},
{c:'casa',n:'Panela de Ferro Fundido',d:'Durabilidade e sabor para os pratos especiais da casa.',p:193,k:'castiron,skillet'},
{c:'casa',n:'Jogo de Taças de Cristal',d:'Para os brindes que ainda vamos comemorar juntos.',p:254,k:'crystal,wineglass'},
{c:'casa',n:'Espelho Decorativo',d:'Peça de destaque para a sala ou o quarto.',p:253,k:'mirror,decor'},
{c:'casa',n:'Air Fryer Família',d:'Praticidade para o dia a dia da nova cozinha.',p:261,k:'airfryer,kitchen'},
{c:'casa',n:'Faqueiro Completo Inox',d:'Conjunto elegante para refeições em família.',p:204,k:'cutlery,silverware'},
{c:'casa',n:'Jogo de Copos Sofisticado',d:'Complemento perfeito para a nova adega do casal.',p:227,k:'glassware,drinkware'},
{c:'casa',n:'Jantar Especial em Casa',d:'Uma noite só dos dois, com direito a mesa posta caprichada.',p:192,k:'candlelight,dinnertable'},
{c:'casa',n:'Jogo de Cama Premium',d:'Lençóis de algodão egípcio para noites tranquilas na casa nova.',p:250,k:'bedding,bedroom'},
{c:'casa',n:'Luminária de Mesa',d:'Um ponto de luz especial para o cantinho de leitura.',p:482,k:'lamp,desk'},
{c:'casa',n:'Conjunto de Panelas Antiaderentes',d:'O ponto de partida da cozinha do casal.',p:316,k:'cookware,pots'},
{c:'casa',n:'Adega Climatizada',d:'Para guardar bem os vinhos preferidos do casal.',p:444,k:'winecellar,wine'},
{c:'casa',n:'Cafeteira Especial',d:'Para começar bem cada manhã em casa.',p:315,k:'coffeemaker,kitchen'},
{c:'casa',n:'Batedeira Planetária',d:'Para os bolos e receitas especiais de fim de semana.',p:458,k:'mixer,baking'},
{c:'casa',n:'Conjunto de Vasos Decorativos',d:'Para trazer um pouco de verde para casa.',p:352,k:'vase,decor'},
{c:'casa',n:'Organizadores para Armário',d:'Para manter a casa nova sempre em ordem.',p:427,k:'closet,organizer'},
{c:'casa',n:'Aspirador de Pó Vertical',d:'Facilita a rotina de cuidar da casa nova.',p:474,k:'vacuum,cleaning'},
{c:'casa',n:'Panela Elétrica de Arroz',d:'Praticidade para o dia a dia da casa nova.',p:436,k:'ricecooker,kitchen'},
{c:'casa',n:'Quadro Decorativo Autoral',d:'Detalhe de personalidade para as paredes da casa nova.',p:409,k:'artwork,wallart'},
{c:'casa',n:'Jogo Americano Artesanal',d:'Detalhe de bom gosto para o dia a dia à mesa.',p:498,k:'placemat,table'},
{c:'casa',n:'Ferro de Passar a Vapor',d:'Cuidado prático com o guarda-roupa da casa.',p:380,k:'iron,laundry'},
{c:'casa',n:'Kit Churrasco Completo',d:'Para os fins de semana reunindo a família em casa.',p:419,k:'barbecue,grill'},
{c:'casa',n:'Travessas Decorativas',d:'Para servir com estilo nos almoços de domingo.',p:449,k:'serving,platter'},
{c:'casa',n:'Edredom Casal King',d:'Conforto e leveza para os dias mais frios em casa.',p:732,k:'duvet,bed'},
{c:'casa',n:'Jogo de Toalhas de Banho',d:'Toalhas macias e absorventes para o novo banheiro do casal.',p:685,k:'towels,bathroom'},
{c:'casa',n:'Almofadas para a Sala',d:'Conforto e cor para as tardes em casa.',p:653,k:'pillow,sofa'},
{c:'casa',n:'Frigideira Profissional',d:'Para os primeiros cafés da manhã preparados juntos.',p:627,k:'frypan,kitchen'},
{c:'casa',n:'Luminária de Piso',d:'Um ponto de luz aconchegante para a sala.',p:592,k:'floorlamp,livingroom'},
{c:'casa',n:'Cesto Organizador para Roupas',d:'Praticidade e organização para o dia a dia.',p:624,k:'basket,laundry'},
{c:'casa',n:'Sanduicheira e Grill',d:'Praticidade para os lanches rápidos do dia a dia.',p:541,k:'grill,kitchen'},
{c:'casa',n:'Toalhas de Mesa Bordadas',d:'Peça especial para receber a família em casa.',p:794,k:'tablecloth,dining'},
{c:'casa',n:'Manta para o Sofá',d:'Um toque aconchegante para as noites de filme.',p:1107,k:'throw,sofa'},
{c:'casa',n:'Jogo de Lençóis Percal 400 Fios',d:'Textura fina e durável para o quarto do casal.',p:1337,k:'linen,bedsheets'},
{c:'casa',n:'Cobertor de Inverno',d:'Aconchego extra para as noites mais frias em casa.',p:1306,k:'blanket,cozy'},
{c:'casa',n:'Robô Aspirador Inteligente',d:'Um upgrade e tanto para o dia a dia do casal.',p:1151,k:'robotvacuum,home'},
{c:'casa',n:'Jogo de Pratos de Porcelana',d:'Base para os primeiros jantares em casa.',p:1259,k:'porcelain,plates'},
{c:'casa',n:'Liquidificador Potente',d:'Aliado das receitas de fim de semana.',p:1094,k:'blender,kitchen'},
{c:'mimos',n:'Assinatura de Vinhos por 6 Meses',d:'Uma garrafa nova para descobrir a cada mês.',p:201,k:'wine,bottle'},
{c:'mimos',n:'Estoque de Chocolate Selecionado',d:'Um mimo doce para os dias corridos.',p:276,k:'chocolate,gourmet'},
{c:'mimos',n:'Kit Chá da Tarde',d:'Para os domingos mais tranquilos em casa.',p:223,k:'tea,afternoon'},
{c:'mimos',n:'Kit Café Especial',d:'Grãos selecionados para começar bem o dia.',p:338,k:'coffee,beans'},
{c:'mimos',n:'Um Jantar sem Precisar Cozinhar',d:'Uma noite de descanso para os dois.',p:425,k:'restaurant,dinner'},
{c:'luademel',n:'Jantar à Luz de Velas',d:'Um momento intimista durante a viagem.',p:754,k:'candlelight,dinner'},
{c:'luademel',n:'Jantar com Vista Panorâmica',d:'Uma noite especial em um lugar memorável.',p:796,k:'view,restaurant'},
{c:'luademel',n:'Café da Manhã Especial na Viagem',d:'Para começar bem os dias da lua de mel.',p:1267,k:'breakfast,hotel'},
{c:'luademel',n:'Diária em Hotel Especial',d:'Uma noite a mais de conforto durante a viagem.',p:870,k:'hotel,resort'},
{c:'luademel',n:'Massagem para Dois',d:'Um respiro de cuidado durante a viagem.',p:895,k:'massage,spa'},
{c:'luademel',n:'Passeio de Barco a Dois',d:'Uma tarde inteira navegando, só para os dois.',p:2467,k:'boat,sea'},
{c:'luademel',n:'Passeio Turístico Guiado',d:'Para conhecer um pouco mais do destino escolhido.',p:1776,k:'travel,tour'},
{c:'luademel',n:'Spa a Dois',d:'Um momento de relaxamento completo para o casal.',p:1985,k:'spa,couple'},
{c:'luademel',n:'Jantar Romântico à Beira-mar',d:'Uma noite especial com vista para o mar.',p:2213,k:'beach,dinner'},
{c:'luademel',n:'Dia de Praia Reservado',d:'Um dia inteiro só para relaxar juntos.',p:2180,k:'beach,tropical'},
{c:'experiencias',n:'Degustação de Vinhos',d:'Uma experiência para conhecer novos rótulos a dois.',p:343,k:'winetasting,vineyard'},
{c:'experiencias',n:'Experiência em Vinícola',d:'Um dia inteiro dedicado a bons vinhos e boa companhia.',p:456,k:'vineyard,wine'},
{c:'experiencias',n:'Observação de Estrelas',d:'Uma noite especial sob o céu, só para os dois.',p:559,k:'stargazing,night'},
{c:'experiencias',n:'Tour Gastronômico pela Cidade',d:'Um passeio saboreando os melhores lugares.',p:752,k:'foodtour,city'},
{c:'experiencias',n:'Passeio de Trem Panorâmico',d:'Uma viagem curta e cheia de vistas bonitas.',p:530,k:'train,scenic'},
{c:'experiencias',n:'Dia em um Spa Urbano',d:'Um momento de pausa na rotina, a dois.',p:611,k:'spa,wellness'},
{c:'experiencias',n:'Jantar Harmonizado',d:'Uma experiência gastronômica cuidadosamente pensada.',p:647,k:'winepairing,dinner'},
{c:'experiencias',n:'Sessão de Fotos do Casal',d:'Para guardar um novo momento especial em imagens.',p:566,k:'photography,couple'},
{c:'experiencias',n:'Aula de Culinária a Dois',d:'Uma tarde diferente aprendendo a cozinhar juntos.',p:1053,k:'cooking,class'},
{c:'experiencias',n:'Piquenique Especial',d:'Uma tarde ao ar livre, só para os dois.',p:1207,k:'picnic,outdoor'},
{c:'experiencias',n:'Experiência em Fazenda de Café',d:'Um passeio diferente para apreciar juntos.',p:1200,k:'coffee,farm'},
{c:'experiencias',n:'Retiro de um Dia no Campo',d:'Uma pausa tranquila fora da rotina.',p:1308,k:'countryside,retreat'},
{c:'vidaadois',n:'Domingo Preguiçoso a Dois',d:'Um dia inteiro sem compromissos, só relaxando juntos.',p:440,k:'lazy,sunday'},
{c:'vidaadois',n:'Uma Noite Especial Só Nossa',d:'Um tempo reservado só para os dois, sem pressa.',p:371,k:'candlelight,couple'},
{c:'vidaadois',n:'Primeiro Jantar na Casa Nova',d:'Para celebrar a primeira noite morando juntos.',p:712,k:'dinner,newhome'},
{c:'vidaadois',n:'Celebração da Nova Fase',d:'Um momento para brindar ao que está começando.',p:683,k:'toast,champagne'},
{c:'vidaadois',n:'Primeiro Vinho da Casa Nova',d:'Um brinde especial para abrir essa nova fase.',p:694,k:'wine,toast'},
{c:'vidaadois',n:'Noite de Filmes na Sala Nova',d:'A primeira sessão de cinema em casa.',p:618,k:'movienight,livingroom'},
{c:'vidaadois',n:'Café da Manhã de Casados',d:'O primeiro café da manhã depois do grande dia.',p:954,k:'breakfast,couple'},
{c:'vidaadois',n:'Jantar de Um Mês de Casados',d:'Para comemorar as primeiras semanas juntos.',p:884,k:'dinner,celebration'},
{c:'grandes',n:'Passeio Exclusivo para o Casal',d:'Um roteiro reservado, pensado para os dois.',p:1512,k:'privatetour,luxury'},
{c:'grandes',n:'Diária em Hotel Cinco Estrelas',d:'Uma noite de luxo durante a viagem do casal.',p:1996,k:'luxuryhotel,resort'},
{c:'grandes',n:'Contribuição para a Lua de Mel',d:'Ajude a construir a viagem dos sonhos do casal.',p:3351,k:'honeymoon,travel'},
{c:'grandes',n:'Grande Contribuição para a Casa Nova',d:'Ajude a equipar um cômodo inteiro da casa.',p:3103,k:'newhome,interior'},
{c:'grandes',n:'Experiência Especial da Viagem',d:'Um momento memorável a mais durante a lua de mel.',p:2686,k:'luxury,travel'}
];

const catLabels = {
  casa: 'Casa',
  luademel: 'Lua de Mel',
  experiencias: 'Experiências',
  mimos: 'Mimos',
  vidaadois: 'Vida a Dois',
  grandes: 'Grandes Presentes'
};

function imgFor(g, idx){
  var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  var w = Math.round(560 * dpr);
  var h = Math.round(420 * dpr);
  return 'https://loremflickr.com/' + w + '/' + h + '/' + g.k + '?lock=' + (idx + 17);
}

const giftGrid = document.getElementById('giftGrid');
const giftEmpty = document.getElementById('giftEmpty');
const giftFilters = document.getElementById('giftFilters');
const giftSearch = document.getElementById('giftSearch');
const giftMoreBtn = document.getElementById('giftMore');

let currentFilter = 'todos';
let currentSearch = '';
let visibleCount = 12;
const PAGE_SIZE = 12;

function formatPrice(p){
  return 'R$ ' + p.toLocaleString('pt-BR');
}

function getFiltered(){
  return gifts.filter((g, idx) => {
    g._idx = idx;
    const matchCat = currentFilter === 'todos' || g.c === currentFilter;
    const matchSearch = !currentSearch || g.n.toLowerCase().includes(currentSearch) || g.d.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });
}

function renderGifts(){
  const filtered = getFiltered();
  giftGrid.innerHTML = '';
  giftEmpty.style.display = filtered.length === 0 ? 'block' : 'none';
  const slice = filtered.slice(0, visibleCount);
  slice.forEach((g) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML =
      '<div class="gift-media"><img loading="lazy" decoding="async" src="' + imgFor(g, g._idx) + '" alt="' + g.n + '"></div>' +
      '<div class="gift-body">' +
        '<div class="gift-cat">' + catLabels[g.c].toUpperCase() + '</div>' +
        '<div class="gift-name">' + g.n + '</div>' +
        '<div class="gift-desc">' + g.d + '</div>' +
        '<div class="gift-foot">' +
          '<div class="gift-price">' + formatPrice(g.p) + '</div>' +
          '<button class="gift-btn" data-idx="' + g._idx + '">Presentear</button>' +
        '</div>' +
      '</div>';
    giftGrid.appendChild(card);
  });
  giftMoreBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';

  giftGrid.querySelectorAll('.gift-btn').forEach(btn => {
    btn.addEventListener('click', () => openGiftModal(gifts[parseInt(btn.dataset.idx)]));
  });
}

giftFilters.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    giftFilters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    visibleCount = PAGE_SIZE;
    renderGifts();
  });
});

giftSearch.addEventListener('input', () => {
  currentSearch = giftSearch.value.toLowerCase().trim();
  visibleCount = PAGE_SIZE;
  renderGifts();
});

giftMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderGifts();
});

// Modal
const giftModal = document.getElementById('giftModal');
const modalClose = document.getElementById('modalClose');
function openGiftModal(g){
  document.getElementById('modalCat').textContent = catLabels[g.c].toUpperCase();
  document.getElementById('modalName').textContent = g.n;
  document.getElementById('modalPrice').textContent = formatPrice(g.p);
  document.getElementById('modalDesc').textContent = g.d;
  document.getElementById('modalConfirm').textContent = 'PRESENTEAR';
  giftModal.classList.add('open');
}
modalClose.addEventListener('click', () => giftModal.classList.remove('open'));
giftModal.addEventListener('click', (e) => { if (e.target === giftModal) giftModal.classList.remove('open'); });
document.getElementById('modalConfirm').addEventListener('click', () => {
  document.getElementById('modalConfirm').textContent = 'OBRIGADO! ❤';
  setTimeout(() => giftModal.classList.remove('open'), 1400);
});

renderGifts();

// ===================== COPIAR CHAVE PIX =====================
function copiarPix() {
  const pixInput = document.getElementById('pixKeyInput');
  const notice = document.getElementById('copyNotice');

  // Seleciona e copia o texto
  pixInput.select();
  pixInput.setSelectionRange(0, 99999); // Para dispositivos móveis

  navigator.clipboard.writeText(pixInput.value).then(() => {
    notice.style.display = 'block';
    setTimeout(() => {
      notice.style.display = 'none';
    }, 3000);
  }).catch(err => {
    console.error('Erro ao copiar chave: ', err);
  });
}