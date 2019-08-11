import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import playerInfo from './newPlayerInfo.js';

const Ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
];

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

const Player = ({player, deactivatePlayer}) => (
    <div className='clickable' onClick={deactivatePlayer}>
	{player.position}, {player.name}, {player.overall}, {player.isActive ? "Active" : "Inactive"}
    </div>
);

const Team = ({team, teamOverall, deactivatePlayer, yourTeam, page}) => {
    return (
	<>
	    <div className='col'>
		<div className='spac'>
		    <div className='headerTwo'>{team.name}, Team Overall: {teamOverall}</div>
		    {page ? team.name !== yourTeam.name ?
		     <div className='button'
			  onClick={() => {
			      globe.changeBoard("tradePage");
			      globe.setActiveTeam(team.name);
			  }}>Offer Trade</div> : null : null}
		</div>
		<div>
		    {globe.sortPlayers(team.name).map(player => (
			<div key={player.name} className='spac'>
			    <Player
				key={player.name}
				deactivatePlayer={() => deactivatePlayer(player)}
				player={player}
			    />
			    {team.name === yourTeam.name ?
			     <div className='button' onClick={() => globe.dropPlayer(team.name, player)}>Drop Player</div> : null}
			</div>
		    ))}
		    <br />
		</div>
	    </div>
	</>
    )
};

const FreeAgents = ({freeAgents, yourTeam}) => (
    <React.Fragment>
	{Object.values(freeAgents).map(player => 
	    <div className='spac' key={player.name}>
		<div className='bigFlex'>
		    <Player
			key={player.name}
			player={player}
		    />
		</div>
		<div>${player.cost}</div>
		<div className='button' key={player.name+"button"} onClick={() => globe.addFreeAgent(yourTeam, player)}>Add Player</div>
	    </div>
	)}
    </React.Fragment>
);

const Schedule = ({team}) => (
    <React.Fragment>
	<div className='headerTwo' key={team.name + "Schedule"}>{team.name} Schedule: </div>
	{team.schedule.map(({week, home, vsName, result}) =>
	    <div
		key={"week" + week}
		onClick={() => globe.setActiveTeam(vsName)}
	    >
		Game {week}: {home ? "" : "@"}{vsName}{result == null ? "" : ", " + result}
	    </div>
	)}
    </React.Fragment>
);

const PageSwitcher = ({activePage, pages}) => (
    <React.Fragment>
	<div className="menu">
	    {Object.values(pages).map(el => (
		<div
		    className={activePage === el ? 'activePage' : 'inactivePage'}
		    key={el}
		    onClick={() => globe.changeBoard(el)}
		>
		    {el}
		</div>		    
	    ))}
	</div>
    </React.Fragment>
);

/* const Menu = ({className, list, clickFn, styleFn, nameFn}) => (
 *     <React.Fragment>
 * 	<div className="menu">
 * 	    {Object.values(list).map(el => (
 * 		<button
 * 		    className={className(el)}
 * 		    key={el}
 * 		    onClick={() => clickFn(el)}
 * 		>
 * 		    {nameFn(el)}
 * 		</button>		    
 * 	    ))}
 * 	</div>
 *     </React.Fragment>
 * );
 *  */
const TeamSwitcher = ({activeTeam, teams}) => (
    <React.Fragment>
	<PullDown
	    selectedValue={activeTeam}
	    list={Object.values(teams)}
	    changeFn={(event) => globe.setActiveTeam(event.target.value)}
	    name={"Active team: "}
	    nameFn={(el) => el.name}
	/>
    </React.Fragment>
);

const SortSwitcher = ({primarySortBy, secondarySortBy, playerAttributes}) => (
    <React.Fragment>
	<div>
	    <div>
		<PullDown
		    selectedValue={primarySortBy}
		    list={playerAttributes}
		    changeFn={(event) => globe.switchPrimarySortBy(event.target.value)}
		    name={"Primary sort: "}
		    nameFn={(el) => el}
		/>
	    </div>
	    <div>
		<PullDown
		    selectedValue={secondarySortBy}
		    list={playerAttributes}
		    changeFn={(event) => globe.switchSecondarySortBy(event.target.value)}
		    name={"Secondary sort: "}
		    nameFn={(el) => el}
		/>
	    </div>
	</div>
    </React.Fragment>
);

const PullDown = ({selectedValue, list, changeFn, name, nameFn}) => (
    <React.Fragment>
	<div>
	    {name}
	    <select value={selectedValue} onChange={changeFn}>		    
		{list.map(el => 
		    <option key={nameFn(el)} value={nameFn(el)}>{nameFn(el)}</option>
		)}
	    </select>
	</div>
    </React.Fragment>
);

const Transactions = ({team}) => (
    <React.Fragment>
	<div className='headerTwo'>Your Recent Roster Moves:</div>
	{team.transactions.slice().reverse().map((transaction, i) => {
	    while (i < 4) {
		if (transaction.type === "Added Free Agent" || transaction.type === "Dropped") {
		    return <div key={transaction.type + transaction.player.name}>
			<div key={transaction.type + transaction.player.name}>{transaction.type} {transaction.player.name}</div>
		    </div>;
		} else if (transaction.type === "Trade") {		    
		    return (
			<div className='col'>
			    <div className='headerThree'>Traded </div> 
			    {transaction.playerList[0].map((player) => (
				<div><Player player={player} deactivatePlayer={() => true} /></div>
			    ))}
			    <div className='headerThree'>to {transaction.teamList[1]} for </div>
			    {transaction.playerList[1].map((player) => (
				<div><Player player={player} deactivatePlayer={() => true} /></div>
			    ))}
			</div>
		    );		
		}
	    }
	    return null;
	})}
    </React.Fragment>
);

const Trade = ({trade}) => (
    <React.Fragment>
	<div>
	    Send
 	    {trade.player[0].map(player => (
 		<div key={player.name}><Player player={player} deactivatePlayer={() => true} /></div>
 	    ))}
	    to {trade.teamNames[1]} for
	    {trade.player[1].map(player => (
 		<div key={player.name}><Player player={player} deactivatePlayer={() => true} /></div>
 	    ))}
	    <div className='button' onClick={() => globe.acceptTrade(trade)}>
		Accept Trade
	    </div>
	</div>
    </React.Fragment>
);

const Trades = ({trades}) => (
    <React.Fragment>
	<div>
	    <div className='headerTwo'>Trades:</div>
	    <div className='headerThree'>Offered Trades:</div>
	    {trades.tradesFrom.map((trade, i) =>		
		<div key={"trade" + i}><Trade trade={trade} /></div>
	    )}
	    <div className='headerThree'>Received Trades:</div>
	</div>
    </React.Fragment>
);

