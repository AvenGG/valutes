const API_KEY="4104769462fe146c52a8d6d1b4bb86966d73b85a8da6ba7790ce38f29f6da2e0"

export function loadCurrencies(currencies){
    if(!currencies.length) return
    return fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currencies.join(',')}&tsyms=USD&api_key=${API_KEY}`)
          .then((responce)=>responce.json())
}

export async function getCoinList(){
    return fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
        .then((responce)=>responce.json())
        .then((responce)=>responce.Data)
}