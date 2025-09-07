const num = document.getElementById('num');
const ver = document.getElementById('ver');
const saida = document.getElementById('saida');

ver.addEventListener ('click', () =>{
     const n = Number(num.value);
     let dia;

     switch (n){
        case 1:
            dia = "Domingo"
            break;
        case 2:
            dia = "Segunda-feira"
            break;
        case 3:
            dia = "Terça-feira"
            break;
        case 4:
            dia = "Quarta-feira"
            break;
        case 5:
            dia = "Quinta-feira"
            break;
        case 6:
            dia = "Sexta-feira"
            break;
        case 7:
            dia = "Sábado"
            break;

        default:
            dia = null;
     }

     if (dia){
        saida.textContent = `o dia selecionado é: ${dia}`;
     } else {
        saida.textContent = "o número selecionado é inválido! Digite de 1 a 7"
     }
})