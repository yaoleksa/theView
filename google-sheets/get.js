function doGet(e) {
  if(e.parameter.entity === 'article') {
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetById(0);
    const lastRow = activeSheet.getLastRow() + 1;
    const savedArticles = activeSheet.getRange(`A1:F${lastRow}`).getValues();
    const JSONresponse = {};
    let index = 1;
    if(!e.parameter.topic) {
      savedArticles.forEach(row => {
        JSONresponse[`row${index}`] = row;
        index++;
      })
      return ContentService.createTextOutput(JSON.stringify(JSONresponse)).setMimeType(ContentService.MimeType.JSON);
    } else if(e.parameter.topic) {
      const articlesByTopic = savedArticles.filter(row => row[5] === e.parameter.topic);
      articlesByTopic.forEach(row => {
        JSONresponse[`row${index}`] = row;
        index++;
      });
      return ContentService.createTextOutput(JSON.stringify(JSONresponse)).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'No such endpoint',
    code: 404
  })).setMimeType(ContentService.MimeType.JSON);
}
