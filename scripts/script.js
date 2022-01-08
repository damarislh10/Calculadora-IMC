// capturing the data

let sexoM = "";
let sexoF = "";
let edadI = "";
let pesoI = "";
let alturaI = "";
let imc = "";

let Persons = [];

let sexo;
function getData() {
  sexo = sexoM || sexoF;
  edadI = document.getElementById("edad").value;
  pesoI = document.getElementById("peso").value;
  alturaI = document.getElementById("altura").value;

  if (sexo != "" && edadI != "" && pesoI != "" && alturaI != "") {
    calcularIMC(pesoI, alturaI);
    addData(sexo, edadI, pesoI, alturaI, imc);
    sendToLocalStorage(Persons);
    barraIndice();
    calcularPesoIdeal(alturaI);

  } else if (sexo == "") {
    alert("Debe seleccionar un sexo");
  } else {
    alert("Debes llenar todos los campos");
  }
}

function calcularIMC(peso, altura) {
  let resultadoIMC = document.getElementById("container-result");
  imc = peso / (altura * altura);
  imc = imc.toFixed(2);

  resultadoIMC.innerHTML = ``;
  resultadoIMC.innerHTML = `<label id="result">${imc}</label> `;
}


// peso ideal
function calcularPesoIdeal(alturaP) {
  if (sexo === "F") {
    let pesoIdealMin = 44; // kg 
    let pesoIdealMax = 49;
    let alterAltura = alturaP * 100; // alterAltura 1.60

    for (let i = 140; i < alterAltura; i++) { // no mida menos de 140cm se ejecuta hasta la altura
      // min 1.40 A
      pesoIdealMin += 0.4; // centimetro se aumente 0.4 kg  veces
      pesoIdealMax += 0.4;
    }
    pesoIdealMin = pesoIdealMin.toFixed(0); // quitar decimales
    pesoIdealMax = pesoIdealMax.toFixed(0);

    const items = document.createElement("div");
    const result = document.getElementById("pesoIdeal");
    result.innerHTML = "";
    items.innerHTML = `<label id="pesoIdeal">${pesoIdealMin}-${pesoIdealMax} (KG)</label>`;
    result.appendChild(items);
  } else if (sexo === "M") {
    let pesoIdealMin = 45;
    let pesoIdealMax = 50;
    let alterAltura = alturaP * 100;

    for (let i = 140; i < alterAltura; i++) {
      pesoIdealMin = pesoIdealMin += 0.67;
      pesoIdealMax = pesoIdealMax += 0.67;
    }
    pesoIdealMin = pesoIdealMin.toFixed(0);
    pesoIdealMax = pesoIdealMax.toFixed(0);

    const items = document.createElement("div");
    const result = document.getElementById("pesoIdeal");
    result.innerHTML = "";
    items.innerHTML = `<label id="pesoIdeal">${pesoIdealMin}-${pesoIdealMax} (KG)</label>`;
    result.appendChild(items);
  }
}

const addData = (sexoU, edadU, pesoU, alturaU, imc) => {
  Persons.push({
    sexoUser: sexoU,
    edadUser: edadU,
    pesoUser: pesoU,
    alturaUser: alturaU,
    masaCorporal: imc,
  });
};

function getLocalStorage() {
  if (localStorage.getItem("Person")) {
    Persons = JSON.parse(localStorage.getItem("Person"));
  }
  return Persons;
}

function sendToLocalStorage(persons) {
  localStorage.setItem("Person", JSON.stringify(persons));
}

getLocalStorage();

const seleccionarMan = () => {
  const botones = document.querySelector("#contenedor-icon");
  const items = document.createElement("div");
  botones.innerHTML = "";
  items.innerHTML = `
  <button id="btn-male" class="btn-sexo">
    <img src="https://img.icons8.com/ios-filled/60/4682B4/men-age-group-4.png"/>
  </button>

  <button id="btn-female" class="btn-sexo">
    <img src = "https://img.icons8.com/ios-filled/60/000000/standing-woman.png"/>
  </button>
  `;
  botones.appendChild(items);
  sexoM = "M";
};

