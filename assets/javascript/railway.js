  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBUakR239Rv9lZjkJm5ug6eM0Lhm_Ay3Ns",
    authDomain: "steamtown-station.firebaseapp.com",
    databaseURL: "https://steamtown-station.firebaseio.com",
    projectId: "steamtown-station",
    storageBucket: "steamtown-station.appspot.com",
    messagingSenderId: "885709597433"
  };
  firebase.initializeApp(config);

  // a variable to reference the database
  var database = firebase.database();

  // variables to define trains

  var trainName = "";
  var destination = "";
  var firstTrain = ""; //hh:mm am/pm May render differently on different browsers.
  //Observation: Firebase automatically logs hh:mm as HH:mm
  var frequency = 0; // a number to define minutes
  var nextArrival = "" //hh:mm am/pm May render differently on different browsers. Calculated
  var minutesAway = 0 //Calculated via Firebase data and moment.js.

$("#train-info").on("submit", function(event){
    event.preventDefault(); //prevents premature submission

    //pull data values from form
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();
    firstTrain = $("#first-train").val().trim();

    //push values to Firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,
    });
});

   //calculate the values for the nextArrival and minutesAway variables
   database.ref().on("child_added", function(snapshot){
       var tFrequency = snapshot.val().frequency;
       var firstTime = snapshot.val().firstTrain;
       console.log(snapshot.val().frequency);
       console.log(snapshot.val().firstTrain);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime); 

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minutes Until Train
        minutesAway = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);

        // Next Train Arrival
        nextArrival = moment().add(minutesAway, "minutes").format("LT");
        console.log("Next Arrival: " + nextArrival);
        //nextArrival = moment(nextTrain).format("LT").format("LT");
   });

//Update the train schedule by creating a new row in table and populating the cells.

database.ref().on("child_added", function(snapshot){
    var tBody = $("tbody");
    var tRow = $("<tr>");

    var trainTd = $("<td>").text(snapshot.val().trainName);
    var destinationTd = $("<td>").text(snapshot.val().destination);
    var frequencyTd = $("<td>").text(snapshot.val().frequency);
    var arrivalTd = $("<td>").text(nextArrival);
    var minAwayTd = $("<td>").text(minutesAway);
    //console.log(snapshot.val().trainName);
    //console.log(snapshot.val().destination);
    //console.log(snapshot.val().frequency);
    //console.log(snapshot.val().firstTrain);

    tRow.append(trainTd, destinationTd, frequencyTd, arrivalTd, minAwayTd);
    tBody.append(tRow);


});