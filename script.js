const BASE = "https://semis-backend.onrender.com/api";

const submit = document.querySelector("#add");
const update = document.querySelector("#update");
const content = document.querySelector("#tableBody");

// ─── TAB SWITCHING ───
let currentTab = "meetings";

const titles = {
    meetings:       "Meetings",
    zoom_sessions:  "Zoom Sessions",
    study_sessions: "Study Sessions",
    participants:   "Participants",
    agendas:        "Agendas"
};

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".form-panel").forEach(f => f.classList.remove("active-form"));
        document.querySelector(`.form-panel[data-form="${btn.dataset.tab}"]`).classList.add("active-form");

        currentTab = btn.dataset.tab;

        // Update page title and breadcrumb
        document.getElementById("page-title").textContent      = titles[currentTab];
        document.getElementById("active-tab-name").textContent = titles[currentTab];

        loadData(currentTab);
    });
});

window.addEventListener('load', () => {
    getMeetings();
});

function loadData(tab) {
    if (tab === "meetings")       getMeetings();
    if (tab === "zoom_sessions")  getZoomSessions();
    if (tab === "study_sessions") getStudySessions();
    if (tab === "participants")   getParticipants();
    if (tab === "agendas")        getAgendas();
}

// ═══════════════════════════════════════════
//  TABLE 1: MEETINGS
// ═══════════════════════════════════════════

//POST API
submit.addEventListener('click', () => {
    let meeting_title  = document.querySelector("#meeting_title").value;
    let host           = document.querySelector("#host").value;
    let department     = document.querySelector("#department").value;
    let meeting_type   = document.querySelector("#meeting_type").value;
    let scheduled_date = document.querySelector("#scheduled_date").value;
    let formData = { meeting_title, host, department, meeting_type, scheduled_date };
    fetch(`https://semifinalsb.onrender.com/api${id}/meetings`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Meeting Added Successfully");
    location.reload();
});

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
        </tr>`;

    fetch(`${BASE}/meetings`, { mode: 'cors' })
    .then(response => { return response.json(); })
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
                        <a class="btn-update" href="javascript:void(0)" onClick="editMeeting(${element.id})">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a class="btn-delete" href="javascript:void(0)" onClick="deleteMeeting(${element.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
        });
        content.innerHTML = html;
    })
    .catch(error => { console.log(error); });
}

//DELETE
function deleteMeeting(id) {
    if (confirm("Are you sure you want to delete this meeting?")) {
        fetch(`https://semifinalsb.onrender.com/api${id}/meetings`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
        }).then(response => response.text())
        .then(response => {
            console.log(response);
            location.reload();
        })
        .catch(error => { console.log(error); });
    } else {
        alert("You Canceled!");
    }
}

//search
function editMeeting(id) {
    fetch(`${BASE}/meetings/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#meeting_title").value  = data[0].meeting_title;
        document.querySelector("#host").value           = data[0].host;
        document.querySelector("#department").value     = data[0].department;
        document.querySelector("#meeting_type").value   = data[0].meeting_type;
        document.querySelector("#scheduled_date").value = data[0].scheduled_date;
        document.querySelector("#ID").value             = data[0].id;
    }).catch(error => { console.log(error); });
}

//PUT
update.addEventListener('click', () => {
    let meeting_title  = document.querySelector("#meeting_title").value;
    let host           = document.querySelector("#host").value;
    let department     = document.querySelector("#department").value;
    let meeting_type   = document.querySelector("#meeting_type").value;
    let scheduled_date = document.querySelector("#scheduled_date").value;
    let id             = document.querySelector("#ID").value;
    let formData = { meeting_title, host, department, meeting_type, scheduled_date, id };
    fetch(`https://semifinalsb.onrender.com/api${id}/meetings`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Meeting Updated Successfully");
    location.reload();
});

// ═══════════════════════════════════════════
//  TABLE 2: ZOOM SESSIONS
// ═══════════════════════════════════════════

