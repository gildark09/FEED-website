
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
