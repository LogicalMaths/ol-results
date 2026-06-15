// =============================================
// Google Apps Script — O/L Results Form Backend
// =============================================
// 
// 📋 SETUP INSTRUCTIONS:
// 
// 1. Open your Google Sheet (create new one if needed)
// 2. Add these column headers in Row 1:
//    A: Timestamp | B: Name | C: School | D: Index Number | 
//    E: Grade | F: Province | G: District | H: WhatsApp | I: Comments
//
// 3. Go to Extensions → Apps Script
// 4. Delete any existing code and paste ALL of this code
// 5. Click 💾 Save
// 6. Click Deploy → New deployment
//    - Type: Web app
//    - Description: "O/L Results Form"
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Click Deploy → Authorize the app when prompted
// 8. Copy the Web App URL
// 9. Paste the URL into script.js (replace YOUR_APPS_SCRIPT_WEB_APP_URL_HERE)
//
// That's it! 🎉
// =============================================

// Handle POST requests from the form
function doPost(e) {
  try {
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (the one this script is attached to)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append a new row with the form data
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name || '',
      data.school || '',
      data.indexNumber || '',
      data.grade || '',
      data.province || '',
      data.district || '',
      data.whatsapp || '',
      data.comments || ''
    ]);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data saved successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// Handle GET requests (for dashboard data retrieval)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // If sheet is empty or only has headers
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'success', 
          data: [] 
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Parse rows
    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j].toString().toLowerCase().trim()
          .replace(/\s+/g, '') // remove spaces
          .replace(/[^a-z0-9]/gi, ''); // remove non-alphanumeric
        row[key] = data[i][j];
      }
      rows.push(row);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        data: rows 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}
