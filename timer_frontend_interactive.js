function addChangeTaskEvent() {
    let changeTaskButton = document.querySelector('#change-task-button');
    changeTaskButton.addEventListener('click', function(){
        let taskDropdown = document.querySelector('#change-task-dropdown-menu');
        if (taskDropdown.classList.contains('hidden')) {
            taskDropdown.classList.remove('hidden');
        } else {
            taskDropdown.classList.add('hidden');
        }
    });
}

addChangeTaskEvent();


function addSetButtonEvent() {
    let setButton = document.querySelector('#task-set');
    setButton.addEventListener('click', function() {
        let setInput = document.querySelector('#task-set-input');
        if (setInput.classList.contains('hidden')) {
            setInput.classList.remove('hidden');
        } else {
            setInput.classList.add('hidden');
        }
    })
}

// addSetButtonEvent();