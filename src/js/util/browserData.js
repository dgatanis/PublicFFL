//Sets the browser data needed for other scripts
import { getCurrentWeek, getCurrentSeason, inauguralSeason, leagueDisplayName, leagueUser } from './leagueInfo.js';
const leagueInfo = await import('./leagueInfo.js');

try{
    setBrowserData();
}
catch (error) {
    console.error(`Error: ${error.message}`);
}

async function setBrowserData() {
    try{

        const currentWeek = await getCurrentWeek();
        const currentLeagueId = await leagueInfo.default();
        const previousLeague = await previousLeagueId(currentLeagueId);

        const expiration = new Date().getTime() + (2*60*60*1000); //2hrs
        const now = new Date()
        const currentExp = new Date(parseInt(localStorage.getItem("expiration")));

        if(!localStorage.getItem("expiration") || currentExp < now.getTime())
        {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem("expiration", expiration);
            setMatchupData(currentLeagueId,currentWeek);
            setAllTimeMatchupData();
            setPlayerData();
            setATLeagueIds();
            setRosterData(currentLeagueId);
            setUserData(currentLeagueId);
            setLeagueDetails(currentLeagueId);
            if(now.getMonth() >=5)
            {
                setPlayoffsData(currentLeagueId);
            }
            else
            {
                setPlayoffsData(previousLeague);
            }
        }
        if(!sessionStorage.getItem("MatchupData"))
        {
            setMatchupData(currentLeagueId,currentWeek);
        }
        if(!sessionStorage.getItem("ATMatchupData"))
        {
            setAllTimeMatchupData();
        }
        if(!localStorage.getItem("PlayerData"))
        {
            setPlayerData();
        }
        if(!localStorage.getItem("ATLeagueIds"))
        {
            setATLeagueIds();
        }
        if(!localStorage.getItem("RosterData"))
        {
            setRosterData(currentLeagueId);
        }
        if(!localStorage.getItem("UserData"))
        {
            setUserData(currentLeagueId);
        }
        if(!localStorage.getItem("LeagueData"))
        {
            setLeagueDetails(currentLeagueId);
        }
        if(!localStorage.getItem("PlayoffData"))
        {
            if(now.getMonth() >=5)
            {
                setPlayoffsData(currentLeagueId);
            }
            else
            {
                setPlayerData(previousLeague);
            }
        }
        
    }
    catch(error){
        console.error(`Error: ${error.message}`);
    }

}

async function setRosterData(leagueID){
    try
    {
        const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`);
        const rosterData = await rosterResponse.json();
        rosterData.forEach(element => {
                element.metadata = {};
        });
        localStorage.setItem("RosterData", JSON.stringify(rosterData));
        return rosterData;
    }
    catch (error) {
        console.log(error);
    }

}

async function setPlayoffsData(leagueID) {
    try
    {
        const playoffResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/winners_bracket`);
        const playoffData = await playoffResponse.json();

        localStorage.setItem("PlayoffData", JSON.stringify(playoffData));
        return playoffData;
    }
    catch (error) {
        console.log(error);
    }
}

async function previousLeagueId(leagueID) {
    const userLeagues = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
    const leagueData = await userLeagues.json();

    let previousLeagueId = leagueData.previous_league_id;
    return previousLeagueId;

}

