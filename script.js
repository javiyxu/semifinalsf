// ────────────────────────────────────────────────
// Study / Zoom / Meeting Scheduler: Meetings CRUD
// ────────────────────────────────────────────────

const BASE = "https://semifinalsb.onrender.com/api";

// DOM Elements
const submit = document.querySelector("#add");
const update = document.querySelector("#update");
const content = document.querySelector("#tableBody");

// ─── LOAD DATA ───
window.addEventListener('load', () => {
    getMeetings();
});

// ─── ADD MEETING ───
submit.addEventListener('click', () => {
    const meeting_title  = document.querySelector("#meeting_title").value;
    const host           = document.querySelector("#host").value;
    const department     = document.querySelector("#department").value;
    const meeting_type   = document.querySelector("#meeting_type").value;
    const scheduled_date = document.querySelector("#scheduled_date").value;

    const formData = { meeting_title, host, department, meeting_type, scheduled_date };

    fetch(`${BASE}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
        alert("Meeting Added Successfully");
        clearForm();
        getMeetings();
    })
    .catch(err => console.log(err));
});

// ─── GET MEETINGS ───
function getMeetings() {
    let html = "";

    document.querySelector("#tableHead").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Meeting Title</th>
            <th>Host</th>
            <th>Department</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    `;

    fetch(`${BASE}/meetings`)
    .then(res => res.json())
    .then(data => {
        data.forEach(element => {
            html += `
            <tr>
                <td>${element.id}</td>
                <td>${element.meeting_title}</td>
                <td>${element.host}</td>
                <td>${element.department}</td>
                <td>${element.meeting_type}</td>
                <td>${element.scheduled_date}</td>
                <td>
                    <div class="actions">
                        <a href="javascript:void(0)" onclick="editMeeting(${element.id})">Edit</a>
                        <a href="javascript:void(0)" onclick="deleteMeeting(${element.id})">Delete</a>
                    </div>
                </td>
            </tr>`;
        });

        content.innerHTML = html;
    })
    .catch(err => console.log(err));
}

// ─── DELETE MEETING ───
function deleteMeeting(id) {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    fetch(`${BASE}/meetings/${id}`, { method: "DELETE" })
    .then(res => res.text())
    .then(() => {
        alert("Meeting Deleted Successfully");
        getMeetings();
    })
    .catch(err => console.log(err));
}

// ─── EDIT MEETING ───
function editMeeting(id) {
    fetch(`${BASE}/meetings/${id}`)
    .then(res => res.json())
    .then(data => {
        document.querySelector("#meeting_title").value  = data[0].meeting_title;
        document.querySelector("#host").value           = data[0].host;
        document.querySelector("#department").value     = data[0].department;
        document.querySelector("#meeting_type").value   = data[0].meeting_type;
        document.querySelector("#scheduled_date").value = data[0].scheduled_date;
        document.querySelector("#ID").value             = data[0].id;

        // Show update button
        submit.style.display = "none";
        update.style.display = "inline-block";
    })
    .catch(err => console.log(err));
}

// ─── UPDATE MEETING ───
update.addEventListener('click', () => {
    const id             = document.querySelector("#ID").value;
    const meeting_title  = document.querySelector("#meeting_title").value;
    const host           = document.querySelector("#host").value;
    const department     = document.querySelector("#department").value;
    const meeting_type   = document.querySelector("#meeting_type").value;
    const scheduled_date = document.querySelector("#scheduled_date").value;

    const formData = { meeting_title, host, department, meeting_type, scheduled_date };

    fetch(`${BASE}/meetings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
        alert("Meeting Updated Successfully");
        clearForm();
        getMeetings();

        // Show submit, hide update
        submit.style.display = "inline-block";
        update.style.display = "none";
    })
    .catch(err => console.log(err));
});

// ─── HELPER: CLEAR FORM ───
function clearForm() {
    document.querySelector("#meeting_title").value  = "";
    document.querySelector("#host").value           = "";
    document.querySelector("#department").value     = "";
    document.querySelector("#meeting_type").value   = "";
    document.querySelector("#scheduled_date").value = "";
    document.querySelector("#ID").value             = "";
}