async function getStation(city){
    const result = await fetch(`https://apiprevmet3.inmet.gov.br/estacao/proxima/${city}`)
    const data = await result.json()
    return data.estacao.CODIGO  
}

async function sendDate() {

    const datainit = document.getElementById("datainit")
    const datafinal = document.getElementById("datafinal")
    const city = document.getElementById("city").value
    const id = await getStation(city)

    const data = {
        id,
        data_init: (new Date(datainit.value)).toISOString().split("T")[0],
        data_final: (new Date(datafinal.value)).toISOString().split("T")[0]
    }  

    const result = await fetch("https://smart-green-api.herokuapp.com/stations/station_data/station_data/", {
        method:"POST",
        mode:"cors",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(data)
    })

    const table = await result.json()
    const dataResult = document.getElementById("result")
    dataResult.innerHTML = JSON.stringify(table, null, 2)
}

async function getStates() {
    const select=document.getElementById("state")

    const result = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    const reader = await result.json()
    alphabeticOrder(reader,"nome")
    for (const state of reader) {
        const option = document.createElement("option")
        option.setAttribute("value", state.sigla)
        option.innerHTML = state.nome
        select.appendChild(option)
    }

}

function alphabeticOrder(array, prop){

    return array.sort((a,b)=>{
        const nameA = a[prop].toUpperCase()
        const nameB = b[prop].toUpperCase()
        if (nameA < nameB){

            return -1
        }
        if (nameA > nameB){

            return 1
        }
        return 0 
    })

}

async function getCities(state) {
    const select=document.getElementById("city")
    

    const result = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/distritos`)
    const reader = await result.json()
    alphabeticOrder(reader,"nome")
    for (const city of reader) {
        const option = document.createElement("option")
        option.setAttribute("value", city.municipio.id)
        option.innerHTML = city.nome
        select.appendChild(option)
    }
}

getStates()

const stateOptions = document.getElementById("state")
stateOptions.addEventListener("change",(e)=>{
    getCities(e.target.value)

})