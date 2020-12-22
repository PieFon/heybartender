console.log("Need that shot , yet?");


    // var queryURL = 
        // multiple ingrendient api query
    // "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon"
    
    var askURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon"
    
    // "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?iid=11001-Old-Fashioned";

   //first API call based on ingredient
    $.get(askURL).then(function(response){
      console.log(response);
      var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
      for (var i = 0; i < response.drinks.length; i++) {
          var drinkId = response.drinks[i].idDrink
          console.log(drinkId);
          //begin second API call for recipe
          $.get(drinkURL+drinkId).then(function(response){
              console.log(response);
          })
      }
        
   }) // End of ask API function