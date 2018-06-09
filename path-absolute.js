const path = require('path');
const {app} = require('electron');

const regex = {
    param: /^%(.*?)%(.*?)$/
};

const replaceArray = {
    'systemroot': path.resolve('C:\\'),
    'windir': path.resolve('C:\\Windows'),
    'userprofile': app.getPath('home'),
    'systemdrive': path.join(app.getPath('home'), '../../'),
};

module.exports.absolute = function (filePath) {
    let match = filePath.match(regex.param);
    if (match !== null && match !== undefined && match[1] !== undefined) {
        filePath = path.resolve(path.normalize(replaceArray[match[1].toLowerCase()] + match[2]))
    }
    return filePath;
};


