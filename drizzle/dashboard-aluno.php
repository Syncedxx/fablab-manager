<?php
declare(strict_types=1);

session_start();

function e(string $valor): string
{
    return htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
}

function redirecionar(string $url = 'dashboard.php'): never
{
    header('Location: ' . $url);
    exit;
}

if (!isset($_SESSION['usuario'])) {
    $_SESSION['usuario'] = [
        'nome' => 'João',
        'iniciais' => 'JP',
    ];
}

if (!isset($_SESSION['maquinas'])) {
    $_SESSION['maquinas'] = [
        [
            'id' => 1,
            'nome' => 'Bambu Lab X1 Carbon',
            'tipo' => 'Impressão 3D',
            'status' => 'livre',
            'detalhe' => 'Livre',
        ],
        [
            'id' => 2,
            'nome' => 'Ender 5 Plus',
            'tipo' => 'Impressão 3D',
            'status' => 'uso',
            'detalhe' => 'Em uso até 15h',
        ],
        [
            'id' => 3,
            'nome' => 'Laser Cutter K40',
            'tipo' => 'Corte a laser',
            'status' => 'manutencao',
            'detalhe' => 'Manutenção',
        ],
        [
            'id' => 4,
            'nome' => 'CNC Router 3018',
            'tipo' => 'Usinagem CNC',
            'status' => 'livre',
            'detalhe' => 'Livre',
        ],
        [
            'id' => 5,
            'nome' => 'Ultimaker S3',
            'tipo' => 'Impressão 3D',
            'status' => 'livre',
            'detalhe' => 'Livre',
        ],
        [
            'id' => 6,
            'nome' => 'Estação de Solda',
            'tipo' => 'Eletrônica',
            'status' => 'livre',
            'detalhe' => 'Livre',
        ],
        [
            'id' => 7,
            'nome' => 'Ender 3 V3 SE',
            'tipo' => 'Impressão 3D',
            'status' => 'uso',
            'detalhe' => 'Em uso até 17h',
        ],
    ];
}

if (!isset($_SESSION['estoque'])) {
    $_SESSION['estoque'] = [
        ['nome' => 'Filamento PLA Preto', 'quantidade' => 2, 'minimo' => 5, 'unidade' => 'rolos'],
        ['nome' => 'Filamento PLA Branco', 'quantidade' => 4, 'minimo' => 5, 'unidade' => 'rolos'],
        ['nome' => 'Chapa MDF 3 mm', 'quantidade' => 7, 'minimo' => 10, 'unidade' => 'chapas'],
        ['nome' => 'Arduino Uno', 'quantidade' => 9, 'minimo' => 3, 'unidade' => 'unidades'],
        ['nome' => 'Resina UV', 'quantidade' => 6, 'minimo' => 2, 'unidade' => 'frascos'],
    ];
}

$_SESSION['reservas'] ??= [];
$_SESSION['requisicoes'] ??= [];

