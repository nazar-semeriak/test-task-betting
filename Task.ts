interface Player {
    name: string;
    bet: number;
    outcome: string;
    potentialWinnings: number;
    eventProbability: number;
}

class BettingPlatform {
    private players: Player[] = [];
    private totalPool: number = 0;
    private totalBets: Map<string, number> = new Map();
    private potentialPayouts: Map<string, number> = new Map();
    private readonly outcomes: string[] = ['Team A Wins', 'Team B Wins'];

    placeBet(playerName: string, betAmount: number, chosenOutcome: string): void {
        // Calculate totals including current bet
        const tempTotalPool = this.totalPool + betAmount;
        const tempTotalBetsOnOutcome = (this.totalBets.get(chosenOutcome) || 0) + betAmount;

        // Calculate event probability
        const eventProbability = tempTotalPool > 0
            ? tempTotalBetsOnOutcome / tempTotalPool
            : 0;

        // Calculate potential winnings
        const potentialWinnings = eventProbability > 0
            ? betAmount / eventProbability
            : 0;

        // Update total bets
        this.totalPool += betAmount;
        this.totalBets.set(chosenOutcome, tempTotalBetsOnOutcome);

        // Store player's bet
        const player: Player = {
            name: playerName,
            bet: betAmount,
            outcome: chosenOutcome,
            potentialWinnings,
            eventProbability
        };
        this.players.push(player);

        // Update potential payouts
        this.potentialPayouts.set(
            chosenOutcome,
            (this.potentialPayouts.get(chosenOutcome) || 0) + potentialWinnings
        );

        console.log(
            `${playerName} placed a $${betAmount} bet on '${chosenOutcome}' ` +
            `with potential winnings of $${potentialWinnings.toFixed(2)} ` +
            `(Event Probability: ${(eventProbability * 100).toFixed(2)}%)`
        );
    }

    determineWinner(): string {
        const winningOutcome = this.outcomes[Math.floor(Math.random() * this.outcomes.length)];
        console.log(`\nWinning Outcome: ${winningOutcome}\n`);
        return winningOutcome;
    }

    settleBets(winningOutcome: string): void {
        const totalPotentialPayouts = this.players
            .filter(p => p.outcome === winningOutcome)
            .reduce((sum, p) => sum + p.potentialWinnings, 0);

        console.log(`Total Pool: $${this.totalPool}`);
        console.log(`Total Potential Payouts to Winners: $${totalPotentialPayouts.toFixed(2)}`);

        // Adjust payouts if necessary
        let adjustmentFactor = 1.0;
        if (totalPotentialPayouts > this.totalPool) {
            adjustmentFactor = this.totalPool / totalPotentialPayouts;
            console.log(
                `Payouts need to be adjusted by factor ${adjustmentFactor.toFixed(4)} ` +
                `to ensure platform neutrality.`
            );
        }

        console.log('\nPlayer Results:');
        this.players.forEach(player => {
            if (player.outcome === winningOutcome) {
                const adjustedPayout = player.potentialWinnings * adjustmentFactor;
                const profit = adjustedPayout - player.bet;
                console.log(
                    `${player.name} won! Bet: $${player.bet}, ` +
                    `Original Potential Winnings: $${player.potentialWinnings.toFixed(2)}, ` +
                    `Adjusted Payout: $${adjustedPayout.toFixed(2)} (Profit: $${profit.toFixed(2)})`
                );
            } else {
                console.log(`${player.name} lost. Bet: $${player.bet}`);
            }
        });

        // Confirm platform's net gain/loss
        const platformGain = this.totalPool - (totalPotentialPayouts * adjustmentFactor);
        console.log(`\nPlatform's net gain/loss: $${platformGain.toFixed(2)}`);
    }
}

// Simulation
function runSimulation(): void {
    const platform = new BettingPlatform();
    const numberOfRounds = 1;

    const players = [
        'Alice', 'Bob', 'Dave', 'Frank', 'Grace', 'Eve', 'Andrew',
        'Joe', 'Tom', 'Pieter', 'Maria', 'Anna', 'Michael', 'Barry', 'Leo',
        'Alex', 'Martha', 'Jen', 'Mia', 'Antony', 'Jack', 'Lea', 'Steve'
    ];
    const outcomes = ['Team A Wins', 'Team B Wins'];

    for (let i = 1; i <= numberOfRounds; i++) {
        console.log(`\n--- Round ${i} ---\n`);

        players.forEach(player => {
            const betAmount = Math.floor(Math.random() * 91) + 10;
            const chosenOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            platform.placeBet(player, betAmount, chosenOutcome);
        });

        const winningOutcome = platform.determineWinner();
        platform.settleBets(winningOutcome);
    }
}

runSimulation();