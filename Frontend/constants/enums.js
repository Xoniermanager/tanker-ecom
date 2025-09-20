

export const NEWZEALAND_REGIONS = Object.freeze({
    NORTHLAND: "northland",
    AUCKLAND: "auckland", 
    WAIKATO: "waikato",
    BAY_OF_PLENTY: "bay_of_plenty",
    GISBORNE: "gisborne",
    HAWKES_BAY: "hawkes_bay",
    TARANAKI: "taranaki",
    MANAWATU_WHANGANUI: "manawatu_whanganui",
    WELLINGTON: "wellington",
    TASMAN: "tasman",
    NELSON: "nelson",
    MARLBOROUGH: "marlborough",
    WEST_COAST: "west_coast",
    CANTERBURY: "canterbury",
    OTAGO: "otago",
    SOUTHLAND: "southland"
})

export const PAYMENT_METHODS = Object.freeze({
        COD:"cod",
        ONLINE_PAYMENT: "online_payment"
})

export const PAYMENT_STATUS = Object.freeze({

        PENDING: "pending",
        FAILED: "failed",
        CANCELLED: "cancelled",
        SUCCESS: "success",
   
})

export const  ORDER_STATUS = Object.freeze({
        PENDING: "pending",
        PROCESSING: "processing",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled"
    })

export const NEWZEALAND_CITIES = Object.freeze({
  WHANGAREI: "whangarei",
  KAITIA: "kaitaia",
  RUSSELL: "russell",
  AUCKLAND: "auckland",
  MANUKAU_CITY: "manukau_city",
  NORTH_SHORE: "north_shore",
  WAITAKERE: "waitakere",
  PAPAKURA: "papakura",
  PUKEKOHE: "pukekohe",
  HAMILTON: "hamilton",
  CAMBRIDGE: "cambridge",
  TOKOROA: "tokoroa",
  PAEROA: "paeroa",
  TE_AROHA: "te_aroha",
  WAIHI: "waihi",
  TAURANGA: "tauranga",
  ROTORUA: "rotorua",
  GISBORNE: "gisborne",
  NAPIER: "napier",
  HASTINGS: "hastings",
  NEW_PLYMOUTH: "new_plymouth",
  HAWERA: "hawera",
  STRATFORD: "stratford",
  PALMERSTON_NORTH: "palmerston_north",
  WANGANUI: "wanganui",
  WELLINGTON: "wellington",
  LOWER_HUTT: "lower_hutt",
  UPPER_HUTT: "upper_hutt",
  PORIRUA: "porirua",
  MASTERTON: "masterton",
  NELSON: "nelson",
  BLENHEIM: "blenheim",
  PICTON: "picton",
  GREYMOUTH: "greymouth",
  HOKITIKA: "hokitika",
  WESTPORT: "westport",
  CHRISTCHURCH: "christchurch",
  TIMARU: "timaru",
  AKAROA: "akaroa",
  LYTTELTON: "lyttelton",
  DUNEDIN: "dunedin",
  OAMARU: "oamaru",
  ALEXANDRA: "alexandra",
  QUEENSTOWN: "queenstown",
  INVERCARGILL: "invercargill"
})

export const COUNTRIES = Object.freeze({
    UNITED_STATES: { code: "US", name: "United States", value: "united_states" },
    CANADA: { code: "CA", name: "Canada", value: "canada" },
    UNITED_KINGDOM: { code: "GB", name: "United Kingdom", value: "united_kingdom" },
    GERMANY: { code: "DE", name: "Germany", value: "germany" },
    FRANCE: { code: "FR", name: "France", value: "france" },
    ITALY: { code: "IT", name: "Italy", value: "italy" },
    JAPAN: { code: "JP", name: "Japan", value: "japan" },
    CHINA: { code: "CN", name: "China", value: "china" },
    INDIA: { code: "IN", name: "India", value: "india" },
    RUSSIA: { code: "RU", name: "Russia", value: "russia" },
    BRAZIL: { code: "BR", name: "Brazil", value: "brazil" },
    AUSTRALIA: { code: "AU", name: "Australia", value: "australia" },
    SOUTH_KOREA: { code: "KR", name: "South Korea", value: "south_korea" },
    MEXICO: { code: "MX", name: "Mexico", value: "mexico" },
    INDONESIA: { code: "ID", name: "Indonesia", value: "indonesia" },
    TURKEY: { code: "TR", name: "Turkey", value: "turkey" },
    SAUDI_ARABIA: { code: "SA", name: "Saudi Arabia", value: "saudi_arabia" },
    ARGENTINA: { code: "AR", name: "Argentina", value: "argentina" },
    SOUTH_AFRICA: { code: "ZA", name: "South Africa", value: "south_africa" },
    SPAIN: { code: "ES", name: "Spain", value: "spain" },
    NETHERLANDS: { code: "NL", name: "Netherlands", value: "netherlands" },
    SWITZERLAND: { code: "CH", name: "Switzerland", value: "switzerland" },
    SWEDEN: { code: "SE", name: "Sweden", value: "sweden" },
    NORWAY: { code: "NO", name: "Norway", value: "norway" },
    DENMARK: { code: "DK", name: "Denmark", value: "denmark" },
    FINLAND: { code: "FI", name: "Finland", value: "finland" },
    BELGIUM: { code: "BE", name: "Belgium", value: "belgium" },
    AUSTRIA: { code: "AT", name: "Austria", value: "austria" },
    ISRAEL: { code: "IL", name: "Israel", value: "israel" },
    SINGAPORE: { code: "SG", name: "Singapore", value: "singapore" },
    NEW_ZEALAND: { code: "NZ", name: "New Zealand", value: "new_zealand" },
    IRELAND: { code: "IE", name: "Ireland", value: "ireland" },
    POLAND: { code: "PL", name: "Poland", value: "poland" },
    PORTUGAL: { code: "PT", name: "Portugal", value: "portugal" },
    GREECE: { code: "GR", name: "Greece", value: "greece" },
    THAILAND: { code: "TH", name: "Thailand", value: "thailand" },
    VIETNAM: { code: "VN", name: "Vietnam", value: "vietnam" },
    MALAYSIA: { code: "MY", name: "Malaysia", value: "malaysia" },
    PHILIPPINES: { code: "PH", name: "Philippines", value: "philippines" },
    BANGLADESH: { code: "BD", name: "Bangladesh", value: "bangladesh" },
    PAKISTAN: { code: "PK", name: "Pakistan", value: "pakistan" },
    EGYPT: { code: "EG", name: "Egypt", value: "egypt" },
    NIGERIA: { code: "NG", name: "Nigeria", value: "nigeria" },
    KENYA: { code: "KE", name: "Kenya", value: "kenya" },
    MOROCCO: { code: "MA", name: "Morocco", value: "morocco" },
    UNITED_ARAB_EMIRATES: { code: "AE", name: "United Arab Emirates", value: "united_arab_emirates" },
    COLOMBIA: { code: "CO", name: "Colombia", value: "colombia" },
    CHILE: { code: "CL", name: "Chile", value: "chile" },
    PERU: { code: "PE", name: "Peru", value: "peru" },
    VENEZUELA: { code: "VE", name: "Venezuela", value: "venezuela" },
    ECUADOR: { code: "EC", name: "Ecuador", value: "ecuador" }
})

export const specType = Object.freeze({
    IMAGE: "image",
    PDF: "pdf"
})

export const months = Object.freeze([
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
])



// 0212345678

// 0298765432

// 036543210

// 079123456

// 064123456

// +64211234567

// +6434567890

