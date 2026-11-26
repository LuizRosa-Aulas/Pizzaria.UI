$(document).ready(function () {
    Lucro.Init();
});

var Lucro = {
    Init: function () {
        Lucro.Listar();

    },
    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="5" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/Lucros",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, Lucro) {
                    var dataFormatada = new Date(Lucro.dataVenda).toLocaleDateString('pt-BR');
                    html += '<tr>';
                    html += '<td>' + Lucro.vendaId + '</td>';
                    html += '<td>R$ ' + parseFloat(Lucro.vendasValorTotal).toFixed(2) + '</td>';
                    html += '<td>R$ ' + parseFloat(Lucro.custoTotal).toFixed(2) + '</td>';
                    html += '<td>R$ ' + parseFloat(Lucro.lucro).toFixed(2) + '</td>';
                    html += '<td>' +  dataFormatada + '</td>';
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
