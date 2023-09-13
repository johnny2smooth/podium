import { google } from "googleapis";
import credentials from "../../data.json";

const jwtClient = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const spreadsheetId = import.meta.env.SHEET_ID;

// Function to append data to the Google Sheet
export async function appendData(email: string | undefined) {
  try {
    await jwtClient.authorize();
    const sheetsAPI = google.sheets({ version: "v4", auth: jwtClient });

    // Append the data to the Google Sheet
    const range = `Sheet1!A:C`;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Month is zero-indexed, so add 1
    const year = today.getFullYear();

    // Format as YYYY-MM-DD (ISO 8601)
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const result = await sheetsAPI.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [[formattedDate, email]],
      },
    });
    if (result.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error appending data:", error);
  }
}
