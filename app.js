const URLBASE = "http://localhost:3000";

fetch()
  .then(data => data.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))

/** FILES UPLOAD */

function element(el) {
    return document.getElementById(el);
}

function upload() {
    var file = element("file").files[0];
    var formdata = new FormData();
    formdata.append("file", file);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "http://localhost:3000/upload"); 
    ajax.send(formdata);
}

function progressHandler(event) {
    element("loadedtotal").innerHTML = "Cargado " + event.loaded + " bytes de " + event.total;
    var percent = (event.loaded / event.total) * 100;
    element("progressBar").value = Math.round(percent);
    element("status").innerHTML = Math.round(percent) + "% subiendo... por favor espere";
    if(percent == 100){
        getFiles();
    }
}

function completeHandler(event) {
    element("status").innerHTML = event.target.responseText;
    element("progressBar").value = 0;
}

function errorHandler(event) {
    element("status").innerHTML = "Subida fallida";
}

function abortHandler(event) {
    element("status").innerHTML = "Subida cancelada";
}


/**  FILES LIST */

const filesList = document.querySelector('#files_list');

window.addEventListener('DOMContentLoaded', () => {
    getFiles();
})

const getFiles = () => {
    fetch(URLBASE+'/files')
    .then(data => data.json())
    .then(response => {
        let files = response.files;
        renderFiles(files);
    })
}


const deleteFile = (fileName) => {
    console.log(fileName)
    fetch(URLBASE+'/files/'+fileName)
    .then(data => data.json())
    .then(response => {
        console.log(response);
        getFiles();
    })
}

const renderFiles = (files) => {
    let filesHTML = '';
    files.forEach(file => {
        filesHTML += `
        <div class="file">
            <img src="${URLBASE}/${file}" width="300" />
            <div>
                <span>Name: ${file} </span>
                <button type="button" onclick="deleteFile('${file}')">Eliminar</button>
            </div>
        </div>`
    });
    filesList.innerHTML = filesHTML;
}