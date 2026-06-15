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
      "'" + (data.whatsapp || ''),
      data.comments || ''
    ]);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data saved successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for dashboard data retrieval or public testimonials)
function doGet(e) {
  try {
    var passcode = e.parameter.passcode;
    var correctPasscode = "maths123";
    var isAdmin = (passcode === correctPasscode);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // If sheet is empty or only has headers
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'success', 
          data: [] 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse rows
    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = {};
      var hasComment = false;
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j].toString().toLowerCase().trim()
          .replace(/\s+/g, '') // remove spaces
          .replace(/[^a-z0-9]/gi, ''); // remove non-alphanumeric
          
        var val = data[i][j];
        
        // Mark if has comments
        if (key === 'comments' && val && val.toString().trim() !== '') {
          hasComment = true;
        }
        
        // Security filter: only include private fields for admin
        if (isAdmin || key === 'name' || key === 'grade' || key === 'comments') {
          row[key] = val;
        }
      }
      
      // If public request, only include rows that have actual comments
      if (isAdmin || hasComment) {
        rows.push(row);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        data: rows 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
