document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarTel(e);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarConfirmarCon(e, 6, 20);
    }
    document.getElementById("txtEmail").onkeyup = e => {
        revisaremail(e);
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        if (this.op == 'Eliminar') {
            this.op = '';
            location.reload();
            return;
        }
        e.target.form.classList.remove("validado");
        //Iterar todos los controles del form
        //debugger;
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
        //console.log(controles);
    });
    let op = '';
    let correo = '';
    document.getElementById("btnAceptar").addEventListener("click", e => {
        //document.getElementById("msgDuplicado").classList.remove("show");
        if (this.op == 'Eliminar') {
            this.op = '';
            let usuarios = JSON.parse(localStorage.getItem('usuarios'));
            let index = usuarios.findIndex(element => element.correo === this.correo);
            if (index !== -1) {
                usuarios.splice(index, 1);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                cargarTabla();
            }
            return;
        }
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        txtNombre.setCustomValidity("");
        txtContrasenia.setCustomValidity("");
        txtContrasenia2.setCustomValidity("");
        txtEmail.setCustomValidity("");
        txtTel.setCustomValidity("");
        txtContrasenia.removeAttribute("required", "required");
        txtContrasenia2.removeAttribute("required", "required");
        if (this.op == 'Restablecer') {
            txtNombre.removeAttribute("required", "required");
            txtEmail.removeAttribute("required", "required");
            txtTel.removeAttribute("required", "required");
        } else {
            txtNombre.setAttribute("required", "required");
            txtEmail.setAttribute("required", "required");
            if (txtNombre.value.trim().length < 2 ||
                txtNombre.value.trim().length > 60) {
                txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
            }
        }

        if (!this.op == 'Editar') {
            if (!txtContrasenia.hasAttribute("required")) {
                // Si no está presente, agrega el atributo required
                txtContrasenia.setAttribute("required", "required");
            }
            if (!txtContrasenia2.hasAttribute("required")) {
                // Si no está presente, agrega el atributo required
                txtContrasenia2.setAttribute("required", "required");
            }
            if (txtContrasenia.value.trim().length < 6 ||
                txtContrasenia.value.trim().length > 20) {
                txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 2 y 60 caracteres)");
            }
            if (txtContrasenia2.value.trim().length < 6 ||
                txtContrasenia2.value.trim().length > 20) {
                txtContrasenia2.setCustomValidity("Confirma la contraseña");
            }

            if (txtContrasenia.value.trim() === txtContrasenia2.value.trim()) {
                txtContrasenia2.setCustomValidity("Contraseñas distintas");
            }
        }
        var telx = /^[0-9]{10}$/;
        if (!telx.test(txtTel.value.trim()) &&txtTel.value.trim().length > 0) {
            txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
        }
        if (this.op != 'Restablecer') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(txtEmail.value)) {
                txtEmail.setCustomValidity("El correo no cumple con la estructura correcta");
            }
        }
        if (e.target.form.checkValidity()) {
            if (this.op == 'Restablecer') {
                this.op = '';
                let usuarios = JSON.parse(localStorage.getItem('usuarios'));
                let index = usuarios.findIndex(element => element.correo === this.correo);
                if (index !== -1) {
                    usuarios[index].password = txtContrasenia.value;
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                }
                return;
            }

            //Crear el objeto usuario y guardarlo en el storage
            let correo = document.getElementById("txtCorreoOriginal").value.trim();
            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: txtEmail.value.trim(),
                contrasenia: txtContrasenia.value.trim(),
                telefono: txtTelefono.value.trim()
            };
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            if (document.querySelector("#mdlRegistro .modal-title").innerText == 'Agregar') {
                let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                if (usuarioEncontrado) {

                    let alerta = document.createElement('div');
                    alerta.innerHTML = 'Este correo ya se encuentra registrado, favor de usar otro <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                    alerta.className = "alert alert-warning alert-dismissible fade show";

                    e.target.parentElement.insertBefore(alerta, e.target);
                    //e.target.parentElement.innerHTML=alerta+e.target.parentElement.innerHTML;
                    //debugger;
                    //document.getElementById("msgDuplicado").classList.add("show");
                    setTimeout(() => {
                        //Destruir la alerta
                        alerta.remove();
                    }, 3000);

                    e.preventDefault();
                    return;
                }
                usuarios.push(usuario);
            } else { 
                if (usuario.correo != correo) {
                    let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                    if (usuarioEncontrado) {
                        let alerta = document.createElement('div');
                        alerta.innerHTML = 'Este correo ya se encuentra registrado, favor de usar otro <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                        alerta.className = "alert alert-warning alert-dismissible fade show";

                        e.target.parentElement.insertBefore(alerta, e.target);

                        setTimeout(() => {
                            alerta.remove();
                        }, 3000);

                        e.preventDefault();
                        return;
                    }
                } else {
                    this.op = '';
                    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
                    let index = usuarios.findIndex(element => element.correo === correo);
                    if (index !== -1) {
                        usuarios[index].nombre = txtNombre.value;
                        usuarios[index].correo = correo;
                        usuarios[index].telefono = txtTel.value;
                        localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    }
                    return;
                }
            }
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            /*const mdlRegistro = bootstrap.Modal.getInstance('#mdlRegistro');
            mdlRegistro.hide();*/
        } else {
            e.preventDefault();
        }
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("divEliminar").style.display = "none";
        document.getElementById("modalid").style.display = "block";
        document.getElementById("btnLimpiar").textContent = "Limpiar";
        document.getElementById("divPassword").style.display = "block";
        document.getElementById("divTel").style.display = "block";
        document.getElementById("divNombre").style.display = "block";
        document.getElementById("divEmail").style.display = "block";
        document.getElementById("divConfirmarPassword").style.display = "block";
        document.getElementById("btnLimpiar").click();
        let operacion = e.relatedTarget.innerText;
        this.op = operacion;
        e.target.querySelector(".modal-title").innerText = operacion;

        //Identificar si vamos editar para cargar los datos
        if (operacion == 'Editar') {
            let correoo = e.relatedTarget.value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios'));
            let usuario = usuarios.find((element => element.correo == correoo));
            document.getElementById("txtNombre").value = usuario.nombre;
            document.getElementById("txtEmail").value = usuario.correo;
            document.getElementById("txtCorreoOriginal").value = usuario.correo;
            document.getElementById("txtTelefono").value = usuario.telefono;
            document.getElementById("divPassword").style.display = "none";
            document.getElementById("divConfirmarPassword").style.display = "none";
        } else if (operacion == 'Eliminar') {
            let correoo = e.relatedTarget.value;
            this.correo = correoo;
            document.getElementById("frmRegistro").style.display = "none";
            document.getElementById("btnLimpiar").style.display = "none";
            document.getElementById("divEliminar").style.display = "block";
            document.getElementById("divEliminar").textContent = "Estas apunto de eliminar a " + correoo + "¿Deseas continuar?";
            
            return;
        } else if (operacion == 'Restablecer') {
            let correoo = e.relatedTarget.value;
            this.correo = correoo;
             document.getElementById("divNombre").style.display = "none";
             document.getElementById("divEmail").style.display = "none";
             document.getElementById("divTel").style.display = "none";
            return;
        }
        document.getElementById("txtNombre").focus();

    })
});