$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';

    if ($acao === 'reservar') {
        $maquinaId = filter_input(INPUT_POST, 'maquina_id', FILTER_VALIDATE_INT);
        $data = trim((string)($_POST['data'] ?? ''));
        $hora = trim((string)($_POST['hora'] ?? ''));
        $observacao = trim((string)($_POST['observacao'] ?? ''));

        $maquina = null;
        foreach ($_SESSION['maquinas'] as $item) {
            if ((int)$item['id'] === (int)$maquinaId) {
                $maquina = $item;
                break;
            }
        }

        $erros = [];

        if (!$maquina) {
            $erros[] = 'Selecione uma máquina válida.';
        } elseif ($maquina['status'] === 'manutencao') {
            $erros[] = 'Essa máquina está em manutenção.';
        }

        $dataReserva = DateTime::createFromFormat('Y-m-d', $data);
        if (!$dataReserva || $dataReserva->format('Y-m-d') !== $data) {
            $erros[] = 'Informe uma data válida.';
        } elseif ($data < date('Y-m-d')) {
            $erros[] = 'A data da reserva não pode estar no passado.';
        }

        if (!preg_match('/^\d{2}:\d{2}$/', $hora)) {
            $erros[] = 'Informe um horário válido.';
        }

        foreach ($_SESSION['reservas'] as $reservaExistente) {
            if (
                (int)$reservaExistente['maquina_id'] === (int)$maquinaId &&
                $reservaExistente['data'] === $data &&
                $reservaExistente['hora'] === $hora
            ) {
                $erros[] = 'Já existe uma reserva para essa máquina nesse horário.';
                break;
            }
        }

        if ($erros) {
            $_SESSION['flash'] = [
                'tipo' => 'erro',
                'mensagem' => implode(' ', $erros),
            ];
            redirecionar('dashboard.php?modal=reserva');
        }

        $_SESSION['reservas'][] = [
            'id' => count($_SESSION['reservas']) + 1,
            'maquina_id' => (int)$maquinaId,
            'maquina' => $maquina['nome'],
            'data' => $data,
            'hora' => $hora,
            'observacao' => $observacao,
            'status' => 'confirmada',
            'criada_em' => date('Y-m-d H:i:s'),
        ];

        $_SESSION['flash'] = [
            'tipo' => 'sucesso',
            'mensagem' => 'Reserva criada com sucesso.',
        ];

        redirecionar('dashboard.php#agenda');
    }

    if ($acao === 'requisitar') {
        $material = trim((string)($_POST['material'] ?? ''));
        $quantidade = filter_input(INPUT_POST, 'quantidade', FILTER_VALIDATE_INT);
        $motivo = trim((string)($_POST['motivo'] ?? ''));

        if ($material === '' || !$quantidade || $quantidade < 1) {
            $_SESSION['flash'] = [
                'tipo' => 'erro',
                'mensagem' => 'Informe o material e uma quantidade válida.',
            ];
            redirecionar('dashboard.php?modal=material');
        }

        $_SESSION['requisicoes'][] = [
            'id' => count($_SESSION['requisicoes']) + 1,
            'material' => $material,
            'quantidade' => (int)$quantidade,
            'motivo' => $motivo,
            'status' => 'aberto',
            'criada_em' => date('Y-m-d H:i:s'),
        ];

        $_SESSION['flash'] = [
            'tipo' => 'sucesso',
            'mensagem' => 'Requisição enviada com sucesso.',
        ];

        redirecionar('dashboard.php#requisicoes');
    }

    if ($acao === 'cancelar_reserva') {
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

        foreach ($_SESSION['reservas'] as $indice => $reserva) {
            if ((int)$reserva['id'] === (int)$id) {
                unset($_SESSION['reservas'][$indice]);
                $_SESSION['reservas'] = array_values($_SESSION['reservas']);
                break;
            }
        }

        $_SESSION['flash'] = [
            'tipo' => 'sucesso',
            'mensagem' => 'Reserva cancelada.',
        ];

        redirecionar('dashboard.php#agenda');
    }
}

$maquinas = $_SESSION['maquinas'];
$estoque = $_SESSION['estoque'];
$reservas = $_SESSION['reservas'];
$requisicoes = $_SESSION['requisicoes'];

$itensCriticos = count(array_filter(
    $estoque,
    fn(array $item): bool => $item['quantidade'] <= $item['minimo']
));

$reservasHoje = count(array_filter(
    $reservas,
    fn(array $reserva): bool => $reserva['data'] === date('Y-m-d')
));

$pedidosAbertos = count(array_filter(
    $requisicoes,
    fn(array $req): bool => $req['status'] === 'aberto'
));

$maquinasLivres = count(array_filter(
    $maquinas,
    fn(array $maquina): bool => $maquina['status'] === 'livre'
));

$modal = $_GET['modal'] ?? '';
$buscaEstoque = trim((string)($_GET['q'] ?? ''));

$estoqueFiltrado = array_values(array_filter(
    $estoque,
    fn(array $item): bool => $buscaEstoque === '' || stripos($item['nome'], $buscaEstoque) !== false
));

