function sendConfirmationEmail(name, email, confirmation_token) {
  const confirmationLink = `${ScriptApp.getService().getUrl()}?token=${confirmation_token}&email=${encodeURIComponent(email)}`;

  const subject = "Please Confirm Your Submission";
  const htmlBody = `
          <p>Hello ${name},</p>
          <p>Thank you for your submission. Please confirm your submission by clicking the link below:</p>
          <p><a href="${confirmationLink}">Click here to confirm your submission</a></p>
          <p>Or copy and paste the following link into your browser:</p>
          <p>${confirmationLink}</p>
          <p>Best regards,<br>Your Team</p>
  `;
  MailApp.sendEmail({ to: email, subject, htmlBody });
}

function doPost(e) {
  Logger.log("Posting");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

  const { name, email, returnUrl } = e.parameter;

  if (name === "crash") {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: "Induced error" }),
    );
  }

  const confirmation_token = Math.random().toString(36).substring(2);

  sheet.appendRow([
    new Date(),
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
    e.parameter.kommentarer,
    confirmation_token,
  ]);
  sendConfirmationEmail(name, email, confirmation_token);
  sheet.getRange(sheet.getLastRow(), 14).setValue("Email sent"); // Assuming column 5 stores email status

  const result = "success";
  return ContentService.createTextOutput(
    JSON.stringify({
      result,
      data: e.parameter,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const { token, email, action } = e.parameter;

  if (action === "test") {
    return ContentService.createTextOutput("Test ok");
  }
  if (action === "error") {
    throw Error("Simulated error");
  }

  if (!token || !email) {
    return ContentService.createTextOutput(
      "Invalid or missing confirmation details.",
    );
  }

  Logger.log(`Confirming email=${email}, token=${token}`);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  // Loop through the data to find the corresponding token and email
  for (let i = 1; i < data.length; i++) {
    Logger.log(`Row ${i}, token=${data[i][12]}, email=${data[i][2]}`);
    if (data[i][12] === token && data[i][2] === email) {
      sheet.getRange(i + 1, 13).setValue("Confirmed");
      return ContentService.createTextOutput(
        "Your email has been successfully confirmed. Thank you!",
      );
    }
  }

  return ContentService.createTextOutput(
    "Confirmation failed: token or email not found.",
  );
}
