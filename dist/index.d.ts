import * as leagues from './lib/leagues.enum';
import Player from './lib/models/player.model';
export declare let optionsData: {
    league: String;
};
export declare const leaguesList: typeof leagues;
export declare const fetchTeams: () => Promise<String[]>;
export declare const fetchPlayersForTeam: (name: String) => Promise<Player[]>;
//# sourceMappingURL=index.d.ts.map