const MainPage = ({teams, yourTeam, week}) => (
    <React.Fragment>
	<div className='spac'>
	    <div><Schedule team={teams[yourTeam]} setActiveTeam={() => true}/></div>
	    <div className='col'>
		<div className='powerCol'>
		    <Transactions team={teams[yourTeam]} />
		</div>
		<div className='hiddenPowerCol'>
		    <Trades trades={teams[yourTeam].trades}/>
		</div>
	    </div>
	</div>
	<br />
	<div className='button' onClick={() => globe.changeBoard("gamePage")}>
	    Simulate Next Week
	</div>
    </React.Fragment>
);

const RosterPage = ({teams, activeTeam, yourTeam, primarySortBy, secondarySortBy, playerAttributes}) => (
    <React.Fragment>
	<TeamSwitcher teams={teams} activeTeam={activeTeam} />
	<SortSwitcher primarySortBy={primarySortBy} secondarySortBy={secondarySortBy} playerAttributes={playerAttributes} />
	<Team
	    key={activeTeam.name}
	    teamOverall = {globe.calculateTeamOverall(teams[activeTeam])}
	    team={teams[activeTeam]}
	    deactivatePlayer={activeTeam === yourTeam.name ?
			  (player) => globe.deactivatePlayer(activeTeam, player.name) :
				      () => true}
	    yourTeam={yourTeam}
	    page={true}
	/>	
    </React.Fragment>
);

const FreeAgentPage = ({freeAgents, yourTeam}) => (
    <React.Fragment>
	<div className={'header'}>Free Agents</div>
	<FreeAgents freeAgents={freeAgents} yourTeam={yourTeam} />
    </React.Fragment>
);

const SchedulePage = ({page, teams, activeTeam}) => (
    <React.Fragment>
	<TeamSwitcher teams={teams} activeTeam={activeTeam} />
	<Schedule team={teams[activeTeam]} />
    </React.Fragment>
);

const ProposedTrade = ({proposedTrade, yourTeam, activeTeam}) => (
    <React.Fragment>
	<div className='spac'>
	    <div className='powerCol'>Your Team:
		<div>
		    {proposedTrade.map(({player, team}) => (
			team === yourTeam ?
			<Player key={player.name} player={player} deactivatePlayer={() => globe.addToProposedTrade(player)}/> : null))}
		</div>
	    </div>
	    <div className='powerCol'>{activeTeam}:
		<div>
	    	    {proposedTrade.map(({player, team}) => (
			team === activeTeam ?
			<Player key={player.name} player={player} deactivatePlayer={() => globe.addToProposedTrade(player)}/> : null))}
		</div>
	    </div>
	</div>
    </React.Fragment>
);

const TradePage = ({yourTeam, activeTeam, teams, proposedTrade}) => (
    <React.Fragment>
	<TeamSwitcher teams={teams} activeTeam={activeTeam} />
	<div className='spac'>
	    <div className='bigFlex'>
		<Team
		    key={yourTeam}
		    team={teams[yourTeam]}
		    teamOverall={globe.calculateTeamOverall(teams[yourTeam])}
		    deactivatePlayer={(player) => globe.addToProposedTrade(player, yourTeam)}
		    yourTeam={yourTeam}
		/>
	    </div>
	    <div className='bigFlex'>
		<Team
		    key={activeTeam}
		    team={teams[activeTeam]}
		    teamOverall={globe.calculateTeamOverall(teams[activeTeam])}
		    deactivatePlayer={(player) => globe.addToProposedTrade(player, activeTeam)}
		    yourTeam={yourTeam}
		/>
	    </div>
	</div>
	<div className='headerThree'>Proposed Trade:</div>
	<div><ProposedTrade proposedTrade={proposedTrade} yourTeam={yourTeam} activeTeam={activeTeam} /></div>
	<div
	    className='button'
	    onClick={() => globe.offerTrade(proposedTrade, yourTeam, activeTeam)}
	>
	    Propose Trade
	</div>
    </React.Fragment>
);

const Board = ({state}) => {
    if (state.page === state.pages[0]) {
	return <MainPage
		   teams={state.teams}
		   yourTeam={state.yourTeam}
		   week={state.week}
	/>
    } else if (state.page === state.pages[1]) {
	return <RosterPage
		   teams={state.teams}
		   activeTeam={state.activeTeam}
		   yourTeam={state.teams[state.yourTeam]}
	           primarySortBy={state.primarySortBy}
	           secondarySortBy={state.secondarySortBy}
	           playerAttributes={state.playerAttributes}
	/>;
    } else if (state.page === state.pages[2]) {
	return <FreeAgentPage freeAgents={state.freeAgents} yourTeam={state.yourTeam} />;
    } else if (state.page === state.pages[3]) {
	return <SchedulePage
		   teams={state.teams}
		   activeTeam={state.activeTeam}
		   page={state.pages[state.page]}
	/>;	
    } else if (state.page === "tradePage") {
	return <TradePage
		   yourTeam={state.yourTeam}
		   activeTeam={state.activeTeam}
		   teams={state.teams}
		   proposedTrade={state.proposedTrade}
	/>
    } else if (state.page === "gamePage") {
	return (
	    <div className='gamePage'>
		<Game
		    homeGame={state.teams[state.yourTeam].schedule[state.week].home}
		    yourTeam={state.teams[state.yourTeam]}
		    opposingTeam={state.teams[state.teams[state.yourTeam].schedule[state.week].vsName]}
		/>
	    </div>
	)
    }
};

const TopInfo = ({activePage, pages, yourTeam, teams, week}) => {
    const teamRecord = globe.calculateTeamRecord(teams[yourTeam]);
    return (
	<React.Fragment>
	    <div className='spac'>
		<div>
		    <PageSwitcher activePage={activePage} pages={pages} />
		</div>
		<div className='info'>
		    <div>Your Team: {yourTeam}</div>
		    <div>Record: {teamRecord[0]}-{teamRecord[1]}-{teamRecord[2]}</div>
		    <div>Money: {teams[yourTeam].money}</div>
		</div>
	    </div>
	    <div className='centerHeaderTwo'>Week {week + 1}</div>
	</React.Fragment>
    );
};

class Globe {
    constructor() {
	this.state = {	    
	    playerAttributes: null,
	    primarySortBy: "isActive",
	    secondarySortBy: "overall",
	    positions: {
		offense: ["QB", "WR", "TE", "RB"],
		defense: ["RD", "CB", "LB", "SF", "NB"],
	    },
	    proposedTrade: [],
	    yourTeam: "Denver Broncos",
	    pages: [
		"Main Page",
		"Team Rosters",
		"Free Agents",
		"Upcoming Schedule",
	    ],
	    page: "Main Page",
	    week: 0,
	    activeTeam: "Denver Broncos",
	    teams: {},
	    freeAgents: {
		test1: {name: "test1", position: "RB", isActive: false, overall: 200, cost: 30},
		test2: {name: "test2", position: "TE", isActive: false, overall: 100, cost: 200},
		test3: {name: "test3", position: "TE", isActive: false, overall: 100, cost: 200},
	    },
	};	
	this.fn = null;
    }
    