const seleccionarWomen = () => {
  const botones = document.querySelector("#contenedor-icon");
  const items = document.createElement("div");
  botones.innerHTML = "";
  items.innerHTML = `
  <button id="btn-male" class="btn-sexo">
    <img src="https://img.icons8.com/ios-filled/60/000000/men-age-group-4.png"/>
  </button>

  <button id="btn-female" class="btn-sexo">
    <img src = "https://img.icons8.com/ios-filled/60/FF69B4/standing-woman.png"/>
  </button>
  `;
  botones.appendChild(items);
  sexoF = "F";
};

let barra = document.getElementById("barra");
let flecha = document.getElementById("flecha");

const barraIndice = () => {
  let posicion = -75; // menos 75% imagen lado izquierdo de la barra 
  for (let i = 0; i < 44; i++) { // 44 imc max no salga barra
    if (i < imc && posicion < 75) { // si es mayor no quiero que aumente màs 75 derecho
      if (i < 19) { // imc bajo 
        posicion += 2.7;// aumente 2.7 
      }
      if (i > 19 && i < 25) {
        posicion += 6;
      }
      if (i > 25 && i < 40) { // sobrepeso
        posicion += 5;
      }
      if (i > 40) { // obesidad
        posicion += 3;
      }
    }
  }
  flecha.style.marginLeft += posicion + "%"; // aumente 
};

//------Estadisticas

let cantMujer = 0;
let cantHombre = 0;

let cantTotal = 0;
let promedioMujer = 0;
let promedioHombre = 0;

getLocalStorage().forEach((person) => {
  if (person.sexoUser === "F") {
    cantMujer++;
  } else if (person.sexoUser === "M") {
    cantHombre++;
  }
});
cantTotal = cantMujer + cantHombre;

promedioMujer = (cantMujer / cantTotal) * 100;
promedioHombre = (cantHombre / cantTotal) * 100;

promedioMujer = Math.round(promedioMujer);
promedioHombre = Math.round(promedioHombre);

const $grafica = document.querySelector("#grafica");

const etiquetas = ["Hombres", "Mujeres"];

const datosProm = {
  label: "Promedio sexo",

  data: [promedioHombre, promedioMujer],
  backgroundColor: ["#4682B4", "#FF69B4"],
  borderColor: ["#3C7EFA", "#D831E0"],
  borderWidth: 1,
};

new Chart($grafica, {
  type: "bar",
  data: {
    labels: etiquetas,
    datasets: [datosProm],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

//----Estadisticas IMC
let indiceImc = 0;
let bajoPeso = 0;
let saludable = 0;
let sobrePeso = 0;
let obeso = 0;
let obesidadExtrema = 0;

getLocalStorage().forEach((person) => {
  if (person.masaCorporal < 18.5) {
    bajoPeso++;
  } else if (person.masaCorporal >= 18.5 && person.masaCorporal <= 24.9) {
    saludable++;
  } else if (person.masaCorporal >= 25.0 && person.masaCorporal <= 29.9) {
    sobrePeso++;
  } else if (person.masaCorporal >= 30.0 && person.masaCorporal <= 39.9) {
    obeso++;
  } else if (person.masaCorporal >= 40) {
    obesidadExtrema++;
  }
});

const $grafica2 = document.querySelector("#grafica2");

const etiquetas2 = [
  "Bajo Peso",
  "Saludable",
  "Sobrepeso",
  "Obeso",
  "Obesidad Extrema",
];

const datosImc = {
  label: "Indice masa Corporal",

  data: [bajoPeso, saludable, sobrePeso, obeso, obesidadExtrema],
  backgroundColor: [
    "rgba(54, 162, 235, 0.2)",
    "rgba(39,218,227,0.2)",
    "rgba(215,227,32,0.5)",
    "rgba(227,114,2,0.5)",
    "rgba(227,52,5,0.6)",
  ],
  borderColor: [
    "rgba(54, 162, 235, 1)",
    "rgba(39,218,227,1)",
    "rgba(215,227,32,1)",
    "rgba(227,114,2,1)",
    "rgba(227,52,5,1)",
  ],
  borderWidth: 1,
};

new Chart($grafica2, {
  type: "bar",
  data: {
    labels: etiquetas2,
    datasets: [datosImc],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

let btnSexoM = document.getElementById("btn-male");
let btnSexoF = document.getElementById("btn-female");
let botonCalcu = document.getElementById("btn-env");
botonCalcu.addEventListener("click", (e) => {
  e.preventDefault();
  getData();
  
});
btnSexoM.addEventListener("click", seleccionarMan, true);
btnSexoF.addEventListener("click", seleccionarWomen, true);
