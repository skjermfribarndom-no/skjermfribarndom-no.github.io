function updateGoogleContacts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  const nyhetsbrev = findOrCreateContactGroup("Nyhetsbrev");

  const allContactsResponse = People.People.Connections.list("people/me", {
    personFields: "names,emailAddresses,memberships",
    pageSize: 1000, // Max allowed per request
    pageToken: null,
  });
  const allContacts = allContactsResponse.connections || [];

  const members = new Map();

  for (let i = 1; i < data.length; i++) {
    const email = data[i][4];
    const shareEmail = data[i][13] === "on";
    const newsletter = data[i][14] === "on";

    if (!email) continue;

    members.set(email, { shareEmail, newsletter });
  }

  for (const [email, { newsletter }] of members.entries()) {
    if (!newsletter) continue;

    const contacts = allContacts.filter((c) =>
      c.emailAddresses.find((e) => e.value === email),
    );
    if (contacts.length === 0) {
      const newContact = People.People.createContact({
        memberships: [
          {
            contactGroupMembership: {
              contactGroupResourceName: nyhetsbrev.resourceName,
            },
          },
        ],
        emailAddresses: [{ value: email }],
      });
      Logger.log("new contact: " + email);
    } else if (contacts.length === 1) {
      const { memberships, resourceName } = contacts[0];
      if (
        !memberships.find(
          (m) =>
            m.contactGroupMembership.contactGroupResourceName ===
            nyhetsbrev.resourceName,
        )
      ) {
        memberships.push({
          contactGroupMembership: {
            contactGroupResourceName: nyhetsbrev.resourceName,
          },
        });
        People.People.updateContact({ memberships }, resourceName, {
          updateMask: "memberships",
        });
      } else {
        Logger.log("Contact up to date " + email);
      }
    } else {
      Logger.log("Warning: Duplicate contact" + email);
    }
  }
}

function findOrCreateContactGroup(tag) {
  const response = People.ContactGroups.list();
  const existingGroup = response.contactGroups.find((g) => g.name === tag);

  if (existingGroup) return existingGroup;

  // Create a new group if it doesn't exist
  return People.ContactGroups.create({ contactGroup: { name: tag } });
}
