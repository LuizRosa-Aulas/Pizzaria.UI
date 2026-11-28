$(document).ready(function () {
    Home.Init();
});

var Home = {
    Init: function () {
        Home.CarregarCardapio();
        $('#listaPizzas').on('click', '.btn-tentar-novamente', Home.CarregarCardapio);
    },

    CarregarCardapio: function () {
        $('#listaPizzas').html('<div class="col-12 loading">Carregando cardapio...</div>');
        $('#cardapioContador').text('');

        $.ajax({
            url: Config.API_URL + "/pizzas",
            method: "GET",
            success: function (data) {
                if (!data || data.length === 0) {
                    $('#listaPizzas').html(
                        '<div class="col-12 cardapio-vazio">' +
                        '<i class="bi bi-emoji-neutral"></i>' +
                        '<p>Nenhuma pizza cadastrada ainda.</p>' +
                        '<a href="pages/pizzas.html" class="btn btn-pizza">Cadastrar primeira pizza</a>' +
                        '</div>');
                    return;
                }

                var html = '';
                $.each(data, function (i, pizza) {
                    html += Home.MontarCard(pizza);
                });
                $('#listaPizzas').html(html);
                $('#cardapioContador').text(data.length + (data.length === 1 ? ' sabor' : ' sabores'));
            },
            error: function () {
                $('#listaPizzas').html(
                    '<div class="col-12 cardapio-vazio">' +
                    '<i class="bi bi-wifi-off"></i>' +
                    '<p>Nao foi possivel carregar o cardapio. Verifique se a API esta rodando.</p>' +
                    '<button type="button" class="btn btn-pizza btn-tentar-novamente">Tentar novamente</button>' +
                    '</div>');
            }
        });
    },

    MontarCard: function (pizza) {
        var preco = Home.FormatarPreco(pizza.preco);
        var ingredientes = Home.Ingredientes(pizza.descricao);

        var html = '';
        html += '<div class="col-12 col-sm-6 col-lg-4 col-xl-3">';
        html += '  <article class="card card-pizza h-100">';
        html += '    <div class="card-pizza-topo"><span class="card-pizza-emoji" aria-hidden="true">&#127829;</span></div>';
        html += '    <div class="card-body">';
        html += '      <h5 class="card-pizza-nome">' + Home.Escapar(pizza.nome) + '</h5>';
        if (ingredientes.length > 0) {
            html += '      <div class="card-pizza-ingredientes" title="' + Home.Escapar(pizza.descricao) + '">';
            $.each(ingredientes, function (i, ing) {
                html += '<span class="badge-ingrediente">' + Home.Escapar(ing) + '</span>';
            });
            html += '      </div>';
        }
        html += '    </div>';
        html += '    <div class="card-footer card-pizza-rodape">';
        html += '      <span class="card-pizza-preco">' + preco + '</span>';
        html += '    </div>';
        html += '  </article>';
        html += '</div>';
        return html;
    },

    Ingredientes: function (descricao) {
        if (!descricao) return [];
        return $.map(String(descricao).split(/\s*,\s*|\s+e\s+/), function (item) {
            item = $.trim(item);
            return item === '' ? null : item.charAt(0).toUpperCase() + item.slice(1);
        });
    },

    FormatarPreco: function (valor) {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    Escapar: function (texto) {
        return $('<div>').text(texto == null ? '' : texto).html().replace(/"/g, '&quot;');
    }
};