    setState = (newObj) => {
	const newState = {...this.state, ...newObj};
	this.state = newState;
	this.fn(this.state);
    }

    setTeamState = (fn) => {
	this.setState({teams: fn({...this.state.teams})});
    }

    addTeams() {
	this.setTeamState((newTeams) => {
	    for (let i = 0; i < NFL_TEAM_LIST.length; i++) {
		newTeams[NFL_TEAM_LIST[i]] = {
		    trades: {
			tradesFrom: [],
			tradesTo: [],
		    },
		    transactions: [],
		    number: i + 1,
		    name: NFL_TEAM_LIST[i],
		    players: {},
		    schedule: [],
		    money: 200,
		};
	    }
	    return newTeams;
	})
    }
    
    addPlayers() {
	const keepAsString = [
	    "name",
	    "team",
	    "Conference",
	    "Division",
	    "position",
	    "Handed",
	    "College",
	];
	let jsonObj = [];
	const arr = playerInfo.split('\n');
	const headers = arr[0].split(',');
	for (let i = 1; i < arr.length; i++) {
	    const data = arr[i].split(', ');
	    let obj = {};
	    for (let j = 0; j < data.length; j++) {
		if (keepAsString.includes(headers[j])) {
		    obj[headers[j]] = data[j];
		} else {
		    obj[headers[j]] = parseInt(data[j]);
		}
	    }
	    obj.isActive = false;
	    jsonObj.push(obj);
	}
	headers.push("isActive");
	this.setState({playerAttributes: headers.sort()});
	for (let i = 0; i < jsonObj.length; i++) {
	    const temp = {};
	    temp[jsonObj[i].name] = jsonObj[i];
	    this.setTeamState((newTeams) => {
		const newPlayers = {...newTeams[jsonObj[i].team].players};
		Object.assign(newPlayers, temp);
		newTeams[jsonObj[i].team] = {
		    ...newTeams[jsonObj[i].team],
		    players: newPlayers,
		};
		return newTeams;
	    });
	}
    }

    switchPrimarySortBy = (el) => {
	this.setState({primarySortBy: el});
	this.sortPlayers();
    }

    switchSecondarySortBy = (el) => {
	this.setState({secondarySortBy: el});
	this.sortPlayers();
    }
    
    deactivatePlayer = (teamName, player) => {
	this.setTeamState((newTeams) => {
	    const newPlayers = {...newTeams[teamName].players};
	    newPlayers[player] = {
		...newPlayers[player],
		isActive: !newPlayers[player].isActive,
	    };
	    newTeams[teamName] = {
		...newTeams[teamName],
		players: newPlayers,
	    };
	    return newTeams;
	});
    };

    //negative money for money loss, positive for money gain
    changeTeamMoney = (teamName, moneyChange) => {
	if (this.state.teams[teamName].money < -moneyChange) {
	    return false;
	}		
	this.setTeamState((newTeams) => {
	    const newMoney = newTeams[teamName].money + moneyChange;
	    newTeams[teamName] =  {
		...newTeams[teamName],
		money: newMoney,
	    };
	    return newTeams;
	});
	return true;
    }

    addToProposedTrade = (player, team) => {
	const newProposedTrade = [...this.state.proposedTrade];
	for (let i = 0; i < newProposedTrade.length; i++) {
	    if (newProposedTrade[i].player.name === player.name) {
		newProposedTrade.splice(newProposedTrade.indexOf({player, team}), 1);
		this.setState({proposedTrade: newProposedTrade});
		return;
	    }
	}
	newProposedTrade.push({player: player, team: team});
	this.setState({proposedTrade: newProposedTrade});
    }

    splitTradePlayers = (proposedTrade, teamName) => {
	const teamOnePlayers = [];
	const teamTwoPlayers = [];
	proposedTrade.forEach(({player, team}) => {
	    if (team === teamName) {
		teamOnePlayers.push(player);
	    } else {
		teamTwoPlayers.push(player);
	    }
	});
	return [teamOnePlayers, teamTwoPlayers];
    };
    
    offerTrade = (proposedTrade, teamOne, teamTwo) => {
	const splitPlayers = this.splitTradePlayers(proposedTrade, teamOne);
	const newProposedTrade = {player: splitPlayers, teamNames: [teamOne, teamTwo]};
	this.setTeamState((newTeams) => {
	    const newTrades = {...newTeams[teamOne].trades};
	    const newTradesFrom = [...newTrades.tradesFrom];
	    newTradesFrom.push(newProposedTrade);
	    newTrades.tradesFrom = newTradesFrom;
	    newTeams[teamOne] = {
		...newTeams[teamOne],
		trades: newTrades,
	    };
	    return newTeams;
	});
	this.receiveTrade(newProposedTrade, teamTwo, teamOne);
	this.setState({proposedTrade: []});	
    }

    receiveTrade = (proposedTrade, teamOne, teamTwo) => {
	this.setTeamState((newTeams) => {
	    const newTrades = {...newTeams[teamOne].trades};
	    const newTradesTo = [...newTrades.tradesTo];
	    newTradesTo.push({...proposedTrade, teamNames: [teamOne, teamTwo]});
	    newTrades.tradesTo = newTradesTo;
	    newTeams[teamOne] = {
		...newTeams[teamOne],
		trades: newTrades,
	    };
	    return newTeams;
	});
    }

    removeTrade = (proposedTrade, teamName) => {
	this.setTeamState((newTeams) => {
	    const newTrades = {...newTeams[teamName].trades};
	    const newTradesTo = [...newTrades.tradesTo];
	    newTradesTo.forEach((trade, i) => {
		if (trade.teamNames[0] === teamName || trade.teamNames[1] === teamName) {
		    newTradesTo.splice(i, 1);
		}
	    });
	    const newTradesFrom = [...newTrades.tradesFrom];
	    newTradesFrom.forEach((trade, i) => {
		if (trade.teamNames[0] === teamName || trade.teamNames[1] === teamName) {
		    newTradesFrom.splice(i, 1);
		}
	    });
	    newTeams[teamName] = {
		...newTeams[teamName],
		trades: {
		    tradesTo: newTradesTo,
		    tradesFrom: newTradesFrom,
		},
	    };
	    return newTeams;
	});
    }

