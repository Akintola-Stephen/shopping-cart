var databaseRegisteredUsers = [];

function clearForm(form) {
    Array.from(form.querySelectorAll('input')).forEach(input => input.value = "");
    Array.from(form.querySelectorAll('textarea')).forEach(textarea => textarea.value = "");
}

function getDataFromFormData(data) {
  return  Array.from(data.entries()).reduce((data, entry) => { data[entry[0]] = entry[1]; return data; }, {})
}


function Submit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    databaseRegisteredUsers.push(getDataFromFormData(data));
    var chat = $.connection.chatHub;
    console.warn(chat);
    // Establish a connection to database
    $.connection.hub.start().done(function () {
      console.log('connected !!!')
        for (let i = 0; i < databaseRegisteredUsers.length; i++){
          chat.server.interns_Insert(
          databaseRegisteredUsers[i].f_name, databaseRegisteredUsers[i].mail,
          databaseRegisteredUsers[i].qty, databaseRegisteredUsers[i].mob,
          databaseRegisteredUsers[i].tarea
            );
        }
});


   // if (Object.keys(registeredUsers[0].length === 0);
    console.log(databaseRegisteredUsers);
    clearForm(event.target);
    generateTable(table,[databaseRegisteredUsers[databaseRegisteredUsers.length - 1]]);
}


const form = document.querySelector('#reg-form');
form.addEventListener("submit", Submit);

  $("#del").click(
      // Establish a connection to database
      $.connection.hub.start().done(function () {
        console.log('connected !!!')
          for (let i = 0; i < databaseRegisteredUsers.length; i++){
            chat.server.interns_delete_SignalR(
            document.getElementById('delMail').innerHTML,
            document.getElementById('delMob').innerHTML
            );
          }
        })
  );


// Button that populates input button value
var count = 0;
var btn = document.getElementById("cty");
var display = document.getElementById("qty");

btn.onclick = function () {
    count++;
    display.value = count;
}



databaseRegisteredUsers.length;
var badgeBtn = document.getElementById("submit");
var badgeDisplay = document.getElementById("badgeValue");

badgeBtn.onclick = function () {
    badgeDisplay.innerHTML = (databaseRegisteredUsers.length) + 1;
}


function generateTable(table, data) {
      if (databaseRegisteredUsers.length > 0){
        let html = "";
        for (var i= 0; i < databaseRegisteredUsers.length; i++){
          console.log(i, databaseRegisteredUsers[i])
          html += "<tr>"
          html += "<td>" + databaseRegisteredUsers[i].f_name +"<td>"
          html += "<td id='delMail'>" + databaseRegisteredUsers[i].mail +"<td>"
          html += "<td>" + databaseRegisteredUsers[i].qty +"<td>"
          html += "<td>" + databaseRegisteredUsers[i].mob +"<td>"
          html += "<td>" + databaseRegisteredUsers[i].tarea +"<td>"
          html += "<td onclick='editForm()'><button  class='btn btn-success' data-index="+i+" id='update"+i+"'>edit</button><td>"
          html += "<td onclick='removeRow()'><button class='btn btn-danger' data-index="+i+">Delete</button><td>"
          html += "</tr>"
        }
        $("table tbody").html(html);
      }
    }

function removeRow(){
  $("table tr").click(function(){
    $(this).remove();
    return false;
  })
}


$('#fetch').click(function () {
  $.connection.hub.start().done(function(){
    console.log('fetch all records connection activated !')
    var chat = $.connection.chatHub;
    records = [];
    data = chat.server.fetchRecords().then(console.log);
    console.log(data)
    // records.push(data)
    // console.log(records)
    if (records.length > 0){
      let html = "";
      for (var i= 0; i < records.length; i++){
        //console.log(records[i])
        html += "<tr>"
        html += "<td>" + records[i].f_name +"<td>"
        html += "<td id='delMail'>" + records[i].mail +"<td>"
        html += "<td>" + records[i].qty +"<td>"
        html += "<td>" + records[i].mob +"<td>"
        html += "<td>" + records[i].tarea +"<td>"
        html += "<td onclick='editForm()'><button  class='btn btn-success' data-index="+i+" id='update"+i+"'>edit</button><td>"
        html += "<td onclick='removeRow()'><button class='btn btn-danger' data-index="+i+">Delete</button><td>"
        html += "</tr>"
      }
      $("table tbody").html(html);
    }
  })
  generateTable(table,[records[records.length - 1]]);
})



let table = document.querySelector("table");
generateTable(table, databaseRegisteredUsers);

