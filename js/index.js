
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
          console.warn(chat);

          // SignalR code that allows communication between VB and JS code together 
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            var myobj = pageload.getDataFromFormData();
            console.log(myobj);
            databaseRegisteredUsers.push(myobj);
            
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
        compileAndInertHtml: function(template, data, outputelement) {
          const templateStr = document.getElementById(template).innerHTML
          const compilled = Handlebars.compile(templateStr)(data)
          document.getElementById(outputelement).innerHTML = compilled
        },
        generateTable: function(myDataa){
          pageload.compileAndInertHtml('table', {products:myDataa}, 'product-area');
          pageload.pageEvents();
        },

        validate: function(){
          if( $('#PRODUCT_NAME').val() == "" ) {
            alert( "Please provide product name!" );
            document.myForm.Name.focus() ;
            return false;
          }
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
          pageload.validate();
          return obj;
         // return  Array.from(data.entries()).reduce((data, entry) => { data[entry[0]] = entry[1]; return data; }, {})
        },

        fetchData: function(){
          $.connection.hub.start().done(function () {
            console.log('connected !!!')
            chat.server.interns_Insert("", 'SELECT');         
          });
        },
        clearForm: function(form) {
        $("input, textarea").val("");
        $("#qty").val(1);
      }
    }

}();


pageload.init();

