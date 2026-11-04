$(document).ready(function () {
    Lucro.Init();
});

var Lucro = {

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="5" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/Lucros",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, Lucro) {
                    html += '<tr>';
                    html += '<td>' + Lucro.id + '</td>';
                    html += '<td>' + Lucro.nome + '</td>';
                    html += '<td>' + Lucro.descricao + '</td>';
                    html += '<td>R$ ' + parseFloat(Lucro.preco).toFixed(2) + '</td>';
                    html += '</tr>';
                });
                if (html === '') {
                    html = '<tr><td colspan="5" class="text-center text-muted">Nenhum Lucro cadastrado</td></tr>';
                }
                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="5" class="text-center text-danger">Erro ao carregar Lucros</td></tr>');
            }
        });
    },

};
