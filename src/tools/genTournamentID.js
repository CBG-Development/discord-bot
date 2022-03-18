const converter = require('hex2dec');

/**
 * Generates ID
 * @param {string} praefix 
 * @returns {string} ID
 */
const genSimpleID = (praefix) => {
    const time = Date.now();
    const randomNumber = Math.floor(Math.random() * 100);
    const numberID = `${time}${randomNumber}`;
    const hexID = converter.decToHex(numberID);
    const id = `${praefix ? praefix : "cbg"}-${hexID.slice(2, hexID.length)}`.toUpperCase();
    return id;
}

module.exports = genSimpleID;