window.addEventListener("load", function(){
    let eachFavDiv = document.createElement("div");
    let eachFavName = document.createElement("span");
    let eachFavImgDiv = this.document.createElement("div");
    
    const pokemonNamesList = document.querySelector("#leftbar");
    const pokemonDetailsName = document.querySelector("#pokemon-details-name");
    const pokemonDetailsImage = document.querySelector("#pokemon-details-image");
    const pokemonDetailsTypes = document.querySelector("#pokemon-details-types");
    const pokemonDetailsDescription = document.querySelector("#pokemon-details-description");
    const pokemonDetailsOtherInfo = document.querySelector("#pokemon-details-otherInfo");
    const pokemonTypeName = this.document.querySelector("#pokemon-type-name");
    const tableDiv = this.document.querySelector("#tableDiv");
    const favouritesDiv = this.document.querySelector("#favourites");
    const addBut = this.document.querySelector("#add-button");

    fetchRandomPokemon();
    fetchAllPokemonNames();
    fetchOtherPokemonInfo();
    
    // Your client-side JavaScript here
    // Remember that your client-side JavaScript cannot directly access any data in your server-side script// All data from the server must be accessed via AJAX fetch requests and the route handlers you write inside 'web-assignment-pokemon.js'
    
    async function fetchOtherPokemonInfo(){
        const otherInfo = await fetch("https://pokeapi.co/api/v2/pokemon/");
        const otherInfoJson = await otherInfo.json();
        return otherInfoJson;
    }

    function getNewPokemonResultsByName(pokemonName, otherInfoJson){
        for (let i = 0; i < otherInfoJson.results.length; i++) {
            if (otherInfoJson.results[i].name === pokemonName.toLowerCase()){
                return otherInfoJson.results[i];
            }
        }
        return null;
    }

    async function fetchAllPokemonNames(){
        const allPokemonNames = await fetch("http://localhost:3000/getAllPokemonNames");
        const allPokemonNamesJson = await allPokemonNames.json();

        for(let i = 0; i < allPokemonNamesJson.length; i++){
            let pokemonNamesEle = document.createElement("li");
            pokemonNamesEle.innerHTML = `${allPokemonNamesJson[i]}`;
            pokemonNamesEle.classList.add("pokemonNames");
            pokemonNamesList.appendChild(pokemonNamesEle);
        }

        let eachEle = document.querySelectorAll(".pokemonNames");
        for(let i = 0; i < allPokemonNamesJson.length; i++){
            eachEle[i].addEventListener("click", () => {
                fetchPokemonByName(allPokemonNamesJson[i]);
            })
        }
        return allPokemonNamesJson;
    }

    async function fetchRandomPokemon(){
        const randomPokemon = await fetch("http://localhost:3000/getRandomPokemon");
        const randomPokemonJson = await randomPokemon.json();
        displaypokemonDetails(randomPokemonJson);
        
    }

    async function fetchPokemonByName(name){
        const pokemonObj = await fetch(`http://localhost:3000/getPokemonByName?name=${name}`);
        const pokemonObjJson = await pokemonObj.json();
        displaypokemonDetails(pokemonObjJson);
        return pokemonObjJson;
    }

    async function fetchPokemonTypeByTypeName(typeName){
        const typeObj = await fetch(`http://localhost:3000/getTypeByName?name=${typeName}`);
        const typeObjJson = await typeObj.json();
        return typeObjJson;
    }

    async function displaypokemonDetails(pokemonJson){
        //displaying my favourites
        if(localStorage.getItem('name') == null){
            localStorage.setItem('name','[]');
        } 
        let oldNameArray = JSON.parse(localStorage.getItem('name'));
        
        if(localStorage.getItem('image') == null){
            localStorage.setItem('image','[]');
        }
        
        let oldImgArray = JSON.parse(localStorage.getItem('image'));
        
        eachFavDiv.innerHTML = "";
        eachFavImgDiv.innerHTML = "";
        eachFavName.innerText = JSON.parse(localStorage.getItem('name'));
        if(oldImgArray != null){
        for(let i = 0; i < oldImgArray.length; i++){
            let eachFavImg = document.createElement("image");
            eachFavImg.innerHTML = `<img src="./images/${oldImgArray[i]}">`;
            eachFavImgDiv.appendChild(eachFavImg);
            }
        }
    
        favouritesDiv.appendChild(eachFavDiv);
        eachFavDiv.appendChild(eachFavName);
        eachFavDiv.appendChild(eachFavImgDiv);
        addBut.onclick = function(){
            //can not add the same Pokemon to My favourites list twice :)                   
            if(containsName(oldNameArray, pokemonJson.name)){
                alert("This Pokemon has been added :)");
            }
            
            if(oldNameArray == null){
                oldNameArray = [`'${pokemonJson.name}'`];
            }
            if(oldNameArray != null &&!containsName(oldNameArray, pokemonJson.name)){
                oldNameArray.push(pokemonJson.name);
            }
            
            
            localStorage.setItem('name', JSON.stringify(oldNameArray));
            eachFavName.innerText = JSON.parse(localStorage.getItem('name'));                         
            
            if(oldImgArray != null &&!containsName(oldImgArray, pokemonJson.imageUrl)){
            oldImgArray.push(pokemonJson.imageUrl);
            }
            localStorage.setItem('image', JSON.stringify(oldImgArray));
            eachFavImgDiv.innerHTML = "";
            if(oldImgArray != null){
            for(let i = 0; i < oldImgArray.length; i++){
                let eachFavImg = document.createElement("image");
                eachFavImg.innerHTML = `<img src="./images/${oldImgArray[i]}">`;
                eachFavImgDiv.appendChild(eachFavImg);
            }
        }               
        }

        //displaying content part
        pokemonDetailsName.innerText = pokemonJson.name;
        pokemonDetailsImage.innerHTML = `<img src="./images/${pokemonJson.imageUrl}">`;
        for(let i = 0; i < pokemonJson.types.length; i++){
        const pokemonDetailsTypesItem = document.createElement("li");
        pokemonDetailsTypesItem.classList.add("types-item");
        pokemonDetailsTypesItem.innerText = pokemonJson.types[i];
        pokemonDetailsTypes.appendChild(pokemonDetailsTypesItem);
        pokemonDetailsDescription.innerHTML = `<span class="smallheading"><strong>Description: </strong></span><span>${pokemonJson.description}</span>`;
        pokemonDetailsDescription.classList.add("types-item");

        //displaying other information part
        pokemonDetailsOtherInfo.classList.add("types-item");
        let otherPokemonInfoJson = await fetchOtherPokemonInfo();
        let newPokemonObj = getNewPokemonResultsByName(pokemonJson.name, otherPokemonInfoJson);
        
        if(newPokemonObj == null){
            for(let i = 0; i < 64; i++){
                let nextPage = await fetch(`${otherPokemonInfoJson.next}`);
                let nextPageJson = await nextPage.json();
                otherPokemonInfoJson = nextPageJson;
                newPokemonObj = getNewPokemonResultsByName(pokemonJson.name, nextPageJson);
                if(newPokemonObj != null){
                    break;
                }
            }
        }
        
        let detailedPokemonInfo = await fetch(`${newPokemonObj.url}`);
        let detailedPokemonInfoJson = await detailedPokemonInfo.json();
        pokemonDetailsOtherInfo.innerHTML = 
        `<ol>
        <li>Base experience: ${detailedPokemonInfoJson.base_experience}</li>
        <li>Height: ${detailedPokemonInfoJson.height}</li>
        <li>Weight: ${detailedPokemonInfoJson.weight}</li>
        <li>Sprites images: </li>
        <ul>
        <li>Back default: </li>
        <img src="${detailedPokemonInfoJson.sprites.back_default}" height="200px">
        <li>Back shiny: </li>
        <img src="${detailedPokemonInfoJson.sprites.back_shiny}" height="200px">
        <li>Front default: </li>
        <img src="${detailedPokemonInfoJson.sprites.front_default}" height="200px">
        <li>Front shiny: </li>
        <img src="${detailedPokemonInfoJson.sprites.front_shiny}" height="200px">
        </ul>
        </ol>`;

        //displaying rightbar
        pokemonTypeName.innerText = pokemonJson.name;

        tableDiv.innerText = "";
        let tableheading = document.createElement("h3");
        tableheading.innerText = pokemonJson.types[i];
        tableDiv.appendChild(tableheading);  

        let typeObjJson = await fetchPokemonTypeByTypeName(pokemonJson.types[i]);
        let table = document.createElement("table");
        tableDiv.appendChild(table);
        let tableHead = document.createElement("thead");
        tableHead.innerHTML = "<thead><tr><th>Type</th><th>Effectiveness</tr></thead>";
        table.appendChild(tableHead);
        let tableBody = document.createElement("tbody");
        tableBody.innerHTML = `<tbody>
        <tr class="evenline"><td>fire</td><td>${typeObjJson.data[0].effectiveness}</td></tr>
        <tr><td>water</td><td>${typeObjJson.data[1].effectiveness}</td></tr>
        <tr class="evenline"><td>grass</td><td>${typeObjJson.data[2].effectiveness}</td></tr>
        <tr><td>electric</td><td>${typeObjJson.data[3].effectiveness}</td></tr>
        <tr class="evenline"><td>ice</td><td>${typeObjJson.data[4].effectiveness}</td></tr>
        </tbody>`;
        table.appendChild(tableBody);
        }
    }
    
    function containsName(array, newValue){
        if(array != null){
        for(let i = 0; i < array.length; i++){
            if(array[i] === newValue){
                return true;
            }
        }}
        return false;
    }
});
