$(document).ready(function () {
    Pizza.Init();
});

var Pizza = {
    Init: function () {
        Pizza.Listar();
        $('#btnNovo').on('click', Pizza.btnNovo_OnClick);
        $('#btnSalvar').on('click', Pizza.btnSalvar_OnClick);
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="5" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/pizzas",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, pizza) {
                    html += '<tr>';
                    html += '<td>' + pizza.id + '</td>';
                    html += '<td>' + pizza.nome + '</td>';
                    html += '<td>' + pizza.descricao + '</td>';
                    html += '<td>R$ ' + parseFloat(pizza.preco).toFixed(2) + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Pizza.Editar(' + pizza.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Pizza.Excluir(' + pizza.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += '</td>';
                    html += '</tr>';
                });
                if (html === '') {
                    html = '<tr><td colspan="5" class="text-center text-muted">Nenhuma pizza cadastrada</td></tr>';
                }
                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="5" class="text-center text-danger">Erro ao carregar pizzas</td></tr>');
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formPizza')[0].reset();
        $('#pizzaId').val('');
        $('#modalPizzaLabel').text('Nova Pizza');
        $('#modalPizza').modal('show');
    },

    btnSalvar_OnClick: function () {
        var id = $('#pizzaId').val();
        var pizza = {
            nome: $('#nome').val(),
            descricao: $('#descricao').val(),
            preco: parseFloat($('#preco').val())
        };

        if (!pizza.nome || !pizza.descricao || isNaN(pizza.preco)) {
            alert('Preencha todos os campos corretamente!');
            return;
        }

        if (id) {
            $.ajax({
                url: Config.API_URL + "/pizzas/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(pizza),
                success: function () {
                    $('#modalPizza').modal('hide');
                    Pizza.Listar();
                },
                error: function () {
                    alert('Erro ao atualizar pizza');
                }
            });
        } else {
            $.ajax({
                url: Config.API_URL + "/pizzas",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(pizza),
                success: function () {
                    $('#modalPizza').modal('hide');
                    Pizza.Listar();
                },
                error: function () {
                    alert('Erro ao cadastrar pizza');
                }
            });
        }
    },

    Editar: function (id) {
        $.ajax({
            url: Config.API_URL + "/pizzas/" + id,
            method: "GET",
            success: function (pizza) {
                $('#pizzaId').val(pizza.id);
                $('#nome').val(pizza.nome);
                $('#descricao').val(pizza.descricao);
                $('#preco').val(pizza.preco);
                $('#modalPizzaLabel').text('Editar Pizza');
                $('#modalPizza').modal('show');
            }
        });
    },

    Excluir: function (id) {
        if (!confirm('Deseja realmente excluir esta pizza?')) return;

        $.ajax({
            url: Config.API_URL + "/pizzas/" + id,
            method: "DELETE",
            success: function () {
                Pizza.Listar();
            },
            error: function () {
                alert('Erro ao excluir pizza');
            }
        });
    }
};
