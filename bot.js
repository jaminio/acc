// Your .ROBLOSECURITY cookie
const cookie = `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_13546AAA14E6B1B58F45D31033AACC3F2C71D67053518ACEC74061EF12720530CD2D7A7CB70CDF1F204F2DA2E74B36A828809A0EA2B99C6EA041C8CA47BBFBF62CB8DA77086A0C9F4F2E45040502847EECC4F7B5A5DAA0A19B2AE682180F30C04A16172F221333FE88C5489140ADC6715220A02A321AC3F76E541042603AB41E267F5D924F44BCC12194DD4901003037F382F133DB218187DE56EFCF23801BB620C514BA117446B691D0CDBAE88C71B67B91E84BBB0CECCEEA7ACFE7E36F5ADEFCA499392135018C13CD1D4DCC40135F45B05C1C7682C406E411C860D8DEEB1351EE2C00FE1B5B25BD523EF6A5019FE1BD36471982E12A9A94D19E6D4A338BB06465FA642D1DAB45F75FF2525DFECE45837BC31E0CFFB157417D7B8511F5278BC0212F323EEBFBC8D523EBF68F6F9BE173B4D913`
// Your Group ID
const groupid = 5715531
// Your Ally Keywords
const keyword = "Clothing";
// Pages of groups:
const grouppages = 30
// Page to skip to
const starterpage = 15; // It will start allying at this page


const axios = require('axios-https-proxy-fix');
const chalk = require('chalk')


function getGroups() {
    return new Promise(async xd => {
        var groups = []
        var num = 0;
        async function groupsFromCursor(cursor) {
            num++;
            if (num > grouppages) { return null; }
            var boomer = await axios.request({
                url: "https://groups.roblox.com/v1/groups/search?cursor=" + (cursor ? cursor : "") + "&keyword="+ keyword + "&limit=100&prioritizeExactMatch=false&sortOrder=Asc"
            })
            var groups2 = boomer.data.data;
            groups2.forEach(g => {
                groups.push(g)
            })
            console.log(chalk.hex("#00aaff").bold("Downloading page "+ num+ " of groups..."))
            await groupsFromCursor(boomer.data.nextPageCursor)
        }
        await groupsFromCursor();
        xd(groups)
        return groups;
    })
}


var rproxies = require('fs').readFileSync("./proxies.txt").toString().split("\r").join("").split("\n")
var proxies = []
rproxies.forEach(d => {
    var auth;
    if (d.split(":")[2]) {
        auth = { username: d.split(":")[2], password: d.split(":")[3] }
    }
    proxies.push({
        host: d.split(":")[0],
        port: d.split(":")[1],
        auth: auth
    })
})
console.log(proxies)
var ind = 0;
function getProxy() {
    if (proxies.length == ind) {
        ind = -1;
    }
    ind++;
    return proxies[ind]
}

getGroups().then(async groups => {
    groups.splice(starterpage)
    console.log("Sending allies right now...")
    groups.forEach(group => {
        if (group.id && group.name) {
            function request(xcsrf) {
                return new Promise(done => {
                    axios.request({
                        url: `https://groups.roblox.com/v1/groups/${groupid}/relationships/allies/${group.id}`,
                        method: 'POST',
                        headers: {
                            'Cookie': `.ROBLOSECURITY=${cookie};`,
                            'x-csrf-token': xcsrf
                        },
                        proxy: getProxy()
                    }).then(oop => {
                        console.log(chalk.hex("#ffaa00").bold("WORKED -> "+ group.name))
                        done()
                    }).catch(gay => {
                        if (gay.response.headers['x-csrf-token']) {
                            request(gay.response.headers['x-csrf-token'])
                            done()
                            return;
                        }
                        console.log(chalk.hex("#ff0000")("FAIL -> "+JSON.stringify(gay.response.data)))
                        done()
                    })
                })
            }
        }
        request('');
    })
    console.log(chalk.hex("#00ff00").bold("Completed with "+ grouppages+" pages!"))
})


function sleep(ms) {
    return new Promise(x => setTimeout(x, ms))
}
