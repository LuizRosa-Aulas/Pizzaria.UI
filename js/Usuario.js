$(document).ready(function () {
    Usuario.Init();
});

var Usuario = {
    Init: function () {
        Usuario.Listar();
        $('#btnNovo').on('click', Usuario.btnNovo_OnClick);
        $('#btnSalvar').on('click', Usuario.btnSalvar_OnClick);
    },

    Listar: function () {
        $('#tabela-body').html('<tr><td colspan="5" class="loading">Carregando...</td></tr>');

        $.ajax({
            url: Config.API_URL + "/usuarios",
            method: "GET",
            success: function (data) {
                var html = '';
                $.each(data, function (i, usuario) {
                    html += '<tr>';
                    html += '<td>' + usuario.id + '</td>';
                    html += '<td>' + usuario.nome + '</td>';
                    html += '<td>' + usuario.email + '</td>';
                    html += '<td>' + usuario.telefone + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-sm btn-warning me-1" onclick="Usuario.Editar(' + usuario.id + ')"><i class="bi bi-pencil"></i> Editar</button>';
                    html += '<button class="btn btn-sm btn-danger" onclick="Usuario.Excluir(' + usuario.id + ')"><i class="bi bi-trash"></i> Excluir</button>';
                    html += '</td>';
                    html += '</tr>';
                });
                if (html === '') {
                    html = '<tr><td colspan="5" class="text-center text-muted">Nenhum usuario cadastrado</td></tr>';
                }
                $('#tabela-body').html(html);
            },
            error: function () {
                $('#tabela-body').html('<tr><td colspan="5" class="text-center text-danger">Erro ao carregar usuarios</td></tr>');
            }
        });
    },

    btnNovo_OnClick: function () {
        $('#formUsuario')[0].reset();
        $('#usuarioId').val('');
        $('#modalUsuarioLabel').text('Novo Usuario');
        $('#modalUsuario').modal('show');
    },

    btnSalvar_OnClick: function () {
        var id = $('#usuarioId').val();
        var usuario = {
            nome: $('#nome').val(),
            email: $('#email').val(),
            telefone: $('#telefone').val()
        };

        if (!usuario.nome || !usuario.email || !usuario.telefone) {
            alert('Preencha todos os campos!');
            return;
        }

        if (id) {
            $.ajax({
                url: Config.API_URL + "/usuarios/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(usuario),
                success: function () {
                    $('#modalUsuario').modal('hide');
                    Usuario.Listar();
                },
                error: function () {
                    alert('Erro ao atualizar usuario');
                }
            });
        } else {
            $.ajax({
                url: Config.API_URL + "/usuarios",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(usuario),
                success: function () {
                    $('#modalUsuario').modal('hide');
                    Usuario.Listar();
                },
                error: function () {
                    alert('Erro ao cadastrar usuario');
                }
            });
        }
    },

    Editar: function (id) {
        $.ajax({
            url: Config.API_URL + "/usuarios/" + id,
            method: "GET",
            success: function (usuario) {
                $('#usuarioId').val(usuario.id);
                $('#nome').val(usuario.nome);
                $('#email').val(usuario.email);
                $('#telefone').val(usuario.telefone);
                $('#modalUsuarioLabel').text('Editar Usuario');
                $('#modalUsuario').modal('show');
            }
        });
    },

    Excluir: function (id) {
        if (!confirm('Deseja realmente excluir este usuario?')) return;

        $.ajax({
            url: Config.API_URL + "/usuarios/" + id,
            method: "DELETE",
            success: function () {
                Usuario.Listar();
            },
            error: function () {
                alert('Erro ao excluir usuario');
            }
        });
    }
};
