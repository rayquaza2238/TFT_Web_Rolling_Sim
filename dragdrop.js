function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    const index = ev.target.dataset.index; // Hole den index aus dem data-index Attribut
    const data = {
        id: ev.target.id,
        index: index
    }; 
    ev.dataTransfer.setData("text", JSON.stringify(data)); // Speichern der ID und des Index als JSON-String
}




function drop(ev) {
    ev.preventDefault();
    const draggedElementData = ev.dataTransfer.getData('text');
    const parsedData = JSON.parse(draggedElementData);  // Parse den JSON-String
    //const draggedElementId = ev.dataTransfer.getData('text');
    //const draggedElement = document.getElementById(draggedElementId);
    //const target = ev.target;
    const draggedElement = document.getElementById(parsedData.id);
    const index = parsedData.index;
    const target = ev.target;  // Das Ziel, auf das das Element abgelegt wurde
    const target_index = target.dataset.index; // Zugriff auf das data-index Attribut
    //console.log("target:", target);
    //console.log("Target_index:", target_index);
    //console.log("Index:", index);
    //console.log("draggedElement", draggedElement);
    if (draggedElement.classList.contains("bank_img")) {
        if (target.classList.contains("bank_slot")) {
            //from bank to empty bank slot
            bank.slots[target_index] = bank.slots[index];
            bank.slots[index] = null;
            console.log("bank to empty bank");
        } else if (target.classList.contains("bank_img")) {
            //from bank bank slot with unit -> swap
            let unit = bank.slots[target_index];
            bank.slots[target_index] = bank.slots[index];
            bank.slots[index] = unit;
            console.log("bank to bank with unit");
        } else if (target.classList.contains("cell")) {
            //from bank to empty field spot
            let field_length = field.slots.filter(el => el !== null).length;
            if (field_length >= game.level){
                console.log("Level Capped reached!");
            } else {
                field.slots[target_index] = bank.slots[index];
                bank.slots[index] = null;
                console.log("bank to empty field");
            }
            
        } else if (target.classList.contains("field_img")) {
            //from bank to field with unit -> swap
            let unit = field.slots[target_index];
            field.slots[target_index] = bank.slots[index];
            bank.slots[index] = unit;
            console.log("bank to field with unit");
        } else if(target.classList.contains("shop_img") || target.classList.contains("shop")) {
            //from bank to shop -> sell
            bank.sell_champion(index);
            console.log("bank to shop");
        }
        //console.log(draggedElement);
        draggedElement.remove();
        update_interface();
    } else if(draggedElement.classList.contains("field_img")) {
        if (target.classList.contains("cell")) {
            //from field to empty bank slot
            field.slots[target_index] = field.slots[index];
            field.slots[index] = null;
            console.log("field to empty field");
        } else if (target.classList.contains("field_img")) {
            //from field field slot with unit -> swap
            let unit = field.slots[target_index];
            field.slots[target_index] = field.slots[index];
            field.slots[index] = unit;
            console.log("field to field with unit");
        } else if (target.classList.contains("bank_slot")) {
            //from field to empty bank spot
            bank.slots[target_index] = field.slots[index];
            field.slots[index] = null;
            console.log("field to empty bank");
        } else if (target.classList.contains("bank_img")) {
            //from field to bank with unit -> swap
            let unit = bank.slots[target_index];
            bank.slots[target_index] = field.slots[index];
            field.slots[index] = unit;
            console.log("field to bank with unit");
        } else if(target.classList.contains("shop_img") || target.classList.contains("shop")) {
            //from bank to shop -> sell
            field.sell(index);
            console.log("field to shop");
        }
        //console.log(draggedElement);
        draggedElement.remove();
        update_interface();
    } else {
        console.log("No Unit selected!");
    }
    
}

