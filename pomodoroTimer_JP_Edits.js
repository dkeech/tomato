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
let pomodoroTimer = {workInterval: 0, breakInterval: 0};

let timeLeftInSession = pomodoroTimer.workInterval;

let timeSpentInSession = 0;
let totalTimeInSession = 0;

//functions for the HTML buttons (HTML buttons should be set to these ID's)
let startButton = document.getElementById("timer-start-pause");
let stopButton = document.getElementById("timer-stop");
let skipButton = document.getElementById("timer-skip");

let setTimer = document.getElementById("timer-set");

let resetTimer = document.getElementById("task-reset");


//assigning HTML divs to manipulate through DOM
// Timer element container:
var timer = document.getElementById("timer-container");

// Timer countdown time:
var countdownTime = document.getElementById("countdown-time");

// Timer fill bar:
var countdownFill = document.getElementById("countdown-fill");


//Assigns the click event listener to the buttons assigned above
startButton.addEventListener('click', function(){
    toggleTimer();
    // Set Start Button inner text:
    if(isTimerRunning){
        startButton.innerText = "Pause";
    } else {
        startButton.innerText = "Start";
    }
});

stopButton.addEventListener('click', function(){
    toggleTimer(true);
});


skipButton.addEventListener('click', function(){
    if(sessionEnded){
        console.log("session has ended");
    }
    else{
        skipSection();
    }
});

//on the click event, updates the intervals with the information from the form
//displays the new timer
setTimer.addEventListener('click', function(event){
    console.log("SET clicked");
    updateWorkDuration(pomodoroTimer);
    timeLeftInSession = pomodoroTimer.workInterval;
    displayTimeLeft();
    event.preventDefault();
});




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
    // Set fill bar width:
    let fillPercent = ((pomodoroTimer.workInterval-timeLeftInSession) /pomodoroTimer.workInterval)*100;
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
}
/****************************************************************************************
 * Function Name: displaySessionType()
 * Description: This function just displays which interval the timer is running on.
    Currently holds a text placeholder but could be used to display the name of the
    task down the road.
****************************************************************************************/
function displaySessionType(){
    // var currentTask = document.getElementById("task section");
    let timerHeader = document.querySelector('#timer-header');
    let taskTitle = document.querySelector('#task-timer-name');
    let taskCategory = document.querySelector('#task-timer-category');

    if(breakTime){
        timerHeader.classList.remove('task-header');
        timerHeader.classList.add('break-header');
    }
    else{
        taskTitle.innerText = "[Task Name]";
        taskCategory.innerText = "[Category]";
        timerHeader.classList.remove('break-header');
        timerHeader.classList.add('task-header');
    }
}

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
 * Function Name: updateWorkDuration(pTimer)
 * Description: This function takes an object, in this case the pomodoro timer object,
    and sets the two timer intervals to inputs from the user at the HTML ID's listed
    in the function.
****************************************************************************************/
function updateWorkDuration(pTimer){
    if(!sessionStarted){
        // let hoursToWork = parseInt(document.getElementById("set_hours").value);
        // let minutesToWork = parseInt(document.getElementById("set_min").value);
        // let hoursToSeconds = hoursToWork * 3600;
        // let minutesToSeconds = minutesToWork * 60;
        // let newWorkDuration = hoursToSeconds + minutesToSeconds;

        // let minutesToBreak = document.getElementById("set_break_min").value;
        // let newBreakDuration = (minutesToBreak * 60);

        // Input:
        let setInputMin = document.querySelector(`#timer-set-input`).value;
        let setInputSec = setInputMin * 60;
        // Check timer classes for task or break status:
        let timerContainer = document.querySelector(`#timer-container`);
        if (timerContainer.classList.contains('task-timer')) {
            pTimer.workInterval = setInputSec;
        } else {
            pTimer.breakInterval = setInputSec;
        }

        // pTimer.workInterval = newWorkDuration;
        // pTimer.breakInterval = newBreakDuration;
    
    }
}



//to display the timer initially
displayTimeLeft();
displaySessionType();