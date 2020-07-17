function login() {

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;

  params = {
    username: username,
    password: password,
    email: email
  }
  postData(window.location.origin + '/login', params, true)
}

function newUser() {

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;

  params = {
    username: username,
    password: password,
    email: email
  }
  console.log(params);
  if(params.username === '') {
    username.value = "cannot be blank";
    alert("username cannot be blank");
  }
  if (params.password === '') {

    alert("password cannot be blank");
    password.value = "cannot be blank";
  }
  else  {
    postData(window.location.origin + '/newUser', params, false)
  }
  
}
async function postData(url = '', data = {}, login) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  if (login) {
    window.location.replace(window.location.origin + '/visitor/');
  }

  return response.json(); // parses JSON response into native JavaScript objects
}
function wait() {}