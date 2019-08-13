import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import playerInfo from './newPlayerInfo.js';
import Game from './game.js';

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
    "Los Angeles Chargers",
    "Los Angeles Rams",
    "Miami Dolphins",
    "Minnesota Vikings",
    "New England Patriots",
    "New Orleans Saints",
    "New York Giants",
    "New York Jets",
    "Oakland Raiders",
    "Philadelphia Eagles",
    "Pittsburgh Steelers",
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

const Player = ({player, clickPlayer, className}) => (
    <div className={className} onClick={clickPlayer}>
	{player.position}, {player.name}, {player.overall}, {player.isActive ? "Active" : "Inactive"}
    </div>
);

const Team = ({team, teamOverall, clickPlayer, yourTeam, page, className}) => {
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
				clickPlayer={() => clickPlayer(player)}
				player={player}
				className={className}
			    />
			    {team.name === yourTeam.name ?
			     (<div className='flex'>
				 <div className='button' onClick={() => globe.deactivatePlayer(team.name, player.name)}>
				     {player.isActive ? "Deactivate" : "Activate"}
				 </div>
				 <div className='button' onClick={() => globe.dropPlayer(team.name, player)}>Drop Player</div>
			     </div>): null}
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

	<div className='content'>
	    <div className='box'>
		{team.transactions.slice().reverse().map((transaction, i) => {
		    while (i < 4) {
			if (transaction.type === "Added Free Agent" || transaction.type === "Dropped") {
			    return <div key={transaction.type + transaction.player.name}>
				<div key={transaction.type + transaction.player.name}>{transaction.type} {transaction.player.name}</div>
			    </div>;
			} else if (transaction.type === "Trade") {		    
			    return (
				<div key={transaction.type+i} className='col'>
				    <div className='headerThree'>Traded </div> 
				    {transaction.playerList[0].map((player) => (
					<Player key={player.name} player={player} clickPlayer={() => true} />
				    ))}
				    <div className='headerThree'>to {transaction.teamList[1]} for </div>
				    {transaction.playerList[1].map((player) => (
					<Player key={player.name} player={player} clickPlayer={() => true} />
				    ))}
				</div>
			    );		
			}
		    }
		    return null;
		})}
	    </div>
	</div>
    </React.Fragment>
);

const Trade = ({trade}) => (
    <React.Fragment>
	<div>
	    <div className='headerThree'>Send</div>
 	    {trade.player[0].map(player => (
 		<Player key={player.name} player={player} clickPlayer={() => true} />
 	    ))}
	    <div className='headerThree'>to {trade.teamNames[1]} for</div>
	    {trade.player[1].map(player => (
 		<Player key={player.name} player={player} clickPlayer={() => true} />
 	    ))}
	    <div className='button' onClick={() => globe.acceptTrade(trade)}>Accept Trade</div>
	</div>
    </React.Fragment>
);

const Trades = ({trades}) => (
    <React.Fragment>
	<div className='content'>
	    <div className='box'>
		<div className='headerTwo'>Trades:</div>
		<div className='headerThree'>Offered Trades:</div>
		{trades.tradesFrom.map((trade, i) =>		
		    <div key={"trade" + i}><Trade trade={trade} /></div>
		)}
		<div className='headerThree'>Received Trades:</div>
	    </div>
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
	    clickPlayer={() => true}
	    yourTeam={yourTeam}
	    page={true}
            className={'text'}
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
	<div className='headerTwo'>Proposed Trade:</div>
	<div className='spac'>
	    <div className='powerCol'>
		<div className='headerThree'>{yourTeam}:</div>
		<div>
		    {proposedTrade.map(({player, team}) => (
			team === yourTeam ?
			<Player key={player.name} player={player} clickPlayer={() => globe.addToProposedTrade(player)}/> : null))}
		</div>
	    </div>
	    <div className='powerCol'>
		<div className='headerThree'>{activeTeam}:</div>
		<div>
	    	    {proposedTrade.map(({player, team}) => (
			team === activeTeam ?
			<Player
			    key={player.name}
			    player={player}
			    clickPlayer={() => globe.addToProposedTrade(player)}
			    className='clickable'
			/> : null))}
		</div>
	    </div>
	</div>
    </React.Fragment>
);

const TradePage = ({yourTeam, activeTeam, teams, proposedTrade}) => (
    <React.Fragment>
	<ProposedTrade proposedTrade={proposedTrade} yourTeam={yourTeam} activeTeam={activeTeam} />
	<div
	    className='button'
	    onClick={() => globe.offerTrade(proposedTrade, yourTeam, activeTeam)}
	>
	    Propose Trade
	</div>
	<div className='spac'>
	    <div className='bigFlex'>
		<Team
		    key={yourTeam}
		    team={teams[yourTeam]}
		    teamOverall={globe.calculateTeamOverall(teams[yourTeam])}
		    clickPlayer={(player) => globe.addToProposedTrade(player, yourTeam)}
		    yourTeam={yourTeam}
		    className='clickable'
		/>
	    </div>
	    <div className='bigFlex'>
		<Team
		    key={activeTeam}
		    team={teams[activeTeam]}
		    teamOverall={globe.calculateTeamOverall(teams[activeTeam])}
		    clickPlayer={(player) => globe.addToProposedTrade(player, activeTeam)}
		    yourTeam={yourTeam}
		    className='clickable'
		/>
	    </div>
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
	const opposingTeam = state.teams[state.teams[state.yourTeam].schedule[state.week].vsName];
	return (
	    <div className='gamePage'>
		<Game
		    homeGame={state.teams[state.yourTeam].schedule[state.week].home}
		    yourTeam={state.teams[state.yourTeam]}
		    opposingTeam={opposingTeam}
		    yourDepthCharts={globe.depthCharts(state.yourTeam)}
		    opposingDepthCharts={globe.depthCharts(opposingTeam.name)}
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

export default globe;
