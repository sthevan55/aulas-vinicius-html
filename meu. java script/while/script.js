const jogar = document.getElementById("jogar");
const statusEl = document.getElementsByClassName("status");
const lista = document.getElementById("lista");

jogar.addEventListener("click", () => {
  const segredo = Math.floor(Math.random() * 50) + 1;
  let vidas = 8;
  let acertou = false;
  let tentativas = 0;

  lista.innerHTML = "";
  statusEl.textContent = "Jogo iniciado!";

  while (vidas > 0 && !acertou) {
    const entrada = prompt(`Adivinhe (1 - 50). Vidas: ${vidas}`);
    if (entrada === null) {
      statusEl.textContent = "Jogo cancelado";
      return;
    }

    const n = Number(entrada);
    if (Number.isNaN(n) || n < 1 || n > 50) {
      alert("Digite um número válido");
      continue;
    }

    tentativas++;

    const li = document.createElement("li");
    li.textContent = `Tentativa ${tentativas}: ${n}`;
    lista.appendChild(li);

    if (n === segredo) {
      acertou = true;
      alert(`Você acertou em ${tentativas} tentativa(s)!`);
    } else {
      vidas--;
      alert(n < segredo ? "Dica: é MAIOR" : "Dica: é MENOR");
    }
  }

  if (!acertou && vidas === 0) {
    statusEl.textContent = `Fim de jogo! Suas vidas acabaram. O número era ${segredo}`;
    alert(`Fim de jogo. O número era ${segredo}.`);
  }
});