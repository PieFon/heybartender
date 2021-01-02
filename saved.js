// new js file for saved drinks page. Linked accordingly
   for (var i = 0; i < localStorage.length; i++){
     
      var  recalledDrinks = localStorage.getItem(localStorage.key(i));
      console.log(recalledDrinks);
      
      $("#saved-drinks").append(recalledDrinks);
   };
  
   $(".card-action").addClass("hide");

$("button").on("click", function(){
   $("#saved-drinks").empty();
   localStorage.clear();
})