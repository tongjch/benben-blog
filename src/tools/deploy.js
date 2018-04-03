
// markdown博客发布工具信息
const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader')
let moment = require('moment')

console.log("Welcome to use benben blog deploy tools");
console.log("Version:","0.0.1");
console.log("base dir:", __dirname);

let args = process.argv;
if(args.length < 1){
    console.log("Illegal Args!!!!")
    process.exit(1);
}
let lastArg = args[args.length-1]

let extname = path.extname(lastArg)
if(extname != ".md" && extname != ".MD"){
    console.log("Illegal Arg:",lastArg);
    console.log("Please enter markdown file")
    process.exit(1);
}

console.log("start parse markdown file:",lastArg);

let exist = fs.existsSync(lastArg);
if(!exist){
    lastArg = path.join(__dirname,lastArg);
    exist = fs.existsSync(lastArg);
}

if(!exist){
    console.log(lastArg,"Markdown file not exists!!!");
    process.exit(1);
}

let meta = {
    id: new Date().getTime(),
    time: moment().format("YYYY-MM-DD")
}
//{"id": 1,"name": "区块链历史2","time": "2018-03-30 09:35:00",
//"tags": ["区块链"],
//"file": "/articles/2018-03-29/blockchain_history.md",
//"desc": "区块链历史简介2"}

function parseLine(line){
    if(!line.startsWith(";")){
        return;
    }
    
    line = line.substring(1).trim();
    console.log(line)
    if(line.startsWith("name:")){
        line = line.substring(5).trim();
        meta.name = line;
    }else if(line.startsWith("tags:")){
        line = line.substring(5).trim();
        meta.tags = line.split("|");
    }else if(line.startsWith("desc:")){
        line = line.substring(5).trim();
        meta.desc = line;
    }
}

new Promise(function(resolve,reject){
    lineReader.eachLine(lastArg,function(line, last, cb){
        parseLine(line);
        if(meta.tags && meta.desc && meta.name){
            cb(false);
            resolve();
        }else{
            cb()
        }
    })
}).then(function(){
    meta.file = "/articles/"+meta.time+"/"+path.basename(lastArg);
    console.log("parse meta info succ!!",meta);
    storeLastData(meta)
    moveMarkDownFile(meta);
})

//获取last.json文件中的数据
function storeLastData(meta){
  var content = fs.readFileSync("data/last.json","UTF-8");
  var json = JSON.parse(content);
  json.push(meta);
  console.log("last data:",json);
  fs.writeFileSync("data/last.json",JSON.stringify(json),"UTF-8");
}

function moveMarkDownFile(meta){
    var file = meta.file.substring("1");
    fs.mkdirSync(path.extname(file))

    fs.writeFileSync(file,fs.readFileSync(lastArg));
    fs.unlinkSync(lastArg);
}