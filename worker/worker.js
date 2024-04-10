
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');

// Function to process the file asynchronously
const processFile = async () => {
    try {
        const jsonArray = [];
    
        // Read the CSV file and parse its contents into JSON objects
        fs.createReadStream(workerData.filePath)
          .pipe(csv())
          .on('data', (row) => {
            // Push each row (CSV record) as a JSON object into the array
            jsonArray.push(row);
          })
          .on('end', () => {
            console.log('CSV processing completed');
            // Send the JSON array back to the main thread
            parentPort.postMessage(jsonArray);
          })
          .on('error', (error) => {
            console.error('Error processing CSV:', error);
            parentPort.postMessage({ error: 'Failed to process file' });
          });
      } catch (error) {
        console.error('Error:', error);
        parentPort.postMessage({ error: 'Failed to process file' });
      }
};

processFile()