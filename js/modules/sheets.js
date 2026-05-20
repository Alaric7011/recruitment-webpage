// ============================================================
// GOOGLE SHEETS — async submit (non-blocking, mode: no-cors).
//
// Setup (~5 min):
// 1. Create a Google Sheet.
// 2. Extensions → Apps Script. Paste the script below, save.
// 3. Deploy → New Deployment → Web App (Execute as: Me; Access: Anyone).
// 4. Copy the URL → set as GOOGLE_SHEET_URL in js/config.js.
//
//   function doPost(e) {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     var data  = JSON.parse(e.postData.contents);
//     if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(data));
//     var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
//     sheet.appendRow(headers.map(h => data[h] ?? ''));
//     return ContentService
//       .createTextOutput(JSON.stringify({ result: 'success' }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// ============================================================
import { GOOGLE_SHEET_URL } from '../config.js';

export function submitToSheets(data) {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('TSS: Google Sheets URL not set. Application saved to localStorage only.');
    return Promise.resolve();
  }
  return fetch(GOOGLE_SHEET_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
    .then(() => console.log('TSS: Application sent to Google Sheets.'))
    .catch(err => console.error('TSS: Google Sheets send failed (localStorage backup saved):', err));
}
