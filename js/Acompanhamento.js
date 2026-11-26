
$(document).ready(function () {
    Acompanhamento.Init();
});

var Acompanhamento = {
    Init: function () {
        Acompanhamento.Listar();
        $('#btnNovo').on('click', Acompanhamento.btnNovo_OnClick);
        $('#btnSalvar').on('click', Acompanhamento.btnSalvar_OnClick);
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="6" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/acompanhamentos",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, acompanhamento) {
                    html += '<tr>';
                    html += '<td>' + acompanhamento.id + '</td>';
                    html += '<td>' + acompanhamento.nome + '</td>';
                    html += '<td>' + acompanhamento.descricao + '</td>';
                    html += '<td>' + acompanhamento.categoria + '</td>';
                    html += '<td>R$ ' + parseFloat(acompanhamento.preco).toFixed(2) + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Acompanhamento.Editar(' + acompanhamento.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Acompanhamento.Excluir(' + acompanhamento.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += '</td>';
                    html += '</tr>';
                });

                if (html === '') {
                    html = '<tr><td colspan="6" class="text-center text-muted">Nenhum acompanhamento cadastrado</td></tr>';
                }

                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="6" class="text-center text-danger">Erro ao carregar acompanhamentos</td></tr>');
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formAcompanhamento')[0].reset();
        $('#acompanhamentoId').val('');
        $('#modalAcompanhamentoLabel').text('Novo Acompanhamento');
        $('#modalAcompanhamento').modal('show');
    },

    btnSalvar_OnClick: function () {
        var id = $('#acompanhamentoId').val();
        var acompanhamento = {
            nome: $('#nome').val(),
            descricao: $('#descricao').val(),
            categoria: $('#categoria').val(),
            preco: parseFloat($('#preco').val())
        };

        if (!acompanhamento.nome || !acompanhamento.descricao || !acompanhamento.categoria || isNaN(acompanhamento.preco)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        if (id) {
            $.ajax({
                url: Config.API_URL + "/acompanhamentos/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(acompanhamento),
                success: function () {
                    $('#modalAcompanhamento').modal('hide');
                    Acompanhamento.Listar();
                },
                error: function () {
                    alert('Erro ao atualizar acompanhamento');
                }
            });
        } else {
            $.ajax({
                url: Config.API_URL + "/acompanhamentos",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(acompanhamento),
                success: function () {
                    $('#modalAcompanhamento').modal('hide');
                    Acompanhamento.Listar();
                },
                error: function () {
                    alert('Erro ao cadastrar acompanhamento');
                }
            });
        }
    },

    Editar: function (id) {
        $.ajax({
            url: Config.API_URL + "/acompanhamentos/" + id,
            method: "GET",
            success: function (acompanhamento) {
                $('#acompanhamentoId').val(acompanhamento.id);
                $('#nome').val(acompanhamento.nome);
                $('#descricao').val(acompanhamento.descricao);
                $('#categoria').val(acompanhamento.categoria);
                $('#preco').val(acompanhamento.preco);
                $('#modalAcompanhamentoLabel').text('Editar Acompanhamento');
                $('#modalAcompanhamento').modal('show');
            }
        });
    },

    Excluir: function (id) {
        if (!confirm('Deseja realmente excluir este acompanhamento?')) return;

        $.ajax({
            url: Config.API_URL + "/acompanhamentos/" + id,
            method: "DELETE",
            success: function () {
                Acompanhamento.Listar();
            },
            error: function (xhr) {
                // 409: a API explica por que não pode excluir (ex.: já tem vendas)
                var mensagem = xhr.responseJSON && xhr.responseJSON.mensagem;
                alert(mensagem || 'Erro ao excluir acompanhamento');
            }
        });
    }
};
