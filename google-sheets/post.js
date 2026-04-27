function doPost(e) {
  if(!e.postData) {
    throw new Error("Invalid API payload");
  }
  const data = JSON.parse(e.postData.contents);
  if(e.parameter.entity === 'article') {
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetById(0);
    const lastRow = activeSheet.getLastRow() + 1;
    activeSheet.getRange(`A${lastRow}:F${lastRow}`).setValues([
      [data.article_id, data.title, data.link, data.content, data.image_url, data.q]
    ]);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'Articles were succesfuly inserted',
      code: 201
    })).setMimeType(ContentService.MimeType.JSON);
  } else if(e.parameter.entity === 'rate') {
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('rate');
    const lastRow = activeSheet.getLastRow() + 1;
    activeSheet.getRange(`A${lastRow}:D${lastRow}`).setValues([
      [lastRow, data.USD, data.EUR, data.PLN]
    ]);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'OK',
      message: 'Rates were successfuly inserted',
      code: 201
    })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'No such endpoint',
    code: 404
  })).setMimeType(ContentService.MimeType.JSON);
}