async function setATLeagueIds() {

    var leagueIds = {
        "ATLeagueId" : []
    };

    try{
        var thisYear = await getCurrentSeason();
        const currentLeagueId = await leagueInfo.default();
        var lastLeagueId = currentLeagueId;

        while(lastLeagueId != 0 && lastLeagueId != null)
        {
            leagueIds.ATLeagueId.push({
                "league_id": lastLeagueId,
                "year": thisYear.toString()
            });

            thisYear = thisYear - 1;
            lastLeagueId = await previousLeagueId(lastLeagueId);
            
        }

        localStorage.setItem("ATLeagueIds", JSON.stringify(leagueIds));

    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
}

async function setPlayerData() {

    try
    {
        var myPlayerMap = {
            "players" : []
        };
        const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`);
        const data = await res.json();
        const playerPositions = ["QB", "RB", "WR", "TE", "K", "DEF"];

        for(let key in data)
        {
           if(data[key] && playerPositions.includes(data[key].position))
           {
                let playerTeam = data[key].team;

                if(playerTeam === null)
                {
                    playerTeam = "FA";
                }
                if(data[key].position =="DEF")
                {
                    myPlayerMap.players.push({
                        "player_id": data[key].player_id,
                        "position": data[key].position,
                        "firstname": data[key].first_name,
                        "lastname": data[key].last_name,
                        "age": 0,
                        "team": data[key].player_id,
                        "number": null,
                        "height": null,
                        "weight": null,
                        "years_exp": null,
                        "rotowire_id": null,
                        "college": null,
                        "search_rank": null,
                        "injury_status": null,
                        "injury_body_part": null
                    });
                }
                else {
                    myPlayerMap.players.push({
                        "player_id": data[key].player_id,
                        "position": data[key].position,
                        "firstname": data[key].first_name,
                        "lastname": data[key].last_name,
                        "age": data[key].age,
                        "team": playerTeam,
                        "number": data[key].number,
                        "height": data[key].height,
                        "weight": data[key].weight,
                        "years_exp": data[key].years_exp,
                        "rotowire_id": data[key].rotowire_id,
                        "college": data[key].college,
                        "search_rank": data[key].search_rank,
                        "injury_status": data[key].injury_status,
                        "injury_body_part": data[key].injury_body_part
                    });
                }

           }
        }

        localStorage.setItem("PlayerData", JSON.stringify(myPlayerMap));
    }
    catch (error) {
        console.log(error);
    }
}


async function setUserData(leagueID){
    try {
        const res = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`);
        const data = await res.json();
        data.forEach(element => {
                element.metadata["team_name"] = "";
        });

        for(let i=0; i<data.length; i++)
        {
            data[i].metadata["team_name"] = "Team_"+(i+1);
        }
        localStorage.setItem("UserData", JSON.stringify(data));
    }
    catch (error) {
        console.log(error);
    }
}

async function setLeagueDetails(leagueID) {
    try {
        const leagueData = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
        const league = await leagueData.json();
        league.name = "";
        localStorage.setItem("LeagueData", JSON.stringify(league));
    }
    catch (error) {
        console.log(error);
    }
}

async function setMatchupData(leagueID, currentWeek) {

    try
    {
        let totalWeeksPlayed = parseInt(currentWeek);
        let matchupWeeks = [];
        let upToCurrentWeekMatchups = [];

        for(let i = 1; i<=totalWeeksPlayed; i++)
        {
            let matchupsArray = [];
            const matchup = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/matchups/${i}`);
            const matchupData = await matchup.json();

            if(matchupData)
            {
                for(let matchups of matchupData)
                {
                    matchupsArray.push({
                        ...matchups
                    });
                }
                matchupWeeks.push({
                    ...matchupsArray
                });

            }

        }

        upToCurrentWeekMatchups.push({
            matchupWeeks
        });

        sessionStorage.setItem("MatchupData", JSON.stringify(upToCurrentWeekMatchups));
    }
    catch (error)
    {
        console.error(`Error: ${error.message}`);
    }

}

async function setAllTimeMatchupData() {
    try{
        var thisYear = await getCurrentSeason();
        const currentLeagueId = await leagueInfo.default();
        var lastLeagueId = currentLeagueId;
        let matchupWeeks = [];
        let allTimeMatchups = [];

        while(lastLeagueId != 0 && lastLeagueId != null)
        {
            for(let i = 0; i<=18; i++)
            {
                const matchup = await fetch(`https://api.sleeper.app/v1/league/${lastLeagueId}/matchups/${i}`);
                const matchupData = await matchup.json();
                let matchupsArray = [];

                if(matchupData)
                {
                    for(let matchups of matchupData)
                    {
                        if(matchups)
                        {
                            matchupsArray.push({
                                ...matchups
                            });
                        }
                    }
                    matchupWeeks.push({
                        ...matchupsArray
                        ,"year": thisYear.toString()
                        ,"week": i
                    });
    
    
                }
            }
            thisYear = thisYear - 1;
            lastLeagueId = await previousLeagueId(lastLeagueId);
            
        }

        allTimeMatchups.push({
            matchupWeeks
        });

        sessionStorage.setItem("ATMatchupData", JSON.stringify(allTimeMatchups));

    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
    

}