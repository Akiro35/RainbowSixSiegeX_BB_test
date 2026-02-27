/**データ処理用のフロア名称
 * @type {Array}
 */
//export const floors = ['basement2nd', 'basement', 'floor1st', 'floor2nd', 'floor3rd', 'roof']

/**ページ表示用のフロア名称
 * @type {Object}
 */
export const floorNamesForDisplay = {
    basement2nd: '2nd basement',
    basement: 'Basement',
    floor1st: '1st floor',
    floor2nd: '2nd floor',
    floor3rd: '3rd floor',
    roof: 'Roof',
};

/**
 * マップオブジェクト
 * @type {
 *   {mapname: string, 
 *     {img:         string},
 *     {basement2nd: string},
 *     {basement:    string},
 *     {floor1st:    string},
 *     {floor2nd:    string},
 *     {floor3rd:    string},
 *     {roof:        string}
 *   }
 * } マップ情報(階層がない場合はnull)
 */

export const mapPool = {
    bank: {
        img: 'image/maps/r6-maps-bank-blueprints/R6S_Maps_Bank_EXT.jpg',
        basement: 'image/maps/r6-maps-bank-blueprints/r6-maps-bank-blueprint-3.jpg',
        floor1st: 'image/maps/r6-maps-bank-blueprints/r6-maps-bank-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-bank-blueprints/r6-maps-bank-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-bank-blueprints/r6-maps-bank-blueprint-4.jpg'
    },

    border: {
        img: 'image/maps/r6-maps-border-blueprints/R6S_Maps_Border_EXT.jpg',
        floor1st: 'image/maps/r6-maps-border-blueprints/r6-maps-border-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-border-blueprints/r6-maps-border-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-border-blueprints/r6-maps-border-blueprint-3.jpg'
    },

    chalet: {
        img: 'image/maps/r6-maps-chalet-blueprints/R6S_Maps_Chalet_EXT.jpg',
        basement: 'image/maps/r6-maps-chalet-blueprints/r6-maps-chalet-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-chalet-blueprints/r6-maps-chalet-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-chalet-blueprints/r6-maps-chalet-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-chalet-blueprints/r6-maps-chalet-blueprint-4.jpg'
    },

    clubhouse: {
        img: 'image/maps/r6-maps-clubhouse-blueprints/R6S_Maps_ClubHouse_EXT.jpg',
        basement: 'image/maps/r6-maps-clubhouse-blueprints/r6-maps-clubhouse-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-clubhouse-blueprints/r6-maps-clubhouse-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-clubhouse-blueprints/r6-maps-clubhouse-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-clubhouse-blueprints/r6-maps-clubhouse-blueprint-4.jpg'
    },

    coastline: {
        img: 'image/maps/r6-maps-coastline-blueprints/r6-maps-coastline.jpg',
        floor1st: 'image/maps/r6-maps-coastline-blueprints/r6-maps-coastline-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-coastline-blueprints/r6-maps-coastline-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-coastline-blueprints/r6-maps-coastline-blueprint-3.jpg'
    },

    consulate: {
        img: 'image/maps/r6-maps-consulate-blueprints_may23/ModernizedMap_Consulate_keyart.jpg',
        basement: 'image/maps/r6-maps-consulate-blueprints_may23/r6-maps-consulat-blueprints_may23/r6-maps-consulate-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-consulate-blueprints_may23/r6-maps-consulat-blueprints_may23/r6-maps-consulate-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-consulate-blueprints_may23/r6-maps-consulat-blueprints_may23/r6-maps-consulate-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-consulate-blueprints_may23/r6-maps-consulat-blueprints_may23/r6-maps-consulate-blueprint-4.jpg'
    },
    /*
    emeraldplains: {
        img: 'image/maps/r6-maps-emeraldplains-blueprints/r6s_maps_emeraldplains__1_.jpg',
        floor1st: 'image/maps/r6-maps-emeraldplains-blueprints/r6-maps-emeraldplains-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-emeraldplains-blueprints/r6-maps-emeraldplains-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-emeraldplains-blueprints/r6-maps-emeraldplains-blueprint-3.jpg'
    },
    */
    fortress: {
        img: 'image/maps/r6-maps-fortress-blueprints/fortress-reworked-thumbnail.avif',
        floor1st: 'image/maps/r6-maps-fortress-blueprints/r6-maps-fortress-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-fortress-blueprints/r6-maps-fortress-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-fortress-blueprints/r6-maps-fortress-blueprint-3.jpg'
    },

    kafe: {
        img: 'image/maps/r6-maps-kafe-blueprints/R6S_Maps_RussianCafe_EXT.jpg',
        floor1st: 'image/maps/r6-maps-kafe-blueprints/r6-maps-kafe-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-kafe-blueprints/r6-maps-kafe-blueprint-2.jpg',
        floor3rd: 'image/maps/r6-maps-kafe-blueprints/r6-maps-kafe-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-kafe-blueprints/r6-maps-kafe-blueprint-4.jpg'
    },

    kanal: {
        img: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal.jpg',
        basement2nd: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal-blueprints/r6-maps-kanal-blueprint-1.jpg',
        basement: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal-blueprints/r6-maps-kanal-blueprint-2.jpg',
        floor1st: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal-blueprints/r6-maps-kanal-blueprint-3.jpg',
        floor2nd: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal-blueprints/r6-maps-kanal-blueprint-4.jpg',
        roof: 'image/maps/r6-maps-kanal-blueprints/r6-maps-kanal-blueprints/r6-maps-kanal-blueprint-5.jpg'
    },

    lair: {
        img: 'image/maps/r6-maps-lair-blueprints/ModernizedMap_Lair_keyart.jpg',
        basement: 'image/maps/r6-maps-lair-blueprints/r6-maps-lair-blueprints/r6-maps-lair-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-lair-blueprints/r6-maps-lair-blueprints/r6-maps-lair-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-lair-blueprints/r6-maps-lair-blueprints/r6-maps-lair-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-lair-blueprints/r6-maps-lair-blueprints/r6-maps-lair-blueprint-4.jpg'
    },

    nighthavenlabs: {
        img: 'image/maps/r6-maps-nighthavenlabs-blueprints/ModernizedMap_Nighthaven_keyart.jpg',
        basement: 'image/maps/r6-maps-nighthavenlabs-blueprints/r6-maps-nighthavenlabs-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-nighthavenlabs-blueprints/r6-maps-nighthavenlabs-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-nighthavenlabs-blueprints/r6-maps-nighthavenlabs-blueprint-3.jpg',
        roof: 'image/maps/r6-maps-nighthavenlabs-blueprints/r6-maps-nighthavenlabs-blueprint-4.jpg'
    },

    oregon: {
        img: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon.jpg',
        basement: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon-blueprint-2.jpg',
        floor2nd: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon-blueprint-3.jpg',
        floor3rd: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon-blueprint-4.jpg',
        roof: 'image/maps/r6-maps-oregon-blueprints/r6-maps-oregon-blueprint-5.jpg'
    },

    outback: {
        img: 'image/maps/r6-maps-outback-blueprints/r6-maps-outback.jpg',
        floor1st: 'image/maps/r6-maps-outback-blueprints/r6-maps-outback-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-outback-blueprints/r6-maps-outback-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-outback-blueprints/r6-maps-outback-blueprint-3.jpg'
    },

    skyscraper: {
        img: 'image/maps/r6-maps-skyscraper-blueprints/r6-maps-skyscraper.jpg',
        floor1st: 'image/maps/r6-maps-skyscraper-blueprints/r6-maps-skyscraper-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-skyscraper-blueprints/r6-maps-skyscraper-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-skyscraper-blueprints/r6-maps-skyscraper-blueprint-3.jpg'
    },

    themepark: {
        img: 'image/maps/r6-maps-themepark-blueprints/rainbow6_maps_theme-park_thumbnail.jpg',
        floor1st: 'image/maps/r6-maps-themepark-blueprints/r6-maps-themepark-blueprints/r6-maps-themepark-blueprint-1.jpg',
        floor2nd: 'image/maps/r6-maps-themepark-blueprints/r6-maps-themepark-blueprints/r6-maps-themepark-blueprint-2.jpg',
        roof: 'image/maps/r6-maps-themepark-blueprints/r6-maps-themepark-blueprints/r6-maps-themepark-blueprint-3.jpg'
    },

    villa: {
        img: 'image/maps/r6-maps-villa-blueprints/r6-maps-villa.jpg',
        basement: 'image/maps/r6-maps-villa-blueprints/r6-maps-villa-blueprint-1.jpg',
        floor1st: 'image/maps/r6-maps-villa-blueprints/r6-maps-villa-blueprint-3.jpg',
        floor2nd: 'image/maps/r6-maps-villa-blueprints/r6-maps-villa-blueprint-4.jpg',
        roof: 'image/maps/r6-maps-villa-blueprints/r6-maps-villa-blueprint-5.jpg'
    }
}