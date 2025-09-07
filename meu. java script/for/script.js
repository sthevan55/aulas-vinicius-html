const base = document.getElementById('base');
const gerar = document.getElementById('gerar');
const tabela = document.getElementById('tabela');
const tbody = tabela.querySelector('tbody');

gerar.addEventListener('click', () => {
    const n = Number (base.value);
    if (Number.isNaN(n)) {
        alert('Digite um numero válido!!!');
        return;
    }

    tbody.innerHMTL = '';
    for (let i = 1; i <= 10; i++) {
        const tr = document.createElement('tr');
        const expr = document.createElement('td');
        const res = document.createElement('td');
        
        expr.textContent = `${n} x ${i}`;
        res.textContent = n * 1;
        tr.appendChild(expr);
        tr.appendChild(res);
        tbody.appendChild(tr);
    }
    
    tabela.hidden = false;
});