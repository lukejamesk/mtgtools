import Papa from 'papaparse'
export const helvaultProCsvToTopDeckedConverter = (source, to, csvString) => {
    const sourceResult = Papa.parse(csvString, {
        header: true
    })

    let convertedJson;

    switch (source) {
        case "helvault":
            convertedJson = sourceResult.data.map(({ collector_number, name, quantity, set_code, set_name, scryfall_id}) => ({
                QUANTITY: quantity,
                NAME: name,
                SETCODE: set_code,
                SETNAME: set_name,
                FOIL: undefined,
                PRICE: undefined,
                RARITY: undefined,
                ID: scryfall_id,
                'COLLECTOR NUMBER': collector_number,
            }))
        break;
        case "topdecked":
            convertedJson = sourceResult.data;
        break;
        case "moxfield":
            convertedJson = sourceResult.data.map(row => ({
                QUANTITY: row.Count,
                NAME: row.Name,
                SETCODE: row.Edition,
                SETNAME: undefined,
                FOIL: row.Foil,
                PRICE: undefined,
                RARITY: undefined,
                ID: undefined,
                'COLLECTOR NUMBER': row['Collector Number']
            }));
        break;
        default:
            console.error('No valid source selected')
        
    }

    console.log('converted', convertedJson)

    let convertedResult;


    switch (to) {
        case "topdecked":
            convertedResult = Papa.unparse(convertedJson, {
                quotes: true,
                header: true,
            })
        break;
        case "moxfield":
            convertedResult = Papa.unparse(convertedJson.map((row) => ({
                Count: row.QUANTITY,
                Name: row.NAME,
                Edition: row.SETCODE,
                Condition: 'Near Mint',
                Language: 'English',
                Foil: row.FOIL,
                'Collector Number': row['COLLECTOR NUMBER']
            })), {
                quotes: true,
                header: true,
            })
        break;
        default:
            console.error('No valid source selected')
    }
        


    // const result = Papa.unparse(convertedJson, {
    //     quotes: true,
    //     header: true,

    // })
    console.log(convertedResult)
    return convertedResult;
}