function revisarControl(e, min, max) {
    txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min ||
        txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }

    /*console.log(txt.value);
    console.log(txt.validity);*/
}

function revisarTel(e) {
    txtTel = document.getElementById("txtTelefono");
    txtTel.classList.remove("valido");
    txtTel.classList.remove("novalido");
    var telx = /^[0-9]{10}$/;
    if (!telx.test(txtTel.value.trim()) &&txtTel.value.trim().length > 0) {
        txtTel.setCustomValidity("Campo no válido");
        txtTel.classList.add("novalido");    
    }else{
        txtTel.classList.add("valido");
    }
}

function revisarConfirmarCon(e, min, max) {
    let txtContrasenia = document.getElementById("txtPassword");
    txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min ||
        txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        if (txtContrasenia.value == txt.value) {
            txt.classList.add("valido");
        } else {
            txt.setCustomValidity("Campo no válido");
            txt.classList.add("novalido");
        }
    }
}

function revisaremail(e) {
    let txtEmail = document.getElementById("txtEmail");
    txtEmail.setCustomValidity("");
    txtEmail.classList.remove("valido");
    txtEmail.classList.remove("novalido");
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(txtEmail.value)) {
        txtEmail.setCustomValidity("Campo no válido");
        txtEmail.classList.add("novalido");
    } else {
        txtEmail.classList.add("valido");
    }
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    for (var i = 0; i < usuarios.length; i++) {
        usuario = usuarios[i];
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.innerText = usuario.nombre;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" id="btnEditar" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="' + usuario.correo + '" onclick="editar(' + i + ')">Editar</button>';
        celda.style.width = "1%";
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" id="btnEliminar" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="' + usuario.correo + '" onclick="Eliminar(' + i + ')">Eliminar</button>';
        celda.style.width = "1%";
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" id="btnRestablecer" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="' + usuario.correo + '">Restablecer</button>';
        celda.style.width = "1%";
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }

}

function editar(correo) {

}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel@gmail.com',
                password: '123456',
                telefono: ''
            },
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena@gmail.com',
                password: '567890',
                telefono: '4454577468'
            }
        ];

        //let usuarios=[];
        usuarios.push(
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel1@gmail.com',
                password: '123456',
                telefono: ''
            });
        usuarios.push(
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena1@gmail.com',
                password: '567890',
                telefono: '4454577468'
            });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

    }
}
