export default function start(){
    var button = document.getElementById('addComment');
    button.addEventListener('click', addComment, true);
}

function addComment() {
    var params = {
        commentName : document.getElementById('commentName').value,
        commentContent :document.getElementById('commentInput').value
    }

    postData('', params)
    .then(data => data.json())
    .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
    })
    .catch(err => console.log('Frontend Error POST Comment', err));
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log(this.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader('content_Type', 'application/json');
  xhttp.send(JSON.stringify(data));
  }
  
 