    acceptTrade = (proposedTrade) => {
	proposedTrade.player[0].forEach(player => {
	    const temp = {};
	    temp[player.name] = player;
	    this.removePlayer(proposedTrade.teamNames[0], player);
	    this.addPlayer(proposedTrade.teamNames[1], temp);
	});
	proposedTrade.player[1].forEach(player => {
	    const temp = {};
	    temp[player.name] = player;
	    this.removePlayer(proposedTrade.teamNames[1], player);
	    this.addPlayer(proposedTrade.teamNames[0], temp);
	});
	this.removeTrade(proposedTrade, proposedTrade.teamNames[0]);
	this.removeTrade(proposedTrade, proposedTrade.teamNames[1]);
	this.addTransaction(proposedTrade.teamNames[0], "Trade", proposedTrade);
    }

    addTransaction = (teamName, type, playerList) => {
	this.setTeamState((newTeams) => {
	    const newTransactionList = [...newTeams[teamName].transactions];
	    if (type === "Added Free Agent" || type === "Dropped") {
		newTransactionList.push({type: type, player: playerList, teamName: teamName});
	    } else if (type === "Trade") {
		newTransactionList.push(
		    {type: type, playerList: playerList.player, teamList: playerList.teamNames}
		)
	    }
	    newTeams[teamName] = {
		...newTeams[teamName],
		transactions: newTransactionList,
	    };
	    return newTeams;
	});
    }
    
    addFreeAgent = (teamName, player) => {
	if (!this.changeTeamMoney(teamName, -player.cost)) {
	    return;
	}
	const temp = {};
	temp[player.name] = player;
	console.log(temp);
	this.addPlayer(teamName, temp);
	const newFreeAgents = {...this.state.freeAgents};
	delete newFreeAgents[player.name];
	this.setState({freeAgents: newFreeAgents});
	this.addTransaction(teamName, "Added Free Agent", player);
    }

    addToFreeAgents = (player) => {
	const newFreeAgents = {...this.state.freeAgents};
	newFreeAgents[player.name] = player;
	this.setState({freeAgents: newFreeAgents});
    }
    
    dropPlayer = (teamName, player) => {
	this.removePlayer(teamName, player);
	this.addToFreeAgents({...player, cost: player.overall});
	this.addTransaction(this.state.yourTeam, "Dropped", player);
    }

    removePlayer = (teamName, player) => {
	this.setTeamState((newTeams) => {
	    const newPlayers = {...newTeams[teamName].players};
	    delete newPlayers[player.name];
	    newTeams[teamName] = {
		...newTeams[teamName],
		players: newPlayers,
	    };
	    return newTeams;
	});
    }

    addPlayer = (teamName, player) => {
	this.setTeamState((newTeams) => {
	    const newPlayers = {...newTeams[teamName].players};
	    Object.assign(newPlayers, player);
	    newTeams[teamName] = {
		...newTeams[teamName],
		players: newPlayers,
	    };
	    return newTeams;
	});
    }

    depthCharts = (teamName) => {
	const offense = [...offensePositions];
	const defense = [...defensePositions];
	const special = [...specialPositions];
	const sortedPlayers = this.sortPlayers(teamName, "position", "overall");
	const depthCharts = {
	    offense: {},
	    defense: {},
	    special: {},
	};
	function helper(player, position, chart) {
	    const temp = {};
	    if (chart.hasOwnProperty(position)) {
		chart[position].push(player);
	    } else {
		temp[position] = [player];
		Object.assign(chart, temp);
	    }
	};	
	for (let player of sortedPlayers) {
	    if (offense.includes(player.position)) {		
		helper(player, offense.shift(), depthCharts.offense);
	    } else if (defense.includes(player.position)) {
		helper(player, defense.shift(), depthCharts.defense);
	    } else if (special.includes(player.position)) {
		helper(player, special.shift(), depthCharts.special);
	    }
	}
	depthCharts.special["KR"] = [this.sortPlayers(teamName, "Speed", "Acceleration")[0]];
	return depthCharts;
    }

    activatePlayers = (teamName) => {
	const depthCharts = this.depthCharts(teamName);
	for (let chart of Object.values(depthCharts)) {
	    for (let players of Object.values(chart)) {
		for (let player of players) {
		    this.deactivatePlayer(teamName, player.name);
		}
	    }
	}
    }
    
    sortPlayers(teamName = this.state.activeTeam, primarySortBy = this.state.primarySortBy, secondarySortBy = this.state.secondarySortBy) {
	const sortOrder = [
	    "isActive",
	    "overall",
	    "position",
	    "name",
	];
	sortOrder.unshift(primarySortBy, secondarySortBy);
	const sortedPlayers = Object.values(this.state.teams[teamName].players).sort((a, b) => {
	    for (let i = 0; i < sortOrder.length; i++) {
		if (typeof a[sortOrder[i]] === "string") {
		    if (a[sortOrder[i]] < b[sortOrder[i]]) {
			return -1;
		    } else if (a[sortOrder[i]] > b[sortOrder[i]]) {
			return 1;
		    }
		} else {
		    if (a[sortOrder[i]] > b[sortOrder[i]]) {
			return -1;
		    } else if (a[sortOrder[i]] < b[sortOrder[i]]) {
			return 1;
		    }
		}
	    }
	    return 0;
	});
	return sortedPlayers;
    }
    
    calculateTeamRecord = (team) => {
	const wins = team.schedule
			 .map((game) => game.result === "Win" ? 1 : 0)
			 .reduce((acc, x) => acc + x);
	const ties = team.schedule
			 .map((game) => game.result === "Tie" ? 1 : 0)
			 .reduce((acc, x) => acc + x);
	return ([wins, this.state.week - wins - ties, ties]);
    };
    
    findNumberOfActivePlayers = (team) => {
	return Object.values(team.players)
		   .map(player => player.isActive ? 1 : 0)
		   .reduce((acc, x) => acc + x);	
    }

    calculateTeamOverall = (team) => {
	if (team.players.length === 0) {
	    return 0;
	}
	
	const overall = Math.floor(Object.values(team.players)
			      .map((player) => player.isActive ? player.overall : 0)
					 .reduce((acc, x) => acc + x) / this.findNumberOfActivePlayers(team));
	return Number.isNaN(overall) ? 0 : overall;
    };
    
    changeBoard = (request) => {
	this.setState({page: request});
    };

    setActiveTeam = (request) => {
	this.setState({activeTeam: request});
    };

