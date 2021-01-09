// Your .ROBLOSECURITY cookie
const cookie = `_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_6E898AFFE6DFD74E03A38CBEEDFF92C1FF5EA6EAE497F7E3C41507402300A24A58B70E00E944E57AD58E484DA1FDBE9F66CA9D7E56E7CDC0AB72906B0679C62545537A6EF36786E9E1DEAEB5E9AFF205EBC9FC78DEA09E1AC6E7FB2869F764D4529E4E893381482B424EA5DC1AE1BA67584F0AB33893A827771A42982965965B4F5E48CF1FAF6CC9ED6052B011151D71B81D23B0B7F2D131834F0DE8E662DD004E34C44C38A67F2DC6A380990C845CC0C692DF7D99EB37AC0CC1A08D9DBDEA1D219961993FD4821C6E72FA3EB3B20DE3C4CC1C7D29A326815DEB7CEEBB928C1E7252126D7A09975A3BA91DA222C4DAC2E01D3ED631C5E3AA24302C0558D8CCF1FA5855ECF3209CB7A5E1704BFD0D7FBD2552CC6DAE0407216E8B84726822AC30ADD0CDB9`
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
