// (C) Philipp Engelmann, MIT licensed
// https://github.com/DasFlappi/

var requestURL = 'http://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json';
var warncellid = '123456789';


//Transform JSONP to JSON
function transform(jsonString) {
   var newString = jsonString.replace('warnWetter.loadWarnings(','');
   newString = newString.replace(');','');
   var newJSON = JSON.parse(newString);
   return newJSON;
}

function gettime(unix_timestemp) {
   var date = new Date(unix_timestemp); // do not multiply by 1000! Already done by DWD in JSONP-File!
   var day = date.getDate();
   if(day.toString().length == 1){
      day = '0' + day;
   }
   var month = date.getMonth()+1;   //0 to 11
   if(month.toString().length == 1){
      month = '0' + month;
   }
   var year = date.getFullYear();
   var hours = date.getHours();
   if(hours.toString().length == 1){
      hours = '0' + hours;
   }
   var minutes = date.getMinutes()
   if(minutes.toString().length == 1){
      minutes = '0' + minutes;
   }
   var time = day + '.' + month + '.' + year +'  -  ' + hours + ':' + minutes + ' Uhr';
   return time;
}


//GET JSONP FILE from DWD 
var request = new XMLHttpRequest(); 

request.open('GET', requestURL);
request.responseType = 'jsonp';
request.send();
request.onload = function(){
   var dwdwarnungen = request.response;
   dwdwarnungen = transform(dwdwarnungen); //JSONP to JSON
   var warnungenspace = document.getElementById('warnungsul');

   if(dwdwarnungen.warnings.hasOwnProperty(warncellid)){    //if warnings availiable
      for(var i = 0; i < dwdwarnungen.warnings[warncellid].length; i++){   // for each element with current warncellid

            var singlewarning = dwdwarnungen.warnings[warncellid][i];   //get warning-content
            var element = document.createElement("li");                 //create list-element for each warning

        switch(singlewarning.level){    //different severity, different color :)
            case 1: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'><span style='color:#E4A7A5'>"+ singlewarning.headline +"</h3>"; break;   //Vorabinformation
            case 2: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'><span style='color:#FFEB3B'>"+ singlewarning.headline +"</h3>"; break;   //Stufe 1
            case 3: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'><span style='color:#FB8C00'>"+ singlewarning.headline +"</h3>"; break;   //Stufe 2
            case 4: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'><span style='color:#E53935'>"+ singlewarning.headline +"</h3>"; break;   //Stufe 3  
            case 5: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'><span style='color:#880E4F'>"+ singlewarning.headline +"</h3>"; break;   //Stufe 4
            default: element.innerHTML = "<li class='singlewarn'><h3 class='warnungen_h3'>"; break;
         }
         element.innerHTML = element.innerHTML +"<p class='warnungen_p'> <span style='font-weight: bold'>Warnung g&uuml;ltig von " + gettime(singlewarning.start) + " bis "+ gettime(singlewarning.end) + "</span><br>" + singlewarning.description +"<br>"+ singlewarning.instruction +"</p></li>";
      warnungenspace.appendChild(element);   //append list-element to ul
      }
   }
   else {   //no warnings availiable
      warnungenspace.innerHTML = "<h3 class='warnungen_h3'><span style='color: #a7c957'>Derzeit sind keine Warnungen aktiv!</h3></span>";
      
   }
}

