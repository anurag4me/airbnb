const fs = require('fs')
const path = require('path')
const rootDir = require("../utils/pathUtil")

const filePath = path.join(rootDir, 'data', 'favourite.json');


module.exports = class Favourite {
    static addToFavourite(homeId, callback) {
        Favourite.getFavourites(favourites => {
            if(favourites.includes(homeId)){
                callback('Home already marked favourite');
            } else {
                favourites.push(homeId);
                fs.writeFile(filePath, JSON.stringify(favourites), callback)
            }
        })
    }

    static getFavourites(callback){
        const data = fs.readFile(filePath, 'utf8', (err, data) => {
            // console.log('File read: ', err)
            callback(!err && data != '' ? JSON.parse(data) : [])
        });
    }

    static deleteFavourite(homeId, callback){
       Favourite.getFavourites(favourites => {
            if(favourites.includes(homeId)){
                favourites = favourites.filter(e => e!=homeId );
                fs.writeFile(filePath, JSON.stringify(favourites), callback)
            } else {
                callback('Home already unmarked favourite');
            }
        })
    }
}

