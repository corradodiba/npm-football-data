"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
const helpers_1 = require("./lib/helpers");
const leagues = __importStar(require("./lib/leagues.enum"));
exports.optionsData = {
    league: leagues.Italy.SERIEC_C
};
exports.leaguesList = leagues;
exports.fetchTeams = () => {
    let fetchedTeams = [];
    const teams = new Promise((resolve, reject) => {
        request_1.default(`${helpers_1.domain}${exports.optionsData.league}/squadre/`, (err, res, html) => {
            if (err || res.statusCode !== 200) {
                resolve(undefined);
            }
            const $ = cheerio_1.default.load(html);
            const teamsHtml = $('a.leagueTable__team');
            teamsHtml.each((i, team) => {
                fetchedTeams.push($(team).text());
            });
            resolve(fetchedTeams);
        });
    });
    return teams;
};
exports.fetchPlayersForTeam = (name) => {
    let fetchedPlayers = [];
    const players = new Promise((resolve, reject) => {
        helpers_1.findUrlTeam(name, exports.optionsData.league)
            .then(teamUrl => {
            request_1.default(`${helpers_1.domain}${teamUrl}/rosa`, (err, res, html) => {
                const $ = cheerio_1.default.load(html);
                const roles = $('.profileTable__row--start');
                roles.each((i, item) => {
                    let currentRow = $(item).next();
                    while (currentRow.hasClass('profileTable__row--between')) {
                        const shirtNumber = $(currentRow).find('.tableTeam__squadNumber');
                        const name = $(currentRow).find('.tableTeam__squadName--playerName a');
                        const age = $(currentRow).find('.playerTable__sportIcon--age');
                        const presence = age.next('.playerTable__sportIcon');
                        const goals = presence.next('.playerTable__sportIcon');
                        const yellowCards = goals.next('.playerTable__sportIcon');
                        const redCards = yellowCards.next('.playerTable__sportIcon');
                        const player = {
                            shirtNumber: +$(shirtNumber).text(),
                            name: $(name).text(),
                            age: +($(age).text()),
                            presence: +$(presence).text(),
                            goals: +$(goals).text(),
                            yellowCards: +$(yellowCards).text(),
                            redCards: +$(redCards).text(),
                            role: helpers_1.customizeRole($(item).text())
                        };
                        fetchedPlayers.push(player);
                        currentRow = currentRow.next('.profileTable__row');
                    }
                });
                resolve(fetchedPlayers);
            });
        });
    });
    return players;
};
exports.fetchPlayersForTeam('Catania').then(players => {
    console.log(players);
});
//# sourceMappingURL=index.js.map