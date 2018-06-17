  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWND59H5sQBHM7yY7zGL1yeZux-GMGiNE",
    authDomain: "trainschedule-619c7.firebaseapp.com",
    databaseURL: "https://trainschedule-619c7.firebaseio.com",
    projectId: "trainschedule-619c7",
    storageBucket: "trainschedule-619c7.appspot.com",
    messagingSenderId: "1024407340394"
  };
  firebase.initializeApp(config);
  
    var dataRef = firebase.database();
    
    // Create variables with initial values
    var trainName = "";
    var destination = "";
    var frequency = 0;
    var firstTrainOfDay = "";
    var minutesAway = "";
    var nextArrival = 0;
    var formattedDate = "";
    console.log(nextArrival);

        
    // When submit button is clicked perform function
    $("#add-train").on("click", function(event) {
      event.preventDefault();
      
    //use jquery to store the user input
      trainName = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      frequency = $("#frequency-input").val().trim();
      firstTrainOfDay = $("#train-time-input").val().trim();

      //calculation for minutes away
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainOfDay, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);
    // Next Train
    nextArrivalCalculation = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
    nextArrival = nextArrivalCalculation.toLocaleString();
    
      
      // Push the data from the input form into firebase database
      dataRef.ref().push({
        
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
      });
    });
    
    // Listen for child_added event
    dataRef.ref().on("child_added", function(childSnapshot) {
      
      console.log(childSnapshot.val());
      
      var getDate = childSnapshot.val().nextArrival;
      var indexingDate = getDate.indexOf("GMT");
      formattedDate = getDate.slice(0, indexingDate-4);
      console.log(formattedDate);


      // add all data from firebase database to the html table
      $("#tableBody").append("<tr><td>" + childSnapshot.val().trainName + 
      "</td><td>" + childSnapshot.val().destination + 
      "</td><td>" + childSnapshot.val().frequency + 
      "</td><td>" + formattedDate + 
      "</td><td>" + childSnapshot.val().minutesAway +
      "</td> </tr>");
       
      //Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
        