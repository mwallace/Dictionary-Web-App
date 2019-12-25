const form = document.querySelector('form');
form.addEventListener('submit', submitLookup);

async function submitLookup(event) {
    event.preventDefault();
    const text = document.querySelector('#query-input');
    const word = encodeURIComponent(text.value.trim());
    const response = await fetch(word);
    const json = await response.json();
    console.log(json);
}
