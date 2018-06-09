const {app, shell} = require('electron');
const {AbstractTypiePackage, TypieRowItem, TypieCore} = require('typie-sdk');

const is = require('electron-is');
let Walker;

if (is.windows()) {
    Walker = require('./walker.js');
} else if (is.osx()) {
    Walker = require('./walker-osx.js');
}

class Applications extends AbstractTypiePackage
{
    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'Applications';
        this.db          = 'global';
        this.typie       = new TypieCore(this.packageName, this.db);

        Walker.run(this.typie)
            .then(res => this.insertAll(res))
            .catch(err => console.error(err));
    }

    insertAll(objectsArray) {
        this.typie.multipleInsert(objectsArray).go()
            .then(data => console.info('Applications done adding', data))
            .catch((err) => console.error('Applications insert error', err));
    }

    search(obj, callback) {
        this.typie.fuzzySearch(obj.value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.error(err));
    }

    activate(pkgList, item, cb) {
        this.typie.updateCalled(item).go()
           .then(()=>{})
           .catch(()=>{});
        console.log("open in files", item);
        shell.openItem(item.getPath());
        this.win.hide();
    }
}
module.exports = Applications;

