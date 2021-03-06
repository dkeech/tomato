var accountData

function fillAccount(user){
    let userName = document.getElementById("username");
    let userText = document.createTextNode(user.username);
    userName.appendChild(userText);

    let userEmail = document.getElementById("user_email");
    let emailText = document.createTextNode(user.email);
    userEmail.appendChild(emailText);
}
//Event listener for account data
window.addEventListener("load", function(event) {
    var req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8000/api/users/", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            accountData = JSON.parse(req.responseText);
            fillAccount(accountData);
    
        } else {
            console.log("Something is big wrong.", req.statusText)
            alert("You do not have a valid login token needed to access this page. You will be redirected to the login screen.");
            window.location.href='/';
        }});
    req.send(null)
})


// Event listener for resetting tasks and categories
document.getElementById("reset_data").addEventListener("click", function(event) {
    var req = new XMLHttpRequest()
    req.open("DELETE", "http://localhost:8000/api/users/reset", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            alert("Your account has been sucessfully reset. You will be redirected to the login page");
            window.sessionStorage.setItem('token', 0);
            window.location.href='/';
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null);
    event.preventDefault()
        
});
