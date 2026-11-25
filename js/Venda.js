$(document).ready(function () {
    Venda.Init();
});

var Venda = {
    _pizzas: [],
    _usuarios: [],
    _tipo: [],
    _borda: [],
    _acompanhamentos: [],
    _itensAcompanhamentos: [],

    Init: function () {
        Venda.Listar();

        $('#btnNovo').on('click', Venda.btnNovo_OnClick);
        $('#btnSalvar').on('click', Venda.btnSalvar_OnClick);
        $('#btnAdicionarAcompanhamento').on('click', Venda.AdicionarAcompanhamento);

        $('#categoriaAcompanhamento').on('change', Venda.FiltrarAcompanhamentos);
        $('#pizzaId, #quantidade, #tipoId, #bordaId').on('change', function () {
            Venda.VerificarTipoBorda();
            Venda.CalcularTotal();
        });
    },

    VerificarTipoBorda: function () {
        var tipoSelecionado = $('#tipoId option:selected').text().trim().toLowerCase();

        if (tipoSelecionado != 'broto' && tipoSelecionado != 'selecione...') {
            $('#Borda').show();
        }
        else {
            $('#Borda').hide();
            $('#bordaId').val('');
        }
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
                            html += '<option value="' + p.id + '" data-preco="' + p.preco + '">' +
                                p.nome + ' - R$ ' + parseFloat(p.preco).toFixed(2) +
                                '</option>';
                        });

                        $('#pizzaId').html(html);

                        // tipo -> borda -> acompanhamentos, em sequência, para o callback
                        // só rodar quando todos os selects estiverem prontos
                        $.ajax({
                            url: Config.API_URL + "/pizzas/tipo",
                            method: "GET",
                            success: function (tipo) {
                                Venda._tipo = tipo;

                                var html = '<option value="">Selecione...</option>';

                                $.each(tipo, function (i, t) {
                                    html += '<option value="' + t.id + '">' + t.nome + '</option>';
                                });

                                $('#tipoId').html(html);

                                $.ajax({
                                    url: Config.API_URL + "/pizzas/borda",
                                    method: "GET",
                                    success: function (borda) {
                                        Venda._borda = borda;

                                        var html = '<option value="">Selecione...</option>';

                                        $.each(borda, function (i, b) {
                                            html += '<option value="' + b.id + '" data-preco="' + b.valor + '">' +
                                                b.nome + ' - R$ ' + parseFloat(b.valor).toFixed(2) +
                                                '</option>';
                                        });

                                        $('#bordaId').html(html);

                                        $.ajax({
                                            url: Config.API_URL + "/acompanhamentos",
                                            method: "GET",
                                            success: function (acompanhamentos) {
                                                Venda._acompanhamentos = acompanhamentos;

                                                $('#categoriaAcompanhamento').val('');
                                                $('#acompanhamentoId').html('<option value="">Selecione uma categoria...</option>');
                                                $('#acompanhamentoId').prop('disabled', true);

                                                if (callback) callback();
                                            },
                                            error: function () {
                                                alert('Erro ao carregar acompanhamentos!');
                                            }
                                        });
                                    },
                                    error: function () {
                                        alert('Erro ao carregar bordas!');
                                    }
                                });
                            },
                            error: function () {
                                alert('Erro ao carregar tipos!');
                            }
                        });
                    },
                    error: function () {
                        alert('Erro ao carregar pizzas!');
                    }
                });
            },
            error: function () {
                alert('Erro ao carregar usuários!');
            }
        });
    },

    FiltrarAcompanhamentos: function () {
        var categoria = $('#categoriaAcompanhamento').val();

        var html = '<option value="">Selecione...</option>';

        $.each(Venda._acompanhamentos, function (i, a) {
            if (a.categoria === categoria) {
                html += '<option value="' + a.id + '" data-preco="' + a.preco + '">' +
                    a.nome + ' - R$ ' + parseFloat(a.preco).toFixed(2) +
                    '</option>';
            }
        });

        $('#acompanhamentoId').html(html);
        $('#acompanhamentoId').prop('disabled', categoria === '');
    },

    AdicionarAcompanhamento: function () {
        var id = parseInt($('#acompanhamentoId').val());
        var quantidade = parseInt($('#quantidadeAcompanhamento').val());

        if (!id || !quantidade || quantidade < 1) {
            alert('Selecione um acompanhamento e informe a quantidade!');
            return;
        }

        var acompanhamento = Venda._acompanhamentos.find(function (a) {
            return a.id === id;
        });

        if (!acompanhamento) return;

        var existente = Venda._itensAcompanhamentos.find(function (a) {
            return a.id === id;
        });

        if (existente) {
            existente.quantidade += quantidade;
        } else {
            Venda._itensAcompanhamentos.push({
                id: acompanhamento.id,
                nome: acompanhamento.nome,
                preco: parseFloat(acompanhamento.preco),
                quantidade: quantidade
            });
        }

        Venda.ListarAcompanhamentos();
        Venda.CalcularTotal();

        $('#acompanhamentoId').val('');
        $('#quantidadeAcompanhamento').val(1);
    },

    ListarAcompanhamentos: function () {
        var html = '';

        if (Venda._itensAcompanhamentos.length === 0) {
            html = '<li class="list-group-item text-muted">Nenhum acompanhamento adicionado.</li>';
        } else {
            $.each(Venda._itensAcompanhamentos, function (i, a) {
                html += '<li class="list-group-item d-flex justify-content-between align-items-center">';
                html += a.nome + ' - ' + a.quantidade + ' x R$ ' + a.preco.toFixed(2);
                html += '<button type="button" class="btn btn-sm btn-danger" onclick="Venda.RemoverAcompanhamento(' + a.id + ')">';
                html += '<i class="bi bi-trash"></i></button>';
                html += '</li>';
            });
        }

        $('#listaAcompanhamentos').html(html);
    },

    RemoverAcompanhamento: function (id) {
        Venda._itensAcompanhamentos = Venda._itensAcompanhamentos.filter(function (a) {
            return a.id !== id;
        });

        Venda.ListarAcompanhamentos();
        Venda.CalcularTotal();
    },

    CalcularTotal: function () {
        var precoPizza = parseFloat($('#pizzaId option:selected').attr('data-preco')) || 0;
        var quantidade = parseInt($('#quantidade').val()) || 0;

        var tipoSelecionado = $('#tipoId option:selected').text().trim().toLowerCase();
        if (tipoSelecionado === 'broto') {
            precoPizza = precoPizza / 2;
        }

        var precoBorda = 0;
        if ($('#Borda').is(':visible') && $('#bordaId').val()) {
            precoBorda = parseFloat($('#bordaId option:selected').attr('data-preco')) || 0;
        }

        var total = (precoPizza + precoBorda) * quantidade;

        $.each(Venda._itensAcompanhamentos, function (i, a) {
            total += a.preco * a.quantidade;
        });

        $('#valorTotal').val(total.toFixed(2));
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="10" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/vendas",
            method: "GET",
            success: function (data) {
                var html = '';

                $.each(data, function (i, venda) {
                    var dataFormatada = new Date(venda.dataVenda).toLocaleDateString('pt-BR');

                    var acompanhamentos = 'Nenhum';

                    if (venda.acompanhamentos && venda.acompanhamentos.length > 0) {
                        acompanhamentos = venda.acompanhamentos.map(function (a) {
                            return a.nomeAcompanhamento + ' (' + a.quantidade + ')';
                        }).join(', ');
                    }

                    html += '<tr>';
                    html += '<td>' + venda.id + '</td>';
                    html += '<td>' + (venda.nomeUsuario || venda.usuarioId) + '</td>';
                    html += '<td>' + (venda.nomePizza || venda.pizzaId) + '</td>';
                    html += '<td>' + (venda.nomeTipo || '-') + '</td>';
                    html += '<td>' + (venda.nomeBorda || '-') + '</td>';
                    html += '<td>' + acompanhamentos + '</td>';
                    html += '<td>' + venda.quantidade + '</td>';
                    html += '<td>R$ ' + parseFloat(venda.valorTotal).toFixed(2) + '</td>';
                    html += '<td>' + dataFormatada + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Venda.Editar(' + venda.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Venda.Excluir(' + venda.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += Venda.BotaoStatus(venda);
                    html += '</td>';
                    html += '</tr>';
                });

                if (html === '') {
                    html = '<tr><td colspan="10" class="text-center text-muted">Nenhuma venda registrada</td></tr>';
                }

                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="10" class="text-center text-danger">Erro ao carregar vendas</td></tr>');
            }
        });
    },

    BotaoStatus: function (venda) {
        var opcoes = [
            { id: '1', nome: 'Preparando' },
            { id: '2', nome: 'A caminho' },
            { id: '3', nome: 'Entregue' }
        ];

        var html = '<select class="form-control btn-status" onchange="Venda.AlterarStatus(' + venda.id + ', this.value)">';
        $.each(opcoes, function (i, o) {
            var selected = String(venda.statusId) === o.id ? ' selected' : '';
            html += '<option value="' + o.id + '"' + selected + '>' + o.nome + '</option>';
        });
        html += '</select>';
        return html;
    },

    AlterarStatus: function (id, statusId) {
        $.ajax({
            url: Config.API_URL + "/vendas/" + id + "/" + statusId,
            method: "PUT",
            success: function () {
                // opcional: Venda.Listar();
            },
            error: function () {
                alert('Erro ao atualizar o status');
                Venda.Listar();
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formVenda')[0].reset();

        $('#vendaId').val('');
        $('#valorTotal').val('');
        $('#modalVendaLabel').text('Nova Venda');

        Venda._itensAcompanhamentos = [];
        Venda.ListarAcompanhamentos();

        Venda.CarregarSelects(function () {
            $('#Borda').hide();
            $('#modalVenda').modal('show');
            Venda.CalcularTotal();
        });
    },

    btnSalvar_OnClick: function () {
        var id = $('#vendaId').val();

        var venda = {
            usuarioId: parseInt($('#usuarioId').val()),
            pizzaId: parseInt($('#pizzaId').val()),
            idTipo: parseInt($('#tipoId').val()),
            idBorda: $('#bordaId').val() ? parseInt($('#bordaId').val()) : null,
            quantidade: parseInt($('#quantidade').val()),
            valorTotal: parseFloat($('#valorTotal').val()),
            acompanhamentos: Venda._itensAcompanhamentos.map(function (a) {
                return {
                    acompanhamentoId: a.id,
                    quantidade: a.quantidade,
                    precoUnitario: a.preco
                };
            })
        };

        if (!venda.usuarioId || !venda.pizzaId || !venda.idTipo || !venda.quantidade || venda.quantidade < 1 || isNaN(venda.valorTotal)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        var metodo = id ? "PUT" : "POST";
        var url = Config.API_URL + "/vendas" + (id ? "/" + id : "");

        $.ajax({
            url: url,
            method: metodo,
            contentType: "application/json",
            data: JSON.stringify(venda),
            success: function () {
                $('#modalVenda').modal('hide');
                Venda.Listar();
                alert('Venda salva com sucesso!');
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                alert('Erro ao salvar venda. Verifique o console e a API.');
            }
        });
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
                    $('#tipoId').val(venda.idTipo);
                    $('#quantidade').val(venda.quantidade);

                    Venda.VerificarTipoBorda();
                    $('#bordaId').val(venda.idBorda);

                    Venda._itensAcompanhamentos = [];

                    $.each(venda.acompanhamentos || [], function (i, a) {
                        Venda._itensAcompanhamentos.push({
                            id: a.acompanhamentoId,
                            nome: a.nomeAcompanhamento,
                            preco: parseFloat(a.precoUnitario),
                            quantidade: a.quantidade
                        });
                    });

                    Venda.ListarAcompanhamentos();

                    $('#modalVendaLabel').text('Editar Venda');
                    $('#modalVenda').modal('show');

                    // depois do show: o preço da borda só conta com o campo visível
                    Venda.CalcularTotal();
                },
                error: function () {
                    alert('Erro ao carregar venda!');
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
                alert('Venda excluída com sucesso!');
            },
            error: function () {
                alert('Erro ao excluir venda');
            }
        });
    }
};