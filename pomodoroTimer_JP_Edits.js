/****************************************************************************************
 * This is the file that contains the functionality for the timer of the
        Pomodoro App.
****************************************************************************************/

//Bool functions for the start of a session
let sessionStarted = false;
let sessionEnded = true;

//Bool functions for timer funcionality
let isTimerRunning = false; //variable keeping track of if the timer is running or not

let isWorking = true;       //variable to keep track of when it is a work interval
let breakTime = false;      //variable to keep track of when it is a break interval


//Variables related to the sessions
// let pomodoroTimer = {workInterval: 0, breakInterval: 0};
// With Default times 25min and 5min:
let pomodoroTimer = {workInterval: (25*60), breakInterval: (5*60)};

let timeLeftInSession = pomodoroTimer.workInterval;

let timeSpentInSession = 0;
let totalTimeInSession = 0;



// DOM Elements:
// Timer Container:
const timerContainer = document.querySelector('#timer-container');
// Task Select:
// Task Selection Input Element:
const taskSelect = document.querySelector('#task-dropdown-select');
// Currently Selected Task:
const taskSelected = document.querySelector('option.task-dropdown-option[selected=true]')
// Timer Buttons:
const startButton = document.querySelector("#timer-start-pause");
const stopButton = document.querySelector("#timer-stop");
const skipButton = document.querySelector("#timer-skip");
const editDurationButton = document.querySelector('#edit-duration');
const setInputsContainer = document.querySelector('#set-inputs');
const setButton = document.querySelector("#timer-set");
const resetButton = document.querySelector("#timer-reset");
// Timer countdown time:
const countdownTime = document.querySelector("#countdown-time");
// Timer fill bar:
const countdownFill = document.querySelector("#countdown-fill");



//Assigns the click event listener to the buttons assigned above
startButton.addEventListener('click', function(){
    toggleTimer();
    toggleTimerVisuals();
});

stopButton.addEventListener('click', function(){
    toggleTimer(true);
    toggleTimerVisuals();
});

skipButton.addEventListener('click', function(){
    if(sessionEnded){
        console.log("session has ended");
    }
    else{
        skipSection();
    }
    toggleTimerVisuals();
});


// Edit Duration button (unhides or hides the set input fields)
editDurationButton.addEventListener('click', function(){
    if (setInputsContainer.classList.contains('hidden')) {
        setInputsContainer.classList.remove('hidden');
    } else {
        setInputsContainer.classList.add('hidden');
    }
})