    createSchedule = () => {
	this.setTeamState((newTeams) => {
	    const teamList = Object.keys(this.state.teams);
	    let i = 0;
	    while(i < 16) {
		const tempTeamList = teamList.slice();
		Object.values(newTeams).forEach((team) => {
		    if (tempTeamList.length === 0 || tempTeamList.indexOf(team.name) === -1) {
			return;
		    }
		    tempTeamList.splice(tempTeamList.indexOf(team.name), 1);
		    const newSchedule = [...newTeams[team.name].schedule];
		    newSchedule.push({
			home: Math.random() < .5 ? true : false,
			vsName: tempTeamList[Math.floor(Math.random() * tempTeamList.length)],
			week: newSchedule.length + 1,
			result: null,
		    });
		    newTeams[team.name] = {
			...newTeams[team.name],
			schedule: newSchedule,
		    };		    
		    const otherSchedule = [...newTeams[newSchedule[newSchedule.length - 1].vsName].schedule];
		    otherSchedule.push({
			home: !newSchedule[newSchedule.length - 1].home,
			vsName: team.name,
			week: otherSchedule.length + 1,
			result: null,
		    });
		    newTeams[newSchedule[newSchedule.length - 1].vsName] = {
			...newTeams[newSchedule[newSchedule.length - 1].vsName],
			schedule: otherSchedule,
		    };
		    tempTeamList.splice(tempTeamList.indexOf(newSchedule[newSchedule.length - 1].vsName), 1);
		});
		i++;
	    }
	    return newTeams
	});
    };

    simulateNextWeek = () => {
	const newTeams = {...this.state.teams};
	if (newTeams[this.state.yourTeam].schedule[this.state.week] == null) {
	    return;
	}
	Object.values(newTeams).forEach((team) => {
	    if (team.name === this.state.yourTeam ||
		team.name === newTeams[this.state.yourTeam].schedule[this.state.week].vsName) {
		return;
	    }
	    const newSchedule = [...team.schedule];
	    const vs = newTeams[team.schedule[this.state.week].vsName];
	    const otherResult = vs.schedule[this.state.week].result;
	    let result = null;
	    if (otherResult != null) {
		if (otherResult === "Tie") {
		    result = "Tie";
		} else if (otherResult === "Win") {
		    result = "Loss";
		} else if (otherResult === "Loss") {
		    result = "Win";
		}
	    } else {
		result = Math.random() * this.calculateTeamOverall(team) < Math.random() * this.calculateTeamOverall(vs) ? "Loss" : "Win";
	    }
	    newSchedule[this.state.week] = {
		...newSchedule[this.state.week],
		result: result			
	    };
	    newTeams[team.name] = {
		...newTeams[team.name],
		schedule: newSchedule,
	    };
	});
	this.setState({teams: newTeams});
	this.setState({week: this.state.week + 1});
    }

    setYourResult(result) {
	console.log(result);
	console.log(result === 0 ? "Tie" : result === 1 ? "Loss" : "Win");
	this.setTeamState((newTeams) => {
	    const game = newTeams[this.state.yourTeam].schedule[this.state.week];
	    newTeams[this.state.yourTeam].schedule[this.state.week].result =
		result === 0 ? "Tie" : result === 1 ? "Win" : "Loss";
	    newTeams[game.vsName].schedule[this.state.week].result =
		result === 0 ? "Tie" : result === 1 ? "Loss" : "Win";
	    return newTeams;
	});
	this.simulateNextWeek();
    }
    
};


