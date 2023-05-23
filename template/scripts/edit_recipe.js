const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');


let przepis = '{ "nazwa" :"nalesniki", '+
'"kroki":[' +
'{ "czynnosc":"dodaj" , "ilosc":"250", "jedostkaIlosci":"ml","skladnik":"mleko","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"dodaj" , "ilosc":"200", "jedostkaIlosci":"g","skladnik":"mąka pszenna","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"dodaj" , "ilosc":"150", "jedostkaIlosci":"ml","skladnik":"woda","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"dodaj" , "ilosc":"2", "jedostkaIlosci":"sztuki","skladnik":"jajka","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"dodaj" , "ilosc":"0.5", "jedostkaIlosci":"łyżeczki","skladnik":"sól","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"dodaj" , "ilosc":"0.5", "jedostkaIlosci":"łyżeczki","skladnik":"cukier","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"mieszaj" , "ilosc":"0", "jedostkaIlosci":"-","skladnik":"-","czas":"5","jednostkaCzasu":"min" },' +
'{ "czynnosc":"dodaj" , "ilosc":"20", "jedostkaIlosci":"ml","skladnik":"olej","czas":"0","jednostkaCzasu":"-" },' +
'{ "czynnosc":"mieszaj" , "ilosc":"0", "jedostkaIlosci":"-","skladnik":"-","czas":"1","jednostkaCzasu":"min" }' +
']}';


// Store listitems
const listItems = [];

let dragStartIndex;
listOfItemsForJson=[]
listOfItemsForJson2=[]
listOfItemsForJsonSkaldniki=[]
listOfItemsForJsonCzas=[]
listOfItemsForJsonJednostki=[]
listOfItemsForJsonIloscCzasu=[]


listaJednostek=["kg","l","dg","-","ml","sztuki"]//tutaj przypisac dostepne jednostki z bazy danych
listaSkladnikow=["marchew","banan","koperek","-","mleko","mąka pszenna","woda","jajka","sól","cukier","olej"]//tutaj przypisac dostepe skladniki
listaCzynnosci=["mieszaj","dodaj","miksuj","pokroj"]//tutaj przypisac dostepe skladniki




createList();

