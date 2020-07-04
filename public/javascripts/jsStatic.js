
export default function start() {
  var button = document.getElementById('addComment');
  button.addEventListener('click', addComment, true);

  console.log("about to get elements");
  var deleteButtons = Array.from(document.getElementsByClassName('deleteComment'));
  console.log(deleteButtons);
  deleteButtons.forEach(element => {
    element.addEventListener('click', deleteComment, false);
    console.log("delete added to element", element);
  });
}
$(document).ready((start()));

function deleteComment() {
  console.log(this);
  this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
  var that = this;
  var params = {
    commentName: that.previousSibling.previousSibling.previousSibling.value,
    commentContent: this.value
  }
  console.log(params);/*
  postData('http://localhost:5000/deleteComment', params)
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  })
  .catch(err => console.log('Frontend Error POST Comment', err));
*/
}

function addComment() {
  var params = {
    commentName: document.getElementById('commentName').value,
    commentContent: document.getElementById('commentInput').value
  }

  postData('http://localhost:5000/addComment', params)
    .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
    })
    .catch(err => console.log('Frontend Error POST Comment', err));
  addCommentToPage(params);
}

function addCommentToPage (params) {
  console.log("adding comment to page")
  let date = new Date();
  let name = params.commentName;
  let content = params.commentContent;
  var list = document.getElementById('commentList');

  let div = document.createElement('div');
  div.setAttribute('class', 'comment');
  let h1 = document.createElement('h1');
  h1.innerText = name;
  let h2 = document.createElement('h2');
  h2.innerText = date;
  let p = document.createElement('p');
  p.innerText = content;
  let button = document.createElement('button');
  button.setAttribute('class', 'deleteComment');
  button.innerText = 'Delete';
  button.addEventListener('click',deleteComment, true);
  div.appendChild(h1);
  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(button);
  list.lastChild.after(div);
  
}
// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}