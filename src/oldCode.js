
    /* createDepthCharts = (teamName) => {
       this.setTeamState((newTeams) => {
       const newDepthCharts = {...newTeams[teamName].depthCharts};
       const sortedPlayers = this.sortPlayers(teamName, "position", "overall");
       for (let i = 0; i < sortedPlayers.length; i++) {
       for (let j = 0; j < Object.keys(newDepthCharts).length; j++) {
       if (Object.keys(Object.values(newDepthCharts)[j]).includes(sortedPlayers[i].position)) {
       Object.values(newDepthCharts)[j][sortedPlayers[i].position].push(sortedPlayers[i].name);
       }
       }
       }
       return newTeams;
       });
     * }
     */
    
    //activatesPlayers based on depth charts
    /* active = (teamName) => {
       this.active(teamName);
       const positionsWithTwoActive = [
       "WR",
       "CB",
       ];
       this.createDepthCharts(teamName);
       const depthCharts = this.state.teams[teamName].depthCharts;
       for (let chart in depthCharts) {
       for (let pos in depthCharts[chart]) {
       if (depthCharts[chart][pos].length === 0) {
       continue;
       }
       if (!this.state.teams[teamName].players[depthCharts[chart][pos][0]].isActive) {		    
       this.deactivatePlayer(teamName, depthCharts[chart][pos][0]);
       }
       if (positionsWithTwoActive.includes(pos)) {
       if (!this.state.teams[teamName].players[depthCharts[chart][pos][1]].isActive) {
       this.deactivatePlayer(teamName, depthCharts[chart][pos][1]);
       }
       }
       }
       }
       this.sortPlayers(teamName);
     * }
     */
    
    /* setLineOfScrimmage() {
       const newGame = {
       ...this.state.game,
       lineOfScrimmage: this.state.game.yard + 10,
       };
       this.setState({game: newGame});
     * }
     * 
     * setDown(first) {
       const newGame = {
       ...this.state.game,
       down: first ? 1 : this.state.game.down + 1,
       };
       this.setState({game: newGame});
       if (first) {
       this.setLineOfScrimmage();
       }
     * }

     * setScore() {
       const newGame = {
       ...this.state.game,
       yourScore: this.state.game.onDefense ? this.state.game.yourScore : this.state.game.yourScore + 7,
       opposingScore: !this.state.game.onDefense ? this.state.game.opposingScore : this.state.game.opposingScore + 7,
       };
       this.setState({game: newGame});
     * }

     * newPossesion() {
       const newGame = {
       ...this.state.game,
       result: this.state.game.result + " TOUCHDOWN!!!",
       onDefense: !this.state.game.onDefense,
       yard: 20,
       down: 1,
       lineOfScrimmage: 30,
       };
       this.setState({game: newGame});
     * }
     * 
     * calculateTeamStats(team) {
       let teamOffense = 0;
       let teamDefense = 0;
       let numOffense = 0;
       let numDefense = 0;
       this.state.teams[team].players.forEach(player => {
       if (player.isActive) {
       if (this.state.positions.offense.includes(player.position)) {
       teamOffense += player.overall;
       numOffense++;
       } else if (this.state.positions.defense.includes(player.position)) {
       teamDefense += player.overall;
       numDefense++;
       }
       }
       });
       return [Math.floor(teamOffense / numOffense), Math.floor(teamDefense / numDefense)];
     * }

     * simulatePlay(type) {
       let defense = 0;
       let offense = 0;
       const opposingType = Math.random() < .5 ? "run" : "pass";
       const defenseVar = opposingType === type ? 1 : .75;
       if (this.state.game.onDefense) {
       defense = this.state.game.yourStats[1] * defenseVar;
       offense = this.state.game.opposingStats[0];
       } else {
       defense = this.state.game.opposingStats[1] * defenseVar;
       offense = this.state.game.yourStats[0];
       }
       if (!this.state.game.onDefense) {	    
       if (type === "run") {
       this.run(offense, defense);
       } else {
       this.pass(offense, defense);
       }
       } else {
       if (opposingType === "run") {
       this.run(offense, defense);
       } else {
       this.pass(offense, defense);
       }
       }
       this.setDown(this.state.game.yard >= this.state.game.lineOfScrimmage ? true : false);
       if (this.state.game.yard >= 100) {
       this.setScore();
       this.newPossesion();
       return;
       }
       if (this.state.game.down > 4) {
       this.turnover(0, "on downs!");
       return;
       }
     * }

     * turnover(yardDelta, whatHappened) {
       const newGame = {
       ...this.state.game,
       onDefense: !this.state.game.onDefense,
       yard: this.state.game.yard + yardDelta,
       result: this.state.game.result + " There was a turnover " + whatHappened + " for " + yardDelta + " yards!",
       lineOfScrimmage: this.state.game.yard + 10,
       down: 1,
       };
       this.setState({game: newGame})
     * }

     * run(offense, defense) {
       const success = Math.random() * offense - Math.random() * defense;
       if (Math.sign(success) >= 0) {
       if (success > offense / 4) {
       const yardChange = Math.floor(Math.random() * 40);
       this.changeYards(yardChange);
       this.setResult("long run play for " + yardChange + " yards!");
       } else {
       const yardChange = Math.floor(Math.random() * 15);
       this.changeYards(yardChange);
       this.setResult("short run play for " + yardChange + " yards!");
       }
       } else {
       if (Math.abs(success) > defense / 4) {
       const yardChange = Math.floor(Math.random() * -10);
       this.changeYards(yardChange);
       this.setResult("tackled for a loss for " + yardChange + " yards!");
       } else {
       const yardChange = Math.floor(Math.random() * 5);
       this.changeYards(yardChange);
       this.setResult("very short run play for " + yardChange + " yards!");
       }
       }	
     * }
     * 
     * pass(offense, defense) {
       const success = Math.random() * offense - Math.random() * defense;
       if (Math.sign(success) >= 0) {
       if (success > offense / 4) {
       const yardChange = Math.floor(Math.random() * 40);
       this.changeYards(yardChange);
       this.setResult("long pass play for " + yardChange + " yards!");
       } else {
       const yardChange = Math.floor(Math.random() * 15);
       this.changeYards(yardChange);
       this.setResult("short pass play for " + yardChange + " yards!");
       }
       } else {
       if (Math.abs(success) > defense / 4) {
       const yardChange = Math.floor(Math.random() * -10);
       this.changeYards(yardChange);
       this.setResult("sacked for a loss for " + yardChange + " yards!");
       } else {
       const yardChange = Math.floor(Math.random() * 5);
       this.changeYards(yardChange);
       this.setResult("very short pass play for " + yardChange + " yards!");
       }
       }	
     * }
     * 
     * changeYards(yardDelta) {
       const newGame = {
       ...this.state.game,
       yard: this.state.game.yard + yardDelta,
       };
       this.setState({game: newGame});
     * } */
const Teams = ({teams, yourTeam, page}) => (
    <React.Fragment>
	{Object.values(teams).map((team) =>
	    <Team
		key={team.name}
		teamOverall = {globe.calculateTeamOverall(team)}
		team={team}
		deactivatePlayer={team.name === yourTeam.name ?
				  (player) => globe.deactivatePlayer(team.name, player) :
						   () => true}
		yourTeam={yourTeam}
		page={page}
	    />
	)}	
    </React.Fragment>
)
