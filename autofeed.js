
setInterval(() => {
    let schedule = JSON.parse(localStorage.getItem("feedSchedule")) || [];
    if (schedule.length === 0) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const dayName = now.toLocaleDateString("en-US", { weekday: "short" });

    schedule.forEach(entry => {

       
        if (entry.time === currentTime && entry.days.includes(dayName)) {

           
            if (entry.lastFed === currentTime) return;

          
            saveHistory("Scheduled");

           
            entry.lastFed = currentTime;

            console.log("Fed at", currentTime, "on", dayName);
        }
    });

   
    localStorage.setItem("feedSchedule", JSON.stringify(schedule));

}, 1000);



function saveHistory(type) {
    const now = new Date();
    const entry = {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        type: type
    };

    let history = JSON.parse(localStorage.getItem("feedHistory")) || [];
    history.unshift(entry);
    localStorage.setItem("feedHistory", JSON.stringify(history));
}

const ESP_IP = "http://192.168.1.33"; // change to ESP8266 IP

function feedPet() {
  fetch(`${ESP_IP}/feed`)
    .then(res => res.text())
    .then(t => console.log("ESP:", t))
    .then(data => alert("Feeding successful"))
    .catch(err => alert("ESP8266 not reachable"));
}



function updateFoodLevel() {
    fetch(`${ESP_IP}/level`)
        .then(res => res.json())
        .then(data => {
            const level = data.level;

            // update %
            document.getElementById("foodLevelText").innerText = level + "%";

            // update bar fill
            document.getElementById("healthFill").style.width = level + "%";

            // change bar color depending on level
            const bar = document.getElementById("healthFill");

            if (level > 60) bar.style.background = "linear-gradient(90deg, #44ff44, #00cc00)";
            else if (level > 30) bar.style.background = "linear-gradient(90deg, #ffcc44, #ff8800)";
            else bar.style.background = "linear-gradient(90deg, #ff4444, #ff0000)";
        })
        .catch(err => {
            document.getElementById("foodLevelText").innerText = "Error";
            document.getElementById("healthFill").style.width = "0%";
        });
}

// update food level every second
setInterval(updateFoodLevel, 1000);