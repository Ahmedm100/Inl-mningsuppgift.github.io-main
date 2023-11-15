document.addEventListener("DOMContentLoaded", () => { 
    const programForm = document.getElementById("program-form");
    const programTitle = document.getElementById("program-title");
    const programDescription = document.getElementById("program-description");
    const programAgeLimit = document.getElementById("program-age-limit");
    const programList = document.getElementById("program-list");
    const searchProgram = document.getElementById("search-program");
    //AddEventListener (DOM) Detta används för att säkerställa att din JavaScript-kod körs först när hela HTML-dokumentet har laddats in.

    function saveProgram(program) {
        const programs = getProgramsFromLocalStorage();
        programs.push(program);
        localStorage.setItem("programs", JSON.stringify(programs));
        /*Funktionen sparar det angivna programmet i local storage genom att 
        hämta befintliga program, lägga till det nya programmet och uppdatera local storage.*/
    }
    function getProgramsFromLocalStorage() {
        const programs = JSON.parse(localStorage.getItem("programs")) || [];
        return programs;
        //Funktionen hämtar program från local storage eller returnerar en tom array om det inte finns några sparade program.
    }   
    function fillFormWithSavedData() {
        const savedData = JSON.parse(localStorage.getItem("savedData")) || {};
        programTitle.value = savedData.title || "";
        programDescription.value = savedData.description || "";
        programAgeLimit.value = savedData.ageLimit || "";
        //Funktionen fyller i formuläret med eventuellt sparade värden från local storage när sidan laddas.
    }
    fillFormWithSavedData();

    programForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = programTitle.value;
        const description = programDescription.value;
        const ageLimit = programAgeLimit.value;
        
        const program = { title, description, ageLimit };
        saveProgram(program);
        
        addProgramToList(program);

        programTitle.value = "";
        programDescription.value = "";
        programAgeLimit.value = "";

        
        const savedData = { title, description, ageLimit };
        localStorage.setItem("savedData", JSON.stringify(savedData));
        /*lyssnar på när formuläret skickas in och hindrar sidan från att laddas om. 
        Den samlar in värdena från formuläret,sparar de och lägger till de i listan och återställer formuläret.*/
    });

    programList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const listItem = e.target.parentElement;
            const programTitle = listItem.querySelector("strong").textContent;
            removeProgramFromList(programTitle);
        }
        /*lyssnar på klick på listelementet. Om knappen klickas, extraheras titeln och programmet tas bort från listan.*/
    });

    searchProgram.addEventListener("input", () => {
        const searchValue = searchProgram.value.toLowerCase();
        const programs = getProgramsFromLocalStorage();
        const filteredPrograms = programs.filter(program => program.title.toLowerCase().includes(searchValue));
        displayPrograms(filteredPrograms);
        /*lyssnar på inmatning i sökrutan. Den filtrerar program baserat på sökningen och visar de matchande programmen som man söker efter.*/
    });

    const addProgramToList = (program) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${program.title}</strong> (Åldersgräns: ${program.ageLimit})<br>${program.description} <button class="remove-button">Remove this</button>`;
        programList.appendChild(listItem);
        /*Funktionen skapar ett nytt listelement och lägger till det i listan med programinformation samt en "Ta bort"knappen.*/
    };

    const displayPrograms = (programs) => {
        programList.innerHTML = "";
        programs.forEach(program => addProgramToList(program));
        /*Funktionen tömmer listan och lägger till varje program i listan.*/
    };

    const removeProgramFromList = (title) => {
        const updatedPrograms = getProgramsFromLocalStorage().filter(program => program.title !== title);
        localStorage.setItem("programs", JSON.stringify(updatedPrograms));
        displayPrograms(updatedPrograms);
        /*Funktionen tar bort det angivna programmet från listan och uppdaterar local storage samt visar de uppdaterade programmen*/
    };
});
