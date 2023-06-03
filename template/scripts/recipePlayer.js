
// let przepis = '{ "nazwa" :"nalesniki", '+
//     '"kroki":[' +
//     '{ "czynnosc":"dodaj" , "ilosc":"250", "jedostkaIlosci":"ml","kategoria":"sypkie","skladnik":"mleko","czas":"10","jednostkaCzasu":"sec" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"200", "jedostkaIlosci":"g","kategoria":"sypkie","skladnik":"mąka pszenna","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"150", "jedostkaIlosci":"ml","kategoria":"stale","skladnik":"woda","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"2", "jedostkaIlosci":"sztuki","kategoria":"stale","skladnik":"jajka","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"0.5", "jedostkaIlosci":"łyżeczki","kategoria":"ciekle","skladnik":"sól","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"0.5", "jedostkaIlosci":"łyżeczki","kategoria":"ciekle","skladnik":"cukier","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"mieszaj" , "ilosc":"0", "jedostkaIlosci":"-","kategoria":"sypkie","skladnik":"-","czas":"5","jednostkaCzasu":"min" },' +
//     '{ "czynnosc":"dodaj" , "ilosc":"20", "jedostkaIlosci":"ml","kategoria":"sypkie","skladnik":"olej","czas":"0","jednostkaCzasu":"-" },' +
//     '{ "czynnosc":"mieszaj" , "ilosc":"0", "jedostkaIlosci":"-","kategoria":"sypkie","skladnik":"-","czas":"1","jednostkaCzasu":"min" }' +
//     ']}';

var i=0
var json=JSON.parse(przepis)
var stepId=0
var intervalId=0
var timeInSec = 0
var startBtn=document.getElementById("startBtn")
var elem = document.getElementById("myBar");
var progressBar = document.getElementById("myProgress");
var nextBtn = document.getElementById("nextBtn");


function  startTimer()
{

    // clearInterval(intervalId);
    // i = 0;
    if (i === 0&& timeInSec>0) {
        var width = 1;
        i=1
        intervalId = setInterval( frame, timeInSec * 10);
        function frame() {
            if (width >= 100) {
                clearInterval(intervalId);
                // i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }


}
 function loadNextStep() {
     clearInterval(intervalId);
     var elem = document.getElementById("myBar");
     elem.style.width = 0 + "%";

    var singleStep = json.kroki[stepId]

    var description = singleStep.czynnosc + " " + singleStep.ilosc + " " + singleStep.jedostkaIlosci + " " +
        singleStep.skladnik+" duration: "+singleStep.czas+" "+singleStep.jednostkaCzasu
    if (parseInt(singleStep.czas) > 0) {
        timeInSec = singleStep.czas
        i = 0;
        startBtn.style.visibility="visible";
        progressBar.style.visibility="visible";


    }else
    {
        startBtn.style.visibility="hidden";
        progressBar.style.visibility="hidden";


    }

    switch (singleStep.jednostkaCzasu) {
        case "min":
            timeInSec *= 60
            break
        case "h":
            timeInSec *= 60 * 60
            break
    }
    // skrocenie czasu dla dobrea prezentacji
    timeInSec = timeInSec / 100
    document.getElementById("descripton").innerHTML = description
     if(stepId<json.kroki.length-1)
     {
         stepId += 1
     }else
     {
         document.getElementById("descripton").innerHTML = "Gratulacje Smacznego"
         startBtn.style.visibility="hidden";
         progressBar.style.visibility="hidden";
         nextBtn.style.visibility="hidden";

     }


}
loadNextStep()
