$(document).ready(function () {
    Venda.Init();
});

var Venda = {
    _pizzas: [],
    _usuarios: [],

    Init: function () {
        Venda.Listar();
        $('#btnNovo').on('click', Venda.btnNovo_OnClick);
        $('#btnSalvar').on('click', Venda.btnSalvar_OnClick);
        $('#pizzaId, #quantidade').on('change', Venda.CalcularTotal);
    },

    CarregarSelects: function (callback) {
        $.ajax({
            url: Config.API_URL + "/usuarios",
            method: "GET",
            success: function (usuarios) {
                Venda._usuarios = usuarios;
                var html = '<option value="">Selecione...</option>';
                $.each(usuarios, function (i, u) {
                    html += '<option value="' + u.id + '">' + u.nome + '</option>';
                });
                $('#usuarioId').html(html);

                $.ajax({
                    url: Config.API_URL + "/pizzas",
                    method: "GET",
                    success: function (pizzas) {
                        Venda._pizzas = pizzas;
                        var html = '<option value="">Selecione...</option>';
                        $.each(pizzas, function (i, p) {
                            html += '<option value="' + p.id + '" data-preco="' + p.preco + '">' + p.nome + ' - R$ ' + parseFloat(p.preco).toFixed(2) + '</option>';
                        });
                        $('#pizzaId').html(html);

                        if (callback) callback();
                    }
                });
            }
        });
    },

    CalcularTotal: function () {
        var precoStr = $('#pizzaId option:selected').data('preco');
        var preco = parseFloat(precoStr) || 0;
        var qtd = parseInt($('#quantidade').val()) || 0;
        $('#valorTotal').val((preco * qtd).toFixed(2));
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="7" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/vendas",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, venda) {
                    var dataFormatada = new Date(venda.dataVenda).toLocaleDateString('pt-BR');
                    html += '<tr>';
                    html += '<td>' + venda.id + '</td>';
                    html += '<td>' + (venda.nomeUsuario || venda.usuarioId) + '</td>';
                    html += '<td>' + (venda.nomePizza || venda.pizzaId) + '</td>';
                    html += '<td>' + venda.quantidade + '</td>';
                    html += '<td>R$ ' + parseFloat(venda.valorTotal).toFixed(2) + '</td>';
                    html += '<td>' + dataFormatada + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Venda.Editar(' + venda.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Venda.Excluir(' + venda.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += '</td>';
                    html += '</tr>';
                });
                if (html === '') {
                    html = '<tr><td colspan="7" class="text-center text-muted">Nenhuma venda registrada</td></tr>';
                }
                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="7" class="text-center text-danger">Erro ao carregar vendas</td></tr>');
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formVenda')[0].reset();
        $('#vendaId').val('');
        $('#valorTotal').val('');
        $('#modalVendaLabel').text('Nova Venda');

        Venda.CarregarSelects(function () {
            $('#modalVenda').modal('show');
        });
    },

    btnSalvar_OnClick: function () {
        var id = $('#vendaId').val();
        var venda = {
            usuarioId: parseInt($('#usuarioId').val()),
            pizzaId: parseInt($('#pizzaId').val()),
            quantidade: parseInt($('#quantidade').val()),
            valorTotal: parseFloat($('#valorTotal').val())
        };

        if (!venda.usuarioId || !venda.pizzaId || !venda.quantidade || isNaN(venda.valorTotal)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        if (id) {
            $.ajax({
                url: Config.API_URL + "/vendas/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(venda),
                success: function () {
                    $('#modalVenda').modal('hide');
                    Venda.Listar();
                },
                error: function () {
                    alert('Erro ao atualizar venda');
                }
            });
        } else {
            $.ajax({
                url: Config.API_URL + "/vendas",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(venda),
                success: function () {
                    $('#modalVenda').modal('hide');
                    Venda.Listar();
                },
                error: function () {
                    alert('Erro ao registrar venda');
                }
            });
        }
    },

    Editar: function (id) {
        Venda.CarregarSelects(function () {
            $.ajax({
                url: Config.API_URL + "/vendas/" + id,
                method: "GET",
                success: function (venda) {
                    $('#vendaId').val(venda.id);
                    $('#usuarioId').val(venda.usuarioId);
                    $('#pizzaId').val(venda.pizzaId);
                    $('#quantidade').val(venda.quantidade);
                    $('#valorTotal').val(parseFloat(venda.valorTotal).toFixed(2));
                    $('#modalVendaLabel').text('Editar Venda');
                    $('#modalVenda').modal('show');
                }
            });
        });
    },

    Excluir: function (id) {
        if (!confirm('Deseja realmente excluir esta venda?')) return;

        $.ajax({
            url: Config.API_URL + "/vendas/" + id,
            method: "DELETE",
            success: function () {
                Venda.Listar();
            },
            error: function () {
                alert('Erro ao excluir venda');
            }
        });
    }
};
