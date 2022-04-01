// UI
const themesSwitch = document.getElementById('switch');
const keys = document.getElementsByClassName('keys')[0];
const currentNumberDiv = document.getElementsByClassName('current-number')[0];
const currentOperationDiv = document.getElementsByClassName('current-operation')[0];

// variables
let previousNumber = '';
let operand = '';
let currentNumber = '0';
let updateNumber = false;

// Event listeners
themesSwitch.addEventListener('click', event => {
	if (event.target instanceof HTMLInputElement) {
		changeTheme(event.target.id);
		localStorage.setItem('prefers-color-scheme', event.target.id);
	}
});

keys.addEventListener('click', event => {
	if (event.currentTarget === event.target) return;

	const value = event.target.innerHTML.toLowerCase();

	switch (value) {
		case '+':
		case '-':
		case 'x':
		case '/':
			previousNumber = currentNumber;
			operand = value;
			updateNumber = true;
			updateCurrentOperation();
			break;
		case 'del':
			currentNumber =
				currentNumber === '0' || currentNumber.length === 1
					? '0'
					: currentNumber.slice(0, -1);
			updateCurrentNumber();
			break;
		case 'reset':
			previousNumber = '';
			operand = '';
			currentNumber = '0';
			updateCurrentNumber();
			updateCurrentOperation();
			break;
		case '=':
			if (!operand) return;
			let temp = currentNumber;
			performOperation();
			updateCurrentNumber();
			updateCurrentOperation(temp);
			break;
		default: //3
			if (updateNumber) {
				currentNumber = '0';
				updateNumber = false;
			}
			appendNumber(value);
			updateCurrentNumber();
			break;
	}
});

// Operations
const operations = {
	'+': (x, y) => x + y,
	'-': (x, y) => x - y,
	'/': (x, y) => x / y,
	x: (x, y) => x * y,
};

// Functions
const init = () => {
	const savedtheme = localStorage.getItem('prefers-color-scheme');
	savedtheme ? changeTheme(savedtheme) : changeTheme('theme-1');

	updateCurrentNumber();
	updateCurrentOperation();
};

const changeTheme = themeName => {
	document.documentElement.className = themeName;
	document.getElementById(themeName).checked = true;
};

const formatNumber = num => {
	const pattern = /(\d)(?=(\d{3})+(?!\d))/g;

	const array = num.toString().split('.');

	let rightSide = array[1] ? array[1] : '';
	let leftSide = array[0].replace(pattern, '$1,');

	return `${leftSide}` + (num.includes('.') ? `.${rightSide}` : '');
};

const updateCurrentNumber = () => (currentNumberDiv.innerHTML = formatNumber(currentNumber));

const updateCurrentOperation = value => {
	currentOperationDiv.innerHTML = value
		? `${formatNumber(previousNumber)} ${operand} ${formatNumber(value)} =`
		: `${formatNumber(previousNumber)} ${operand}`;
};

const performOperation = () => {
	currentNumber = operations[operand](
		parseFloat(previousNumber),
		parseFloat(currentNumber)
	).toString();
};

const appendNumber = number => {
	if (number === '.' && currentNumber.includes('.')) return;

	if (currentNumber === '0' && number === '0') {
		return;
	}

	if (currentNumber === '0' && number !== '.') {
		currentNumber = number.toString();
		return;
	}

	currentNumber = currentNumber.toString() + number.toString();
};

init();
