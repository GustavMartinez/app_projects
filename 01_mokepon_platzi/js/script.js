function iniciarJuego(){
    let botonMascotaJugador = document.getElementById('boton-mascota') // Selecciona el elemento boton-mascota
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
}


function seleccionarMascotaJugador(){

    let inputHipodoge = document.getElementById('hipodoge')
    let inputCapipepo = document.getElementById('capipepo')
    let inputRatigueya = document.getElementById('ratigueya')
    let spanMascotaJugador = document.getElementById('mascota-jugador')

    if (inputHipodoge.checked){
        //alert('Seleccionaste a Hipodoge')
        spanMascotaJugador.innerHTML = 'Hipodogue'
    }else if(inputCapipepo.checked){
        //alert('Seleccionaste a Capipepo')
        spanMascotaJugador.innerHTML = 'Capipepo'
    }else if(inputRatigueya.checked){
        //alert('Seleccionaste a Ratigueya')
        spanMascotaJugador.innerHTML = 'Ratigueya'
    }else{
        alert('Selecciona una mascota')
    }

    seleccionarMascotaEnemigo()
}

function seleccionarMascotaEnemigo(){
    
}


function aleatorio(min, max){
    return Math.floor(Math.random() * (max-min+1) + min)
}

window.addEventListener('load', iniciarJuego)