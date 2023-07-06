// Timer variables
let hours = 0;
let minutes = 0;
let seconds = 0;
let timerInterval;

// Buttons
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const endSessionButton = document.getElementById("endSessionButton");

// Timer display
const timerDisplay = document.getElementById("timer");

// Session table
const sessionTableBody = document.getElementById("sessionTableBody");

// Summary row
const avgIntensityCell = document.getElementById("avgIntensityCell");
const avgElapsedTimeCell = document.getElementById("avgElapsedTimeCell");
const totalActualTimeCell = document.getElementById("totalActualTimeCell");

// Load previous session data from localStorage
let previousSessions = JSON.parse(localStorage.getItem("studySessions")) || [];

// Display previous session data in the table
previousSessions.forEach(session => {
  createTableRow(session);
});

// Calculate and display summary
calculateSummary();

// Event listeners for buttons
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
endSessionButton.addEventListener("click", endSession);

function startTimer() {
  timerInterval = setInterval(incrementTimer, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
  endSessionButton.disabled = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  startButton.disabled = false;
  stopButton.disabled = true;
  endSessionButton.disabled = false;
}

function incrementTimer() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(value) {
  return value.toString().padStart(2, "0");
}

function endSession() {
  const now = new Date();
  const dateTime = now.toLocaleString();
  const activity = prompt("What did you do?:");
  const intensity = parseFloat(prompt("How focused were you on a scale of 0~100%:"));

  const elapsedTime = hours * 3600 + minutes * 60 + seconds;
  const actualTime = elapsedTime * (intensity / 100);

  const session = {
    date: formatDate(now),
    startTime: formatTime(now),
    endTime: formatTime(new Date()),
    activity: activity,
    intensity: intensity,
    duration: formatTime(elapsedTime),
    total: formatTime(actualTime)
  };

  createTableRow(session);
  previousSessions.push(session);

  // Save sessions to localStorage
  localStorage.setItem("studySessions", JSON.stringify(previousSessions));

  // Calculate and display summary
  calculateSummary();

  // Reset timer and buttons
  resetTimer();
}

function createTableRow(session) {
  const newRow = document.createElement("tr");

  // Date column
  const dateCell = document.createElement("td");
  dateCell.textContent = session.date;
  newRow.appendChild(dateCell);

  // Activity column
  const activityCell = document.createElement("td");
  activityCell.textContent = session.activity;
  newRow.appendChild(activityCell);

  // Intensity column
  const intensityCell = document.createElement("td");
  intensityCell.textContent = session.intensity;
  newRow.appendChild(intensityCell);

  // Duration column
  const durationCell = document.createElement("td");
  durationCell.textContent = session.duration;
  newRow.appendChild(durationCell);

  // Total column
  const totalCell = document.createElement("td");
  totalCell.textContent = session.total;
  newRow.appendChild(totalCell);

  // Modify/Delete button column
  const modifyDeleteButtonCell = document.createElement("td");
  const modifyButton = document.createElement("button");
  modifyButton.textContent = "Modify";
  modifyButton.classList.add("modify-button");
  modifyButton.addEventListener("click", function () {
    modifySession(newRow, session);
  });
  modifyDeleteButtonCell.appendChild(modifyButton);
  newRow.appendChild(modifyDeleteButtonCell);

  sessionTableBody.appendChild(newRow);
}

function modifySession(row, session) {
  const activity = prompt("Modify the activity:", session.activity);
  const intensity = parseFloat(prompt("Modify the intensity percentage (0-100):", session.intensity));

  if (activity !== null && intensity !== null) {
    session.activity = activity;
    session.intensity = intensity;

    const elapsedTime = hours * 3600 + minutes * 60 + seconds;
    const actualTime = elapsedTime * (intensity / 100);

    session.duration = formatTime(elapsedTime);
    session.total = formatTime(actualTime);

    row.cells[1].textContent = activity;
    row.cells[2].textContent = intensity;
    row.cells[3].textContent = session.duration;
    row.cells[4].textContent = session.total;

    // Save updated sessions to localStorage
    localStorage.setItem("studySessions", JSON.stringify(previousSessions));

    // Calculate and display summary
    calculateSummary();
  }
}

function createDeleteButton(row, session) {
  const deleteButtonCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    deleteSession(row, session);
  });
  deleteButtonCell.appendChild(deleteButton);
  row.appendChild(deleteButtonCell);
}