document.querySelector(`.form-panel[data-form="zoom_sessions"] .btn-add`).addEventListener('click', () => {
    let session_title = document.querySelector("#session_title").value;
    let organizer     = document.querySelector("#organizer").value;
    let zoom_link     = document.querySelector("#zoom_link").value;
    let platform      = document.querySelector("#platform").value;
    let session_date  = document.querySelector("#session_date").value;
    let formData = { session_title, organizer, zoom_link, platform, session_date };
    fetch(`https://semifinalsb.onrender.com/api/zoom-sessions`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Zoom Session Added Successfully");
    location.reload();
});

function getZoomSessions() {
    let html = "";
    document.querySelector("#tableHead").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Session Title</th>
            <th>Organizer</th>
            <th>Link</th>
            <th>Platform</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>`;

    fetch(`https://semifinalsb.onrender.com/api/zoom-sessions`, { mode: 'cors' })
    .then(response => { return response.json(); })
    .then(data => {
        data.forEach(element => {
            html += `
            <tr>
                <td>${element.id}</td>
                <td>${element.session_title}</td>
                <td>${element.organizer}</td>
                <td><a href="${element.zoom_link}" target="_blank">${element.zoom_link}</a></td>
                <td>${element.platform}</td>
                <td>${element.session_date}</td>
                <td>
                    <div class="actions">
                        <a class="btn-update" href="javascript:void(0)" onClick="editZoomSession(${element.id})">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a class="btn-delete" href="javascript:void(0)" onClick="deleteZoomSession(${element.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
        });
        content.innerHTML = html;
    })
    .catch(error => { console.log(error); });
}

function deleteZoomSession(id) {
    if (confirm("Are you sure you want to delete this zoom session?")) {
        fetch(`https://semifinalsb.onrender.com/api/zoom-sessions/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" },
        }).then(response => response.text())
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
    } else {
        alert("You Canceled!");
    }
}

function editZoomSession(id) {
    fetch(`https://semifinalsb.onrender.com/api/zoom-sessions/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#session_title").value = data[0].session_title;
        document.querySelector("#organizer").value     = data[0].organizer;
        document.querySelector("#zoom_link").value     = data[0].zoom_link;
        document.querySelector("#platform").value      = data[0].platform;
        document.querySelector("#session_date").value  = data[0].session_date;
        document.querySelector(`.form-panel[data-form="zoom_sessions"] .hidden-id`).value = data[0].id;
    }).catch(error => { console.log(error); });
}

document.querySelector(`.form-panel[data-form="zoom_sessions"] .btn-update`).addEventListener('click', () => {
    let session_title = document.querySelector("#session_title").value;
    let organizer     = document.querySelector("#organizer").value;
    let zoom_link     = document.querySelector("#zoom_link").value;
    let platform      = document.querySelector("#platform").value;
    let session_date  = document.querySelector("#session_date").value;
    let id            = document.querySelector(`.form-panel[data-form="zoom_sessions"] .hidden-id`).value;
    let formData = { session_title, organizer, zoom_link, platform, session_date, id };
    fetch(`https://semifinalsb.onrender.com/api/zoom-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Zoom Session Updated Successfully");
    location.reload();
});

// ═══════════════════════════════════════════
//  TABLE 3: STUDY SESSIONS
// ═══════════════════════════════════════════

document.querySelector(`.form-panel[data-form="study_sessions"] .btn-add`).addEventListener('click', () => {
    let subject      = document.querySelector("#subject").value;
    let facilitator  = document.querySelector("#facilitator").value;
    let topic        = document.querySelector("#topic").value;
    let study_mode   = document.querySelector("#study_mode").value;
    let session_date = document.querySelector("#study_date").value;
    let formData = { subject, facilitator, topic, study_mode, session_date };
    fetch(`https://semifinalsb.onrender.com/api/study-sessions`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Study Session Added Successfully");
    location.reload();
});

function getStudySessions() {
    let html = "";
    document.querySelector("#tableHead").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Facilitator</th>
            <th>Topic</th>
            <th>Mode</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>`;

    fetch(`https://semifinalsb.onrender.com/api/study-sessions`, { mode: 'cors' })
    .then(response => { return response.json(); })
    .then(data => {
        data.forEach(element => {
            html += `
            <tr>
                <td>${element.id}</td>
                <td>${element.subject}</td>
                <td>${element.facilitator}</td>
                <td>${element.topic}</td>
                <td>${element.study_mode}</td>
                <td>${element.session_date}</td>
                <td>
                    <div class="actions">
                        <a class="btn-update" href="javascript:void(0)" onClick="editStudySession(${element.id})">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a class="btn-delete" href="javascript:void(0)" onClick="deleteStudySession(${element.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
        });
        content.innerHTML = html;
    })
    .catch(error => { console.log(error); });
}

function deleteStudySession(id) {
    if (confirm("Are you sure you want to delete this study session?")) {
        fetch(`https://semifinalsb.onrender.com/api/study-sessions/${id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
        }).then(response => response.text())
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
    } else {
        alert("You Canceled!");
    }
}

function editStudySession(id) {
    fetch(`https://semifinalsb.onrender.com/api/study-sessions/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#subject").value     = data[0].subject;
        document.querySelector("#facilitator").value = data[0].facilitator;
        document.querySelector("#topic").value       = data[0].topic;
        document.querySelector("#study_mode").value  = data[0].study_mode;
        document.querySelector("#study_date").value  = data[0].session_date;
        document.querySelector(`.form-panel[data-form="study_sessions"] .hidden-id`).value = data[0].id;
    }).catch(error => { console.log(error); });
}

document.querySelector(`.form-panel[data-form="study_sessions"] .btn-update`).addEventListener('click', () => {
    let subject      = document.querySelector("#subject").value;
    let facilitator  = document.querySelector("#facilitator").value;
    let topic        = document.querySelector("#topic").value;
    let study_mode   = document.querySelector("#study_mode").value;
    let session_date = document.querySelector("#study_date").value;
    let id           = document.querySelector(`.form-panel[data-form="study_sessions"] .hidden-id`).value;
    let formData = { subject, facilitator, topic, study_mode, session_date, id };
    fetch(`https://semifinalsb.onrender.com/api/study-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Study Session Updated Successfully");
    location.reload();
});

// ═══════════════════════════════════════════
//  TABLE 4: PARTICIPANTS
// ═══════════════════════════════════════════

document.querySelector(`.form-panel[data-form="participants"] .btn-add`).addEventListener('click', () => {
    let full_name   = document.querySelector("#full_name").value;
    let email       = document.querySelector("#email").value;
    let role        = document.querySelector("#role").value;
    let team        = document.querySelector("#team").value;
    let joined_date = document.querySelector("#joined_date").value;
    let formData = { full_name, email, role, team, joined_date };
    fetch(`https://semifinalsb.onrender.com/api/participants`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Participant Added Successfully");
    location.reload();
});

function getParticipants() {
    let html = "";
    document.querySelector("#tableHead").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Team</th>
            <th>Joined</th>
            <th>Actions</th>
        </tr>`;

    fetch(`https://semifinalsb.onrender.com/api/participants`, { mode: 'cors' })
    .then(response => { return response.json(); })
    .then(data => {
        data.forEach(element => {
            html += `
            <tr>
                <td>${element.id}</td>
                <td>${element.full_name}</td>
                <td>${element.email}</td>
                <td>${element.role}</td>
                <td>${element.team}</td>
                <td>${element.joined_date}</td>
                <td>
                    <div class="actions">
                        <a class="btn-update" href="javascript:void(0)" onClick="editParticipant(${element.id})">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a class="btn-delete" href="javascript:void(0)" onClick="deleteParticipant(${element.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
        });
        content.innerHTML = html;
    })
    .catch(error => { console.log(error); });
}

function deleteParticipant(id) {
    if (confirm("Are you sure you want to delete this participant?")) {
        fetch(`https://semifinalsb.onrender.com/api/participants/${id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
        }).then(response => response.text())
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
    } else {
        alert("You Canceled!");
    }
}

function editParticipant(id) {
    fetch(`https://semifinalsb.onrender.com/api/participants/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#full_name").value   = data[0].full_name;
        document.querySelector("#email").value       = data[0].email;
        document.querySelector("#role").value        = data[0].role;
        document.querySelector("#team").value        = data[0].team;
        document.querySelector("#joined_date").value = data[0].joined_date;
        document.querySelector(`.form-panel[data-form="participants"] .hidden-id`).value = data[0].id;
    }).catch(error => { console.log(error); });
}

document.querySelector(`.form-panel[data-form="participants"] .btn-update`).addEventListener('click', () => {
    let full_name   = document.querySelector("#full_name").value;
    let email       = document.querySelector("#email").value;
    let role        = document.querySelector("#role").value;
    let team        = document.querySelector("#team").value;
    let joined_date = document.querySelector("#joined_date").value;
    let id          = document.querySelector(`.form-panel[data-form="participants"] .hidden-id`).value;
    let formData = { full_name, email, role, team, joined_date, id };
    fetch(`https://semifinalsb.onrender.com/api/participants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Participant Updated Successfully");
    location.reload();
});

// ═══════════════════════════════════════════
//  TABLE 5: AGENDAS
// ═══════════════════════════════════════════

document.querySelector(`.form-panel[data-form="agendas"] .btn-add`).addEventListener('click', () => {
    let agenda_title = document.querySelector("#agenda_title").value;
    let assigned_to  = document.querySelector("#assigned_to").value;
    let priority     = document.querySelector("#priority").value;
    let status       = document.querySelector("#status").value;
    let due_date     = document.querySelector("#due_date").value;
    let formData = { agenda_title, assigned_to, priority, status, due_date };
    fetch(`https://semifinalsb.onrender.com/api/agendas`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Agenda Added Successfully");
    location.reload();
});

function getAgendas() {
    let html = "";
    document.querySelector("#tableHead").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Agenda Title</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
        </tr>`;

    fetch(`https://semifinalsb.onrender.com/api/agendas`, { mode: 'cors' })
    .then(response => { return response.json(); })
    .then(data => {
        data.forEach(element => {
            html += `
            <tr>
                <td>${element.id}</td>
                <td>${element.agenda_title}</td>
                <td>${element.assigned_to}</td>
                <td>${element.priority}</td>
                <td>${element.status}</td>
                <td>${element.due_date}</td>
                <td>
                    <div class="actions">
                        <a class="btn-update" href="javascript:void(0)" onClick="editAgenda(${element.id})">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a class="btn-delete" href="javascript:void(0)" onClick="deleteAgenda(${element.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            </tr>`;
        });
        content.innerHTML = html;
    })
    .catch(error => { console.log(error); });
}

function deleteAgenda(id) {
    if (confirm("Are you sure you want to delete this agenda?")) {
        fetch(`https://semifinalsb.onrender.com/api/agendas/${id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
        }).then(response => response.text())
        .then(response => { console.log(response); location.reload(); })
        .catch(error => { console.log(error); });
    } else {
        alert("You Canceled!");
    }
}

function editAgenda(id) {
    fetch(`https://semifinalsb.onrender.com/api/agendas/${id}`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#agenda_title").value = data[0].agenda_title;
        document.querySelector("#assigned_to").value  = data[0].assigned_to;
        document.querySelector("#priority").value     = data[0].priority;
        document.querySelector("#status").value       = data[0].status;
        document.querySelector("#due_date").value     = data[0].due_date;
        document.querySelector(`.form-panel[data-form="agendas"] .hidden-id`).value = data[0].id;
    }).catch(error => { console.log(error); });
}

document.querySelector(`.form-panel[data-form="agendas"] .btn-update`).addEventListener('click', () => {
    let agenda_title = document.querySelector("#agenda_title").value;
    let assigned_to  = document.querySelector("#assigned_to").value;
    let priority     = document.querySelector("#priority").value;
    let status       = document.querySelector("#status").value;
    let due_date     = document.querySelector("#due_date").value;
    let id           = document.querySelector(`.form-panel[data-form="agendas"] .hidden-id`).value;
    let formData = { agenda_title, assigned_to, priority, status, due_date, id };
    fetch(`https://semifinalsb.onrender.com/api/agendas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
    }).catch((error) => { console.log(error); });
    alert("Agenda Updated Successfully");
    location.reload();
});