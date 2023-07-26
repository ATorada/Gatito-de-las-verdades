/*~~~~~~ Variables globales ~~~~~~*/

const gatito = document.getElementById('gatito');
const corazones = document.getElementById('corazones');
const registro = document.getElementById('registro');
const musica = document.getElementById('musica');
const play = document.getElementById("play");
const volumen = document.getElementById("volumen");
const container = document.getElementsByClassName('container')[0];
const audio = document.getElementById("musica");
let timeout = null;
let cancionActual = 0;

/* Lista de canciones */
const canciones = [
    "music/ghibli_vibes.mp3",
    "music/summer_vibes.mp3",
    "music/lofi.mp3",
    "music/cafe_vibes.mp3",
];

/* Lista de cumplidos */
const cumplidos = [
    "Eres increíblemente amable.",
    "Tienes un corazón de oro.",
    "Eres inteligente y talentoso.",
    "Tu positividad es contagiosa.",
    "Gracias por ser siempre tan atento y considerado.",
    "Eres muy especial.",
    "Tus palabras siempre animan a los demás.",
    "Tu amabilidad no conoce límites.",
    "Eres increíble.",
    "Tienes un espíritu amable y generoso.",
    "Eres una persona única y especial.",
    "Gracias por ser tú mismo, porque eres maravilloso tal como eres.",
    "Tienes una forma única de hacer que todo sea más divertido.",
    "Tus acciones inspiran a los que te rodean.",
    "Siempre encuentras la manera de hacer que las cosas sean mejores.",
    "La amabilidad que demuestras es una inspiración para todos.",
    "Eres un tesoro, alguien verdaderamente especial.",
    "Tu compasión y comprensión son invaluables.",
    "Eres un sol que ilumina la vida de los demás.",
    "Tus acciones hablan más que mil palabras, y siempre son amables.",
    "Eres un ejemplo de humildad y buen corazón.",
    "Gracias por ser siempre tan auténtico y sincero.",
    "Tus palabras siempre tocan los corazones de quienes te escuchan.",
    "Eres una fuente constante de aliento y apoyo para quienes te rodean.",
    "Eres suficiente, tal como eres.",
    "Eres un ejemplo de fortaleza y perseverancia.",
];


/*~~~~~~ Apartado de audio ~~~~~~*/

/* Volumen predeterminado y máximo base*/
audio.volume = 0.1;

/* Gestor de volumen */
volumen.addEventListener("input", function () {
    musica.volume = volumen.value;
});

/* Funcionamiento del botón de play */
play.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        this.children[0].classList.remove("fa-play");
        this.children[0].classList.add("fa-pause");
    } else {
        audio.pause();
        this.children[0].classList.remove("fa-pause");
        this.children[0].classList.add("fa-play");
    }
});

/* Reproducción de la siguiente pista al acabar la actual */
musica.addEventListener("ended", function () {
    cambiarCancion("siguiente");
});

/* Empieza a reproducir la canción actual */
function reproducirCancionActual() {
    musica.src = canciones[cancionActual];
    musica.play();
}

