// Auto feed loop (runs every second on ALL pages)
setInterval(() => {
    let schedule = JSON.parse(localStorage.getItem("feedSchedule")) || [];
    if (schedule.length === 0) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const dayName = now.toLocaleDateString("en-US", { weekday: "short" });

    schedule.forEach(entry => {

        // Does scheduled time match?
        if (entry.time === currentTime && entry.days.includes(dayName)) {

            // Prevent multiple feeds in the same minute
            if (entry.lastFed === currentTime) return;

            // Save feed event
            saveHistory("Scheduled");

            // Remember last fed time   
            entry.lastFed = currentTime;

            console.log("Fed at", currentTime, "on", dayName);
        }
    });

    // Save updated schedule back to storage
    localStorage.setItem("feedSchedule", JSON.stringify(schedule));

}, 1000);


// Universal save history function so ALL pages can use it
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
