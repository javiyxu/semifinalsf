const BASE = "http://localhost:3000/api"; // <-- change to your backend URL

// DOM elements
const submit = document.querySelector("#add");
const update = document.querySelector("#update");
const content = document.querySelector("#tableBody");

// Load agendas on page load
window.addEventListener('load', getAgendas);

// ADD agenda
submit.addEventListener('click', () => {
    const agenda_title = document.querySelector("#agenda_title").value;
    const assigned_to = document.querySelector("#assigned_to").value;
    const priority = document.querySelector("#priority").value;
    const status = document.querySelector("#status").value;
    const due_date = document.querySelector("#due_date").value;

    fetch(`${BASE}/agendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agenda_title, assigned_to, priority, status, due_date })
    })
    .then(res => res.json())
    .then(() => { 
        alert("Agenda Added"); 
        clearForm(); 
        getAgendas(); 
    })
    .catch(err => console.log(err));
});

// GET agendas
function getAgendas() {
    fetch(`${BASE}/agendas`)
    .then(res => res.json())
    .then(data => {
        content.innerHTML = data.map(a => `
            <tr>
                <td>${a.id}</td>
                <td>${a.agenda_title}</td>
                <td>${a.assigned_to}</td>
                <td>${a.priority}</td>
                <td>${a.status}</td>
                <td>${a.due_date}</td>
                <td>
                    <a onclick="editAgenda(${a.id})">Edit</a>
                    <a onclick="deleteAgenda(${a.id})">Delete</a>
                </td>
            </tr>
        `).join('');
    })
    .catch(err => console.log(err));
}

// EDIT agenda
function editAgenda(id) {
    fetch(`${BASE}/agendas/${id}`)
    .then(res => res.json())
    .then(a => {
        document.querySelector("#agenda_title").value = a.agenda_title;
        document.querySelector("#assigned_to").value = a.assigned_to;
        document.querySelector("#priority").value = a.priority;
        document.querySelector("#status").value = a.status;
        document.querySelector("#due_date").value = a.due_date;
        document.querySelector("#ID").value = a.id;

        submit.style.display = 'none';
        update.style.display = 'inline-block';
    });
}

// UPDATE agenda
update.addEventListener('click', () => {
    const id = document.querySelector("#ID").value;
    const agenda_title = document.querySelector("#agenda_title").value;
    const assigned_to = document.querySelector("#assigned_to").value;
    const priority = document.querySelector("#priority").value;
    const status = document.querySelector("#status").value;
    const due_date = document.querySelector("#due_date").value;

    fetch(`${BASE}/agendas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agenda_title, assigned_to, priority, status, due_date })
    })
    .then(res => res.json())
    .then(() => {
        alert("Agenda Updated");
        clearForm();
        getAgendas();
        submit.style.display='inline-block';
        update.style.display='none';
    })
    .catch(err => console.log(err));
});

// DELETE agenda
function deleteAgenda(id) {
    if(!confirm("Are you sure you want to delete this agenda?")) return;

    fetch(`${BASE}/agendas/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => { 
        alert("Agenda Deleted"); 
        getAgendas(); 
    })
    .catch(err => console.log(err));
}

// CLEAR form
function clearForm() {
    document.querySelector("#agenda_title").value = '';
    document.querySelector("#assigned_to").value = '';
    document.querySelector("#priority").value = 'Medium';
    document.querySelector("#status").value = 'Pending';
    document.querySelector("#due_date").value = '';
    document.querySelector("#ID").value = '';
}
