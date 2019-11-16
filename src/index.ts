import request, { Response } from 'request';
import cheerio from 'cheerio';

import { 
    domain,
    findUrlTeam,
    customizeRole
 } from './lib/helpers';

import * as leagues from './lib/leagues.enum';
import Player from './lib/models/player.model';

export let optionsData = {
    league: leagues.Italy.SERIEC_C as String
}

export const leaguesList = leagues;

export const fetchTeams = (): Promise<String[]> => {
    let fetchedTeams: String[] = [];
    const teams = new Promise<String[]>((resolve, reject) => {
        request(`${domain}${optionsData.league}/squadre/`, (err: Error, res: Response, html: string) => {
            if (err || res.statusCode !== 200) {
                resolve(undefined);
            }
            const $ = cheerio.load(html);
            const teamsHtml = $('a.leagueTable__team');
            teamsHtml.each((i: Number, team: CheerioElement) => {
                fetchedTeams.push($(team).text());
            })
            resolve(fetchedTeams);
        });
    });
    return teams;
};
    

export const fetchPlayersForTeam = (name: String): Promise<Player []> => {
    let fetchedPlayers: Player[] = [];
    const players = new Promise<Player []>((resolve, reject) => {
        findUrlTeam(name, optionsData.league)
        .then(teamUrl => {
            request(`${domain}${teamUrl}/rosa`, (err: Error, res: Response, html: string) => {
                const $ = cheerio.load(html);
                const roles = $('.profileTable__row--start');
                roles.each((i: Number, item: CheerioElement) => {

                    let currentRow = $(item).next();
                    while (currentRow.hasClass('profileTable__row--between')) {
                        const shirtNumber = $(currentRow).find('.tableTeam__squadNumber');
                        const name = $(currentRow).find('.tableTeam__squadName--playerName a');
                        const age = $(currentRow).find('.playerTable__sportIcon--age');
                        const presence = age.next('.playerTable__sportIcon');
                        const goals = presence.next('.playerTable__sportIcon');
                        const yellowCards = goals.next('.playerTable__sportIcon');
                        const redCards = yellowCards.next('.playerTable__sportIcon');

                        const player: Player = {
                            shirtNumber: +$(shirtNumber).text(),
                            name: $(name).text(),
                            age: +($(age).text()),
                            presence: +$(presence).text(),
                            goals: +$(goals).text(),
                            yellowCards: +$(yellowCards).text(),
                            redCards: +$(redCards).text(),
                            role: customizeRole($(item).text())
                        };

                        fetchedPlayers.push(player);
                        currentRow = currentRow.next('.profileTable__row');
                    }
                })
                resolve(fetchedPlayers);
            });
        });
    });
    return players;
}


fetchPlayersForTeam('Catania').then(players => {
    console.log(players);
});