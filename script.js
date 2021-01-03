
$(document).ready(function () {
    // jquery for materialize
    // function for drop downs 
    $('select').formSelect();
    // function for navbar collapse on mobile
    $('.sidenav').sidenav();
    // date picker
    $('.datepicker').datepicker({
        yearRange: 100,
        maxDate: new Date()
    });
    

    var drinkKey = 0 //this will be incremented on to provide new keys for each saved drink
    //So this next four lines work with the local storage of the incremented drink key -- when someone leaves the page and comes back their key value will be saved.
    var updatedKey = localStorage.getItem("newKey");
    if (updatedKey) {
        drinkKey = updatedKey;
    }
    //checking localStorage to grab the user's name (if any provided).
    var returnUser = localStorage.getItem("nameValue");
    if (returnUser) {
        $("#name-input").val(returnUser);
    }
    
    //grabing the color used in the previous search
    var savedColor = localStorage.getItem("colorValue");
    if(savedColor) {
        $("#color-input").val(savedColor);
    }
    //Birthday localStorage not functioning properly...yet.
    //grabbing the birthday used in the previous search
    // var savedDay = localStorage.getItem("birthValue");
    // if (savedDay) {
    //     $("#birth-input").val(savedDay);
    // }

    function findDrinks(ingredient) {

        var askURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient

        $.get(askURL).then(function (response) {
            // console.log(response);
            //This clears out the previous search results
            $("#recipe-display").empty()
            // jquery for Materialize
            $(document).ready(function () {
                $('.collapsible').collapsible();
            });

            var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
            // header for search results
            var searchHeader = $("<h1>").text("Your drink matches:")
            var card = $("<ul>").addClass("collapsible");
            card.attr("id", "main-list");




            for (var i = 0; i < response.drinks.length; i++) {
                var drinkId = response.drinks[i].idDrink
                // console.log(drinkId);

                //begin second API call for recipe
                $.get(drinkURL + drinkId).then(function (drinkResponse) {
                    // using class names from Materialize, I dynamically created cards with content to print different pieces from our response.
                    // We'll create them & append them in the order we want them to appear on the screen.
                    // Here we start by building the html elements for the card (that will hold all info) & card content (that will hold additional html elements like span & p-tags).
                    var cardContent = $("<li>").addClass("card-content");
                    cardContent.attr("id", "recipe-content");
                    var collapseHead = $("<div>").addClass("collapsible-header");
                    // collapseHead.addClass("center-align");
                    // Now we'll create an html span, add a class and text directly from our API call.
                    var span = $("<span>").addClass("card-title").text(drinkResponse.drinks[0].strDrink);
                    // Creating html img with src from response
                    var img = $("<img>").attr("src", drinkResponse.drinks[0].strDrinkThumb);
                    img.addClass("responsive-image circle");
                    // Next we'll append the span with the drink name & thumbnail img to the card content.
                    var spanComp = $("<div>").addClass("span-comp");
                    spanComp.append(span);
                    collapseHead.append(img, spanComp);
                    cardContent.append(collapseHead);

                    var collapseBody = $("<div>").addClass("collapsible-body");
                    var recipeContent = $("<div>");
                    recipeContent.addClass("left-align");
                    // Using a for loop, we'll cycle over information that needs more than 1 line extracted from the response: ingredients & measurements, and set a conditional to only capture info if it exists.
                    for (var i = 1; i <= 15; i++) {
                        if (drinkResponse.drinks[0]["strMeasure" + i]) {
                            // Now we'll create a p-tag with text from our for loop response that targets measurements.
                            var pTag = $("<p>").text(drinkResponse.drinks[0]["strMeasure" + i]);
                        }
                        if (drinkResponse.drinks[0]["strIngredient" + i]) {
                            // Now we'll create a variable to capture text from our for loop that targets ingredients (empty string applied to create space when appended).
                            var cardIng = ("" + drinkResponse.drinks[0]["strIngredient" + i]);
                            // Now we'll append the ingredients to the same p-tag with the measurements so they line up together (hopefully!).
                            pTag.append(cardIng);
                            // Now we'll append the p-tag with both measurements & ingredients to the card content.
                            recipeContent.append(pTag);
                        }

                    } //End of for loop for measurements/ingredients

                    // Finally, we want to follow a similar process for our type of glass and instructions. Because only one value exists for each of these in our response, we don't need to use the for loop. Executing here b/c page is read top-bottom and want this text to appear on the card we're creating last.

                    // create a variable to make a p-tag and add text from response about glass type.
                    var glass = $("<p>").text("Glass: " + (drinkResponse.drinks[0].strGlass))
                    // Same process for instructions ------- using seperate p-tags to make styling easier later-on: right now all elements are stacking TODO: will change in final stages to wrap/float.
                    var instructions = $("<p>").text("Instructions: " + (drinkResponse.drinks[0].strInstructions));
                    // Now we'll append the glass and instructions p-tags to card content.
                    recipeContent.append(glass, instructions);

                    //Here is the start of the match-making API taken from https://rapidapi.com/ajith/api/love-calculator/endpoints
                    //This is in a format I'm unfamiliar with, but it works!
                    var userName = $("#name-input").val();
                    var secondName = (drinkResponse.drinks[0].strDrink)

                    //saving user name into local storage.
                    localStorage.setItem("nameValue", userName);

                    //The is the API call.
                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://love-calculator.p.rapidapi.com/getPercentage?fname=" + userName + "&sname=" + secondName,
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-key": "19df3380dfmsh99f4e329e5f0d08p18e0b9jsn20005bc6de7b",
                            "x-rapidapi-host": "love-calculator.p.rapidapi.com"
                        }
                    };

                    var cardAction = $("<div>").addClass("card-action");
                    cardAction.addClass("center-align");

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        //this variable collects and holds the compatability rating from the API call.
                        compatability = parseInt(response.percentage);
                        //a variable that will be used to print the score to the user.
                        userCompatability = "Compatibility: " + compatability + "%";


                        //these are the variables for the comments based on compatability rating
                        var responseOne = "NOOOOOO! Definitely not this one!";
                        var responseTwo = "Beer goggle necessary to enjoy this drink. Think again.";
                        var responseThree = "C'mon! Don't settle for this! There's a better choice.";
                        var responseFour = "Only one way to know for sure.";
                        var responseFive = "Any drink you can walk away from, am I right?";
                        var responseSix = "You've had worse ideas.";
                        var responseSeven = "Almost tastes right, together";
                        var responseEight = "A good standard you can start tabs with.";
                        var responseNine = "Worth a second round.";
                        var responseTen = "Don't mean to get 'spirit'ual, but this is a perfect match.";

                        if (compatability > 0 && compatability < 10) {
                            console.log(responseOne)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseOne);
                            cardAction.append(responseOne);
                        }
                        if (compatability > 9 && compatability < 20) {
                            console.log(responseTwo)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseTwo);
                            cardAction.append(responseTwo);
                        }
                        if (compatability > 19 && compatability < 30) {
                            console.log(responseThree)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseThree);
                            cardAction.append(responseThree);
                        }
                        if (compatability > 29 && compatability < 40) {
                            console.log(responseFour)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseFour);
                            cardAction.append(responseFour);
                        }
                        if (compatability > 39 && compatability < 50) {
                            console.log(responseFive)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseFive);
                            cardAction.append(responseFive);
                        }
                        if (compatability > 49 && compatability < 60) {
                            console.log(responseSix)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseSix);
                            cardAction.append(responseSix);
                        }
                        if (compatability > 59 && compatability < 70) {
                            console.log(responseSeven)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseSeven);
                            cardAction.append(responseSeven);
                        }
                        if (compatability > 69 && compatability < 80) {
                            console.log(responseEight)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseEight);
                            cardAction.append(responseEight);
                        }
                        if (compatability > 79 && compatability < 90) {
                            console.log(responseNine)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseNine);
                            cardAction.append(responseNine);
                        }
                        if (compatability > 89 && compatability < 100) {
                            console.log(responseTen)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseTen);
                            cardAction.append(responseTen);
                        }
                    }); //End of the match-making API call.

                    var saveBtn = $("<button>").attr("id", "save-button");
                    saveBtn.addClass("savebtn");
                    saveBtn.addClass("waves-effect waves-light orange darken-4 btn-flat");
                    saveBtn.text("Save Drink");
                    // adding delete button to card with class of hide. Will add line in saved js to show on saved recipes page.
                    // var removeBtn = $("<button>").attr("id", "remove-button");
                    // removeBtn.addClass("waves-effect waves-light orange darken-4 btn-flat hide");
                    // removeBtn.text("Delete Recipe");
                    cardAction.append(saveBtn);
                    recipeContent.append(cardAction);
                    collapseBody.append(recipeContent);
                    cardContent.append(collapseBody);
                    card.append(cardContent);

                    // Using the "active" class to call on the specific li we want to save.
                    $(saveBtn).on("click", function () {
                        var saveClick = $("li.active").html();
                        localStorage.setItem(drinkKey, saveClick);
                        //everytime the user saves a drink the value of drinkKey increments, creating a new key and a new save slot. and preventing the override.
                        drinkKey++
                        //we save the drinkKey value in storage also. When the user comes back to the page they will also upload the most recent key.
                        localStorage.setItem("newKey", drinkKey);
                    })

                }) //End of function for drinkResponse

            } //End of for loop for main API call

            $("#recipe-display").prepend(searchHeader, card);

        }) // End of ask API function

    } //end of findDrinks function
    // $("#recipe-display").val("");



    //click event that will start the api call for cocktail recipes based on ingredient choice
    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var ingredient = $("#alcohol-input").val();
        console.log(ingredient);
        var favoriteColor = $("#color-input").val();
        localStorage.setItem("colorValue", favoriteColor);
       //not getting the birthday to save properly.
        // var birthDay = $("#birth-input");
        // JSON.stringify(localStorage.setItem("birthValue", birthDay))
        
        findDrinks(ingredient);
    }) //end of cocktail ingredient recipe "click event" search


    //button-click event to start the non-alcoholic drink search
    $("#alocholic-button").on("click", function (event) {
        event.preventDefault();
        console.log("button-button");
        var favoriteColor = $("#color-input").val();
            localStorage.setItem("colorValue", favoriteColor);
        nonAlch();

    })
    
    //click event for a random drink recipe
    $("#random-button").on("click", function (event) {
        event.preventDefault();
        var favoriteColor = $("#color-input").val();
        localStorage.setItem("colorValue", favoriteColor);
        whateverWorks();
    }) //end of the random drink "click event"

    //The function that will look for a random drink & append a card to the page for the user.
    function whateverWorks() {
        //This clears out the previous search results
        $("#recipe-display").empty()
        // jquery for Materialize
        $(document).ready(function () {
            $('.collapsible').collapsible();
        });

        var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        var randomHeader = $("<h1>").text("Have you tried this before?")
        var card = $("<ul>").addClass("collapsible");
        card.attr("id", "main-list");

        //random-drink api call: https://www.thecocktaildb.com/api/json/v1/1/random.php


        //begin random API call for recipe
        $.get(randomURL).then(function (randomDrink) {
            // using class names from Materialize, I dynamically created cards with content to print different pieces from our response.
            // We'll create them & append them in the order we want them to appear on the screen.
            // Here we start by building the html elements for the card (that will hold all info) & card content (that will hold additional html elements like span & p-tags).
            var cardContent = $("<li>").addClass("card-content");
            cardContent.attr("id", "recipe-content");
            var collapseHead = $("<div>").addClass("collapsible-header");
            // collapseHead.addClass("center-align");
            // Now we'll create an html span, add a class and text directly from our API call.
            var span = $("<span>").addClass("card-title").text(randomDrink.drinks[0].strDrink);
            // Creating html img with src from response
            var img = $("<img>").attr("src", randomDrink.drinks[0].strDrinkThumb);
            img.addClass("responsive-image circle");
            // Next we'll append the span with the drink name & thumbnail img to the card content.
            var spanComp = $("<div>").addClass("span-comp");
            spanComp.append(span);
            collapseHead.append(img, spanComp);
            cardContent.append(collapseHead);

            var collapseBody = $("<div>").addClass("collapsible-body");
            var recipeContent = $("<div>");
            recipeContent.addClass("left-align");
            // Using a for loop, we'll cycle over information that needs more than 1 line extracted from the response: ingredients & measurements, and set a conditional to only capture info if it exists.
            for (var i = 1; i <= 15; i++) {

                if (randomDrink.drinks[0]["strMeasure" + i]) {

                    // Now we'll create a p-tag with text from our for loop response that targets measurements.
                    var pTag = $("<p>").text(randomDrink.drinks[0]["strMeasure" + i]);
                }
                if (randomDrink.drinks[0]["strIngredient" + i]) {
                    // Now we'll create a variable to capture text from our for loop that targets ingredients (empty string applied to create space when appended).
                    var cardIng = ("" + randomDrink.drinks[0]["strIngredient" + i]);
                    // Now we'll append the ingredients to the same p-tag with the measurements so they line up together (hopefully!).
                    pTag.append(cardIng);
                    // Now we'll append the p-tag with both measurements & ingredients to the card content.
                    recipeContent.append(pTag);
                }

            } //End of for loop for measurements/ingredients

            // Finally, we want to follow a similar process for our type of glass and instructions. Because only one value exists for each of these in our response, we don't need to use the for loop. Executing here b/c page is read top-bottom and want this text to appear on the card we're creating last.

            // create a variable to make a p-tag and add text from response about glass type.
            var glass = $("<p>").text("Glass: " + (randomDrink.drinks[0].strGlass))
            // Same process for instructions ------- using seperate p-tags to make styling easier later-on: right now all elements are stacking TODO: will change in final stages to wrap/float.
            var instructions = $("<p>").text("Instructions: " + (randomDrink.drinks[0].strInstructions));
            // Now we'll append the glass and instructions p-tags to card content.
            recipeContent.append(glass, instructions);

            //Here is the start of the match-making API taken from https://rapidapi.com/ajith/api/love-calculator/endpoints
            //This is in a format I'm unfamiliar with, but it works!
            var userName = $("#name-input").val();
            var secondName = (randomDrink.drinks[0].strDrink)

            //saving user name into local storage.
            localStorage.setItem("nameValue", userName);

            const settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://love-calculator.p.rapidapi.com/getPercentage?fname=" + userName + "&sname=" + secondName,
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "19df3380dfmsh99f4e329e5f0d08p18e0b9jsn20005bc6de7b",
                    "x-rapidapi-host": "love-calculator.p.rapidapi.com"
                }
            };

            var cardAction = $("<div>").addClass("card-action");
            cardAction.addClass("center-align");

            $.ajax(settings).done(function (response) {

                //this variable collects and holds the compatability rating from the API call.
                compatability = parseInt(response.percentage);
                //a variable that will be used to print the score to the user.
                userCompatability = "Compatibility: " + compatability + "%";


                //these are the variables for the comments based on compatability rating
                var responseOne = "NOOOOOO! Definitely not this one!";
                var responseTwo = "Beer goggle necessary to enjoy this drink. Think again.";
                var responseThree = "C'mon! Don't settle for this! There's a better choice.";
                var responseFour = "Only one wat to know for sure.";
                var responseFive = "Any drink you can walk away from, am I right?";
                var responseSix = "You've had worse ideas.";
                var responseSeven = "Almost tastes right, together";
                var responseEight = "A good standard you can start tabs with.";
                var responseNine = "Worth a second round.";
                var responseTen = "Don't mean to get 'spirit'ual, but this is a perfect match.";
                

                if (compatability > 0 && compatability < 10) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseOne);
                    cardAction.append(responseOne);
                }
                if (compatability > 9 && compatability < 20) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseTwo);
                    cardAction.append(responseTwo);
                }
                if (compatability > 19 && compatability < 30) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseThree);
                    cardAction.append(responseThree);
                }
                if (compatability > 29 && compatability < 40) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseFour);
                    cardAction.append(responseFour);
                }
                if (compatability > 39 && compatability < 50) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseFive);
                    cardAction.append(responseFive);
                }
                if (compatability > 49 && compatability < 60) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseSix);
                    cardAction.append(responseSix);
                }
                if (compatability > 59 && compatability < 70) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseSeven);
                    cardAction.append(responseSeven);
                }
                if (compatability > 69 && compatability < 80) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseEight);
                    cardAction.append(responseEight);
                }
                if (compatability > 79 && compatability < 90) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseNine);
                    cardAction.append(responseNine);
                }
                if (compatability > 89 && compatability < 100) {
                    var ratingScore = $("<p>").text(userCompatability);
                    spanComp.append(ratingScore);
                    compatabilityMessage = $("<p>").text(responseTen);
                    cardAction.append(responseTen);
                }



            }); //End of the match-making API call.

            var saveBtn = $("<button>").attr("id", "save-button");
            saveBtn.addClass("waves-effect waves-light btn-flat");
            saveBtn.text("Save Drink");
            cardAction.append(saveBtn);
            recipeContent.append(cardAction);
            collapseBody.append(recipeContent);
            cardContent.append(collapseBody);
            card.append(cardContent);

            // Using the "active" class to call on the specific li we want to save.
            $(saveBtn).on("click", function () {
                var saveClick = $("li.active").html();
                localStorage.setItem(drinkKey, saveClick);
                //everytime the user saves a drink the value of drinkKey increments, creating a new key and a new save slot. and preventing the override.
                drinkKey++
                //we save the drinkKey value in storage also. When the user comes back to the page they will also upload the most recent key.
                localStorage.setItem("newKey", drinkKey);

            })

        }) //end of "random drink" api call

        $("#recipe-display").prepend(randomHeader, card);

    } //end of "whateverWorks" function


    //carrying off of the first get drink function ALL vars/response objects HAVE YET TO BE UPDATED;
    function nonAlch() {

        var nonURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"

        $.get(nonURL).then(function (nonResponse) {
            // console.log(response);
            //This clears out the previous search results
            $("#recipe-display").empty()
            // jquery for Materialize
            $(document).ready(function () {
                $('.collapsible').collapsible();
            });

            var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
            var nonHeader = $("<h1>").text("Make it virgin:")
            var card = $("<ul>").addClass("collapsible");
            card.attr("id", "main-list");

            for (var i = 0; i < nonResponse.drinks.length; i++) {
                var nonId = nonResponse.drinks[i].idDrink
                console.log(nonId);

                //begin second API call for recipe
                $.get(drinkURL + nonId).then(function (drinkResponse) {
                    // using class names from Materialize, I dynamically created cards with content to print different pieces from our response.
                    // We'll create them & append them in the order we want them to appear on the screen.
                    // Here we start by building the html elements for the card (that will hold all info) & card content (that will hold additional html elements like span & p-tags).
                    var cardContent = $("<li>").addClass("card-content");
                    cardContent.attr("id", "recipe-content");
                    var collapseHead = $("<div>").addClass("collapsible-header");
                    // collapseHead.addClass("center-align");
                    // Now we'll create an html span, add a class and text directly from our API call.
                    var span = $("<span>").addClass("card-title").text(drinkResponse.drinks[0].strDrink);
                    // Creating html img with src from response
                    var img = $("<img>").attr("src", drinkResponse.drinks[0].strDrinkThumb);
                    img.addClass("responsive-image circle");
                    // Next we'll append the span with the drink name & thumbnail img to the card content.
                    var spanComp = $("<div>").addClass("span-comp");
                    spanComp.append(span);
                    collapseHead.append(img, spanComp);
                    cardContent.append(collapseHead);

                    var collapseBody = $("<div>").addClass("collapsible-body");
                    var recipeContent = $("<div>");
                    recipeContent.addClass("left-align");
                    // Using a for loop, we'll cycle over information that needs more than 1 line extracted from the response: ingredients & measurements, and set a conditional to only capture info if it exists.
                    for (var i = 1; i <= 15; i++) {
                        if (drinkResponse.drinks[0]["strMeasure" + i]) {
                            // Now we'll create a p-tag with text from our for loop response that targets measurements.
                            var pTag = $("<p>").text(drinkResponse.drinks[0]["strMeasure" + i]);
                        }
                        if (drinkResponse.drinks[0]["strIngredient" + i]) {
                            // Now we'll create a variable to capture text from our for loop that targets ingredients (empty string applied to create space when appended).
                            var cardIng = ("" + drinkResponse.drinks[0]["strIngredient" + i]);
                            // Now we'll append the ingredients to the same p-tag with the measurements so they line up together (hopefully!).
                            pTag.append(cardIng);
                            // Now we'll append the p-tag with both measurements & ingredients to the card content.
                            recipeContent.append(pTag);
                        }

                    } //End of for loop for measurements/ingredients

                    // Finally, we want to follow a similar process for our type of glass and instructions. Because only one value exists for each of these in our response, we don't need to use the for loop. Executing here b/c page is read top-bottom and want this text to appear on the card we're creating last.

                    // create a variable to make a p-tag and add text from response about glass type.
                    var glass = $("<p>").text("Glass: " + (drinkResponse.drinks[0].strGlass))
                    // Same process for instructions ------- using seperate p-tags to make styling easier later-on: right now all elements are stacking TODO: will change in final stages to wrap/float.
                    var instructions = $("<p>").text("Instructions: " + (drinkResponse.drinks[0].strInstructions));
                    // Now we'll append the glass and instructions p-tags to card content.
                    recipeContent.append(glass, instructions);

                    //Here is the start of the match-making API taken from https://rapidapi.com/ajith/api/love-calculator/endpoints
                    //This is in a format I'm unfamiliar with, but it works!
                    var userName = $("#name-input").val();
                    var secondName = (drinkResponse.drinks[0].strDrink)

                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://love-calculator.p.rapidapi.com/getPercentage?fname=" + userName + "&sname=" + secondName,
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-key": "19df3380dfmsh99f4e329e5f0d08p18e0b9jsn20005bc6de7b",
                            "x-rapidapi-host": "love-calculator.p.rapidapi.com"
                        }
                    };

                    var cardAction = $("<div>").addClass("card-action");
                    cardAction.addClass("center-align");

                    //saving user name into local storage.
                    localStorage.setItem("nameValue", userName);

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        //this variable collects and holds the compatability rating from the API call.
                        compatability = parseInt(response.percentage);
                        //a variable that will be used to print the score to the user.
                        userCompatability = "Compatibility: " + compatability + "%";
                        //just for testing...can be deleted.
                        console.log(compatability);

                        //these are the variables for the comments based on compatability rating
                        var responseOne = "NOOOOOO! Definitely not this one!";
                        var responseTwo = "Beer goggle necessary to enjoy this drink. Think again.";
                        var responseThree = "C'mon! Don't settle for this! There's a better choice.";
                        var responseFour = "What doesn't kill you...the added sugar content I mean.";
                        var responseFive = "Take it or leave it.";
                        var responseSix = "This isn't a bad choice after a bad day.";
                        var responseSeven = "Definitely a drink worth trying a second time.";
                        var responseEight = "Satisfying to the last drop.";
                        var responseNine = "Clearly a top, no hangover type of drink. Delish.";
                        var responseTen = "You could drink this all day, a match made in non-alky heaven.";

                        if (compatability > 0 && compatability < 10) {
                            console.log(responseOne)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseOne);
                            cardAction.append(responseOne);
                        }
                        if (compatability > 9 && compatability < 20) {
                            console.log(responseTwo)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseTwo);
                            cardAction.append(responseTwo);
                        }
                        if (compatability > 19 && compatability < 30) {
                            console.log(responseThree)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseThree);
                            cardAction.append(responseThree);
                        }
                        if (compatability > 29 && compatability < 40) {
                            console.log(responseFour)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseFour);
                            cardAction.append(responseFour);
                        }
                        if (compatability > 39 && compatability < 50) {
                            console.log(responseFive)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseFive);
                            cardAction.append(responseFive);
                        }
                        if (compatability > 49 && compatability < 60) {
                            console.log(responseSix)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseSix);
                            cardAction.append(responseSix);
                        }
                        if (compatability > 59 && compatability < 70) {
                            console.log(responseSeven)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseSeven);
                            cardAction.append(responseSeven);
                        }
                        if (compatability > 69 && compatability < 80) {
                            console.log(responseEight)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseEight);
                            cardAction.append(responseEight);
                        }
                        if (compatability > 79 && compatability < 90) {
                            console.log(responseNine)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseNine);
                            cardAction.append(responseNine);
                        }
                        if (compatability > 89 && compatability < 100) {
                            console.log(responseTen)
                            var ratingScore = $("<p>").text(userCompatability);
                            spanComp.append(ratingScore);
                            compatabilityMessage = $("<p>").text(responseTen);
                            cardAction.append(responseTen);
                        }
                    }); //End of the match-making API call.

                    var saveBtn = $("<button>").attr("id", "save-button");
                    saveBtn.addClass("waves-effect waves-light orange darken-4 btn-flat");
                    saveBtn.text("Save Drink");
                    cardAction.append(saveBtn);
                    recipeContent.append(cardAction);
                    collapseBody.append(recipeContent);
                    cardContent.append(collapseBody);
                    card.append(cardContent);

                    // Using the "active" class to call on the specific li we want to save.
                    $(saveBtn).on("click", function () {
                        var saveClick = $("li.active").html();
                        localStorage.setItem(drinkKey, saveClick);
                        //everytime the user saves a drink the value of drinkKey increments, creating a new key and a new save slot. and preventing the override.
                        drinkKey++
                        //we save the drinkKey value in storage also. When the user comes back to the page they will also upload the most recent key.
                        localStorage.setItem("newKey", drinkKey);

                    })

                }) //End of function for drinkResponse

            } //End of for loop for main API call

            $("#recipe-display").prepend(nonHeader, card);

        }) // End of ask API function

    } //end of nonAlch function



}) // end of the document ready 