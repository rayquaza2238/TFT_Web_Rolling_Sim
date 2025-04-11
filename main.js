let game;
let shop;
let bank;
let field;
let trait_tier_info = {"Anima Squad": [3, 5, 7, 10], 
    "BoomBots": [2,4,6], 
    "Cyberboss": [2,3,4], 
    "Cypher":[3,4,5], 
    "Divinicorp":[1,2,3,4,5,7], 
    "Exotech":[3,5,7,10], 
    "God of the Net":[1], 
    "Golden Ox":[2,4,6], 
    "Nitro": [3,4], 
    "Overlord": [1], 
    "Soul Killer": [1], 
    "Street Demon": [3,5,7,10], 
    "Syndicate": [3,5,7], 
    "Virus": [1], 
    "A.M.P.": [2,3,4,5], 
    "Bastion": [2,4,6], 
    "Bruiser": [2,4,6], 
    "Dynamo": [2,3,4], 
    "Executioner": [2,3,4,5], 
    "Marksman": [2,4], 
    "Rapidfire": [2,4,6], 
    "Slayer": [2,4,6], 
    "Strategist": [2,3,4,5], 
    "Techie": [2,4,6,8], 
    "Vanguard": [2,4,6]}

    //bis 1-3 = bronce
    //bis 4-5 = silver
    //bis 6-8 = gold
    //10 = platin

function get_label_tier_color(trait, trait_count){
    //length of trait to determine max tier
    let trait_tiers = trait_tier_info[trait];
    let trait_length = Object.keys(trait_tiers).length;
    if (trait_length <= 1) {
        //5_cost_trait
        return "rgba(133, 128, 128, 0.45)";
    } else if(trait_length == 2){
        //bronce or gold
        if (trait_count <= trait_tiers[0]) {
            return "rgba(153, 51, 0, 1)";
        } else {
            return "rgba(255, 255, 0, 1)";
        }
    } else if(trait_length == 3) {
        //bronce, silver or gold
        if (trait_count < trait_tiers[0]) {
            return "rgba(133, 128, 128, 0.45)";  
        } else if(trait_count < trait_tiers[1]) {
            return "rgba(153, 51, 0, 1)";
        } else if(trait_count < trait_tiers[2]){
            return "rgba(217, 217, 217, 1)";
        } else {
            return "rgba(255, 255, 0, 1)";
        }
    } else if(trait_length == 4) {
        if (trait_count < trait_tiers[0]) {
            return "rgba(133, 128, 128, 0.45)";
        }else if(trait_count < trait_tiers[1]) {
            return "rgb(153, 51, 0)";
        } else if(trait_count < trait_tiers[2]){
            return "rgba(217, 217, 217, 1)";
        } else if(trait_count < trait_tiers[3]) {
            return "rgba(255, 255, 0, 1)";
        } else {
            return "rgba(153, 255, 153, 1)";
        }
    } else if(trait_length >= 5) {
        if (trait_count == 1) {
            return "rgba(153, 51, 0, 1)";
        } else if(trait_count < 5) {
            return "rgba(217, 217, 217, 1)";
        } else{
            return "rgba(255, 255, 0, 1)";
        }
    }
}


function start_game() {
    const gold = parseInt(document.getElementById("goldSlider").value);
    document.getElementById("goldValue").textContent = gold;
    const level = parseInt(document.getElementById("levelSlider").value);
    document.getElementById("levelValue").textContent = level;
    const stage = 3;
    const champion_pool = [];
    //Championpool erstellen
    fetch('champs_py_pool.json')
        .then(response => response.json())
        .then(data => {
            const poolSizes = [30, 25, 18, 10, 9];
            const champions = data.map(entry => new Champion(entry.name, entry.cost, entry.traits, entry.tier));
            const championPoolMultiplicator = champions.map(champ => poolSizes[champ.cost - 1]);
            
            champions.forEach((champ, index) => {
                const size = championPoolMultiplicator[index];
                for (let i = 0; i < size; i++) {
                    champion_pool.push(new Champion(champ.name, champ.cost, champ.traits, champ.tier));
                }
            });
        })
        .catch(error => console.error('Fehler beim Laden der JSON-Daten:', error));
    let three_stared_list = [];
    game = new Game(gold, level, stage, champion_pool, three_stared_list);
    field = new Field(game,);
    bank = new Bank(game, field);
    shop = new Shop(game, bank, field, );
    field.setBank(bank);
    
    document.getElementById("mainMenu").style.display = "none";
    const gameUI = document.getElementById("gameUI");
    gameUI.style.display = "block";
    const sound = document.getElementById("bg_sound");
    sound.loop = true;  
    sound.play(); // Spielt den Sound ab
    updateGoldDisplay();

}

