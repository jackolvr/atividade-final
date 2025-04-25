// Script do formulário de login
document.getElementById('formulario-login').addEventListener('submit', function(evento) {
    evento.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const mensagemErro = document.getElementById('mensagem-erro');

    if (!usuario || !senha) {
        mensagemErro.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    mensagemErro.textContent = '';
    // Aqui você pode adicionar a lógica de autenticação real
    alert('Login realizado com sucesso!');
});

// Script do clima
window.addEventListener('DOMContentLoaded', function() {
    const statusClima = document.getElementById('status-clima');
    const cidade = document.getElementById('cidade');
    const temperatura = document.getElementById('temperatura');

    function mostrarErro() {
        statusClima.textContent = 'Não foi possível obter a temperatura.';
        cidade.textContent = '';
        temperatura.textContent = '';
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
                cidade.textContent = nomeCidade;

                // Busca a temperatura usando Open-Meteo
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                    .then(resposta => resposta.json())
                    .then(dadosClima => {
                        if (dadosClima.current_weather && dadosClima.current_weather.temperature !== undefined) {
                            temperatura.textContent = `${dadosClima.current_weather.temperature}°C`;
                            statusClima.textContent = '';
                        } else {
                            mostrarErro();
                        }
                    })
                    .catch(mostrarErro);
            })
            .catch(mostrarErro);
    }
});
