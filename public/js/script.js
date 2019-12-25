const form = document.querySelector('form');
form.addEventListener('submit', submitLookup);

async function submitLookup(event) {
    event.preventDefault();
    const text = document.querySelector('#query-input');
    const word = text.value.trim();
    const response = await fetch(word);
    if (response.status >= 400) {
        console.log(response.statusText);
    }
}
