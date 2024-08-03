function randomInteger(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Command {
	execute(state: GameState): void;
}

abstract class Cmd {
	static canYouAnswer(randomNumber: number, state: GameState): boolean {
		return false;
	}
}

class Tmp {}
class WaterCmd extends Cmd implements Command {
	// play around with static blocks
	static hello: Tmp;
	static {
		// we can do whatever we want here
		this.hello = new Tmp();
	}

	static canYouAnswer(randomNumber: number, state: GameState): boolean {
		if (randomNumber === 2) {
			new WaterCmd().execute(state);
			return true;
		}

		return false;
	}

	execute(state: GameState): void {
		state.nextSupply = "water";
	}
}

class FoodCmd extends Cmd implements Command {
	static canYouAnswer(randomNumber: number, state: GameState): boolean {
		if (randomNumber === 1) {
			new ResupplyCmd().execute(state);
			return true;
		}

		return false;
	}

	execute(state: GameState): void {
		state.nextSupply = "food";
	}
}

class ResupplyCmd extends Cmd implements Command {
	static canYouAnswer(randomNumber: number, state: GameState): boolean {
		if (randomNumber >= 3) {
			new ResupplyCmd().execute(state);
			return true;
		}

		return false;
	}

	execute(state: GameState): void {
		switch (state.nextSupply) {
			case "food":
				state.food += state.getRandomNumber();
				state.nextSupply = undefined;
				break;
			case "water":
				state.water += state.getRandomNumber();
				state.nextSupply = undefined;
				break;
			default:
				state.nextSupply = state.getRandomNumber() % 2 === 0 ? "food" : "water";
				break;
		}
	}
}

type Supplies = "food" | "water" | undefined;

class GameState {
	food: number = 5;
	water: number = 5;
	nextSupply: Supplies = undefined;
	#randomNumber: number = 0;

	increaseFood(by: number) {
		this.food += by;
	}
	increaseWater(by: number) {
		this.water += by;
	}

	nextSupplyIs(supply: Supplies): boolean {
		return this.nextSupply === supply;
	}

	resourcesDepleted(): boolean {
		return this.food <= 0 || this.water <= 0;
	}

	getRandomNumber() {
		return this.#randomNumber;
	}

	updateRandomNumber() {
		this.#randomNumber = randomInteger(1, 6);
	}
}

const commandClasses = [WaterCmd, FoodCmd, ResupplyCmd];
const state = new GameState();

export function runCommands(): boolean {
	// Perhaps separating out the randomNumber would be a good idea -> something like a Die class; the die is cast
	for (let i = 1; i <= 7; i++) {
		state.updateRandomNumber();

		// Maybe a more complete interface for the GameState would work well
		runCommand(state);

		state.food -= 1;
		state.water -= 1;
		if (state.resourcesDepleted()) return false;
	}

	return true;
}

function runCommand(state: GameState) {
	for (const commandClass of commandClasses) {
		if (commandClass.canYouAnswer(state.getRandomNumber(), state)) break;
	}
}
