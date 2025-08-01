export const leagueDisplayName = "Crush Cities ";
export const dues = 200; 
export const leagueUser = '467550885086490624';
export const dynasty = true; 
export const weeklyWinner = 35; //Amount won for highest weekly scorer
export const inauguralSeason = 2024; //year league began in Sleeper

export const leagueDescription = "Welcome to the Public dynasty fantasy football league, founded in the summer of 2020. This league is comprised of 10 members who dream of bringing home a jersey of their choice, each and every year. However, some owners' dreams are just that, dreams. At the conclusion of the season, the champion is given the opportunity to select our new destination to draft rookies that will almost certainly become future waiver additions for someone else. Luck? Skill? Who cares. The only thing that matters is: Don't. Finish. Last."

export default async function getCurrentLeagueId() {
    try {
        const thisSeason = await getCurrentSeason();
        var myLeagueId = await currentLeagueId(thisSeason);

        if(myLeagueId == null) //If current season isnt setup go back 1 year
        {
            myLeagueId = await currentLeagueId(thisSeason - 1);
        }

        return myLeagueId;
    }
    catch (error) {
        console.log("Error: ", error);
    }

}

export async function getCurrentSeason() {
    try {
        const nflState = await getNFLState();
        return nflState.league_season;
    } catch (error) {
        console.log("Error: ", error);
    }

}

export async function getCurrentWeek() {
    try {
        const nflState = await getNFLState();
        return nflState.leg;
    } catch (error) {
        console.log("Error: ", error);
    }

}

export async function getPlayoffsData(leagueId) {
    const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`); 
    const data = await res.json(); 

   return data;
}


async function currentLeagueId(thisYear) {
    const myUserId = leagueUser;
    const leagueName = leagueDisplayName;
    const userLeagues = await fetch(`https://api.sleeper.app/v1/user/${myUserId}/leagues/nfl/${thisYear}`);
    const leagueData = await userLeagues.json();

    const leagues = leagueData.map((league) => league);
    
    for(let league of leagues)
    {
        if(league.name === leagueName)
        {
            let thisLeagueId = league.league_id;
            return thisLeagueId;
        }
    }
}

async function getNFLState() {
    try {
        const nfl = await fetch(`https://api.sleeper.app/v1/state/nfl`);
        const nflData = await nfl.json(); 
    
        return nflData;
    }
    catch(error) {
        console.log("Error: ", error);
    }

}

export function setLeagueName(elementId) {
    var element = document.getElementById(elementId)

    element.innerText = "Public FFL";
}

export async function setLinkSource(elementId, userID1 = null, userID2 = null) {
    var element = document.getElementById(elementId);
    var leagueId = await getCurrentLeagueId();

    if(userID1 != null && userID2 != null) //sets link on for roster comparison
    {
        element.setAttribute('href', `https://keeptradecut.com/`)
    }
    else 
    {
        element.setAttribute('href', `https://keeptradecut.com/`)
    }
    
}

export function getLeagueURL() {
    const leagueURL = 'https://dgatanis.github.io/PublicFFL';
    let baseURL = new URL(leagueURL);
    if (!baseURL.pathname.endsWith('/')) {
        baseURL.pathname += '/';  // Ensure the trailing slash
    }
    return baseURL;
}

export function getRandomString() {

    var myArray = [
        "What an idiot",
        "*rolls eyes*",
        "Every league needs a taco amirite",
        "Well this certainly isn't going to work out",
        "Yikes",
        "Is this season over yet",
        "https://www.nflshop.com/<enter jersey they're buying here>",
        "Wack",
        "Anyone else throw-up in their mouth a little",
        "You're probably wondering how we got here",
        "Softer than Charmin",
        "Yea we're all thinking the same thing",
        "*yawns*",
        "Be better",
        "Jerseys aint cheap",
        "Tanking allegations ensuing",
        "We can do better than this",
        "*dry heaving*",
        "This hurts to look at",
        "Why are you like this"
    ]
    var randomNumber=Math.random()*myArray.length;
    randomNumber= Math.random()*myArray.length;
    var roundRandomNumber = Math.floor(randomNumber);

    return myArray[roundRandomNumber];
}