// Funktion, um den Sound abzuspielen
function playSound(input_sound) {
    if (input_sound.paused) {
        input_sound.currentTime = 0;  // Setzt den Sound zurück, wenn er schon läuft
        input_sound.play();
    }
  }
  

const levelSlider = document.getElementById("levelSlider");
  const levelValue = document.getElementById("levelValue");

  levelSlider.addEventListener("input", () => {
    levelValue.textContent = levelSlider.value;
  });

  const goldSlider = document.getElementById("goldSlider");
  const goldValue = document.getElementById("goldValue");

  goldSlider.addEventListener("input", () => {
    goldValue.textContent = goldSlider.value;
  });

// Checkbox Zugriff
const checkbox = document.getElementById("activateOption");
checkbox.addEventListener("change", () => {
if (checkbox.checked) {
    console.log("Checkbox ist aktiviert");
} else {
    console.log("Checkbox ist deaktiviert");
}
});


function update_interface() {
    if (!shop || !bank) return;
    updateGoldDisplay();
    update_shop_slots();
    
    updateField();
    updateBank();
    update_trait_labels();
}

function check_if_in_planer(champ) {
    let name = champ.name;
    let cost = champ.cost;

    let foundChamp = teamplaner.find(champInPlaner => {
        // Logge den aktuellen champInPlaner aus
        
        // Überprüfe, ob champInPlaner nicht null oder undefined ist
        if (champInPlaner) {
            
            // Logge die beiden Werte, die du vergleichen willst
            // Vergleiche den Namen und den Cost
            let isMatch = champInPlaner[0] === name && champInPlaner[1] === cost;
            
            return isMatch; // Rückgabe des Vergleichs
        } 
    });
    return foundChamp !== undefined;  // Wenn ein Champion gefunden wurde, gibt es true zurück
}

function update_shop_slots(){
    const shopSlots = document.querySelectorAll('.shop_slot');
    
    shopSlots.forEach((slot, index) => {
        
        let champ = shop.slots[index];
        if (champ) {
            //check if in teamplaner
            let check_planer = check_if_in_planer(champ);
            const imgElement = slot.querySelector('.shop_img');
            imgElement.src = "downloaded_images/" + champ.name + ".png";  // Bild ändern
        
            // Text ändern
            const infoElement = slot.querySelector('.shop_unit_info');
            infoElement.textContent = `${champ.name} - ${champ.cost} 🟡`;
            infoElement.style.fontSize = '16px';
            infoElement.style.color = 'black';
            slot.classList.remove('label-pulse'); 
            
            //TRait
            let trait_text = document.createElement("div");
            trait_text.id = "trait_text";
            trait_text.dataset.index = index;
            trait_text.classList.add("trait_text");
            trait_text.style.pointerEvents = 'none';
            trait_text.style.display= "grid";
            let champ_traits = champ.traits;
            let trait_count = Object.keys(champ_traits).length;
            trait_text.style.gridTemplateRows = `repeat(${trait_count}, 1fr)`;
            for (trait of champ_traits) {
                let text_for_label = document.createElement("label");
                text_for_label.textContent = trait;
                trait_text.style.position = "absolute";
                text_for_label.style.color = "white"; 
                text_for_label.style.fontSize = "12px"; 
                text_for_label.style.top = '100px';
                text_for_label.style.left = '100px';
                text_for_label.style.backgroundColor = "rgba(71, 68, 68, 0.5)";
                trait_text.appendChild(text_for_label);
            }
            // Hintergrundfarbe ändern
            slot.style.backgroundColor = champ.tier_colors[champ.cost];
            if(check_planer){
                slot.classList.add('label-pulse');
            }
            slot.appendChild(trait_text);

        } else {
            // Wenn champ null ist, setze Standardwerte
            const imgElement = slot.querySelector('.shop_img');
            imgElement.removeAttribute('src');  // Bildquelle entfernen (Bild bleibt leer)
            const infoElement = slot.querySelector('.shop_unit_info');
            infoElement.textContent = "";  // Kein Text

            slot.style.backgroundColor = "darkblue";  // Dunkelblau als Hintergrundfarbe
            const trait_text = document.querySelector('.trait_text');
            if (trait_text) {
                trait_text.remove();
            }
        }
    });
}

function updateGoldDisplay() {
    // Gold im goldAmount Span aktualisieren
    document.getElementById("goldAmount").innerText = game.gold;
}