/* Permite cambiar la canción  */
function cambiarCancion(direccion, cookie) {

    if(!cookie) {
        cancionActual = parseInt(cancionActual);
        if (direccion === "anterior") {
            cancionActual = (cancionActual - 1 + canciones.length) % canciones.length;
        } else if (direccion === "siguiente") {
            cancionActual = (cancionActual + 1) % canciones.length;
        }
    }
    document.getElementById("icono").style.opacity = 0;
    setTimeout(() => {
        if (canciones[cancionActual] === "music/ghibli_vibes.mp3") {
            document.getElementById("icono").innerHTML = "<i>Ghibli fantasy</i> ☔";
        } else if (canciones[cancionActual] === "music/summer_vibes.mp3") {
            document.getElementById("icono").innerHTML = "<i>Summer vibes</i> 🌞";
        } else if (canciones[cancionActual] === "music/lofi.mp3") {
            document.getElementById("icono").innerHTML = "<i>Chill time</i> 🎧";
        } else if (canciones[cancionActual] === "music/cafe_vibes.mp3") {
            document.getElementById("icono").innerHTML = "<i>Coffee break</i> ☕";
        }
        document.getElementById("icono").style.opacity = 1;
    }, 1000);

    if (!cookie) {
        reproducirCancionActual();
        play.children[0].classList.remove("fa-play");
        play.children[0].classList.add("fa-pause");
    } else {
        musica.src = canciones[cancionActual];
    }

    setTimeout(() => {
        document.getElementById("progreso").max = musica.duration;
        if(!cookie){
            document.getElementById("progreso").value = 0;
        } else {
            document.getElementById("progreso").value = musica.currentTime;
        }
    
        let minutos = Math.floor(musica.duration / 60);
        let segundos = Math.floor(musica.duration % 60);
        if (segundos < 10) {
            segundos = "0" + segundos;
        }
        document.getElementById("duracion").innerHTML = minutos + ":" + segundos;
    }, 200);
}

let cookieCargada = false;
window.addEventListener("load", function () {
    let minutos = Math.floor(musica.duration / 60);
    let segundos = Math.floor(musica.duration % 60);
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    document.getElementById("duracion").innerHTML = minutos + ":" + segundos;
    /* Si tiene las cookies pone la canción que tenia en ese momento */
    if (document.cookie && !cookieCargada) {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].includes("track")) {
                cancionActual = cookies[i].split("=")[1];
            } else if (cookies[i].includes("tiempo")) {
                musica.currentTime = cookies[i].split("=")[1];
            }
            cambiarCancion("siguiente", true);
        }
    }
    cookieCargada = true;
    minutos = Math.floor(musica.duration / 60);
    segundos = Math.floor(musica.duration % 60);
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    document.getElementById("duracion").innerHTML = minutos + ":" + segundos;
});


/* Se encarga de la barra de progreso */

let cambiandoDuracion = false;
musica.addEventListener("timeupdate", function () {
    if (!cambiandoDuracion) {
        const progreso = (musica.currentTime);
        document.getElementById("progreso").value = progreso;
        document.getElementById("progreso").max = musica.duration;
        let minutos = Math.floor(musica.currentTime / 60);
        let segundos = Math.floor(musica.currentTime % 60);
        if (segundos < 10) {
            segundos = "0" + segundos;
        }
        if (minutos + ":" + segundos === document.getElementById("duracion").innerHTML) {
            cambiarCancion("siguiente");
        }
        document.getElementById("tiempo").innerHTML = minutos + ":" + segundos;
    }
    document.cookie = "track=" + cancionActual + "; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
    document.cookie = "tiempo=" + musica.currentTime + "; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";

});

document.getElementById("progreso").addEventListener("change", function () {
    musica.currentTime = (this.value);
});

document.getElementById("progreso").addEventListener("input", function () {
    let minutos = Math.floor(this.value / 60);
    let segundos = Math.floor(this.value % 60);
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    document.getElementById("tiempo").innerHTML = minutos + ":" + segundos;
});


document.addEventListener("mousedown", function () {
    cambiandoDuracion = true;
});

document.addEventListener("mouseup", function () {
    cambiandoDuracion = false;
});

window.addEventListener("load", function () {
    document.getElementById("progreso").max = musica.duration;
    document.getElementById("progreso").min = 0;
});

/*~~~~~~ Apartado de cumplidos ~~~~~~*/

/* Muestra el primer cumplido */
function mostrarCumplido(event) {
    const x = event.clientX - event.target.offsetLeft;
    const y = event.clientY - event.target.offsetTop;

    /* Crea y añade el cumplido */
    const cumplido = document.createElement('span');
    cumplido.classList.add('cumplido');
    cumplido.style.left = `${x}px`;
    cumplido.style.top = `${y}px`;
    cumplido.innerHTML = cumplidos[Math.floor(Math.random() * cumplidos.length)];

    registro.appendChild(cumplido);

}

