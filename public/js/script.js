const formLookup = document.querySelector('#lookup');
formLookup.addEventListener('submit', dispatchFormAction);

const newEntry = document.querySelector('#new-entry');
newEntry.addEventListener('submit', submitNewEntry);

// Dispatches appropriate function based on what the user selected from
// drop-down menu
function dispatchFormAction(event) {
    event.preventDefault();
    // Hide all stuff from previous interactions
    const notFound = document.querySelector('#notFound');
    const addNewInstead = document.querySelector('#addNewInstead');
    addNewInstead.classList.add('hidden');
    notFound.classList.add('hidden');
    newEntry.classList.add('hidden');
    // Find out what option was selected from drop-down box
    const action = document.querySelector("#action");
    const i = action.selectedIndex;
    // Switch to appropriate function
    switch(action.options[i].text) {
        case 'Lookup':
            onLookup();
            break;
        case 'Add':
            // If a definition doesn't already exist, allow user to
            // add one
            if (!onLookup()) {
                newEntry.classList.remove('hidden');
            }
            break;
        case 'Delete':
            break;
        case 'Update':
            // If word doesn't exist, let the user know they will be adding a new entry
            // rather than updating an old one.
            if (onLookup()) {
                const addNewInstead = document.querySelector('#addNewInstead');
                addNewInstead.classList.remove('hidden');
            }
            // Allow user to add a defintion. Will overwrite existing definition.
            newEntry.classList.remove('hidden');
            break;
        default:
            break;
    }
}

// Fetches a definition for a given word.
async function onLookup() {
    const text = document.querySelector('#query-input-word');
    const word = encodeURIComponent(text.value.trim());
    const response = await fetch(word);
    const json = await response.json();
    // Check the response from the server
    if (json !== null) {
        if (json.def !== null) {
            // Valid definition received, so alter the webpage to display it
            const def = document.querySelector('#def');
            def.classList.remove('hidden');
            const definition = def.querySelector('#definition');
            definition.innerHTML =  json ? json.def : '';
            return true;
        } 
    } else {
        // No valid definition received. Show error message that no definition exists
        const def = document.querySelector('#def');
        def.classList.add('hidden');
        const notFound = document.querySelector('#notFound');
        notFound.classList.remove('hidden');
        return false;
    }
}

// Submits a definition for a given word.
async function submitNewEntry(event) {
    event.preventDefault();
    const textDef = document.querySelector('#query-input-def');
    const def = textDef.value.trim();
    const textWord = document.querySelector('#query-input-word');
    const word = textWord.value.trim();
    const msg = {
        word: word,
        definition: def
    }
    const fetchOptions = {
        method: 'POST',
        header: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(msg)
    };
  
    const response = await fetch(word, fetchOptions); 
    const json = await response.json();
    // Check response from server
    if (json !== null) {
        // Definition successfully added to database. Alter UI so that
        // only the word and definition are displayed (same as if a simple
        // lookup succeeded).
        newEntry.classList.add('hidden');
        formLookup.classList.remove('hidden');
        const text = document.querySelector('#query-input-word');
        text.textContent = word;
        const notFound = document.querySelector('#notFound');
        notFound.classList.add('hidden');
        const definition = document.querySelector('#def');
        definition.classList.remove('hidden');
        definition.querySelector('#definition').innerHTML = json ? json.def : '';
    }
}