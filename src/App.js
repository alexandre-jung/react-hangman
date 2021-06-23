import './App.css';
import { Component } from 'react';

/**4
 * The list of words to be used in the game
 */
const words = [
    'kangaroo',
    'computer',
    'table',
    'photo',
    'dinosaur',
    'mouse',
    'book',
    'television',
    'house',
    'goose',
];

/**
 * Randomly select a word
 */
function getRandomWord() {
    let max = words.length;
    let rand = Math.floor(Math.random() * max);
    return words[rand];
}

/**
 * Return all lowercase letters from 'a' to 'z' in an array
 */
function getAlphabet() {
    let startCode = 'a'.charCodeAt(0);
    let endCode = startCode + 26;
    let alphabet = [];
    for (let code = startCode; code < endCode; code++) {
        alphabet.push(String.fromCharCode(code));
    }
    return alphabet;
}

class VirtualKeyboard extends Component {

    /**
     * Render all the buttons of the keyboard
     */
    renderAlphabet() {
        let alphabet = getAlphabet();
        let { alreadyTriedLetters, onLetterClicked } = this.props;
        return alphabet.map((letter, index) => {
            return (
                <li className={alreadyTriedLetters.has(letter) ? 'disabled' : undefined}
                    key={index} onClick={() => { onLetterClicked(index) }}>{letter}</li>
            );
        }
        );
    }

    /**
     * Render this component
     */
    render() {
        return (
            <ul className='virtual-keyboard'>{this.renderAlphabet()}</ul>
        );
    }
}

class App extends Component {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            wordToGuess: getRandomWord(),
            alreadyTriedLetters: new Set(),
        };
    }

    /**
     * Compute an array with same length as the word to guess.
     * If a letter has already been tried (and therefore found), it is displayed.
     * All letters that remain to found are replaced with underscores.
     */
    computeWordMask() {
        let { wordToGuess, alreadyTriedLetters } = this.state;
        return [...wordToGuess].map(letter => {
            return alreadyTriedLetters.has(letter) ? letter : '_';
        });
    }

    /**
     * A callback for the keyboard, called when a letter is clicked.
     * This function needs the position (0 to 25) of the letter in the alphabet
     */
    handleLetterClick = letterPosition => {
        let firstCode = 'a'.charCodeAt(0);
        let code = letterPosition + firstCode;
        let letter = String.fromCharCode(code);
        this.handleLetter(letter);
    }

    /**
     * Check wether the word has been completely discovered
     */
    checkWon() {
        let { wordToGuess, alreadyTriedLetters } = this.state;
        for (let letter of wordToGuess) {
            if (!alreadyTriedLetters.has(letter)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Handle an attempt to guess a letter.
     * This function needs the letter itself (lowercase)
     */
    handleLetter(letter) {
        let { alreadyTriedLetters } = this.state;
        let wordFound = false;
        alreadyTriedLetters.add(letter);
        if (this.checkWon()) {
            wordFound = true;
            getAlphabet().forEach(letter => {
                alreadyTriedLetters.add(letter);
            });
        }
        this.setState({ alreadyTriedLetters }, () => {
            if (wordFound) {
                alert('You won !');
            }
        });
    }

    /**
     * Get JSX for word mask elements (hidden and revealed letters)
     */
    renderWordMask() {
        let mask = this.computeWordMask();
        return mask.map((maskItem, index) => <li key={index}>{maskItem}</li>);
    }

    /**
     * Render this component
     */
    render() {
        return (
            <div className="App">
                <ul className='mask'>{this.renderWordMask()}</ul>
                <p className='word-length'>({this.state.wordToGuess.length} letters)</p>
                <VirtualKeyboard onLetterClicked={this.handleLetterClick}
                    alreadyTriedLetters={this.state.alreadyTriedLetters} />
            </div>
        );
    }
}

export default App;
