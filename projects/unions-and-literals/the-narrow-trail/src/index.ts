function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Command {
	execute(state: GameState): void;
}

class WaterCmd {
	execute(state: GameState): void {
		state.nextSupply = "water";
	}
}

class FoodCmd {
	execute(state: GameState): void {
		state.nextSupply = "food";
	}
}

class ResupplyCmd {
	static canIAnswer(randomNumber: number, state: GameState): boolean {
		if (randomNumber >= 3) {
			new ResupplyCmd().execute(state);
			return true;
		}

		return false;
	}

	execute(state: GameState): void {
		switch (state.nextSupply) {
			case "food":
				state.food += state.randomNumber;
				state.nextSupply = undefined;
				break;
			case "water":
				state.water += state.randomNumber;
				state.nextSupply = undefined;
				break;
			default:
				state.nextSupply = state.randomNumber % 2 === 0 ? "food" : "water";
				break;
		}
	}
}

class GameState {
	food: number = 5;
	water: number = 5;
	nextSupply: "food" | "water" | undefined = undefined;
	randomNumber: number = 0;

	dead(): boolean {
		return this.food <= 0 || this.water <= 0;
	}
}

export function runCommands(): boolean {
	let state = new GameState();

	for (let i = 1; i <= 7; i++) {
		state.randomNumber = randomInteger(1, 6);

		let command: Command;

		// the command classes themselves could also answer on their own if they are applicable for the given random number
		// foodCommand->willYouAnswer()
		switch (state.randomNumber) {
			case 1:
				command = new FoodCmd();
				break;
			case 2:
				command = new WaterCmd();
				break;
			default:
				command = new ResupplyCmd();
				break;
		}

		command.execute(state);

		state.food -= 1;
		state.water -= 1;

		if (state.dead()) {
			return false;
		}
	}

	return true;
}
