var Alexa = require('alexa-sdk');
var request = require('request');
const weatherAPIKey = "2865f839ffd44cabdfd9f3561b703562";
const skillName = "Headsail Chooser";

function decideSail(data,windSpeed){
  windSpeed = parseFloat(windSpeed);
  if (data.Direction.value && data.Direction.value.includes("own")){
      if (data.Boat.value.includes("ar") && data.Boat.value.includes("40")){
        if (windSpeed>16){
          return "CODE S2"
        }else if (windSpeed<11){
          return "Code 1"
        }else {
          return "Code 1.5"
        }
      }else {
        return "Class Spinnaker"
      }
  }
  else if(data.Boat.value){
    if(data.Boat.value.includes("24"))
      {
        // J24
        if (windSpeed<18.0){
          return "Genoa"
        }else {
          return "Jib"
        }
      } else if(data.Boat.value.includes("30")) {
        if (windSpeed<15){
          return "#1 Genoa"
        }else if  (windSpeed<21){
          return "#2 Jib"
        }else {
          return "#3 Blade"
        }
      }else if(data.Boat.value.includes("avy") && data.Boat.value.includes("44")) {
        if (windSpeed<12){
          return "#1 Genoa"
        }else if  (windSpeed<18){
          return "#2 Genoa"
        }else if (windSpeed<25){
          return "#3 Working Jib"
        }else if (windSpeed<35){
          return "Heavy WX Jib"
        }else {
          return "Storm Jib"
        }
      } else {
        if (windSpeed<15){
          return "#1 Genoa"
        }else if  (windSpeed<21){
          return "#2 Jib"
        }else {
          return "#3 Blade"
        }
      }
  }
}
var handlers = {

    "ChooseSail": function () {
      console.log("------ ChooseSail --------------------")
      deviceId = this.event.context.System.device.deviceId;
      consentToken = "Bearer " +this.event.context.System.user.permissions.consentToken;
      var self = this;
      if (consentToken){
        request(
          {
            method:'GET',
            uri : "https://api.amazonalexa.com/v1/devices/"+deviceId+"/settings/address/countryAndPostalCode",
            headers : {
            Authorization : consentToken,
            "Host": "api.amazonalexa.com",
            "Accept": "application/json",
          }
          },
        function (error, response, body) {
          //needs some error handling
          data = JSON.parse(body);
          zip = data.postalCode;
          if (zip){
          weatherUrl="http://api.openweathermap.org/data/2.5/weather?zip="+zip+",us&appid="+weatherAPIKey;
          request(weatherUrl,function(error,response,body){
            var weatherData = JSON.parse(body);
            var windSpeed = weatherData.wind.speed;
            var windDirection = weatherData.wind.deg;
            var town = weatherData.name;
            var sail = decideSail(self.event.request.intent.slots,windSpeed);
            var speechOutput = "you should use your " + sail + " while sailing in " + town +
            " today as the wind is blowing " + windSpeed + " knots from a heading of " + windDirection + "degrees";
            self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
          })
        }else{
          zip = "94119";
          weatherUrl="http://api.openweathermap.org/data/2.5/weather?zip="+zip+",us&appid="+weatherAPIKey;
          console.log("Checking Weather --- " + weatherUrl);
          request(weatherUrl,function(error,response,body){
            console.log(body);
            var weatherData = JSON.parse(body);
            var windSpeed = weatherData.wind.speed;
            var windDirection = weatherData.wind.deg;
            var town = weatherData.name;
            var sail = decideSail(self.event.request.intent.slots,windSpeed);
            var speechOutput = "Please enable location services with the Alexa App. " +
            "Until you do we will use the weather in San Francisco, a great place to sail. " +
            "you should use your " + sail + " while sailing in " + town +
            " today as the wind is blowing " + windSpeed + " knots from a heading of " + windDirection + "degrees";
            self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
          })
        }

        }
      );
    }else {
      zip = "94119";
      weatherUrl="http://api.openweathermap.org/data/2.5/weather?zip="+zip+",us&appid="+weatherAPIKey;
      console.log("Checking Weather --- " + weatherUrl);
      request(weatherUrl,function(error,response,body){
        console.log(body);
        var weatherData = JSON.parse(body);
        var windSpeed = weatherData.wind.speed;
        var windDirection = weatherData.wind.deg;
        var town = weatherData.name;
        var sail = decideSail(self.event.request.intent.slots,windSpeed);
        var speechOutput = "Please enable location services with the Alexa App" +
        "Until you do we will use the weather in San Francisco, a great place to sail" +
        "you should use your " + sail + " while sailing in " + town +
        " today as the wind is blowing " + windSpeed + " knots from a heading of " + windDirection + "degrees";
        self.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    });


    }
  },

    "AboutIntent": function () {
        var speechOutput = "Head Sail Chooser is by Conner Fullerton";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },

    "AMAZON.HelpIntent": function () {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "what sail should I use for my J24";
        speechOutput += "what sail should I use while sailing Upwind on my J30";
        speechOutput += "You can also say stop if you're done. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "LaunchRequest": function () {
        var speechText = "";
        speechText += "Welcome to " + skillName + ".  ";
        speechText += "You can ask a question like, what sail should I use while sailing Upwind on my J30.  ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);

    }

};


exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.31e26e66-4f05-4039-bbbb-558bcfd72bb8";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