class Game extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    down: 1,
	    quarter: 1,
	    time: 300,
	    lineOfScrimmage: 35,
	    firstDownLine: 45,
	    result: "",
	    yourScore: 0,
	    opposingScore: 0,
	    possesion: Math.random() < .5 ? true : false, //true if you have ball
	};
	this.oldLineOfScrimmage = 35;
	this.oldFirstDownLine = 45;
	this.homeGame = props.homeGame;
	this.possesionAfterHalfTime = !this.state.possesion;
	this.yourPlay = "kickoff";
	this.opposingPlay = "kickReturn";
	this.bonusToPlay = 0;
	this.yourTeam = props.yourTeam;
	this.yourActivePlayers = globe.depthCharts(this.yourTeam.name);
	this.opposingTeam = props.opposingTeam;
	this.opposingActivePlayers = globe.depthCharts(this.opposingTeam.name);
	this.plays = {
	    offense: [
		"pass",
		"run",
		"punt",
		"fg",
	    ],
	    defense: [
		"pass",
		"run",
		"punt",
	    ],
	    kickOff: [
		"kickOff",
	    ],
	};
	this.isKickOff = true;
	this.over = false;
	this.driveTowards = true; // true for right side
	this.pickYourPlay = () => {
	    if (this.over) {
		return (
		    <>
		    	<div className='centerBigFlex'>
			    <div
				className='spaceButton'
				onClick={() => globe.changeBoard("Main Page")}
			    >
				Main Page
			    </div>
			</div>
		    </>
		)
	    }
	    const shownPlays = this.isKickOff ? this.plays.kickOff : this.state.possesion ? this.plays.offense : this.plays.defense;
	    return (
		<>
		    <div className='centerBigFlex'>
			{shownPlays.map((play) => 
			    <div
				className='spaceButton'
				key={play}
				onClick={() => this.pickPlay(play)}
			    >
				{play}
			    </div>
			)}
		    </div>
	        </>
	    );
	};
    }    
    
    pickPlay(type) {
	this.yourPlay = type;
	this.setUp();
    }
    
    setUp() {
	this.pickPlayForOpposing();
	if (this.yourPlay !== this.opposingPlay) {
	    this.bonusToPlay = .3;
	} else {
	    this.bonusToPlay = 0;
	}
	if (this.state.possesion) {
	    this[this.yourPlay]();
	} else {
	    this[this.opposingPlay]();
	}
    }
    
    pickPlayForOpposing() {
	if (this.isKickOff) {
	    this.opposingPlay = "kickOff";
	} else if (this.state.down === 4) {
	    if (this.state.lineOfScrimmage > 30) {
		this.opposingPlay = "fg";
	    } else {
		this.opposingPlay = "punt";
	    }
	} else {
	    this.opposingPlay =  Math.random() < .5 ? "pass" : "run";
	}
    }
    
    timeRunOff(playLength, clockStop) {
	if (clockStop) {
	    playLength += Math.floor(Math.random()) * 10 + 25;
	}
	if (this.state.time - playLength <= 0) {
	    this.nextQuarter();
	    return;
	}
	this.setState({time: this.state.time - playLength})
    }

    nextQuarter() {
	let result = " Well folks that'll be it for the " + Ordinals[this.state.quarter - 1] + " quarter. ";
	if (this.state.quarter === 1) {
	    result += "What a good game of football and we are just getting started. We will be right back after these messages."
	} else if (this.state.quarter === 2) {
	    result += "We are heading into halftime and boy do we have a show for you. Stay tuned and we will be right back after this fifteen minute, commercial filled break.";
	    this.setState({possesion: this.possesionAfterHalfTime});
	    this.driveTowards = false;
	    this.isKickOff = true;
	} else if (this.state.quarter === 3) {
	    result += "And, boy do we have a game on our hands here. So much to look forward to in the fourth and final quarter.";
	} else if (this.state.quarter === 4) {
	    const end = this.state.yourScore === this.state.opposingScore ? "game being tied." : (this.state.yourScore > this.state.opposingScore ? this.yourTeam.name : this.opposingTeam.name) + " coming away with the win."
	    result += "What a game we had here tonight, with the " + end + " I'm Chris Collinsworth and I will be signing off for tonight.";
	    this.endGame();
	}
	this.setState({
	    result: this.state.result + result,
	    quarter: this.state.quarter < 4 ? this.state.quarter + 1 : 4,
	    time: this.state.quarter === 4 ? 0 : 300,
	    down: this.state.quarter === 2 ? 1 : this.state.down,
	    lineOfScrimmage: this.state.quarter === 2 ? 35 : this.state.lineOfScrimmage,
	    firstDownLine: this.state.quarter === 2 ? 45 : this.state.firstDownLine,
	});
    }
		
    pass(passType = "Medium") {
	const options = this.createOptions();
	const defenders = this.createMatchups(options);
	const seperations = [];
	for (let i = 0; i < options.length; i++) {
	    seperations.push(Math.random() * options[i][passType + " Route Running"] -
			     Math.random() * defenders[i]["Man Coverage"]);
	}
	let caught = false;
	let index = 0;
	if (Math.random() > .9) {
	    index = seperations.indexOf(Math.max(...seperations));
	    if (Math.random() * options[index]["Catch in Traffic"] >
		Math.random() * (defenders[index]["Jumping"] + defenders[index]["Awareness"]) / 2 * .8) {
		caught = true;
	    }
	} else {
	    for (let i = 0; i < seperations.length; i++) {	    
		if (seperations[i] <= 0) {
		    if (Math.random() < .2) {
			index = i;
			if (Math.random() * options[i]["Catch in Traffic"] >
			    Math.random() * (defenders[i]["Jumping"] + defenders[i]["Awareness"]) / 2) {
			    caught = true;
			}
			break;
		    }
		} else if (seperations[i] < 35) {
		    if (Math.random() < .4) {
			index = i;
			if (Math.random() * options[i]["Catch In Traffic"] >
			    Math.random() * (defenders[i]["Pursuit"] + defenders[i]["Awareness"]) / 2) {
			    caught = true;
			}
			break;
		    }
		} else {
		    if (Math.random() < .6) {
			index = i;
			if (Math.random() * options[i]["Catching"] >
			    Math.random() * (defenders[i]["Pursuit"] + defenders[i]["Awareness"]) / 2 * .8) {
			    caught = true;
			}
			break;
		    }
		}
	    }
	}
	const yards = caught ? Math.floor(Math.random() * 20) + 5 : 0;
	this.changeYards(yards);
	let result = "";
	const QB = this.state.possesion ? this.yourActivePlayers.offense.QB[0] : this.opposingActivePlayers.offense.QB[0];
	result += QB.name +" passed the ball to "+ options[index].name +"! ";
	if (caught) {
	    result += "It was caught for "+ yards +" yards!";
	} else {
	    result += "It was broken up by "+ defenders[index].name +"!";
	}
	this.setState(
	    {result: result},
	    () => this.timeRunOff(Math.floor(Math.random() * 5) + 4, true)
	);
    }

    changeYards(yards) {	
	this.oldLineOfScrimmage = this.state.lineOfScrimmage;
	this.oldFirstDownLine = this.state.firstDownLine;
	if (this.state.lineOfScrimmage + yards >= 100) {
	    this.touchdown();
	} else if (this.state.lineOfScrimmage + yards >= this.state.firstDownLine) {
	    this.setState({
		lineOfScrimmage: this.state.lineOfScrimmage + yards,
		firstDownLine: this.state.lineOfScrimmage + yards + 10,
		down: 1,
	    });
	} else if (this.state.down + 1 > 4) {
	    this.setState(
		{lineOfScrimmage: this.state.lineOfScrimmage + yards},
		() => this.changePossesion(" Turnover on downs!")
	    );
	} else {
	    this.setState({
		lineOfScrimmage: this.state.lineOfScrimmage + yards,
		down: this.state.down + 1,
	    });
	}
    }

    run() {
	const maxYards = 100 - this.state.lineOfScrimmage;
	const activePlayers = this.state.possesion ? this.yourActivePlayers.offense : this.opposingActivePlayers.offense;
	let result = activePlayers.QB[0].name + " hands the ball off to " + activePlayers.HB[0].name + ". ";
	let yards = 0;
	let time = 0;
	if (Math.random() > .9) {
	    time = Math.floor(Math.random() * 5) + 5;
	    yards = Math.floor(Math.random() * 25) + 15;
	    yards = yards > maxYards ? maxYards : yards;
	    result += activePlayers.HB[0].name + " finds a big hole and takes off running! He gets a huge gain of " + yards + " yards!";
	    //big hole
	} else if (Math.random() > .9) {
	    time = Math.floor(Math.random() * 3) + 1;
	    yards = Math.floor(Math.random() * -3) - 2;
	    result += activePlayers.HB[0].name + " has no space to run and gets tackled before even getting to the line of scrimmage. That will be a loss of " + Math.abs(yards) + " yards!";
	    //tackled in backfield
	} else if (Math.random() > .5) {
	    time = Math.floor(Math.random() * 3) + 3;
	    yards = Math.floor(Math.random() * 8) + 5;
	    yards = yards > maxYards ? maxYards : yards;
	    result += activePlayers.HB[0].name + " finds a decent hole and gets a good gain of " + yards + " yards!";
	    //medium hole
	} else {
	    time = Math.floor(Math.random() * 3) + 2;
	    yards = Math.floor(Math.random() * 5) + 2;
	    yards = yards > maxYards ? maxYards : yards;
	    result += activePlayers.HB[0].name + " finds a small hole and is able to get " + yards + " yards!";
	    //small hole
	}
	
	this.changeYards(yards);
	this.setState(
	    {result: result},
	    () => this.timeRunOff(time, true)
	);
    }

    runWithBall() {}

    endGame() {
	this.over = true;
	if (this.state.yourScore === this.state.opposingScore) {
	    globe.setYourResult(0);
	} else if (this.state.yourScore > this.state.opposingScore) {
	    globe.setYourResult(1);
	} else {
	    globe.setYourResult(2);
	}
    }

