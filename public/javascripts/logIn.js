function login() {

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;
  var correctPassword = false;
  params = {
    username: username,
    password: password,
    email: email
  }
  if(params.username === '') {
    username.value = "cannot be blank";
    alert("username cannot be blank");
  }
  if (params.password === '') {

    alert("password cannot be blank");
    password.value = "cannot be blank";
  }
  else  {
    postData(window.location.origin + '/login', params, true)
    .then(function(response) { if (response.password == 'not found') {
      correctPassword = false;
      alert("incorrect credentials");
    } else {
      correctPassword = true;
    }
    if (correctPassword) {
      window.location.replace(window.location.origin + '/visitor/');
    }
  })
    .catch(err => console.log("catch", err));
  }
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
    const response = postData(window.location.origin + '/newUser', params, false);
    console.log(response);
    alert("user created");
    postData(window.location.origin + '/login', params, true)
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

//console.log(response.json());
  return response.json(); // parses JSON response into native JavaScript objects
}
function wait() {}