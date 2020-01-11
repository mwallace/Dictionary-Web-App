const formLookup = document.querySelector('#lookup');
formLookup.addEventListener('submit', dispatchFormAction);

const newEntry = document.querySelector('#new-entry');
newEntry.addEventListener('submit', submitNewEntry);

// Dispatches appropriate function based on what the user selected from
// drop-down menu
function dispatchFormAction(event) {
    event.preventDefault();
    // Enforce hiding of not found error message
    const notFound = document.querySelector('#notFound');
    notFound.classList.add('hidden');
    // Find out what option was selected from drop-down box
    const action = document.querySelector("#action");
    const i = action.selectedIndex;
    // Switch to appropriate function
    switch(action.options[i].text) {
        case 'Lookup':
            onLookup();
            break;
        case 'Add':
            break;
        case 'Delete':
            break;
        case 'Update':
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
            console.log(json.def);
            const def = document.querySelector('#def');
            def.classList.remove('hidden');
            const definition = def.querySelector('#definition');
            definition.innerHTML =  json ? json.def : '';
        } 
    } else {
        // No valid definition received. Show error message that no definition exists
        const def = document.querySelector('#def');
        def.classList.add('hidden');
        const notFound = document.querySelector('#notFound');
        notFound.classList.remove('hidden');
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