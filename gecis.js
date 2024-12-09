const API_URL = "https://jm1r5hvs-8000.euw.devtunnels.ms/api/"
const wrapperEl = document.getElementById("wrapper")

let playerStatus = null

function newGame(){
    localStorage.removeItem("player_id")
    location.reload()
}

function wrapperBuilder(){
    wrapperEl.innerHTML = ""

    let title = document.createElement("h1")
    title.innerText = playerStatus.current_location.name

    let description = document.createElement("p")
    description.innerText = playerStatus.current_location.description

    
    wrapperEl.appendChild(title)
    wrapperEl.appendChild(description)

    if (playerStatus.current_location.image != null){
        let img = document.createElement("img")
        img.src = (API_URL + playerStatus.current_location.image).replace("api//","/")
        wrapperEl.appendChild(img)
    }

    let btn_holder = document.createElement("div")
    playerStatus.current_location.choices.forEach(choice => {
        let btn = document.createElement("button")
        btn.innerText = choice.text
    
        btn_holder.appendChild(btn)

        btn.addEventListener("click", ()=> {
            choose(choice.id)
        })
    });
    btn_holder.classList.add("fasz")
    wrapperEl.appendChild(btn_holder)

    if (playerStatus.current_location.choices.length == 0){
        let delbtn = document.createElement("button")
        delbtn.innerText = "Új játék"
        delbtn.addEventListener("click", newGame)
        btn_holder.appendChild(delbtn)
        btn_holder.classList.add("fasz")
        wrapperEl.appendChild(btn_holder)
    }
}

function choose(choiceId){
    fetch(API_URL + "choose/",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },

        body: JSON.stringify({
            player_id: playerStatus.player_id,
            choice_id: choiceId
        })
    })
    .then(res => res.json())
    .then(newStatus =>{
        playerStatus = newStatus
        wrapperBuilder()
    })
}

function startGame(){
    if(playerStatus === null){
        if(localStorage.getItem("player_id") == null){
            fetch(API_URL + "start/")
            .then(res => res.json())
            .then(currentplayerStatus => {
                console.log(currentplayerStatus)
                playerStatus = currentplayerStatus
                localStorage.setItem("player_id", playerStatus.player_id)
                wrapperBuilder()
            })
        }
        else{
            fetch(API_URL + "state/" + localStorage.getItem("player_id"))
            .then(res => res.json())
            .then(currentplayerStatus => {
                console.log(currentplayerStatus)
                playerStatus = currentplayerStatus
                wrapperBuilder()
            })
        }
    }
}

startGame()