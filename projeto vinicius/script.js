const API_KEY = "b1b15e88fa797225412429c1c50c122a1"; // Sua chave real

async function buscarCidade() {
  const nomeCidade = document.getElementById("inputCidade").value.trim();
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "Carregando...";

  if (!nomeCidade) {
    resultadoDiv.innerHTML = "Digite o nome de uma cidade.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade},BR&appid=${API_KEY}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      resultadoDiv.innerHTML = "Cidade não encontrada.";
      return;
    }

    const dados = await response.json();

    // Extraindo dados relevantes
    const nome = dados.name;
    const temp = dados.main.temp.toFixed(1);
    const sensacao = dados.main.feels_like.toFixed(1);
    const umidade = dados.main.humidity;
    const vento = dados.wind.speed;
    const descricao = dados.weather[0].description;
    const clima = dados.weather[0].main;

    // Ícone ou emoji do clima
    let icone;
    switch (clima) {
      case "Clear":
        icone = "☀️ Céu limpo";
        break;
      case "Clouds":
        icone = "☁️ Nublado";
        break;
      case "Rain":
        icone = "🌧 Chuva";
        break;
      case "Thunderstorm":
        icone = "⛈ Tempestade";
        break;
      case "Snow":
        icone = "❄️ Neve";
        break;
      default:
        icone = "🌡 Clima variado";
    }

    resultadoDiv.innerHTML = `
      <div class="cidade">
        <h3>${nome}</h3>
        <p><strong>Temperatura:</strong> ${temp}°C</p>
        <p><strong>Sensação térmica:</strong> ${sensacao}°C</p>
        <p><strong>Umidade:</strong> ${umidade}%</p>
        <p><strong>Vento:</strong> ${vento} m/s</p>
        <p><strong>Condição:</strong> ${descricao} ${icone}</p>
      </div>
    `;
  } catch (error) {
    resultadoDiv.innerHTML = "Erro ao buscar dados.";
    console.error(error);
  }
}
