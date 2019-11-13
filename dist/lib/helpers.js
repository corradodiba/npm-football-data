"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
exports.domain = 'https://www.diretta.it';
exports.findUrlTeam = (nameTeam, league) => {
    const teams = new Promise((resolve, reject) => {
        request_1.default(`${exports.domain}${league}/squadre/`, (err, res, html) => {
            const $ = cheerio_1.default.load(html);
            const teamsHtml = $('a.leagueTable__team');
            teamsHtml.each((i, team) => {
                if ($(team).text() === nameTeam) {
                    resolve($(team).attr('href'));
                }
            });
            resolve(undefined);
        });
    });
    return teams;
};
exports.customizeRole = (role) => {
    return role === 'Portieri'
        ? 'Goalkeaper'
        : role === 'Difensori'
            ? 'Defender'
            : role === 'Centrocampisti'
                ? 'Midfielder'
                : role === 'Attaccanti'
                    ? 'Forward'
                    : 'Coach';
};
//# sourceMappingURL=helpers.js.map