const form = document.querySelector('form');
form.addEventListener('submit', submitLookup);

async function submitLookup(event) {
    event.preventDefault();
    const text = document.querySelector('#query-input');
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
        console.log('here');
    }

}
