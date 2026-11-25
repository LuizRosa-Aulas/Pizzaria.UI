$(document).ready(function () {
    Calculadora.init();
});

var Calculadora = {
    init: function () {
        $('#Calcular').on('click', Calculadora.Calcular);
    },
    Calcular: function (event) {
        event.preventDefault();
        var numero1 =  $('#numero1').val();
        var numero2 =  $('#numero2').val();
        var operacao =  $('#operacao').val();

        switch (operacao) {
            case'+':
                var resultado = parseFloat(numero1) + parseFloat(numero2);
                break;
            case '-':
                var resultado = parseFloat(numero1) - parseFloat(numero2);
                break;
            case'*':
                var resultado = parseFloat(numero1) * parseFloat(numero2);
                break;
            case'/':
                if (parseFloat(numero2) == 0) {
                    alert('divisao indeterminada!');
                    return;
                }
                var resultado = parseFloat(numero1) / parseFloat(numero2);
                break;
            default:
                alert('Operacao invalida!');
                return;
            }

        alert(resultado);
    }
}
