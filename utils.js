mapeador = {
    name: "nombre",
    gender: "genero",
    height: "altura"
}

module.exports.mapearPersona=(datos)=>{
    return Object.fromEntries(Object.entries(mapeador).map(([k,v])=>[v,datos[k]]));
}