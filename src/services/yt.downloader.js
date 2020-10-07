const fs = require('fs');
const { format } = require('path');
const ytdl = require('ytdl-core');
const uuid = require('uuid')
const ffmpeg = require('fluent-ffmpeg')
const prefixFile='../../download'
exports.downloadLink = function (link, output) {
    let uuidNew = uuid.v4();
    var readStream = ytdl(link, { filter: format => format.container === "mp4" });
    ffmpeg({ source: readStream }).withInputFormat('mp4')
        .setFfmpegPath('/usr/bin/ffmpeg')
        .withOutputFormat('mp3')
        .pipe(fs.createWriteStream(prefixFile + uuidNew + '.mp3'))
        .on('finish', () => {
            fs.createReadStream(prefixFile + uuidNew + '.mp3').pipe(output).on('finish', () => {
                console.log('subido');
                fs.unlink(prefixFile + uuidNew + '.mp3', (err) => { console.log(err); });
            });
        });
}