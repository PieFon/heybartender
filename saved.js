
// new js file for saved drinks page. Linked accordingly
// $("#saved-drinks").html(localStorage.getItem(drinkKey));

 for (var i = 0; i < localStorage.length; i++){
     
    var  recalledDrinks = localStorage.getItem(localStorage.key(i));
    console.log(recalledDrinks);
    
    $("#saved-drinks").append(recalledDrinks);
 };

 $("button").addClass("hide");