function deleteSession(row, session) {
  // Remove the row from the table
  sessionTableBody.removeChild(row);

  // Remove the session from the previousSessions array
  const sessionIndex = previousSessions.indexOf(session);
  if (sessionIndex > -1) {
    previousSessions.splice(sessionIndex, 1);
  }

  // Save updated sessions to localStorage
  localStorage.setItem("studySessions", JSON.stringify(previousSessions));

  // Calculate and display summary
  calculateSummary();
}

function createTableRow(session) {
  const newRow = document.createElement("tr");

  // Date column
  const dateCell = document.createElement("td");
  dateCell.textContent = session.date;
  newRow.appendChild(dateCell);

  // Activity column
  const activityCell = document.createElement("td");
  activityCell.textContent = session.activity;
  newRow.appendChild(activityCell);

  // Intensity column
  const intensityCell = document.createElement("td");
  intensityCell.textContent = session.intensity;
  newRow.appendChild(intensityCell);

  // Duration column
  const durationCell = document.createElement("td");
  durationCell.textContent = session.duration;
  newRow.appendChild(durationCell);

  // Total column
  const totalCell = document.createElement("td");
  totalCell.textContent = session.total;
  newRow.appendChild(totalCell);

  // Modify button column
  const modifyButtonCell = document.createElement("td");
  const modifyButton = document.createElement("button");
  modifyButton.textContent = "Modify";
  modifyButton.classList.add("modify-button");
  modifyButton.addEventListener("click", function () {
    modifySession(newRow, session);
  });
  modifyButtonCell.appendChild(modifyButton);
  newRow.appendChild(modifyButtonCell);

  // Delete button column
  createDeleteButton(newRow, session);

  sessionTableBody.appendChild(newRow);
}

function calculateSummary() {
  const rowCount = sessionTableBody.rows.length;
  let totalIntensity = 0;
  let totalElapsedTime = 0;
  let totalActualTime = 0;

  for (let i = 0; i < rowCount; i++) {
    const row = sessionTableBody.rows[i];
    const intensityValue = parseFloat(row.cells[2].textContent);
    const elapsedTimeValue = timeToSeconds(row.cells[3].textContent);
    const actualTimeValue = timeToSeconds(row.cells[4].textContent);

    totalIntensity += intensityValue;
    totalElapsedTime += elapsedTimeValue;
    totalActualTime += actualTimeValue;
  }

  const avgIntensity = rowCount > 0 ? totalIntensity / rowCount : 0;
  const avgElapsedTime = formatTime(totalElapsedTime);
  const totalActualTimeFormatted = formatTime(totalActualTime);

  avgIntensityCell.textContent = `${Math.round(avgIntensity)}%`;
  avgElapsedTimeCell.textContent = avgElapsedTime;
  totalActualTimeCell.textContent = totalActualTimeFormatted;
}

function resetTimer() {
  hours = 0;
  minutes = 0;
  seconds = 0;
  timerDisplay.textContent = "00:00:00";
  startButton.disabled = false;
  stopButton.disabled = true;
  endSessionButton.disabled = true;
}

function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatTime(date) {
  const options = { hour: "numeric", minute: "numeric", hour12: false };
  return date.toLocaleString("en-US", options);
}

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const formattedHours = pad(hours);
  const formattedMinutes = pad(minutes);
  const formattedSeconds = pad(seconds);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function timeToSeconds(time) {
  const timeParts = time.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2]);

  return hours * 3600 + minutes * 60 + seconds;
}
