const Ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
];

const Styles = {
    flex: {
	display: 'flex',
    },
    spaceBetween: {
	display: 'flex',
	justifyContent: 'space-between',
    },
    center: {
	display: 'flex',
	justifyContent: 'center',
    },
    column: {
	display: 'flex',
	flexDirection: 'column',
    },
    row: {
	diplay: 'flex',
	flexDirection: 'row',
    },
    underlineBold: {
	fontWeight: 'bold',
	textDecoration: 'underline',
    },
    bold: {
	fontWeight: 'bold',
    },
    underline: {
	textDecoration: 'underline',
    },
    popup: {
	position: 'fixed',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	margin: 'auto',
	backgroundColor: 'rgba(0,0,0, 0.5)',
    },
    popupInner: {
	position: 'absolute',
	left: '25%',
	right: '25%',
	top: '25%',
	bottom: '25%',
	margin: 'auto',
	background: 'white',
    },
};

const NFL_TEAM_LIST = [
    "Arizona Cardinals",
    "Atlanta Falcons",
    "Baltimore Ravens",
    "Buffalo Bills",
    "Carolina Panthers",
    "Chicago Bears",
    "Cincinnati Bengals",
    "Cleveland Browns",
    "Dallas Cowboys",
    "Denver Broncos",
    "Detroit Lions",
    "Green Bay Packers",
    "Houston Texans",
    "Indianapolis Colts",
    "Jacksonville Jaguars",
    "Kansas City Chiefs",
    "Miami Dolphins",
    "Minnesota Vikings",
    "New England Patriots",
    "New Orleans Saints",
    "New York Giants",
    "New York Jets",
    "Oakland Raiders",
    "Philadelphia Eagles",
    "Pittsburgh Steelers",
    "Los Angeles Rams",
    "Los Angeles Chargers",
    "San Francisco 49ers",
    "Seattle Seahawks",
    "Tampa Bay Buccaneers",
    "Tennessee Titans",
    "Washington Redskins",
];

const positionAbreviations = {
    LDE: "Left Defensive End",
    NT: "Nose Tackle",
    RDE: "Right Defensive End",
    LOLB: "Left Outside Linebacker",
    LILB: "Left Inside Linebacker",
    RILB: "Right Inside Linebacker",
    ROLB: "Right Outside Linebacker",
    SS: "Strong Safety",
    FS: "Free Safety",
    RCB: "Right Cornerback",
    LCB: "Left Cornerback",
    WR: "Wide Receiver",
    TE: "Tight End",
    LT: "Left Tackle",
    LG: "Left Guard",
    C: "Center",
    RG: "Right Guard",
    RT: "Right Tackle",
    QB: "Quarterback",
    FB: "Fullback",
    RB: "Running Back",
    PK: "Place Kicker",
    P: "Punter",
    H: "Holder",
    PR: "Punt Returner",
    KR: "Kick Returner",
    LS: "Long Snapper",
};

const offensePositions = [
    "C",
    "FB",
    "HB",
    "LG",
    "LT",
    "QB",
    "RG",
    "RT",
    "TE",
    "WR",
    "WR",
];

const defensePositions = [
    "CB",
    "CB",
    "DT",
    "DT",
    "FS",
    "LE",
    "LOLB",
    "MLB",
    "RE",
    "ROLB",
    "SS",
];

const specialPositions = [
    "H",
    "K",
    "KR",
    "LS",
    "P",
    "PR",
];

export default {Ordinals, Styles, NFL_TEAM_LIST, offensePositions, defensePositions, specialPositions};
