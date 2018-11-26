

//====================================================================================/
// Initial array of topics - Choose a Theme
//====================================================================================/
// var topics = ["Babies", "Puppies", "Kittens", "Unicorns", "Mermaids", "Princesses", "Goddesses"];
// var topics = ["Oprah Winfrey", "Hilary Clinton", "Sheryl Sandberg"];
var topics = ["Austin Powers", "Dr. Evil", "Mini Me"];
var limit=10;
//====================================================================================/
// Function for displaying Topic Buttons
// 
//====================================================================================/
function renderButtons() {
    // Deletes the topics prior to adding new topics
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();
    // Loops through the array of topics
    for (var i = 0; i < topics.length; i++) {

        // Then dynamicaly generates buttons for each topic in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adds a class of topic to our button
        a.addClass("topic");
        // Added a data-attribute
        a.attr("data-name", topics[i]);
        // Provided the initial button text
        a.text(topics[i]);
        // Added the button to the buttons-view div
        $("#buttons-view").append(a);
    }
}


// This function handles events where the add topic button is clicked
$("#add-topic").on("click", function (event) {
    console.log("add topic click");
    event.preventDefault();

    var topic = $("#topic-input").val().trim();
    if (!topic) { 
        return; 
    }
    else { 
        topics.push(topic);
        $("#topic-input").empty();
        renderButtons();
    }
});


// Calling the renderButtons function to display the intial buttons
renderButtons();


//====================================================================================/
// Add Event Listener for adding Topics
//====================================================================================/
// Event listener for all button elements
function displayTopicInfo() {

    var topic = $(this).attr("data-name");
    var encodedTopic = encodeURIComponent(topic);

    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        encodedTopic + "&api_key=dc6zaTOxFJmzC&limit=" + limit;

    console.log("queryURL", queryURL);
    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable
            var results = response.data;
            $("#gifs-appear-here").empty();
            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only taking action if the photo has an appropriate rating
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                // Creating a div for the gif
                var gifDiv = $("<div>").addClass("gif-container");


                // Storing the result item's rating
                var rating = results[i].rating;

                // Creating a paragraph tag with the result item's rating
                var txtDiv = $("<div>").text("Rating: " + rating.toUpperCase());
                
                // Creating an image tag
                var topicImage = $("<img>");

                // Giving the image tag an src attribute of a proprty pulled off the
                // result item
                topicImage.attr("src", results[i].images.fixed_height_still.url);
                topicImage.attr("data-still", results[i].images.fixed_height_still.url);
                topicImage.attr("data-animate", results[i].images.fixed_height.url);
                topicImage.attr("data-state", "still");
                topicImage.addClass("gif"); 

  
                // Appending the paragraph and personImage we created to the "gifDiv" div we created
                gifDiv.append(txtDiv);
                gifDiv.append(topicImage);

                // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                $("#gifs-appear-here").prepend(gifDiv);
                }
            }
        });
}




// Adding click event listeners to all elements with a class of "topic"
$("#buttons-view").on("click", ".topic", displayTopicInfo);

//====================================================================================/
// Toggle image between animate and still
//====================================================================================/
$("#gifs-appear-here").on("click", ".gif", function () {

    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});
