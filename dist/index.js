"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle = __importStar(require("needle"));
let options = {
    headers: { 'X-Auth-Token': '3ed277c07502468b9acf3f1b56e31bc3' }
};
let footballOptions = {
    competitions: 'SA',
};
function getAllTeamsByComp() {
    const response = new Promise((resolve, reject) => {
        needle.get(`http://api.football-data.org/v2/competitions/${footballOptions.competitions}/teams`, options, (err, resp) => {
            if (resp.statusCode === 200) {
                resolve(resp.body);
            }
            else if (err) {
                reject(`[${resp.statusCode}] ${err}`);
            }
        });
    });
    return response;
}
function getTeamByName(shortName) {
    const response = new Promise((resolve, reject) => {
        return getAllTeamsByComp()
            .then(result => {
            for (let i = 0; i < result.teams.length; i++) {
                const team = result.teams[i];
                if (team.shortName === shortName) {
                    return resolve(team);
                }
            }
            return reject({
                statusCode: 404,
                message: 'Team not found!'
            });
        });
    });
    return response;
}
function getPlayersForTeam(shortName) {
    const response = new Promise((resolve, reject) => {
        return getTeamByName(shortName).then(team => {
            const teamId = team.id;
            return getTeamById(teamId).then(team => {
                if (team.statusCode) {
                    return reject({
                        statusCode: 404,
                        message: 'Team not found!'
                    });
                }
                resolve(team.squad);
            });
        });
    });
    return response;
}
// Private
function getTeamById(teamId) {
    const response = new Promise((resolve, reject) => {
        needle.get(`http://api.football-data.org/v2/teams/${teamId}`, options, (err, resp) => {
            if (resp.statusCode === 200) {
                resolve(resp.body);
            }
            else if (err) {
                reject(`[${resp.statusCode}] ${err}`);
            }
        });
    });
    return response;
}
function getPlayersForComp(limit = 0) {
    const response = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const result = yield getAllTeamsByComp();
        const players = {};
        const teamsLimit = limit === 0
            ? 8
            : limit;
        for (let i = 0; i < teamsLimit; i++) {
            const teamId = result.teams[i].id;
            const teamWithPlayers = yield getTeamById(teamId);
            const squad = teamWithPlayers.squad;
            console.log(i);
            players[teamWithPlayers.shortName] = squad;
        }
        resolve(players);
    }));
    return response;
}
getPlayersForComp().then(players => {
    console.log(players);
});
// function getPlayersForComp() {
//     let players: any[] = [];
//     const response = new Promise(async (resolve, reject) => {
//         const result = await getAllTeamsByComp();
//         const teams = result.teams;
//         for (let i = 0; i < teams.length; i++) {
//             const team = teams[i];
//             console.log(team);
//             const fetchedTeam = await getTeamByName(team.shortName);
//             const teamSquad = await getTeamById(fetchedTeam.id);
//             players.push(teamSquad.squad);
//         }
//         resolve(players);
//     });
//     return response;
// }
//# sourceMappingURL=index.js.map