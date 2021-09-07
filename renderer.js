const readXlsxFile = require('read-excel-file/node')
const fs = require('fs')
let chapters = [];
let dialogs = {}
let saveData = require('./saveData.json');
// Readable Stream.
document.getElementById('loaded').style.display = "none";
readXlsxFile(fs.createReadStream('./resources/app/hajimari.xlsx'), {getSheets: true}).then((sheets) => {
    chapters = sheets;
}).then(function () {
    chapters.forEach(function (value) {
        let key = value.name;
        let el = document.createElement('option');
        el.textContent = key;
        el.value = key;
        document.getElementById('chapters').appendChild(el);
        readXlsxFile(fs.createReadStream('./resources/app/hajimari.xlsx'), {sheet: key}).then((data) => {
            dialogs[key] = data;
        }).then(function () {
            refreshLine(saveData.line)
            selectPage(saveData.chapter)
            goToLine(saveData.chapter, saveData.line);
            document.getElementById('loaded').style.display = "block";

            document.getElementById('loading').style.display = "none";
        })
    })
})
document.getElementById('chapters').addEventListener("change", function (value) {
    refreshLine(0);

    goToLine(this.value, 0);
});

document.getElementById('line').addEventListener("change", function (event) {
    let selectedChapter = document.getElementById('chapters').value;
    goToLine(selectedChapter, this.value);
});
document.getElementById('line').addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        let selectedChapter = document.getElementById('chapters').value;
        goToLine(selectedChapter, this.value);
    }
});

document.onkeyup = function (event) {
    if (event.key === "right") {
        let line = parseInt(getActualLine()) + 1;
        refreshLine(line);

        goToLine(getSelectedPage(), line);
    }
    if (event.key === "left") {
        let line = parseInt(getActualLine()) - 1;
        refreshLine(line)
        goToLine(getSelectedPage(), line);
    }
}

function goToLine(chapterName, line) {
    let saveData = {chapter: chapterName, line: line}
    let data = JSON.stringify(saveData);
    fs.writeFileSync('./resources/app/saveData.json', data);


    let chapter = dialogs[chapterName]

    document.getElementById('name').innerHTML = chapter[line][0]
    document.getElementById('text').innerHTML = chapter[line][1]

}

function getSelectedPage() {
    return document.getElementById('chapters').value;
}

function selectPage(value) {
    return document.getElementById('chapters').value = value;
}

function getActualLine() {
    return document.getElementById('line').value;
}

function refreshLine(line) {
    document.getElementById('line').value = line
}