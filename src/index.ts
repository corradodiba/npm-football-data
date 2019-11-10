import * as needle from 'needle';

let options = {
    headers: { 'X-Auth-Token': '3ed277c07502468b9acf3f1b56e31bc3' }
}

let footballOptions = {
    competitions: 'SA',
}

function getAllTeamsByComp(): Promise<any> {
    const response = new Promise((resolve, reject) => {
        needle.get(
            `http://api.football-data.org/v2/competitions/${footballOptions.competitions}/teams`,
            options, 
            (err, resp) => {
            if (resp.statusCode === 200) {
                resolve(resp.body);
            } else if(err) {
                reject(`[${resp.statusCode}] ${err}`);
            }
        });
    });
    return response;
}

function getTeamByName(shortName: String): Promise<any> {
    const response = new Promise((resolve, reject) => {
        return getAllTeamsByComp()
        .then(result => {
            for (let i = 0; i < result.teams.length; i++) {
                const team = result.teams[i];
                if(team.shortName === shortName) {
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

function getPlayersForTeam(shortName: String): Promise<any> {
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
            })
        })
    });
    return response;
    
}

// Private
function getTeamById(teamId: number): Promise<any> {
    const response = new Promise((resolve, reject) => {
        needle.get(`http://api.football-data.org/v2/teams/${teamId}`, options, (err, resp) => {
            if (resp.statusCode === 200) {
                resolve(resp.body);
            } else if(err) {
                reject(`[${resp.statusCode}] ${err}`);
            }
        });
    });
    return response;
}

function getPlayersForComp(limit: number = 0) {

    const response = new Promise(async (resolve, reject) => {
        const result = await getAllTeamsByComp();
        const players: any = {};
        const teamsLimit = limit === 0 
        ? 8
        : limit;

        for (let i = 0; i < teamsLimit; i++) {
            const teamId = result.teams[i].id;
            const teamWithPlayers = await getTeamById(teamId);
            const squad = teamWithPlayers.squad;
            console.log(i);
            players[teamWithPlayers.shortName] = squad;   
        }
        resolve(players);
    });
    return response;
}






