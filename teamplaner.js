//Teamplner
async function get_images_teamplaner() {
    let unique_champs = [];

    try {
        const response = await fetch('champs_py_pool.json');
        const data = await response.json();
        unique_champs = data.map(champ => ({
            name: champ.name,
            tier: champ.tier
        }));
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Daten:', error);
    }

    return unique_champs;
}

function groupByTier(champs) {
    const grouped = [];

    for (let champ of champs) {
        const tier = champ.tier;

        // Stelle sicher, dass es eine Liste für dieses Tier gibt
        if (!grouped[tier - 1]) {
            grouped[tier - 1] = [];
        }

        grouped[tier - 1].push(champ);
    }

    return grouped;
}

let teamplaner = new Array(10).fill(null);

let champs = [];

let tier_colors = {
    1: "white",
    2: "green",
    3: "blue",
    4: "purple",
    5: "gold",
}
window.onload = async function () {
    champs = await get_images_teamplaner();
    champs = groupByTier(champs);
    const cost_table_images = document.querySelectorAll('.cost_table');
    cost_table_images.forEach((slot, index) => {
    
        let cost_list = champs[index];
        for (let champ of cost_list) {
            const imgElement = document.createElement("img");
            imgElement.src = "downloaded_images/" + champ.name + ".png";  // Bild ändern
            imgElement.style.border = `2px solid ${tier_colors[index + 1]}`
            imgElement.style.width = "100px";  // Setze hier eine gewünschte Breite
            imgElement.style.height = "auto";
            imgElement.id = `${champ.name}_${index}`
            imgElement.classList.add("teamplan_img");
            imgElement.addEventListener('click', function() {
                const imgID = imgElement.id;      // ID des Bildes
                add_to_teamplaner(imgID);
            });
            slot.appendChild(imgElement);
        }    
    });
};

function add_to_teamplaner(imgID) {
    const champName = imgID.split('_')[0];
    const champindex = parseInt(imgID.split('_')[1] , 10) + 1;  // Korrigiert die Berechnung der Index
    const champ = [champName, champindex];

    // Überprüfen, ob der Champion bereits im Teamplaner ist
    const isInTeamplaner = teamplaner.some(champInPlaner => champInPlaner && champInPlaner[0] === champName && champInPlaner[1] === champindex);

    if (isInTeamplaner) {
        console.log(`${champName} is already in the teamplaner!`);
    } else {
        if (teamplaner.includes(null)) {
            let index_of_first_null = teamplaner.indexOf(null);
            teamplaner[index_of_first_null] = champ;
            console.log(`${champName} added to teamplaner!`);
        } else {
            console.log('Teamplaner is full!');
        }
    }
    
    update_teamplaner();
}


function update_teamplaner(){
    const teamplanerSlots = document.querySelectorAll('.teamplaner_slots');
    teamplanerSlots.forEach((slot, index) => {
        let champ = teamplaner[index];
        const img = slot.querySelector('img');
        if (img){
            slot.removeChild(img);
        }
        if (champ) {
            let name = champ[0];
            let cost = champ[1];
            if (champ) {
                let imgElement = document.createElement("img");
                imgElement.src = "downloaded_images/" + name + ".png"; 
                imgElement.style.border = `10px solid ${tier_colors[cost]}`;
                imgElement.style.width = "100px";  // Setze hier eine gewünschte Breite
                imgElement.style.height = "auto";
                imgElement.id = `${name}_${index}`
                imgElement.addEventListener('click', function() {
                    const imgID = imgElement.id;      // ID des Bildes
                    remove_from_teamplaner(imgID);
                });
                slot.appendChild(imgElement);
            } else {
                slot.removeChild(img);
            }
        }
        
    });
}

function remove_from_teamplaner(imgID){
    const champindex = imgID.split('_')[1];
    teamplaner[champindex] = null;
    update_teamplaner();
}

