
// markdown博客发布工具信息
const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader')
let moment = require('moment')

console.log("Welcome to use benben blog deploy tools");
console.log("Version:","0.0.2");
console.log("base dir:", __dirname);
let jsonFile = "deploy/deploy.json";

let meta = {
    id: new Date().getTime(),
    time: moment().format("YYYY-MM-DD")
}

let json = JSON.parse(fs.readFileSync(jsonFile,"UTF-8"));
console.log("read deploy.json file:",json);

//移动markdown文件
moveFile("deploy/"+json.file+".md");
//移动html文件
moveFile("deploy/"+json.file+".html");

//赋值meta信息
meta.name = json.name;
meta.desc = json.desc;
meta.tags = json.tags;
meta.file = "/articles/"+meta.time+"/"+json.file+".html";

//存储last.json数据
let lastFile = "data/last.json";
let last = JSON.parse(fs.readFileSync(lastFile,"UTF-8"));
last.unshift(meta);
if(last.length > 12){
    console.log("last length > 12 will remove last")
    meta.pop();
}
fs.writeFileSync(lastFile,JSON.stringify(last),"UTF-8");

//存储data.json数据
 let dataFile = "data/data.json";
 let all = JSON.parse(fs.readFileSync(dataFile,"UTF-8"));
 let year = moment().format("YYYY");
 if(!all[year]){
    all[year] = [];
 }
 all.push(meta);
 fs.writeFileSync(dataFile,JSON.stringify(all),"UTF-8");



//存储tag.json数据
let tagFile = "data/tags.json";
let tagJSON = JSON.parse(fs.readFileSync(tagFile,"UTF-8"));
for(let tag of json.tags){
    if(tag == undefined || tag == null || tag.trim() == ""){
        continue;
    }
    let arr = tagJSON[tag];
    if(arr == undefined || arr == null){
        arr = [];
        tagJSON[tag] = arr;
    }
    arr.push(meta);
}
fs.writeFileSync(tagFile,JSON.stringify(tagJSON),"UTF-8");


//移动文件工具
function moveFile(file){
    console.log("starting move file:",file);
    if(!fs.existsSync(file)){
        console.error(file,"file not exists!!!")
        throw new Error("file not exists");
    }
    var base = "articles/"+meta.time;
    if(!fs.existsSync(base)){
        fs.mkdirSync(base);
    }

    var content = fs.readFileSync(file,"UTF-8");

    fs.writeFileSync(base+"/"+path.basename(file),content,"UTF-8");

    fs.unlinkSync(file);

    console.log("end move file",file);
}


