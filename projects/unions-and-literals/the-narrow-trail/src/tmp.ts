function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function runCommands(): boolean {
	let nextSupply: "food" | "water" | undefined;
	let food = 5;
	let water = 5;

	for (let i = 1; i <= 7; i++) {
		const randomNumber = randomInteger(1, 6);

		let command: "food" | "water" | number;

		switch (randomNumber) {
			case 1:
				command = "food";
				break;
			case 2:
				command = "water";
				break;
			default:
				command = randomNumber;
				break;
		}

		if (typeof command === "number") {
		}
	}

	return true;
}