//    sack
//    interception
//    fumble
//    add diversity to what can happen with plays: left middle right, deep medium short,

    changePossesion(str) {	
	this.setState({
	    result: this.state.result + str,
	    down: 1,
	    possesion: !this.state.possesion,
	    lineOfScrimmage: 100 - this.state.lineOfScrimmage,
	    firstDownLine: 110 - this.state.lineOfScrimmage,
	});
	this.driveTowards = !this.driveTowards;
    }
    
    setResult(type, success, firstDown, yards, offender, defender) {
    }
    
    getPossesion() {
	return this.state.possesion ?
	       [this.yourActivePlayers.offense, this.opposingActivePlayers.defense] :
	       [this.opposingActivePlayers.offense, this.yourActivePlayers.defense];
    }
    
    createMatchups(options) {
	const LB = ["ROLB", "LOLB", "MLB"];
	const matchUp = [];
	const defensivePlayers = this.getPossesion()[1];
	const lineBackers = LB.map(pos => defensivePlayers[pos][0])
			      .sort((a, b) => b["Man Coverage"] - a["Man Coverage"]);
	for (let player of options) {
	    if (player.position === "WR") {
		for (let player of defensivePlayers.CB) {
		    if (matchUp.includes(player)) {
			continue;
		    }
		    matchUp.push(player);
		}
	    } else if (player.position === "TE" || player.position === "HB") {
		matchUp.push(lineBackers.shift());
	    }
	}
	return matchUp;
    }
    
    createOptions() {
	const offensiveOptions = [
	    "WR",
	    "TE",
	    "HB",
	];
	const options = [];
	const offensivePlayers = this.getPossesion()[0];
	for (let pos of offensiveOptions) {
	    for (let player of offensivePlayers[pos]) {
		options.push(player);
	    }
	}
	return options;
    }

    punt() {
	this.kickOff("punt")
    }
    
    kickOff(type = "kick") {
	this.isKickOff = false;
	const returner = !this.state.possesion ? this.yourActivePlayers.special.KR[0] :
			 this.opposingActivePlayers.special.KR[0];
	const punter = this.state.possesion ? this.yourActivePlayers.special.K[0] :
		       this.opposingActivePlayers.special.K[0];
	const dist = type === "kick" ? Math.floor(Math.random() * 30 + 55) : Math.floor(Math.random() * 20) + 35;
	let yard = type === "kick" ? 65 - dist : 100 - this.state.lineOfScrimmage - dist;
	let result = punter.name + " " + type + "s the ball off! ";
	if (yard < -10) {
	    result += "It's a long one for " + dist + " yards and goes sailing out the back of the endzone for a touchback. ";
	    yard = 25;
	} else if (yard < -2) {
	    result += "It goes " + dist + " yards into the endzone, " + returner.name + " kneels it down for a touchback. ";
	    yard = 25;
	} else {
	    result += "It's a returnable kick that goes for " + dist + " yards! " + returner.name + " catches it and brings it out! " + returner.name;
	    let returnDist = 0;
	    if (Math.random() > .95) {
		result += " finds a huge hole! The 20! The 10! ";
		this.setState({
		    possesion: !this.state.possesion,
		    result: "",
		}, () => this.touchdown(result));
		return;
	    } else if (Math.random() > .8) {
		returnDist = Math.floor(Math.random()) * 30 + 40;
		result += " manages to find a crease and gets a huge gain of " + returnDist + " yards! ";
	    } else if (Math.random > .7) {
		returnDist = Math.floor(Math.random()) * 10 + 10;
		result += " is locked up by the defense quickly! He gets a small gain of " + returnDist + " yards! ";
	    } else {
		returnDist = Math.floor(Math.random()) * 20 + 20;
		result += " gets a decent return of " + returnDist + " yards! ";
	    }
	    yard += returnDist;
	}
	result += "The " + (this.state.possesion ? this.opposingTeam.name : this.yourTeam.name) + " will start their drive on " + (this.getYard(yard)) + " yard line!";
	this.setState({
	    down: 1,
	    possesion: !this.state.possesion,
	    result: result,
	    lineOfScrimmage: yard,
	    firstDownLine: yard + 10,
	}, () => this.timeRunOff(Math.floor(Math.random() * 5) + 4, false));
	this.driveTowards = !this.driveTowards;
	this.oldLineOfScrimmage = yard;
	this.oldFirstDownLine = yard + 10;
    }
    
    touchdown(result = "") {
	this.setScore(6, result + " TOUCHDOWN! ", () => this.fieldGoal(1, 15, "extra point"));
    }

    fg() {
	this.setState(
	    {result: ""},
	    () => this.fieldGoal(3, 100 - this.state.lineOfScrimmage, "field goal")
	);
    }
    
    fieldGoal(point, yard, type) {	
	const kicker = this.state.possesion ? this.yourActivePlayers.special.K[0] :
		       this.opposingActivePlayers.special.K[0];
	if (yard + 15 <= 65 && kicker["Kick Power"] >= ((Math.random() * .5) + ((yard + 15) / 100)) * 100) {
	    this.setScore(point, " " + kicker.name + " made the " + (yard + 15) + " yard " + type + "!");
	} else {
	    this.changePossesion(" " + kicker.name + " missed the " + (yard + 15) + " yard " + type + "! It will be the " + (this.state.possesion ? this.opposingTeam.name : this.yourTeam.name) + "'s ball.");
	}
    }

    setScore(point, result, callback) {
	this.isKickOff = true;
	this.setState({
	    yourScore: this.state.possesion ? this.state.yourScore + point : this.state.yourScore,
	    opposingScore: !this.state.possesion ? this.state.opposingScore + point : this.state.opposingScore,
	    result: this.state.result + result,
	    down: 1,
	    lineOfScrimmage: 35,
	    firstDownLine: 45,
	}, callback);
    }
    
    getYard(los = this.state.lineOfScrimmage) {
	return (los < 50 ? "own " : "opp. ") + 
 	       (los < 50 ? los : 50 - los % 50);
    }

    getTime() {
	let secs = (this.state.time % 60).toString();
	if (secs.length === 1) {
	    secs = "0" + secs;
	}	
	return Math.floor(this.state.time / 60) + ":" + secs;
    }

    render() {
	return (
	    <>
		{/* <button onClick={() => this.endGame()}>End Game</button>
		    <button onClick={() => this.pass("Medium")}>Pass</button>
		    <button onClick={() => this.setState({result: ""}, () => this.fieldGoal(3, 100 - this.state.lineOfScrimmage, "field goal"))}>FIELD GOAL</button>
		    <button onClick={() => this.changePossesion("turonver on downs")}>TURNOVER</button>
		    <button onClick={() => this.touchdown()}>TOUCHDOWN</button>
		    <button onClick={() => this.kickOff("kick")}>KICKOFF</button>
		    <button onClick={() => this.kickOff("punt")}>Punt</button> */}
		<ScoreBoard
		    homeGame={this.homeGame}
		    possesion={this.state.possesion}
		    time={this.getTime()}
		    yourScore={this.state.yourScore}
		    opposingScore={this.state.opposingScore}
		    down={this.state.down}
		    lineOfScrimmage={this.state.lineOfScrimmage}
		    firstDownLine={this.state.firstDownLine}
		    quarter={this.state.quarter}
		/>
		<FootballField
		    lineOfScrimmage={this.driveTowards ? this.state.lineOfScrimmage : 100 - this.state.lineOfScrimmage}
		    firstDownLine={this.driveTowards ? this.state.firstDownLine : 100 - this.state.firstDownLine}
		    homeTeamName={this.homeGame ? this.yourTeam.name : this.opposingTeam.name}
		    oldLineOfScrimmage={this.driveTowards ? this.oldLineOfScrimmage : 100 - this.oldLineOfScrimmage}
		    oldFirstDownLine={this.driveTowards ? this.oldFirstDownLine : 100 - this.oldFirstDownLine}
		/>
		{this.pickYourPlay()}
		<div className='result'>{this.state.result}</div>
	    </>
	);
    }    
}

