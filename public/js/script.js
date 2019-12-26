const formLookup = document.querySelector('#lookup');
formLookup.addEventListener('submit', submitLookup);

const newEntry = document.querySelector('#new-entry');
newEntry.addEventListener('submit', submitNewEntry);

async function submitLookup(event) {
    event.preventDefault();
    const text = document.querySelector('#query-input-word');
    const word = encodeURIComponent(text.value.trim());
    const response = await fetch(word);
    const json = await response.json();
    if (json !== null) {
        if (json.def !== null) {
            console.log(json.def);
            const def = document.querySelector('#def');
            def.classList.remove('hidden');
            const definition = def.querySelector('#definition');
            definition.innerHTML = json.def;
        } 
    } else {
        formLookup.classList.add('hidden');
        const def = document.querySelector('#def');
        def.classList.add('hidden');      
        newEntry.classList.remove('hidden');
    }
}

async function submitNewEntry(event) {
    event.preventDefault();
    const textDef = document.querySelector('#query-input-def');
    const def = encodeURIComponent(textDef.value.trim());
    const textWord = document.querySelector('#query-input-word');
    const word = encodeURIComponent(textWord.value.trim());
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
    if (json.OK) {
        newEntry.classList.add('hidden');
        formLookup.classList.remove('hidden');
        const text = document.querySelector('#query-input-word');
        text.textContent = word;
        const definition = document.querySelector('#def');
        definition.classList.remove('hidden');
        definition.querySelector('#definition').innerHTML = def;
    }

}