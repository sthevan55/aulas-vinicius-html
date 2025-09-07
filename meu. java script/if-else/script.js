const idade = document.getElementById('idade');
const btn = document.getElementById('verificar');
const saida = document.getElementById('saida');

btn.addEventListener('click', () =>{
    const valor = Number(idade.value);
    if (Number.isNaN(valor) || valor <=0) {
        saida.textContent.Cntent = 'digite uma idade válida';
        saida.className = 'erro';
        return;
    }
    if (valor >= 16 ){
        saida.textContent = 'Acesso Liberado';
        saida.className = 'ok';
    } else {
        saida.textContent = 'Acesso Negado (menor de 16 anos)';
        saida.className = 'erro';
    }
});
