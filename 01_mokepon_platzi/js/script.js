function iniciarJuego(){
    let botonMascotaJugador = document.getElementById('boton-mascota') // Selecciona el elemento boton-mascota
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
}


function seleccionarMascotaJugador(){

    let inputHipodoge = document.getElementById('hipodoge')
    let inputCapipepo = document.getElementById('capipepo')
    let inputRatigueya = document.getElementById('retigueya')

    if (inputHipodoge.cheked){
        alert('Seleccionaste a Hipodoge')
    }else if(inputCapipepo.cheked){
        alert('Seleccionaste a Capipepo')
    }else if(inputRatigueya.cheked){
        alert('Seleccionaste a Ratigueya')
    }else{
        alert('Selecciona una mascota')
    }
}


window.addEventListener('load', iniciarJuego)