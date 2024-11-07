document.getElementsByClassName('enviar').addEventListener('click', () => {

    const nombre = document.getElementById('nombre').value
    const email = document.getElementById('email').value
    const contraseña = document.getElementById('contraseña').value

    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Contraseña:', contraseña);
    
    // alert("¡Botón presionado!");
    
});