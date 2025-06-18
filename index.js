const API_BASE =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/GENESIS/events";
const app = document.getElementById("app");

let state = {
  parties: [],
  selectedParty: null,
  guests: [],
  rsvps: [],
};

async function fetchParties() {
  try {
    const res = await fetch(API_BASE);
    const json = await res.json();
    state.parties = json.data;
    render();
  } catch (err) {
    console.error("Error fetching parties:", err);
  }
}

async function fetchPartyDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const json = await res.json();
    state.selectedParty = json.data;
    await fetchRSVPs();
    render();
  } catch (err) {
    console.error("Error fetching party details:", err);
  }
}

async function fetchRSVPs() {
  try {
    const resGuests = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/GENESIS/guests"
    );
    const guestsJson = await resGuests.json();
    state.guests = guestsJson.data;

    const resRsvps = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/GENESIS/rsvps"
    );
    const rsvpsJson = await resRsvps.json();
    state.rsvps = rsvpsJson.data;
  } catch (err) {
    console.error("Error fetching RSVPs or guests:", err);
  }
}

function renderPartyList() {
  const listDiv = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = "Upcoming Parties";
  listDiv.appendChild(heading);

  state.parties.forEach((party) => {
    const partyBtn = document.createElement("button");
    partyBtn.textContent = party.name;
    partyBtn.style.display = "block";
    if (state.selectedParty && state.selectedParty.id === party.id) {
      partyBtn.style.fontStyle = "italic";
      partyBtn.style.fontWeight = "bold";
    }
    partyBtn.addEventListener("click", () => fetchPartyDetails(party.id));
    listDiv.appendChild(partyBtn);
  });

  return listDiv;
}

function renderPartyDetails() {
  const detailDiv = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = "Party Details";
  detailDiv.appendChild(heading);

  if (!state.selectedParty) {
    detailDiv.appendChild(document.createTextNode("Please select a party."));
    return detailDiv;
  }

  const { name, id, date, location, description } = state.selectedParty;
  detailDiv.innerHTML += `
    <p><strong>${name} #${id}</strong></p>
    <p>${date}<br><em>${location}</em></p>
    <p>${description}</p>
  `;

  const guestList = document.createElement("ul");
  const filteredGuests = state.rsvps
    .filter((rsvp) => rsvp.eventId === state.selectedParty.id)
    .map((rsvp) => state.guests.find((guest) => guest.id === rsvp.guestId))
    .filter(Boolean);

  filteredGuests.forEach((guest) => {
    const li = document.createElement("li");
    li.textContent = guest.name;
    guestList.appendChild(li);
  });

  detailDiv.appendChild(guestList);
  return detailDiv;
}

function render() {
  app.innerHTML = "";
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.gap = "40px";

  const partyList = renderPartyList();
  const partyDetails = renderPartyDetails();

  container.appendChild(partyList);
  container.appendChild(partyDetails);
  app.appendChild(container);
}

fetchParties();