/* Agrega el siguiente cumplido */
function agregarCumplido(cumplido) {
    registro.innerHTML = '';
    const cumplidoElement = document.createElement('span');
    cumplidoElement.classList.add('cumplido');
    cumplidoElement.innerHTML = cumplido;
    registro.appendChild(cumplidoElement);
}

/* Temporiza cuando volverá de jugar el gato */
function crearTimeout() {
    /* Si ya se le está dando amor se resetea el contador para jugar */
    if (timeout) {
        clearTimeout(timeout);
    }
    /* Crea el retorno del gatito al acto de jugar */
    timeout = setTimeout(() => {
        /* Cambia el gatito */
        gatito.style.opacity = 0;
        setTimeout(() => {
            gatito.src = "img/gato_jugando.gif";
            gatito.style.opacity = 1;
            container.style.animation = "girar 5s infinite linear";
            corazones.style.opacity = 0;
        }, 1000);
        /* Oculta los corazones y los cumplidos */
        corazones.classList.add('hidden');
        registro.style.opacity = 0;
        registro.style.transition = 'opacity 1s';

        /* Crea un cumplido oculto por mi TOC a que se muevan las cosas */
        setTimeout(() => {
            registro.innerHTML = '';
            registro.style.opacity = 1;
            let span = document.createElement("span");
            span.style.opacity = 0;
            span.innerHTML = "¡Eres muy listo uwu!";
            registro.appendChild(span);
            gatito.style.marginTop = "0px";
            gatito.style.marginLeft = "0px";
        }, 1000);
    }, 5000);
}

/* Crea corazones aleatorios de diferentes formas, posiciones y efectos */
function mostrarCorazones(event) {
    const x = event.clientX - event.target.offsetLeft;
    const y = event.clientY - event.target.offsetTop;

    const corazon = document.createElement('span');
    corazon.classList.add('corazon');
    corazon.style.left = `${x}px`;
    corazon.style.top = `${y}px`;
    let listaCorazones = ["💖", "💗", "💓", "💕", "💞", "💘", "🖤", "💜"];
    corazon.innerHTML = listaCorazones[Math.floor(Math.random() * listaCorazones.length)];
    const size = Math.random() * 35 + 15;
    corazon.style.width = `${size}px`;
    corazones.appendChild(corazon);


    corazon.style.opacity = 0.7;
    corazon.style.display = "absolute";
    corazon.style.left = `${x + Math.random() * 100 - 50}px`;
    corazon.style.top = `${y + Math.random() * 100 - 50}px`;

    /* Tiempo después el corazón desaparece de manera aleatoria */
    setTimeout(() => {
        corazon.style.opacity = 0;
        setTimeout(() => {
            corazon.remove();
        }, Math.random() * 4000 + 1000);
    }, Math.random() * 4000 + 1000);

    crearTimeout();

    gatito.style.marginTop = "40px";
    gatito.style.marginLeft = "25px";

    /* Por cada corazón mostrado se actualiza el piropo */
    agregarCumplido(cumplidos[Math.floor(Math.random() * cumplidos.length)]);
}

/* Cuando le das click al gatito se empiezan a mostrar los corazones y el gatito está feliz */
gatito.addEventListener('click', () => {
    if (corazones.classList.contains('hidden')) {
        corazones.classList.remove('hidden');
        /* Cambia la imagen con un blur */
        gatito.style.opacity = 0;
        setTimeout(() => {
            gatito.src = "img/gato_feliz.gif";
            gatito.style.opacity = 1;
            corazones.style.opacity = 1;
            container.style.animation = "none";
        }, 1000);
    }

    mostrarCorazones(event);
});
