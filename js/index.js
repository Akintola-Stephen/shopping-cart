var databaseRegisteredUsers = [];
var table = $("#productsTable");
var chat = $.connection.chatHub;

chat.client.broadcastrecords = function(data){
  var dData = JSON.parse(data)
  if (dData.ACTION_TYPE == 'SELECT'){
      pageload.generateTable(dData.RESULT);
  }
  else if (dData.ACTION_TYPE == 'INSERT' || dData.ACTION_TYPE == 'DELETE'){
    pageload.fetchData();
  }
 
}
var pageload = function(){
    return {
        init: function(){
         pageload.pageEvents();
         pageload.fetchData();
        },

        addProduct: function(event){
          event.preventDefault();
          
          // SignalR code that allows communication between VB and JS code together 
        
          console.warn(chat);

          // Establish a connection to database
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            var myobj = pageload.getDataFromFormData();
            console.log(myobj);
            databaseRegisteredUsers.push(myobj);

             //  pageload.generateTable();
          
            var JSON_STRING = JSON.stringify(databaseRegisteredUsers);
            chat.server.interns_Insert(JSON_STRING, 'INSERT')
            .done(function(data){
              console.log(data);
            });   
         

            console.log(databaseRegisteredUsers);
            pageload.clearForm(event.target);
         
            $("#badgeValue").html(databaseRegisteredUsers.length);      
          });
        },
      

        checkOut: function(){
         var chat = $.connection.chatHub;
          console.warn(chat);
          // Establish a connection to database
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            var myobj = pageload.getDataFromFormData();
            console.log(myobj);
            databaseRegisteredUsers.push(myobj);
            var JSON_STRING = JSON.stringify(databaseRegisteredUsers);
            chat.server.interns_Insert(JSON_STRING, 'INSERT');
           
          });
        },
        fetchData: function(){
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            chat.server.interns_Insert("", 'SELECT');         
          });
        },
        generateTable: function(myDataa){
            let html = "";
            for (var i= 0; i < myDataa.length; i++){
              html += "<tr>"
              html += "<td>" + myDataa[i].PRODUCT_NAME +"<td>"
              html += "<td id='mailto'>" + myDataa[i].USER_MAIL +"<td>"
              html += "<td>" + myDataa[i].PRODUCT_QUANTITY +"<td>"
              html += "<td id='mobto'>" + myDataa[i].MOBILE_NUMBER +"<td>"
              html += "<td>" + myDataa[i].PRODUCT_MSG +"<td>"
              html += "<td'><button class='btn btn-danger deleteBtn' id='delMail' data-index="+i+" data-id="+ myDataa[i].PRODUCT_ID +">Delete</button><td>"
              html += "</tr>"
            }
            $("table tbody").html(html);
         
          pageload.pageEvents();
        },

        pageEvents: function(){
        
          
         
          $(".deleteBtn").off("click").on("click", function(event){
            event.preventDefault()
            var product_id = $(this).data("id");
            $.connection.hub.start().done(function () {
              console.log('connected !!!')
              var myobj = [{PRODUCT_ID :product_id }]
              var JSON_STRING = JSON.stringify(myobj);
              chat.server.interns_Insert(JSON_STRING, 'DELETE');
             
            });
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