// Insert list items into DOM
function createList() {
  var json=JSON.parse(przepis)
  var index=0;
  for(var {czynnosc,ilosc,jedostkaIlosci,skladnik,czas,jednostkaCzasu} of json.kroki)
    {
      const listItem = document.createElement('li');

      listItem.setAttribute('data-index', index);

      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
          <select name="czynnosc" id="selectCzynnosc${index+1}"> </select>
          <input type="number" min=0  oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" id="fname" name="ilosc" placeholder="podaj ilosc" value=${ilosc}>
          <select name="unit" id="selectUnit${index+1}"> </select>
          <select name="skladnik" id="selectSkladnik${index+1}"> </select>
          <input type="number" min=0 oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" id="fname" name="iloscCzasu" placeholder="podaj Czas" value=${czas}>
          <select name="czas" id="selectCzas${index+1}">
            <option value="h">h</option>
            <option value="min">min</option>
            <option value="s">s</option>
            <option value="-">-</option>
          </select>
          <button class="delBtn" onClick="deleteItem(this)" >del</button>
        </div>
      `;
      // <i class="fas fa-grip-lines"></i>
      

      listItems.push(listItem);

      draggable_list.appendChild(listItem);

      document.getElementById("selectCzas"+(index+1)).value=jednostkaCzasu

      var select = document.getElementById("selectUnit"+(index+1));
      for(var i = 0; i < listaJednostek.length; i++) {
        var opt = listaJednostek[i];
        var el = document.createElement("option");
        if(jedostkaIlosci==opt)
        {
          el.setAttribute("selected","selected")
        }
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }

      var select = document.getElementById("selectSkladnik"+(index+1));
      for(var i = 0; i < listaSkladnikow.length; i++) {
        var opt = listaSkladnikow[i];
        var el = document.createElement("option");
        if(skladnik==opt)
        {
          el.setAttribute("selected","selected")
        }
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }

      var select = document.getElementById("selectCzynnosc"+(index+1));
      for(var i = 0; i < listaCzynnosci.length; i++) {
        var opt = listaCzynnosci[i];
        var el = document.createElement("option");
        if(listaCzynnosci==opt)
        {
          el.setAttribute("selected","selected")
        }
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }

      index++;
     
    };

  addEventListeners();
}


function generateListofItems()
{
  listOfItemsForJson=[]
  listOfItemsForJson2=[]
  listOfItemsForJsonJednostki=[]
  listOfItemsForJsonSkaldniki=[]
  listOfItemsForJsonCzas=[]
  listOfItemsForJsonIloscCzasu=[]


  const inputsList=document.getElementById("draggable-list").getElementsByTagName("input");

  Array.from(inputsList).forEach(el=>
    {
      if(el.name=="krok")
        {
          listOfItemsForJson.push(el.value);
        }
      if(el.name=="ilosc")
        {
          listOfItemsForJson2.push(el.value);
        }
        if(el.name=="iloscCzasu")
        {
          listOfItemsForJsonIloscCzasu.push(el.value);
        }
        
    });

    const selectsList=document.getElementById("draggable-list").getElementsByTagName("select");

    Array.from(selectsList).forEach(el=>
      {
        if(el.name=="unit")
          {
            listOfItemsForJsonJednostki.push(el.options[el.selectedIndex].text);
          }
        if(el.name=="skladnik")
          {
            listOfItemsForJsonSkaldniki.push(el.options[el.selectedIndex].text);
          }
        if(el.name=="czas")
          {
            listOfItemsForJsonCzas.push(el.options[el.selectedIndex].text);
          }
      });
      obj = JSON.parse(przepis);
      obj['kroki']=[]
     for(var i=0;i<listOfItemsForJson.length;i++)
      {
        obj['kroki'].push({ "czynnosc":listOfItemsForJson[i] , "ilosc":listOfItemsForJson2[i], "jedostkaIlosci":listOfItemsForJsonJednostki[i],"skladnik":listOfItemsForJsonSkaldniki[i],"czas":listOfItemsForJsonIloscCzasu[i],"jednostkaCzasu":listOfItemsForJsonCzas[i] })
      }
      przepis=JSON.stringify(obj)
      
     
    
}

function dragStart() {
  // console.log('Event: ', 'dragstart');
  dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragEnter() {
  // console.log('Event: ', 'dragenter');
  this.classList.add('over');
  generateListofItems()

}

function dragLeave() {
  // console.log('Event: ', 'dragleave');
  this.classList.remove('over');
  generateListofItems()

}

function dragOver(e) {
  // console.log('Event: ', 'dragover');
  e.preventDefault();
  generateListofItems()

}

function dragDrop() {
  // console.log('Event: ', 'drop',this.getChildNodes.getAttribute("id"));
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove('over');
  
}

// Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  var tmpSelecUnitId=  listItems[fromIndex].children[1].children[2].getAttribute("id");
  listItems[fromIndex].children[1].children[2].setAttribute("id",listItems[toIndex].children[1].children[2].getAttribute("id"))
  listItems[toIndex].children[1].children[2].setAttribute("id",tmpSelecUnitId)

  var tmpSelecSkldanikId=  listItems[fromIndex].children[1].children[3].getAttribute("id");
  listItems[fromIndex].children[1].children[3].setAttribute("id",listItems[toIndex].children[1].children[3].getAttribute("id"))
  listItems[toIndex].children[1].children[3].setAttribute("id",tmpSelecSkldanikId)

  var tmpSelectCzasId=  listItems[fromIndex].children[1].children[5].getAttribute("id");
  listItems[fromIndex].children[1].children[5].setAttribute("id",listItems[toIndex].children[1].children[5].getAttribute("id"))
  listItems[toIndex].children[1].children[5].setAttribute("id",tmpSelectCzasId)

  var tmpSelectCzynnoscId=  listItems[fromIndex].children[1].children[0].getAttribute("id");
  listItems[fromIndex].children[1].children[0].setAttribute("id",listItems[toIndex].children[1].children[0].getAttribute("id"))
  listItems[toIndex].children[1].children[0].setAttribute("id",tmpSelectCzynnoscId)

  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');


  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
  generateListofItems()

}




function checkOrder() {
  
      index=listItems.length

      const listItem = document.createElement('li');

      listItem.setAttribute('data-index', index);

      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
        <select name="czynnosc" id="selectCzynnosc${index+1}"> </select>
        <input type="number" min=0 oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" id="fname" name="ilosc" placeholder="podaj ilosc">
          <select id="selectUnit${index+1}"> </select>
          <select id="selectSkladnik${index+1}"> </select>
          <input type="number" min=0 oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null" id="fname" name="iloscCzasu" placeholder="podaj Czas">
          <select id="selectCzas${index+1}">
            <option value="h">h</option>
            <option value="min">min</option>
            <option value="s">s</option>
            <option value="-">-</option>
          </select>
          
          <button class="delBtn" onClick="deleteItem(this)">del</button>
        </div>
      `;
      // <i class="fas fa-grip-lines"></i>

      listItems.push(listItem);

      draggable_list.appendChild(listItem);
      addEventListeners()
      generateListofItems()

      window.scrollTo(0, document.body.scrollHeight);

      var select = document.getElementById("selectUnit"+(index+1));
      for(var i = 0; i < listaJednostek.length; i++) {
        var opt = listaJednostek[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }

      var select = document.getElementById("selectSkladnik"+(index+1));
      for(var i = 0; i < listaSkladnikow.length; i++) {
        var opt = listaSkladnikow[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
      var select = document.getElementById("selectCzynnosc"+(index+1));
      for(var i = 0; i < listaCzynnosci.length; i++) {
        var opt = listaCzynnosci[i];
        var el = document.createElement("option");
        if(listaCzynnosci==opt)
        {
          el.setAttribute("selected","selected")
        }
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }

  
}

function deleteItem(e) {
  for (let i = parseInt(e.parentNode.parentNode.getAttribute("data-index")); i < listItems.length-1; i++) {
    swapItems(i,i+1)

  }  

  // swapItems(elementIndex,listItems.length-1)
  draggable_list.removeChild(listItems.pop(listItems.length))
  
}


function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });

 
}


// var elements = document.getElementsByClassName("delBtn");
// for (var i = 0; i < elements.length; i++) {
//   elements[i].addEventListener('click', function(e){
//     console.log(e.target.parentNode.parentNode.getAttribute("data-index"));
//     deleteItem();

//   }, false);
// }
check.addEventListener('click', checkOrder);



