
$(document).ready(function () {
    $(document).ready(function(){
        $('select').formSelect();
      });
    // console.log("Need that shot , yet?");

    // var ingredientEl = $("#search-input")
    // console.log(ingredientEl);


    // var queryURL = 
    // multiple ingrendient api query
    // "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon"
    // cocktail ID search to get recipe information
    //"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="

    function findDrinks(ingredient) {
        var askURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient

        $.get(askURL).then(function (response) {
            // console.log(response);
            var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
            for (var i = 0; i < response.drinks.length; i++) {
                var drinkId = response.drinks[i].idDrink
                // console.log(drinkId);
                //begin second API call for recipe
                $.get(drinkURL + drinkId).then(function (drinkResponse) {
                    // using class names from Materialize, I dynamically created cards with content to print different pieces from our response.
                    // We'll create them & append them in the order we want them to appear on the screen.
                    // Here we start by building the html div elements for the card (that will hold all info) & card content (that will hold additional html elements like span & p-tags).
                    var card = $("<div>").addClass("card");
                    var cardContent = $("<div>").addClass("card-content");
                    // Now we'll create an html span, add a class and text directly from our API call.
                    var span = $("<span>").addClass("title").text(drinkResponse.drinks[0].strDrink);
                    // Creating html img with src from response
                    var img = $("<img>").attr("src", drinkResponse.drinks[0].strDrinkThumb);
                    img.addClass("responsive-image circle");
                    // Next we'll append the span with the drink name & thumbnail img to the card content.
                    cardContent.append(span, img);

                    // Using a for loop, we'll cycle over information that needs more than 1 line extracted from the response: ingredients & measurements, and set a conditional to only capture info if it exists.
                    for (var i = 1; i <= 15; i++) {
                        if (drinkResponse.drinks[0]["strMeasure" + i]) {
                            // Now we'll create a p-tag with text from our for loop response that targets measurements.
                            var pTag = $("<p>").text(drinkResponse.drinks[0]["strMeasure" +i]);
                        }
                        if (drinkResponse.drinks[0]["strIngredient" + i]) {
                            // Now we'll create a variable to capture text from our for loop that targets ingredients (empty string applied to create space when appended).
                            var cardIng = ("" + drinkResponse.drinks[0]["strIngredient" + i]);
                            // Now we'll append the ingredients to the same p-tag with the measurements so they line up together (hopefully!).
                            pTag.append(cardIng);
                            // Now we'll append the p-tag with both measurements & ingredients to the card content.
                            cardContent.append(pTag);
                        }

                    } //End of for loop for measurements/ingredients

                    // Finally, we want to follow a similar process for our type of glass and instructions. Because only one value exists for each of these in our response, we don't need to use the for loop. Executing here b/c page is read top-bottom and want this text to appear on the card we're creating last.

                    // create a variable to make a p-tag and add text from response about glass type.
                    var glass = $("<p>").text("Glass: " + (drinkResponse.drinks[0].strGlass))
                    // Same process for instructions ------- using seperate p-tags to make styling easier later-on: right now all elements are stacking TODO: will change in final stages to wrap/float.
                    var instructions = $("<p>").text("Instructions: " + (drinkResponse.drinks[0].strInstructions));
                    // Now we'll append the glass and instructions p-tags to card content.
                    cardContent.append(glass, instructions);
                    // Once we have all of our card content created, we'll append this to the card.
                    card.append(cardContent);
                    // Finally, we'll append the entire card to our div with the id of recipe-display.
                    $("#recipe-display").append(card);

                }) //End of function for drinkResponse

            } //End of for loop for main API call

        }) // End of ask API function
        
    } //end of findDrinks function


    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var ingredient = $("#alcohol-input").val();
        // console.log(ingredient);
        $("#alcohol-input").val("");
        findDrinks(ingredient);
    })
    

}) // end of the document ready 