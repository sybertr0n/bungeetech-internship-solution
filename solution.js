const parser = require('csv-parse/lib/sync');
const stringifier = require('csv-stringify');
const fs = require('fs');

init();

//Intialization
function init() {    
    filterCountry();  
}

/**
 * For second challenge to create file with first and second lowest price. 
 */
function lowestPrice() {
    const data = fs.readFileSync('output/filteredCountry.csv');

    const records = parser(data, { columns: true });
    const results = {};
    const final = []
    const headers = ['SKU', 'FIRST_MINIMUM_PRICE', 'SECOND_MINIMUM_PRICE'];

    //remove $ sign and convert to float and group prices under same SKUs
    records.forEach(record => {
        if (/^[\$*]/.test(record['PRICE'])) { 
            var price = parseFloat(record['PRICE'].split('$')[1]);
            if (record['SKU'] in results) {
                results[`${record.SKU}`].push(price);
            } else {                
                results[`${record.SKU}`] = [];                
                results[`${record.SKU}`].push(price);
            }
        }
    });

    //Sort prices and create data objects to write to file 
    for (var x in results) {
        if (results[x].length > 1) {
            results[x].sort((a, b) => { a - b });            
        }        
        final.push({
            SKU: x,
            FIRST_MINIMUM_PRICE: results[x][0],
            SECOND_MINIMUM_PRICE: results[x][results[x].length > 1 ? 1 : 0]
        });
    }
    
    //console.log(results.length);
    //console.log(final[0]);

    //Convert Js Objects to string and write to a csv file
    stringifier(final, { header: true, columns: headers }, (err, data) => {
        fs.writeFile('output/lowestPrice.csv', data, () => {
            console.log('Written to lowestPrice.csv');
        });
    });
}

/**
 * For first challenge to filter data with country USA and write to file
 */
async function filterCountry() {
    const data = await fs.readFileSync('input/main.csv');

    const records = parser(data, { columns: true });
    const results = [];
    const headers = ['SKU',
        'DESCRIPTION',
        'YEAR',
        'CAPACITY',
        'URL',
        'PRICE',
        'SELLER_INFORMATION',
        'OFFER_DESCRIPTION',
        'COUNTRY'];

    //Filter data that have country as USA and add it to a temporary array
    records.forEach(element => {
        if (element['COUNTRY'].includes('USA')) {
            results.push(element);
        }
    });
    //console.log(results[0]);

    //Convert Js Objects to string and write to a csv file
    stringifier(results, { header: true, columns: headers }, (err, data) => {
        fs.writeFile('output/filteredCountry.csv', data, () => {
            console.log('Written to filteredCountry.csv'); 
            lowestPrice();           
        });
    });
}
