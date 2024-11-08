function sendConfirmationEmail(name, email, confirmationLink) {
  const subject = "Bekreft din emailadresse for skjermfribarndom.no";
  const htmlBody = `
          <p>Hei ${name},</p>
          <p>Takk for at du har signert løftet om skjermfri barndom. For å bekrefte din signatur ber vi om at du klikker på denne lenken:</p>
          <p><a href="${confirmationLink}">Bekreft signering</a></p>
          <p>Eller kopier og lim følgende lenke inn i nettleseren:</p>
          <p>${confirmationLink}</p>
          <p>Takk for at du er med,<br>Hilsen Skjermfri Norge</p>
  `;
  MailApp.sendEmail({ to: email, subject, htmlBody });
}

function doPost(e) {
  try {
    Logger.log("Posting");
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

    const { name, email, confirmationUrl } = e.parameter;

    if (name === "error") {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", errorMessage: "Induced error" }),
      );
    }
    if (name === "crash") {
      throw Error("crashing");
    }

    const confirmation_token = Math.random().toString(36).substring(2);

    sheet.appendRow([
      "Recorded",
      new Date(),
      undefined,
      name,
      email,
      e.parameter.fylkesnummer,
      e.parameter.fylkesnavn,
      e.parameter.kommunenummer,
      e.parameter.kommunenavn,
      e.parameter.skoleorgnummer,
      e.parameter.skolenavn,
      e.parameter.klassetrinn,
      e.parameter.samtykke_email,
      e.parameter.samtykke_dele_email,
      e.parameter.samtykke_nyhetsbrev,
      e.parameter.kommentarer,
      confirmation_token,
    ]);
    const confirmationLink = `${confirmationUrl}?token=${confirmation_token}&email=${encodeURIComponent(email)}`;
    sendConfirmationEmail(name, email, confirmationLink);
    sheet.getRange(sheet.getLastRow(), 1).setValue("Email sent"); // Assuming column 5 stores email status

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok", data: e.parameter }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        data: e.parameter,
        errorMessage: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function confirmSubmission({ email, token }) {
  Logger.log(`Confirming email=${email}, token=${token}`);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  // Loop through the data to find the corresponding token and email
  for (let i = 1; i < data.length; i++) {
    Logger.log(`Row ${i}, token=${data[i][16]}, email=${data[i][4]}`);
    if (data[i][16] === token && data[i][4] === email) {
      sheet.getRange(i + 1, 1).setValue("Confirmed");
      sheet.getRange(i + 1, 3).setValue(new Date());
      return true;
    }
  }
  return false;
}

function doGet(e) {
  const { token, email, action } = e.parameter;

  if (action === "test") {
    return ContentService.createTextOutput("Test ok");
  }
  if (action === "error") {
    throw Error("Simulated error");
  }
  if (action !== "confirm") {
    return ContentService.createTextOutput(`Invalid action ${action}`);
  }

  if (!token || !email) {
    return ContentService.createTextOutput(
      "Invalid or missing confirmation details.",
    );
  }

  if (confirmSubmission({ email, token })) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }));
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        errorMessage: "Token or email not found",
      }),
    );
  }
}
