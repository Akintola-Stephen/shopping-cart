var databaseRegisteredUsers = [];
var table = $("#productsTable");
var pageload = function(){
    return {
        init: function(){
         pageload.pageEvents();
        },
        addProduct: function(event){
          event.preventDefault();
          var myobj = pageload.getDataFromFormData();
          console.log(myobj);
          databaseRegisteredUsers.push(myobj);
          
          // SignalR code that connects VB and JS code together 
          $.connection.hub.start().done(function () {
            var chat = $.connection.chatHub;
            console.log('connected !!!')
            var JSON_STRING = JSON.stringify(databaseRegisteredUsers);
            chat.server.interns_Insert(JSON_STRING, 'INSERT');         
          });
          myobj ={};
          console.log(databaseRegisteredUsers);
          pageload.clearForm(event.target);
          pageload.generateTable();
          $("#badgeValue").html(databaseRegisteredUsers.length);
        },
        checkOut: function(){
         var chat = $.connection.chatHub;
          console.warn(chat);
          // Establish a connection to database
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            var JSON_STRING = JSON.stringify(databaseRegisteredUsers);
            chat.server.interns_Insert(JSON_STRING, 'INSERT');         
          });
        },
        generateTable: function(){
            let html = "";
            for (var i= 0; i < databaseRegisteredUsers.length; i++){
              console.log(i, databaseRegisteredUsers[i])
              html += "<tr>"
              html += "<td>" + databaseRegisteredUsers[i].f_name +"<td>"
              html += "<td id='mailto'>" + databaseRegisteredUsers[i].mail +"<td>"
              html += "<td>" + databaseRegisteredUsers[i].qty +"<td>"
              html += "<td id='mobto'>" + databaseRegisteredUsers[i].mob +"<td>"
              html += "<td>" + databaseRegisteredUsers[i].tarea +"<td>"
              html += "<td><button  class='btn btn-success editBtn' style= 'background-color;green;' data-index="+i+" id='update"+i+"'>edit</button><td>"
              html += "<td'><button class='btn btn-danger deleteBtn' id='delMail' data-index="+i+">Delete</button><td>"
              html += "</tr>"
            }
            $("table tbody").html(html);
         
          pageload.pageEvents();
        },
        pageEvents: function(){
          $('#delBtn').off("click").on("click", function(event){
            event.preventDefault()
            $.connection.hub.start().done(function(){
              var chat = $.connect.chatHub;
              for (let j = 0; j < databaseRegisteredUsers.length; j++)
              {
                chat.server.interns_delete_SignalR(
                  databaseRegisteredUsers[j].mail,
                  databaseRegisteredUsers[j].mob
                )
              }
            })
          });
          
          $(".editBtn").off("click").on("click", function(event){
            event.preventDefault()
            var index = $(this).data("index");
            var currentObj = databaseRegisteredUsers[index];
            console.log(currentObj);

          });
          $(".deleteBtn").off("click").on("click", function(event){
            event.preventDefault()
            $("table tr").click(function(){
              $(this).remove();
              return false;
            })
          });
          
          $('#fetch').off("click").on("click", function(event){
            $.connection.hub.start().done(function(){
              console.log('fetch all records connection activated !')
              var chat = $.connection.chatHub;
              records = [];
              JSONSTRING = JSON.stringify(databaseRegisteredUsers)
              data = chat.server.fetchRecords(JSONSTRING, 'SELECT').then(console.log);
              console.log(data)
              // records.push(data)
              // console.log(records)
              if (records.length > 0){
                let html = "";
                for (var i= 0; i < data.length; i++){
                  //console.log(records[i])
                  html += "<tr>"
                  html += "<td>" + data[i].f_name +"<td>"
                  html += "<td id='delMail'>" + data[i].mail +"<td>"
                  html += "<td>" + data[i].qty +"<td>"
                  html += "<td>" + data[i].mob +"<td>"
                  html += "<td>" + data[i].tarea +"<td>"
                  html += "<td onclick='editForm()'><button  class='btn btn-success' data-index="+i+" id='update"+i+"'>edit</button><td>"
                  html += "<td onclick='removeRow()'><button id='delBtn' class='btn btn-danger' data-index="+i+">Delete</button><td>"
                  html += "</tr>"
                }
                $("table tbody").html(html);
              }
            })
          //  generateTable();
          });

          $("#addtoCart").off("click").on("click", function(event){
            event.preventDefault();
           pageload.addProduct(event);
          });
          $("#submit").off("click").on("click", function(event){
            event.preventDefault();
            pageload.checkOut();
           });

          $("#cty").off("click").on("click", function(event){
            var count = parseInt($("#qty").val());
            count++;
            $("#qty").val(count)
          });
        },
      
        getDataFromFormData: function() {
          var obj = {};
          $("#reg-form input, #reg-form textarea").filter(function(i,o){
              obj[$(o).attr("name")] = $(o).val();
          });
          return obj;
         // return  Array.from(data.entries()).reduce((data, entry) => { data[entry[0]] = entry[1]; return data; }, {})
        },
        clearForm: function(form) {
        $("input, textarea").val("");
        $("#qty").val(1);
      }
    }

}();

pageload.init();

