import request, { Response } from 'request';
import cheerio from 'cheerio';

export const domain = 'https://www.diretta.it';


export const findUrlTeam = (nameTeam: String, league: String): Promise<String> => {
    const teams = new Promise<String>((resolve, reject) => {
        request(`${domain}${league}/squadre/`, (err: Error, res: Response, html: string) => {
            const $ = cheerio.load(html);
            const teamsHtml = $('a.leagueTable__team');
            teamsHtml.each((i: Number, team: CheerioElement) => {
                if ($(team).text() === nameTeam) {
                    resolve($(team).attr('href'));
                } 
            });
            resolve(undefined);
        });
    });
    return teams;
}

export const customizeRole = (role: String): String => {

    return role === 'Portieri' 
    ? 'Goalkeaper'
    : role === 'Difensori'
    ? 'Defender'
    : role === 'Centrocampisti'
    ? 'Midfielder'
    : role === 'Attaccanti'
    ? 'Forward'
    : 'Coach';
}