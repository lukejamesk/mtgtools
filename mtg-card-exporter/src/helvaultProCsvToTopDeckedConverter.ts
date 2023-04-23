import Papa from 'papaparse'

type MtgCardJson = {
    QUANTITY: string,
    NAME: string,
    SETCODE: string,
    SETNAME?: string,
    FOIL?: string,
    PRICE?: string,
    RARITY?: string,
    ID?: string,
    'COLLECTOR NUMBER'?: string,
}

type TopDeckedJson = MtgCardJson;

type HelvaultJson = {
    collector_number: string,
    name: string,
    quantity: string,
    set_code: string,
    set_name: string,
    scryfall_id: string
}

type MoxFieldJson = {
    Count: string,
    Name: string,
    Edition: string,
    Foil?: string,
    'Collector Number'?: string
}

export const helvaultProCsvToTopDeckedConverter = (source:string, to: string, csvString: string) => {
    const sourceResult = Papa.parse(csvString, {
        header: true
    })

    let convertedJson: MtgCardJson[] = [];

    switch (source) {
        case "helvault":
            convertedJson = (sourceResult.data as HelvaultJson[]).map(({quantity, name, set_code, set_name, scryfall_id, collector_number}: HelvaultJson) => ({
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
            convertedJson = (sourceResult.data as TopDeckedJson[]);
        break;
        case "moxfield":
            convertedJson = (sourceResult.data as MoxFieldJson[]).map(row => ({
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
            break;
        
    }

    console.log('converted', convertedJson)

    let convertedResult: string = '';


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
        
    return convertedResult;
}