function badgeMaquina(string $status): array
{
    return match ($status) {
        'livre' => ['text-emerald-600 bg-emerald-50', 'Livre'],
        'uso' => ['text-amber-600 bg-amber-50', 'Em uso'],
        'manutencao' => ['text-red-500 bg-red-50', 'Manutenção'],
        default => ['text-slate-600 bg-slate-100', ucfirst($status)],
    };
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - FabLab Manager</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        html { scroll-behavior: smooth; }
        body { min-width: 320px; }
        .modal-bg { backdrop-filter: blur(4px); }
    </style>
</head>

<body class="bg-slate-50 text-slate-800 antialiased font-sans">
<main>
    <div id="geral" class="flex min-h-screen">

        <aside id="barraLateral"
               class="hidden lg:flex w-64 min-h-screen bg-[#0d1527] text-white p-6 flex-col gap-6 shrink-0 sticky top-0 h-screen">
            <div class="flex flex-col gap-1">
                <h2 class="text-xl font-bold leading-tight text-white">FabLab Manager</h2>
                <p class="text-[10px] text-blue-300 font-semibold tracking-wider uppercase">
                    SENAI — SISTEMA DE GESTÃO
                </p>
            </div>

            <hr class="border-slate-800 -mx-6 my-4 -mt-3">

            <nav class="flex flex-col gap-2">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MENU</p>

                <a href="#visao-geral"
                   class="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg text-xs font-medium transition-all hover:bg-slate-800/60 hover:text-white">
                    <span>📊</span> Visão Geral
                </a>

                <a href="?modal=estoque"
                   class="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg text-xs font-medium transition-all hover:bg-slate-800/60 hover:text-white">
                    <span>📦</span> Inventário
                </a>

                <a href="#agenda"
                   class="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg text-xs font-medium transition-all hover:bg-slate-800/60 hover:text-white">
                    <span>📅</span> Reservas
                </a>

                <a href="#requisicoes"
                   class="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg text-xs font-medium transition-all hover:bg-slate-800/60 hover:text-white">
                    <span>📄</span> Requisições
                </a>
            </nav>

            <div class="mt-auto rounded-xl bg-slate-800/70 p-4">
                <p class="text-[10px] uppercase tracking-wider text-slate-400">Sessão atual</p>
                <p class="mt-1 text-sm font-semibold"><?= e($_SESSION['usuario']['nome']) ?></p>
                <p class="text-[10px] text-slate-400">Dashboard local</p>
            </div>
        </aside>

        <div id="painelDireita" class="flex-1 p-4 md:p-8 flex flex-col gap-6 min-w-0">
            <header id="visao-geral" class="flex justify-between items-center pb-4 border-b border-slate-200">
                <div class="flex flex-col gap-0.5">
                    <p class="text-[10px] font-bold text-blue-600 uppercase tracking-wider">VISÃO GERAL</p>
                    <h2 class="text-2xl font-bold text-slate-900">
                        Olá, <?= e($_SESSION['usuario']['nome']) ?>
                    </h2>
                    <p class="text-xs text-slate-500">Aqui está o resumo do laboratório hoje.</p>
                </div>

                <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                    <?= e($_SESSION['usuario']['iniciais']) ?>
                </div>
            </header>

            <?php if ($flash): ?>
                <div class="<?= $flash['tipo'] === 'sucesso'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700' ?> border px-4 py-3 rounded-xl text-sm flex justify-between gap-4">
                    <span><?= e($flash['mensagem']) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="font-bold">×</button>
                </div>
            <?php endif; ?>

            <section class="bg-[#1b437c] text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-5 relative overflow-hidden">
                <div class="flex flex-col gap-2 z-10">
                    <span class="inline-flex items-center gap-2 text-[11px] bg-emerald-500/20 text-emerald-300 font-medium px-2.5 py-0.5 rounded-full w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Laboratório aberto
                    </span>
                    <h3 class="text-xl font-bold">Pronto para criar?</h3>
                    <p class="text-xs text-blue-100">
                        Há <?= $maquinasLivres ?> máquina<?= $maquinasLivres === 1 ? '' : 's' ?> disponível<?= $maquinasLivres === 1 ? '' : 'is' ?>
                        no momento.
                    </p>
                </div>

                <a href="?modal=reserva"
                   class="bg-blue-400 hover:bg-blue-300 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors z-10 flex items-center justify-center gap-1.5">
                    <span>+</span> Nova reserva
                </a>
            </section>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span class="text-red-500 text-sm">⚠️</span>
                    <span class="text-2xl font-bold text-slate-900 mt-1"><?= $itensCriticos ?></span>
                    <span class="text-xs font-semibold text-slate-800">Itens críticos</span>
                    <span class="text-[10px] text-slate-400">Precisam de reposição</span>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span class="text-blue-500 text-sm">📅</span>
                    <span class="text-2xl font-bold text-slate-900 mt-1"><?= $reservasHoje ?></span>
                    <span class="text-xs font-semibold text-slate-800">Reservas hoje</span>
                    <span class="text-[10px] text-slate-400"><?= count($reservas) ?> reserva(s) cadastrada(s)</span>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span class="text-amber-500 text-sm">📋</span>
                    <span class="text-2xl font-bold text-slate-900 mt-1"><?= $pedidosAbertos ?></span>
                    <span class="text-xs font-semibold text-slate-800">Pedidos abertos</span>
                    <span class="text-[10px] text-slate-400">Requisições em análise</span>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1">
                    <span class="text-emerald-500 text-sm">🖨️</span>
                    <span class="text-2xl font-bold text-slate-900 mt-1"><?= $maquinasLivres ?></span>
                    <span class="text-xs font-semibold text-slate-800">Máquinas livres</span>
                    <span class="text-[10px] text-slate-400">de <?= count($maquinas) ?> equipamentos</span>
                </div>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div class="xl:col-span-2 bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="text-sm font-bold text-slate-900">Status das máquinas</h4>
                            <p class="text-[11px] text-slate-400">Atualizado nesta sessão</p>
                        </div>
                        <a href="#agenda" class="text-xs text-blue-600 font-semibold hover:underline">Ver agenda</a>
                    </div>

                    <div class="flex flex-col divide-y divide-slate-100">
                        <?php foreach ($maquinas as $maquina): ?>
                            <?php [$badgeClass] = badgeMaquina($maquina['status']); ?>
                            <div class="py-3 flex justify-between items-center gap-4">
                                <div class="flex items-center gap-3 min-w-0">
                                    <span class="p-2 bg-slate-50 rounded-lg text-slate-500 text-xs">🛠️</span>
                                    <div class="min-w-0">
                                        <p class="text-xs font-semibold text-slate-800 truncate"><?= e($maquina['nome']) ?></p>
                                        <p class="text-[10px] text-slate-400"><?= e($maquina['tipo']) ?></p>
                                    </div>
                                </div>
                                <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap <?= e($badgeClass) ?>">
                                    <?= e($maquina['detalhe']) ?>
                                </span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div>
                        <h4 class="text-sm font-bold text-slate-900">Ações rápidas</h4>
                        <p class="text-[11px] text-slate-400">Acesse o que mais usa</p>
                    </div>

                    <div class="flex flex-col gap-2.5">
                        <a href="?modal=reserva"
                           class="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <span class="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs">📅</span>
                                <div>
                                    <p class="text-xs font-semibold text-slate-800">Reservar máquina</p>
                                    <p class="text-[10px] text-slate-400">Escolha uma data e horário</p>
                                </div>
                            </div>
                            <span class="text-slate-300 text-xs group-hover:translate-x-0.5 transition-transform">›</span>
                        </a>

                        <a href="?modal=material"
                           class="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <span class="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs">📦</span>
                                <div>
                                    <p class="text-xs font-semibold text-slate-800">Solicitar material</p>
                                    <p class="text-[10px] text-slate-400">Crie um novo pedido</p>
                                </div>
                            </div>
                            <span class="text-slate-300 text-xs group-hover:translate-x-0.5 transition-transform">›</span>
                        </a>

                        <a href="?modal=estoque"
                           class="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <span class="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs">🔍</span>
                                <div>
                                    <p class="text-xs font-semibold text-slate-800">Consultar estoque</p>
                                    <p class="text-[10px] text-slate-400">Confira saldos disponíveis</p>
                                </div>
                            </div>
                            <span class="text-slate-300 text-xs group-hover:translate-x-0.5 transition-transform">›</span>
                        </a>
                    </div>
                </div>
            </section>

            <section id="agenda" class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h4 class="text-sm font-bold text-slate-900">Minhas reservas</h4>
                        <p class="text-[11px] text-slate-400">Reservas criadas neste dashboard</p>
                    </div>
                    <a href="?modal=reserva"
                       class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-lg text-center">
                        + Nova reserva
                    </a>
                </div>

                <?php if (!$reservas): ?>
                    <div class="border border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <p class="text-sm font-semibold text-slate-700">Nenhuma reserva criada ainda.</p>
                        <p class="text-xs text-slate-400 mt-1">Use o botão “Nova reserva” para testar.</p>
                    </div>
                <?php else: ?>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-slate-100 text-slate-400">
                                    <th class="py-3 pr-4 font-semibold">Máquina</th>
                                    <th class="py-3 pr-4 font-semibold">Data</th>
                                    <th class="py-3 pr-4 font-semibold">Hora</th>
                                    <th class="py-3 pr-4 font-semibold">Status</th>
                                    <th class="py-3 text-right font-semibold">Ação</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                            <?php foreach ($reservas as $reserva): ?>
                                <tr>
                                    <td class="py-3 pr-4 font-medium text-slate-800"><?= e($reserva['maquina']) ?></td>
                                    <td class="py-3 pr-4"><?= e(date('d/m/Y', strtotime($reserva['data']))) ?></td>
                                    <td class="py-3 pr-4"><?= e($reserva['hora']) ?></td>
                                    <td class="py-3 pr-4">
                                        <span class="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-semibold">
                                            Confirmada
                                        </span>
                                    </td>
                                    <td class="py-3 text-right">
                                        <form method="post" onsubmit="return confirm('Cancelar esta reserva?')">
                                            <input type="hidden" name="acao" value="cancelar_reserva">
                                            <input type="hidden" name="id" value="<?= (int)$reserva['id'] ?>">
                                            <button class="text-red-500 hover:underline font-semibold" type="submit">Cancelar</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </section>

            <section id="requisicoes" class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h4 class="text-sm font-bold text-slate-900">Requisições de material</h4>
                        <p class="text-[11px] text-slate-400">Pedidos enviados nesta sessão</p>
                    </div>
                    <a href="?modal=material"
                       class="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-2 rounded-lg text-center">
                        + Solicitar material
                    </a>
                </div>

                <?php if (!$requisicoes): ?>
                    <div class="border border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <p class="text-sm font-semibold text-slate-700">Nenhuma requisição aberta.</p>
                        <p class="text-xs text-slate-400 mt-1">Você pode criar uma para testar o fluxo.</p>
                    </div>
                <?php else: ?>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <?php foreach (array_reverse($requisicoes) as $req): ?>
                            <article class="border border-slate-100 rounded-xl p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-xs font-bold text-slate-800"><?= e($req['material']) ?></p>
                                        <p class="text-[11px] text-slate-500 mt-1">Quantidade: <?= (int)$req['quantidade'] ?></p>
                                    </div>
                                    <span class="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-semibold">
                                        Aberto
                                    </span>
                                </div>
                                <?php if ($req['motivo'] !== ''): ?>
                                    <p class="text-[11px] text-slate-500 mt-3"><?= e($req['motivo']) ?></p>
                                <?php endif; ?>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>
        </div>
    </div>
</main>

<?php if ($modal === 'reserva'): ?>
<div class="fixed inset-0 bg-slate-950/55 modal-bg z-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
        <div class="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-900">Nova reserva</h3>
                <p class="text-xs text-slate-400">Escolha a máquina, data e horário.</p>
            </div>
            <a href="dashboard.php" class="text-slate-400 hover:text-slate-700 text-xl">×</a>
        </div>

        <form method="post" class="p-5 space-y-4">
            <input type="hidden" name="acao" value="reservar">

            <div>
                <label class="text-xs font-semibold text-slate-700">Máquina</label>
                <select name="maquina_id" required
                        class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione</option>
                    <?php foreach ($maquinas as $maquina): ?>
                        <option value="<?= (int)$maquina['id'] ?>" <?= $maquina['status'] === 'manutencao' ? 'disabled' : '' ?>>
                            <?= e($maquina['nome']) ?> — <?= e($maquina['detalhe']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="text-xs font-semibold text-slate-700">Data</label>
                    <input type="date" name="data" min="<?= date('Y-m-d') ?>" required
                           class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="text-xs font-semibold text-slate-700">Horário</label>
                    <input type="time" name="hora" min="08:00" max="21:00" required
                           class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <div>
                <label class="text-xs font-semibold text-slate-700">Observação</label>
                <textarea name="observacao" rows="3" maxlength="300"
                          placeholder="Ex.: impressão de protótipo"
                          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <a href="dashboard.php"
                   class="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    Cancelar
                </a>
                <button type="submit"
                        class="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                    Confirmar reserva
                </button>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>

<?php if ($modal === 'material'): ?>
<div class="fixed inset-0 bg-slate-950/55 modal-bg z-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
        <div class="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-900">Solicitar material</h3>
                <p class="text-xs text-slate-400">Envie uma nova requisição ao laboratório.</p>
            </div>
            <a href="dashboard.php" class="text-slate-400 hover:text-slate-700 text-xl">×</a>
        </div>

        <form method="post" class="p-5 space-y-4">
            <input type="hidden" name="acao" value="requisitar">

            <div>
                <label class="text-xs font-semibold text-slate-700">Material</label>
                <input type="text" name="material" maxlength="120" required
                       placeholder="Ex.: Filamento PLA azul"
                       class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
                <label class="text-xs font-semibold text-slate-700">Quantidade</label>
                <input type="number" name="quantidade" min="1" max="999" required
                       class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
                <label class="text-xs font-semibold text-slate-700">Motivo</label>
                <textarea name="motivo" rows="3" maxlength="300"
                          placeholder="Descreva para qual atividade o material será usado"
                          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <a href="dashboard.php"
                   class="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    Cancelar
                </a>
                <button type="submit"
                        class="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                    Enviar requisição
                </button>
            </div>
        </form>
    </div>
</div>
<?php endif; ?>

<?php if ($modal === 'estoque'): ?>
<div class="fixed inset-0 bg-slate-950/55 modal-bg z-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-900">Consultar estoque</h3>
                <p class="text-xs text-slate-400">Materiais disponíveis no FabLab.</p>
            </div>
            <a href="dashboard.php" class="text-slate-400 hover:text-slate-700 text-xl">×</a>
        </div>

        <div class="p-5 border-b border-slate-100">
            <form method="get" class="flex gap-2">
                <input type="hidden" name="modal" value="estoque">
                <input type="search" name="q" value="<?= e($buscaEstoque) ?>"
                       placeholder="Buscar material..."
                       class="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <button class="bg-slate-900 text-white rounded-lg px-4 text-xs font-semibold hover:bg-slate-800">
                    Buscar
                </button>
            </form>
        </div>

        <div class="p-5 overflow-y-auto">
            <div class="space-y-2">
                <?php if (!$estoqueFiltrado): ?>
                    <p class="text-sm text-slate-500 text-center py-8">Nenhum material encontrado.</p>
                <?php endif; ?>

                <?php foreach ($estoqueFiltrado as $item): ?>
                    <?php $critico = $item['quantidade'] <= $item['minimo']; ?>
                    <div class="border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                            <p class="text-xs font-semibold text-slate-800"><?= e($item['nome']) ?></p>
                            <p class="text-[10px] text-slate-400">
                                Mínimo recomendado: <?= (int)$item['minimo'] ?> <?= e($item['unidade']) ?>
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold <?= $critico ? 'text-red-600' : 'text-emerald-600' ?>">
                                <?= (int)$item['quantidade'] ?>
                            </p>
                            <p class="text-[10px] <?= $critico ? 'text-red-500' : 'text-slate-400' ?>">
                                <?= $critico ? 'Estoque crítico' : e($item['unidade']) ?>
                            </p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>

</body>
</html>