const ScoreBoard = ({homeGame, possesion, time, yourScore, opposingScore, down, lineOfScrimmage, firstDownLine, quarter}) => (
    <>
	<div className='flexCent'>
	    <div className='board'>
		<div className='boardRow'>
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>Home</div>
			<div className='scoreBoardDataRow'>
			    <div className='scoreBoardData'>
				{homeGame ? yourScore : opposingScore}
			    </div>
			    <div className='scoreBoardIcon'>
				{homeGame ? possesion ? '🏈' : null : !possesion ? '🏈' : null}
			    </div>
			</div>
		    </div>			
		    <div className='bigScoreBoardBox'>
			<div className='scoreBoardTitle'>Time</div>
			<div className='scoreBoardData'>{time}</div>
		    </div>			
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>Visitor</div>
			<div className='scoreBoardDataRow'>
			    <div className='scoreBoardIcon'>
				{!homeGame ? possesion ? '🏈' : null : !possesion ? '🏈' : null}
			    </div>
			    <div className='scoreBoardData'>
				{!homeGame ? yourScore : opposingScore}
			    </div>
			</div>			    
		    </div>			
		</div>
		<div className='boardRow'>
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>Down</div>
			<div className='scoreBoardData'>{down}</div>
		    </div>
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>Ball On</div>
			<div className='scoreBoardData'>{lineOfScrimmage}</div>
		    </div>			
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>To Go</div>
			<div className='scoreBoardData'>{firstDownLine - lineOfScrimmage}</div>
		    </div>			
		    <div className='scoreBoardBox'>
			<div className='scoreBoardTitle'>Quarter</div>
			<div className='scoreBoardData'>{quarter}</div>
		    </div>			
		</div>
	    </div>
	</div>
    </>    
);

const FootballField =  ({lineOfScrimmage, firstDownLine, homeTeamName, oldLineOfScrimmage, oldFirstDownLine}) => {
    console.log(firstDownLine, oldFirstDownLine);
    console.log(lineOfScrimmage, oldLineOfScrimmage);
    firstDownLine = firstDownLine >= 100 ? 100 : firstDownLine;
    firstDownLine = firstDownLine <= 0 ? 0 : firstDownLine;
    const counter = new Array(9).fill(0);
    const teamName = homeTeamName.split(" ").pop();
    return (
	<>
	    <div className="fieldContainer">
		<svg height="10em" width={796}>
		    <rect
			width={64}
			height="10em"
			fill="DarkGreen"
			stroke="white"
			strokeWidth={5}
		    />
		    <text
			x={160}
			y={-26}
			fill="white"
			transform={"rotate(90)"}
			textAnchor="middle"
			fontWeight= "bold"
			fontFamily= "'Istok Web', Helvetica, sans-serif"
		    >
			{teamName}
		    </text>
		    <rect
			width={64}
			height="10em"
			fill="DarkGreen"
			transform={"translate("+ 32 * 22 +")"}
			stroke="white"
			strokeWidth={5}
		    />		
		    <text
			x={-160}
			y={32 * 23 + 12}
			fill="white"
			transform={"rotate(-90)"}
			textAnchor="middle"
			fontWeight= "bold"
			fontFamily= "'Istok Web', Helvetica, sans-serif"
		    >
			{teamName}
		    </text>
		    <rect
			width={32 * 20}
			height="10em"
			fill="ForestGreen"
			transform={"translate(64)"}
			stroke="white"
			strokeWidth={4}
		    />
		    <line
			x1={64}
			x2={32 * 23}
			y1={0}
			y2={0}
			stroke="white"
			strokeWidth={"20em"}
			strokeDasharray="2 30"
		    />
		    <line
			x1={64}
			x2={32 * 22}
			y1={0}
			y2={0}
			stroke="white"
			strokeWidth={8}
			strokeDasharray="1 5"
		    />
		    <line
			x1={64}
			x2={32 * 22}
			y1={120}
			y2={120}
			stroke="white"
			strokeWidth={8}
			strokeDasharray="1 5"
		    />
		    <line
			x1={64}
			x2={32 * 22}
			y1={200}
			y2={200}
			stroke="white"
			strokeWidth={8}
			strokeDasharray="1 5"
		    />
		    <line
			x1={64}
			x2={32 * 22}
			y1={320}
			y2={320}
			strokeWidth={8}
			stroke="white"
			strokeDasharray="1 5"
		    />
		    {counter.map((el, i) => {
			const num = (i + 1) * 10;
			return (
			    <text
				key={"topYard" + num}
				x={i * 64 + 112}
				y={32}
				fill="white"
			    >
				{num < 50 ? num : 50 - num % 50}
			    </text>
			)})}
		    {counter.map((el, i) => {
			const num = (i + 1) * 10;
			return (
			    <text
				key={"bottomYard" + num}
				x={i * -64 - 128}
				y={-288}
				fill="white"
				textAnchor="middle"
				transform="rotate(180)"
			    >
				{num < 50 ? num : 50 - num % 50}
			    </text>
			)})}
		    <rect
			className='animated'
			x={lineOfScrimmage * 6.5 + 64}
			y={0}
			width={2}
			height={320}
			fill={"blue"}
		    />
		    <rect
			className='animated'
			x={firstDownLine * 6.5 + 64}
			y={0}
			width={2}
			height={320}
			fill={"yellow"}
		    />
		</svg>
	    </div>
	</>
    )
};

class GameState extends React.Component {
    constructor(props) {
	super(props);	
	this.state = globe.state;
    };

    componentWillMount() {
	globe.fn = (newState) => {
	    this.setState(newState);
	};
	globe.addTeams();
	globe.addPlayers();
	for (let i = 0; i < NFL_TEAM_LIST.length; i++) {
	    globe.activatePlayers(NFL_TEAM_LIST[i]);
	}
	globe.createSchedule();	    
    }

    render() {
	return (
	    <React.Fragment>
		{this.state.page !== "gamePage" ?
		 <TopInfo activePage={this.state.page} pages={this.state.pages} teams={this.state.teams} yourTeam={this.state.yourTeam} week={this.state.week}/> : null}
		<Board state={this.state} />
	    </React.Fragment>
	);
    }
}

const globe = new Globe();

ReactDOM.render(
    <GameState />,
    document.getElementById('root')
);