// Set new duration
setButton.addEventListener('click', function(){
    // Update duration:
    updateDuration();
    // Update timeLeftInSession for correct timer session type:
    if (isWorking) {
        timeLeftInSession = pomodoroTimer.workInterval;
    } else {
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    // Hide Input fields:
    setInputsContainer.classList.add('hidden');
    // Display:
    displayTimeLeft();
    event.preventDefault();
});


resetButton.addEventListener('click', resetTimer);


/****************************************************************************************
 * Function Name: toggleTimerVisuals()
 * Description: This function checks if isTimerRunning, if timer is running, 
 * sets startButton innerText = "Pause", if timer is not running, sets 
 * startButton innerText = "Start". 
****************************************************************************************/
function toggleTimerVisuals() {
    // If timer complete:
    // (Some sort of completed visual)
    if (timeLeftInSession == 0) {
        timerContainer.classList.add('complete');
    } else {
        timerContainer.classList.remove('complete');    
    }
    // If timer is running:
    if (isTimerRunning){
        startButton.innerText = "Pause";
        timerContainer.classList.add('running');
    } 
    // If timer is not running:
    else {
        startButton.innerText = "Start";
        timerContainer.classList.remove('running');
    }
}


/****************************************************************************************
 * Function Name: resetTimer()
 * Description: Restarts the current timer from start.
****************************************************************************************/
function resetTimer() {
    // ** how to handle time spent / total time with reset? **
    // Display time spent:
    totalTimeInSession = timeSpentInSession;
    displayTotalTimeOnTask();
    // Reset time spent:
    timeSpentInSession = 0;
    // Reset time left = work or break duration:
    if (isWorking) {
        timeLeftInSession = pomodoroTimer.workInterval;
    }
    if (breakTime) {
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    // Session?
    // sessionEnded = true;
    // sessionStarted = false;

    // Display new countdown:
    toggleTimerVisuals();
    displayTimeLeft();    
}



/****************************************************************************************
 * Function Name: toggleTimer(reset)
 * Description: This function takes one boolean argument, if that argument is
        true, the toggleTimer function ends the session. Otherwise, the
        toggleTimer function will start or stop the timer. Otherwise the function
        changes the state of the timer based off of a number of factors.
****************************************************************************************/
function toggleTimer(reset){
    if(reset){
        //ends the session
        if(!sessionStarted){
            console.log("session already over");
        }
        else{
            stopClock();                            //stops the session entirely
        }
    }
    //if the stop button is not pressed
    else{
        if(!sessionStarted){            //if the session hasn't started (before a time is put in for timer)
            sessionStarted = true;      //starts the session
        }
        if(isTimerRunning){             //if the timer is running, stops the timer
            clearInterval(clockTimer);
            isTimerRunning = false;
        }
        else{                           //if user tries to toggle the timer when there is no time left in the session
            if(timeLeftInSession == 0){
                console.log("no time"); //placeholder for possible front-end alert window
            }
            else{
                sessionEnded = false;   //this line is to allow for multiple trials of testing without refreshing the browser
                isTimerRunning = true;  //sets the timer to running
                //the actual process of counting down the timer
                clockTimer = setInterval(function(){
                    timeLeftInSession--;
                    if(isWorking){
                        timeSpentInSession++;       //while the work interval timer is running, adds time spent to the session
                    }
                    if(timeLeftInSession == 0){     //when the timer reaches zero by counting down, switches intervals and continues
                        if(isWorking){
                            timeLeftInSession = pomodoroTimer.breakInterval;
                            swapSection();
                            displaySessionType();
                        }
                        else{
                            timeLeftInSession = pomodoroTimer.workInterval;
                            swapSection();
                            displaySessionType();
                        }
                    }
                    displayTimeLeft();
                }, 1000);   //set interval uses milliseconds, so this sets the interval of the timer to one second
            }
        }
    }
}


/****************************************************************************************
 * Function Name: displayTimeLeft()
 * Description: This function handles the updating of the timer. Inside of this
    function is the leadingZeros function, which adds a leading zero in front of a time
    value to maintain the time format HH:MM:SS throughout the timer. The function then
    displays the timer to a div in the HTML with the ID "pomodoro Timer".
****************************************************************************************/
function displayTimeLeft(){
    let timeRemaining = timeLeftInSession;
    let timeDisplayed = ' ';
    let seconds = timeRemaining % 60;

    let minutes = parseInt(timeRemaining / 60)  % 60;
    let hours = parseInt(timeRemaining / 3600);
    //following adds leading zeros for format: 00:00:00
    function leadingZeros(time){
        if(time < 10){
            return `0${time}`;
        }
        else{
            return time;
        }
    }
    if(hours > 0){
        timeDisplayed += `${leadingZeros(hours)}:` //adds the hours to the timer if there are any
    }
    timeDisplayed += `${leadingZeros(minutes)}:${leadingZeros(seconds)}` //adds the minutes and seconds to timer

    // Set displayed countdown time:
    countdownTime.innerText = timeDisplayed.toString();
    // Fill bar:
    displayFillBar();

}


/****************************************************************************************
 * Function Name: displayFillBar()
 * Description: This function updates the visual fill bar for the countdown.
****************************************************************************************/
function displayFillBar(){
    let fillPercent;
    // If work session:
    if (isWorking) {
        fillPercent = (pomodoroTimer.workInterval-timeLeftInSession) /pomodoroTimer.workInterval *100;
    }
    else if (breakTime) {
        fillPercent = (pomodoroTimer.breakInterval-timeLeftInSession) /pomodoroTimer.breakInterval *100;
    }
    countdownFill.style.setProperty('--countdown-fill-width', `${fillPercent}%`);
}



/****************************************************************************************
 * Function Name: stopClock()
 * Description: This function stops the clock, and sets the timer to 0, signalling the
    end of the session. The function then sets the total Time spent in the session to
    the accumulator time working and resets the boolean variables to start a fresh new
    section.
****************************************************************************************/
function stopClock(){
    clearInterval(clockTimer);
    isTimerRunning = false;
    timeLeftInSession = 0;
    totalTimeInSession = timeSpentInSession;
    displayTotalTimeOnTask();
    timeSpentInSession = 0;
    isWorking = true;
    breakTime = false;
    sessionEnded = true;
    sessionStarted = false;
    displayTimeLeft();
    displaySessionType();
}


/****************************************************************************************
 * Function Name: skipSection()
 * Description: This function switches the timer to the next section. So if the timer is
    currently on the working interval it gets switched to the break interval and vice
    versa
****************************************************************************************/
function skipSection(){
    swapSection();
    if(isWorking){
        timeLeftInSession = pomodoroTimer.workInterval;
    }
    else{
        timeLeftInSession = pomodoroTimer.breakInterval;
    }
    displayTimeLeft();
    displaySessionType();
}


/****************************************************************************************
 * Function Name: swapSection()
 * Description: This function swaps the boolean variables for is working and on break.
    This function is used throughout the file to simulate switching work/break intervals
****************************************************************************************/
function swapSection(){
    if(isWorking){
        isWorking = false;
        breakTime = true;
    }
    else{
        isWorking = true;
        breakTime = false;
    }
    // Reset fill bar: 
    displayFillBar();
}

/****************************************************************************************
 * Function Name: displaySessionType()
 * Description: This function just displays which interval the timer is running on.
    Currently holds a text placeholder but could be used to display the name of the
    task down the road.
****************************************************************************************/
function displaySessionType(){
    // Break Timer:
    if(breakTime){
        timerContainer.classList.remove('task-timer');
        timerContainer.classList.add('break-timer');
    }
    // Task Timer:
    else{
        timerContainer.classList.remove('break-timer');
        timerContainer.classList.add('task-timer'); 
    }
}


/****************************************************************************************
 * Function Name: 
 * Description:
****************************************************************************************/




/****************************************************************************************
 * Function Name: displayTotalTimeOnTask()
 * Description:
****************************************************************************************/
function displayTotalTimeOnTask(){
    var totalTime = totalTimeInSession;
    var displayTimer = document.getElementById("total task");
    var timeDisplayed = " ";
    let seconds = totalTime % 60;

    let minutes = parseInt(totalTime / 60)  % 60;
    let hours = parseInt(totalTime / 3600);
    function leadingZeros(time){
        if(time < 10){
            return `0${time}`;
        }
        else{
            return time;
        }
    }
    if(hours > 0){
        timeDisplayed += `${leadingZeros(hours)}:` //adds the hours to the timer if there are any
    }
    timeDisplayed += `${leadingZeros(minutes)}:${leadingZeros(seconds)}` //adds the minutes and seconds to timer
    displayTimer.innerText = timeDisplayed.toString();
}




/****************************************************************************************
 * Function Name: updateDuration()
 * Description: This function takes time input(s), converts to seconds, and applies
 * to workInterval or breakInterval, depending on which timer type is currently in use.
****************************************************************************************/
function updateDuration(){
    // If no session started:
    // if(!sessionStarted){

        let inputHour = parseInt(document.querySelector("#set-hour").value);
        let inputMin = parseInt(document.querySelector("#set-min").value);
        let inputSec = parseInt(document.querySelector("#set-sec").value);

        let inputHourToSec = inputHour * 60 * 60;
        let inputMinToSec = inputMin * 60;
        let totalSec = inputHourToSec + inputMinToSec + inputSec;

        // Check timer classes for task or break status:
        if (isWorking) {
            pomodoroTimer.workInterval = totalSec;
        }
        else {
            pomodoroTimer.breakInterval = totalSec;
        }
    // }
}










//to display the timer initially
displayTimeLeft();
displaySessionType();