// Menu lateral único do FabLab Manager. Uso: <aside id="barraLateral"></aside> + <script src="menu.js"></script> no fim do body.
(function () {
  var PERFIS = {
    aluno: 'Aluno(a) - TDS 2026',
    instrutor: 'Professor(a) - TDS 2026',
    administrador: 'Administrador(a)'
  };
  var RESTRITO = { // página -> perfis que podem abrir
    'pedidos.html': ['instrutor', 'administrador'],
    'usuarios.html': ['administrador']
  };

  var perfil = null;
  try { perfil = localStorage.getItem('perfil'); } catch (e) {}
  if (!PERFIS[perfil]) { location.replace('login.html'); return; }

  var arquivo = location.pathname.split('/').pop() || '';
  if (RESTRITO[arquivo] && RESTRITO[arquivo].indexOf(perfil) < 0) { location.replace('403.html'); return; }

  var itens = [['📊', 'Visão Geral', 'dashboard-' + perfil + '.html'],
               ['📦', 'Inventário', 'inventario.html'],
               ['📅', 'Reservas', 'reservas.html']];
  if (perfil !== 'aluno') itens.push(['📄', 'Requisições', 'pedidos.html']);
  itens.push(['🔔', 'Notificações', 'notificacoes.html']);
  if (perfil === 'administrador') itens.push(['👥', 'Usuários', 'usuarios.html']);

  var base = 'flex items-center gap-3 px-3 py-2 text-xs transition-all ';
  var ativo = base + 'text-white bg-slate-800/80 border-l-4 border-emerald-500 rounded-r-lg font-semibold';
  var normal = base + 'text-slate-400 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white';

  var links = itens.map(function (i) {
    var atual = i[2] === arquivo || (i[1] === 'Visão Geral' && arquivo.indexOf('dashboard-') === 0);
    return '<a href="' + i[2] + '" class="' + (atual ? ativo : normal) + '"><span>' + i[0] + '</span> ' + i[1] + '</a>';
  }).join('');

  var aside = document.getElementById('barraLateral');
  aside.className = 'w-64 h-screen sticky top-0 shrink-0 bg-[#0d1527] text-white p-6 flex flex-col gap-6 overflow-y-auto';
  aside.innerHTML =
    '<div class="flex flex-col gap-1"><h2 class="text-xl font-bold leading-tight text-white">FabLab Manager</h2>' +
    '<p class="text-[10px] text-blue-300 font-semibold tracking-wider uppercase">SENAI — SISTEMA DE GESTÃO</p></div>' +
    '<hr class="border-slate-800 -mx-6">' +
    '<nav class="flex flex-col gap-2"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MENU</p>' + links + '</nav>' +
    '<div class="mt-auto bg-[#172339] border border-slate-800 rounded-2xl p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">' +
    '<div class="w-10 h-10 rounded-full bg-blue-200 text-slate-900 text-sm font-bold flex items-center justify-center shrink-0">EX</div>' +
    '<div class="flex flex-col min-w-0"><strong class="text-sm font-semibold text-white truncate">Nome Exemplo</strong>' +
    '<small class="text-xs text-slate-400 truncate">' + PERFIS[perfil] + '</small></div>' +
    '<a href="login.html" id="btnSair" class="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors pt-1"><span>→]</span> Sair da conta</a></div>';

  document.getElementById('btnSair').addEventListener('click', function () {
    try { localStorage.removeItem('perfil'); } catch (e) {}
  });
})();