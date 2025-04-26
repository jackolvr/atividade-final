// Script do formulário de login
const formLogin = document.getElementById('formulario-login');
if (formLogin) {
  formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const mensagemErro = document.getElementById('mensagem-erro');

    if (!usuario || !senha) {
      if (mensagemErro) mensagemErro.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    if (mensagemErro) mensagemErro.textContent = '';
    // Aqui você pode adicionar a lógica de autenticação real
    // alert('Login realizado com sucesso!');
    window.location.href = './home.html';
  });
}

// Script do clima
window.addEventListener('DOMContentLoaded', function() {
  const statusClima = document.getElementById('status-clima');
  const cidade = document.getElementById('cidade');
  const temperatura = document.getElementById('temperatura');

  function mostrarErro() {
    if (statusClima) statusClima.textContent = 'Não foi possível obter a temperatura.';
    if (cidade) cidade.textContent = '';
    if (temperatura) temperatura.textContent = '';
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sucesso, mostrarErro);
  } else {
    mostrarErro();
  }

  function sucesso(posicao) {
    const lat = posicao.coords.latitude;
    const lon = posicao.coords.longitude;

    // Busca o nome da cidade usando Nominatim (OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      .then(resposta => resposta.json())
      .then(dadosLocalizacao => {
        let nomeCidade = '';
        if (dadosLocalizacao.address) {
          nomeCidade = dadosLocalizacao.address.city ||
            dadosLocalizacao.address.town ||
            dadosLocalizacao.address.village ||
            dadosLocalizacao.address.hamlet ||
            dadosLocalizacao.address.municipality ||
            dadosLocalizacao.address.county ||
            'Localidade desconhecida';
        } else {
          nomeCidade = 'Localidade desconhecida';
        }
        if (cidade) cidade.textContent = nomeCidade;

        // Busca a temperatura usando Open-Meteo
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
          .then(resposta => resposta.json())
          .then(dadosClima => {
            if (dadosClima.current_weather && dadosClima.current_weather.temperature !== undefined) {
              if (temperatura) temperatura.textContent = `${dadosClima.current_weather.temperature}°C`;
              if (statusClima) statusClima.textContent = '';
            } else {
              mostrarErro();
            }
          })
          .catch(mostrarErro);
      })
      .catch(mostrarErro);
  }
});

// Mock de dados para simulação
function obterDadosMock(par, estrategia, valor) {
  const base = par.length + estrategia.length;
  const preco = (0.7 + (base % 10) * 0.01).toFixed(4);
  const media_movel = (0.6 + (base % 5) * 0.01).toFixed(2);
  const ifr = (50 + (base % 20)).toFixed(2);
  const variacao = ((-2 + (base % 4) * 0.5)).toFixed(2);
  const take = (parseFloat(preco) + 0.00434).toFixed(5);
  const stop = (parseFloat(preco) - 0.010849).toFixed(6);
  const lucro = (0.05).toFixed(2);
  const perda = (0.15).toFixed(2);

  return {
    par,
    preco,
    estrategia,
    media_movel,
    ifr,
    variacao,
    valor,
    take,
    stop,
    lucro,
    perda
  };
}

const formOrdem = document.getElementById('formularioOrdem');
if (formOrdem) {
  formOrdem.addEventListener('submit', function(e) {
    e.preventDefault();

    let moeda = document.getElementById('moeda').value.trim();
    let valor = document.getElementById('valor').value.trim();
    let estrategiaInput = document.querySelector('input[name="estrategia"]:checked');
    if (!estrategiaInput) return;
    let estrategia = estrategiaInput.value;

    moeda = moeda.toUpperCase();
    let par = moeda.endsWith('USDT') ? moeda : moeda + 'USDT';

    const dados = obterDadosMock(par, estrategia, valor);

    document.getElementById('par').textContent = dados.par;
    document.getElementById('preco').textContent = dados.preco;
    document.getElementById('estrategia').textContent = dados.estrategia;
    document.getElementById('media_movel').textContent = dados.media_movel;
    document.getElementById('ifr').textContent = dados.ifr;
    document.getElementById('variacao').textContent = dados.variacao + '%';

    document.getElementById('resumo-operacao').textContent = `COMPRA (LONG) de ${dados.par} com 10x de alavancagem`;
    document.getElementById('resumo-valor').textContent = dados.valor;
    document.getElementById('resumo-preco').textContent = dados.preco;
    document.getElementById('resumo-take').textContent = `${dados.take}`;
    document.getElementById('resumo-stop').textContent = `${dados.stop}`;

    const resultados = document.getElementById('resultados');
    if (resultados) {
      resultados.style.display = 'block';
      resultados.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

const btnConfirmar = document.getElementById('btnConfirmar');
if (btnConfirmar) {
  btnConfirmar.addEventListener('click', function() {
    alert('Operação confirmada e executada! (Simulação)');
  });
}

const btnSair = document.getElementById('btnSair');
if (btnSair) {
  btnSair.addEventListener('click', function() {
    window.location.href = './index.html';
  });
}