function updateField() {
    const fieldSlots = document.querySelectorAll('.cell');
    fieldSlots.forEach((slot, index) => {
        let champ = field.slots[index];
        const imgElement = slot.querySelector('.field_img'); // Hole das Bild im Slot (falls vorhanden)
        const level_label = slot.querySelector('.level-label');
        if(level_label){
            level_label.remove();
        }
        if (champ) {
            const levelLabel = document.createElement('label');
            levelLabel.textContent =`${champ.star_level}⭐`;
            levelLabel.classList.add("level-label");
            levelLabel.style.fontWeight = 'bold';
            levelLabel.style.pointerEvents = 'none';
            levelLabel.style.position = 'absolute';
            levelLabel.style.top = '1px';
            levelLabel.style.left = '20px';
            levelLabel.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            levelLabel.style.color = 'black';
            slot.appendChild(levelLabel); 
            // Bild ändern oder erstellen, wenn es nicht existiert
            if (!imgElement) {
                // Falls noch kein Bild existiert, erstellen
                const newImg = document.createElement('img');
                newImg.classList.add('field_img');
                newImg.style.width = "4vw";
                newImg.style.height = "5vh";
                newImg.style.objectFit = 'cover';
                newImg.style.objectPosition = 'center';
                newImg.draggable = "true";
                newImg.ondragstart = "drag(event)"; // Dragstart Ereignis
                newImg.id = `field_img_${index}`; // Setze eine dynamische ID basierend auf dem Index
                newImg.dataset.index = index;
                newImg.src = `downloaded_images/${champ.name}.png`; // Bildquelle
                slot.appendChild(newImg);
            }
            
            else {
                // Bild existiert, nur die Quelle ändern
                imgElement.src = `downloaded_images/${champ.name}.png`;

            }
            
        } else {
            
            // Kein Champion, Bild entfernen
            if (imgElement) {
                imgElement.removeAttribute('src'); // Bildquelle entfernen (Bild bleibt leer)
            }
        }
    });
}

function updateBank() {
    const bankSlots = document.querySelectorAll('.bank_slot');
    bankSlots.forEach((slot, index) => {
        let champ = bank.slots[index];
        const imgElement = slot.querySelector('.bank_img'); // Hole das Bild im Slot (falls vorhanden)
        const level_label = slot.querySelector('.level-label');
        if(level_label){
            level_label.remove();
        }
        if (champ) {
            const levelLabel = document.createElement('label');
            levelLabel.textContent =`${champ.star_level}⭐`;
            levelLabel.dataset.index = index
            levelLabel.classList.add("level-label");
            levelLabel.style.fontWeight = 'bold';
            levelLabel.style.pointerEvents = 'none';
            levelLabel.style.position = 'absolute';
            levelLabel.style.top = '1px';
            levelLabel.style.left = '20px';
            levelLabel.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            levelLabel.style.color = 'black';
            levelLabel.style.zIndex = '999';
            slot.appendChild(levelLabel); 
            // Bild ändern oder erstellen, wenn es nicht existiert
            if (!imgElement) {
                // Falls noch kein Bild existiert, erstellen
                const newImg = document.createElement('img');
                newImg.classList.add('bank_img');
                newImg.style.maxWidth = '100%';
                newImg.style.maxHeight = '100%';
                newImg.style.objectFit = 'contain';
                newImg.draggable = "true";
                newImg.ondragstart = "drag(event)"; // Dragstart Ereignis
                newImg.id = `bank_img_${index}`; // Setze eine dynamische ID basierend auf dem Index
                newImg.dataset.index = index;
                newImg.src = `downloaded_images/${champ.name}.png`; // Bildquelle
                slot.appendChild(newImg);
                
            } else {
                // Bild existiert, nur die Quelle ändern
                imgElement.src = `downloaded_images/${champ.name}.png`;
            }
        } else {
            // Kein Champion, Bild entfernen
            if (imgElement) {
                imgElement.removeAttribute('src'); // Bildquelle entfernen (Bild bleibt leer)
            }
        }
    });
}



// Eventlisterer für Shop
document.getElementById("startGameButton").addEventListener('click', start_game);

document.getElementById("rerollButton").addEventListener('click', function() {
    let new_shop = shop.reroll_shop();
    const input_sound = document.getElementById("reroll_sound");
    const trait_text = document.querySelectorAll('.trait_text');
    trait_text.forEach(el => el.remove());
    input_sound.play(input_sound); // Spielt den Sound ab
    update_interface();
});

const clickableShop = document.querySelectorAll('.shop_slot');     
// Füge jedem div einen Event Listener hinzu
clickableShop.forEach((div, index) => {
    div.addEventListener('click', function() {
        shop.buy_slots(index);
        const sound = document.getElementById("buy_sound");
        sound.play(); // Spielt den Sound ab
        update_interface();
    });
});

