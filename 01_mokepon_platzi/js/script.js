function iniciarJuego(){
    let botonMascotaJugador = document.getElementById('boton-mascota') // Selecciona el elemento boton-mascota
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
}


function seleccionarMascotaJugador(){

    let inputHipodoge = document.getElementById('hipodoge')
    let inputCapipepo = document.getElementById('capipepo')
    let inputRatigueya = document.getElementById('retigueya')
    //let spanMascotaJugador = document.getElementById('mascota-jugador')

    if (inputHipodoge.checked){
        alert('Seleccionaste a Hipodoge')
        //spanMascotaJugador.innerHTML = 'Hipodogue'
    }else if(inputCapipepo.checked){
        alert('Seleccionaste a Capipepo')
    }else if(inputRatigueya.checked){
        alert('Seleccionaste a Ratigueya')
    }else{
        alert('Selecciona una mascota')
    }
}


window.addEventListener('load', iniciarJuego)