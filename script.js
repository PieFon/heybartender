
$(document).ready(function(){

console.log("Need that shot , yet?");

var ingredientEl = $("#search-input")
console.log(ingredientEl);


    // var queryURL = 
        // multiple ingrendient api query
    // "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon"
        // cocktail ID search to get recipe information
    //"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
    
    function findDrinks(ingredient) {
    var askURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+ingredient
    
    $.get(askURL).then(function(response){
      console.log(response);
      var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
      for (var i = 0; i < response.drinks.length; i++) {
          var drinkId = response.drinks[i].idDrink
          console.log(drinkId);
          //begin second API call for recipe
          $.get(drinkURL+drinkId).then(function(drinkResponse){
              console.log(drinkResponse);
              
        for(var i = 1; i < 16; i++){
            if(drinkResponse.drinks[0]["strMeasure"+i]){
                console.log(drinkResponse.drinks[0]["strMeasure"+i]);
            }
            if (drinkResponse.drinks[0]["strIngredient"+i]){
                console.log(drinkResponse.drinks[0]["strIngredient"+i]);
            }
        }
        //  for (var i=0; i < response.drinks[0].length; i++){
        //     console.log("here's what we got:" + response.drinks[0][i]);
        //     if (response.drinks[0][i].indexOf("strIngredient") !== -1) {
        //         console.log("did this work?")
        //         console.log("ingredients: " + response.drinks[0][i].strIngredient);
        //     }
        //   }

            })
        
      }
        
   }) // End of ask API function

} //end of findDrinks function

  
  $("#search-button").on("click", function(event){
      event.preventDefault();
        var ingredient = $("#search-input").val();
        console.log(ingredient);
      $("#search-input").val("");
      findDrinks(ingredient);
  })
  
}) // end of the document ready 