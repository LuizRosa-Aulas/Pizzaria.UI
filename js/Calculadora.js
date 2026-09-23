$(document).ready(function () {
    Calculadora.Init();
});

var Calculadora = {
    Init: function () {
        $('#calcular').on('click', Calculadora.Calcular);
    },
    Calcular: function (event) {
        event.preventDefault();
        var numero1 = $('#numero1').val();
        var numero2 = $('#numero2').val();
        var operacao = $('#operacao').val();
        var resultado;
        switch (operacao) {
            case '+':
                resultado = parseFloat(numero1) + parseFloat(numero2); 
                break;
            case '-':
                resultado = parseFloat(numero1) - parseFloat(numero2);
                break;
            case '*':
                resultado = parseFloat(numero1) * parseFloat(numero2);  
                break; 
            case '/':  
                if (parseFloat(numero2) === 0) {
                    alert('Divisão por zero não é permitida!');
                    return;
                }
                resultado = parseFloat(numero1) / parseFloat(numero2);
                break;
            default:
                alert('Operação inválida!');
                return;
        }

        alert(resultado);
        
    }
}