function create_labels(traits){
    let trait_labels = document.querySelector('.trait_label');
    const gameUI = document.querySelector('.gameUI');
    if (trait_labels) {
        trait_labels.remove();
    }
    //div erstellen
    let newDiv = document.createElement("div");
    const length = Object.keys(traits).length;
    // Setze Styles für das div
    newDiv.style.position = "fixed";  // Fixiere es auf der Seite
    newDiv.style.left = "2%";  // Am linken Seitenrand
    newDiv.style.top = "25%";  // Vertikale Mitte (optional)
    newDiv.style.transform = "translateY(-50%)";  // Zentriere es vertikal  // Maximale Länge (Breite) des Divs
    newDiv.style.height = `${length * 0.08}vh`;  // Höhe des Divs (optional)
    //newDiv.style.backgroundColor = "blue";  // Hintergrundfarbe (optional)
    newDiv.style.display = "grid";
    newDiv.style.gridTemplateRows = `repeat(${length}, 1fr)`;
    newDiv.classList.add("trait_label");
    for (let key in traits) {
        let count = traits[key];
        let section = document.createElement("div");
        section.style.display = "flex";  // Verwende Flexbox für horizontales Layout
        section.style.flexDirection = "row";  // Mach das Layout vertikal
        section.style.alignItems = "center";  // Zentriere den Inhalt
        //section.style.backgroundColor = `blue`;  // Zufällige Farben für jedes Abschnitt

        //Bild
        let hexDiv = document.createElement("div");
        hexDiv.className = "hexagon";
        let color = get_label_tier_color(count[0], count[1]);
        console.log(color);
        hexDiv.style.backgroundColor = color;
        
        let img = document.createElement("img");
        img.src = "downloaded_origins/" + count[0] + ".png";
        img.alt = count[0];
        
        img.className = "hex-img";
        
        

        hexDiv.appendChild(img);

        let countText = document.createElement("div");
        countText.textContent = `${count[1]}`;
        countText.style.marginBottom = "5px";
        countText.style.backgroundColor = '#cccccc'; // Helleres Grau
        countText.style.fontSize = '14px'; // oder z.B. '1rem' / '16px'
        countText.style.color = '#000000'; // Schwarzer Text für guten Kontrast
        countText.style.padding = '2px 6px'; // Optional: etwas Innenabstand
        countText.style.borderRadius = '4px'; // Optional: leicht abgerundete Ecken
        countText.style.textAlign = 'center'; // Optional: zentrierter Text
        
        //label tier trait
        let trait_info = document.createElement("div");
        trait_info.style.display = "flex";  // Verwende Flexbox für horizontales Layout
        trait_info.style.flexDirection = "column";  // Mach das Layout vertikal
        trait_info.style.alignItems = "center";  // Zentriere den Inhalt
        trait_info.style.backgroundColor = 'grey';  // Zufällige Farben für jedes Abschnitt

        //trait name
        let keyText = document.createElement("div");
        keyText.textContent = `${count[0]}`;
        keyText.style.marginBottom = "5px";
        //trait tiers
        let trait_tiers = trait_tier_info[count[0]];
        let formatted = trait_tiers.join(' > ');
        let text = document.createElement("div");
        text.textContent = formatted;


        section.appendChild(hexDiv);
        section.appendChild(countText);
        trait_info.appendChild(keyText);
        trait_info.appendChild(text);
        section.appendChild(trait_info);

        newDiv.appendChild(section);
    }
    // Füge das div zum Body des Dokuments hinzu
    gameUI.appendChild(newDiv);
}
// Trait Labels
function update_trait_labels(showOtherHalf = false){
    let hasChamp = field.slots.filter(champ => champ !== null).length > 0;
    let tButton = document.querySelector(".toggle_button");
    const gameUI = document.querySelector('.gameUI');
    if (tButton){
        tButton.remove();
    }
    if (hasChamp) {
        let traits = field.get_trait_count();
        const length = Object.keys(traits).length;
        if (length > 10) {
            const secondBatch = traits.slice(10);
            traits = traits.slice(0, 10);
            create_labels(traits);

            // new div for toggle:
            let toggleButton = document.createElement("button");
            toggleButton.textContent = "+";
            toggleButton.style.position = "absolute";
            toggleButton.style.top = "80%";
            toggleButton.style.left = "5%";
            toggleButton.style.transform = "translateX(-50%)";
            toggleButton.style.padding = "10px";
            toggleButton.classList.add("toggle_button");
            
            toggleButton.addEventListener("click", function () {
                if (showOtherHalf) {
                    create_labels(secondBatch);  // Zeige die restlichen Einträge an
                    toggleButton.textContent = "-";  // Button-Text ändern
                } else {
                    create_labels(traits);
                    toggleButton.textContent = "+";  // Button-Text ändern
                }
                showOtherHalf = !showOtherHalf;

            });
            gameUI.appendChild(toggleButton);
        
        } else {
            create_labels(traits);
        }
    }
}



document.getElementById("openTeamplaner").addEventListener("click", () => {
    document.getElementById("teamplaner").style.display = "block";
    document.getElementById("gameUI").style.display = 'none';
});

document.getElementById("close_button").addEventListener("click", () => {
    document.getElementById("teamplaner").style.display = "none";
    document.getElementById("gameUI").style.display = 'block';

});


