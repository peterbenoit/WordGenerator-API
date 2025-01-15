/**
 * WordGenerator Class
 * ---------------------
 * This class generates random text based on predefined word lists, such as Latin or Medieval words.
 * It supports various customization options for output formatting, word limits, and random styling.
 *
 * @version 1.0.2
 * @license MIT
 *
 * (c) 2024 Peter Benoit. All rights reserved. https://github.com/peterbenoit/WordGenerator-API
 *
 * Disclaimer:
 * -----------
 * This software is provided "as is," without warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose, and noninfringement. In no event shall the authors or copyright holders be
 * liable for any claim, damages, or other liability, whether in an action of contract,
 * tort, or otherwise, arising from, out of, or in connection with the software or the
 * use or other dealings in the software. Use this software at your own risk.
 */

// Import word lists
import { latinWords } from '../dialects/latin.js';
import { medievalWords } from '../dialects/medieval.js';
import { cowboyWords } from '../dialects/cowboy.js';
import { genZWords } from '../dialects/genz.js';
import { bostonianWords } from '../dialects/bostonian.js';
import { billAndTedWords } from '../dialects/billandted.js';
import { pirateWords } from '../dialects/pirate.js';
import { hobbitWords } from '../dialects/hobbitses.js';
import { leetWords } from '../dialects/leet.js';
import { surferWords } from '../dialects/surfer.js';
import { yodaWords } from '../dialects/yoda.js';
import { corporateWords } from '../dialects/corporate.js';
import { shakespeareanWords } from '../dialects/shakespeare.js';
import { scoobyDooWords } from '../dialects/scoobydoo.js';
import { valleyWords } from '../dialects/valley.js';
// import { darthVaderWords } from '../dialects/darthvader.js';
// import { hipsterWords } from '../dialects/hipster.js';
// import { greekWords } from '../dialects/greek.js';
// import { scifiWords } from '../dialects/scifi.js';

export class WordGenerator {
    /**
     * Constructor initializes the WordGenerator class with user-defined or default settings.
     * @param {Object} settings - Optional settings to customize the text generation.
     */
    constructor(settings = {}) {
        const defaultSettings = {
            sentence: { min: 2, max: 15 }, // Minimum and maximum number of words in a sentence
            paragraph: { min: 3, max: 10 }, // Minimum and maximum number of sentences in a paragraph
            commaRate: 10, // Chance of placing a comma in a sentence
            injectStyling: false, // Whether to randomly style words
            maxFormattedWords: 3, // Maximum number of words to format
            wordList: 'medieval', // Default word list ('latin', 'medieval', 'both')
            outputFormat: 'string', // Default output format ('string', 'array', 'hash')
            maxWords: null, // Maximum number of words to generate
        };

        this.settings = { ...defaultSettings, ...settings };
        this.wordList = this.chooseWordList(this.settings.wordList);
        this.wordCount = this.wordList.length;
    }

    /**
     * Chooses a word list based on the provided type.
     * @param {string} type - The type of word list ('latin', 'medieval', 'both').
     * @returns {Array} The selected word list.
     */
    chooseWordList = (type) => {
        const availableDialects = {
            billAndTed: billAndTedWords,
            bostonian: bostonianWords,
            corporate: corporateWords,
            cowboy: cowboyWords,
            genZ: genZWords,
            hobbit: hobbitWords,
            latin: latinWords,
            leet: leetWords,
            medieval: medievalWords,
            pirate: pirateWords,
            scoobyDoo: scoobyDooWords,
            shakespeare: shakespeareanWords,
            surfer: surferWords,
            valley: valleyWords,
            yoda: yodaWords,
        };

        if (type === 'random') {
            const dialects = Object.values(availableDialects);
            return dialects[Math.floor(Math.random() * dialects.length)];
        }

        if (type === 'all') {
            return Object.values(availableDialects).flat();
        }

        return availableDialects[type] || medievalWords;
    };

    /**
     * Generates a random integer between min and max, inclusive.
     * @param {number} min - The minimum integer.
     * @param {number} max - The maximum integer.
     * @returns {number} A random integer between min and max.
     */
    getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    /**
     * Capitalizes the first letter of a string.
     * @param {string} str - The string to capitalize.
     * @returns {string} The capitalized string.
     */
    capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    /**
     * Retrieves a random word from the selected word list.
     * @returns {string} A random word.
     */
    getWord = () => this.wordList[this.getRandomInt(0, this.wordList.length - 1)];

    /**
     * Applies random formatting (bold, italic, or link) to a word.
     * @param {string} word - The word to format.
     * @returns {string} The formatted word.
     */
    formatWord = (word) => {
        const formats = ['bold', 'italic', 'link'];
        const formatType = formats[Math.floor(Math.random() * formats.length)];

        switch (formatType) {
            case 'bold':
                return `<strong>${word}</strong>`;
            case 'italic':
                return `<em>${word}</em>`;
            case 'link':
                return `<a href="#">${word}</a>`;
            default:
                return word;
        }
    };

    /**
     * Injects random formatting into a sentence.
     * @param {string} sentence - The sentence to format.
     * @returns {string} The formatted sentence.
     */
    injectFormatting = (sentence) => {
        const words = sentence.split(' ');
        const { maxFormattedWords } = this.settings;
        const uniqueIndexes = new Set();

        while (uniqueIndexes.size < maxFormattedWords && uniqueIndexes.size < words.length) {
            const randomIndex = Math.floor(Math.random() * words.length);
            uniqueIndexes.add(randomIndex);
        }

        for (const index of uniqueIndexes) {
            words[index] = this.formatWord(words[index]);
        }

        return words.join(' ');
    };

    /**
     * Generates a random sentence.
     * @param {boolean} [beginWithLoremIpsum=false] - Whether to start the sentence with "Lorem ipsum".
     * @returns {string} The generated sentence.
     */
    getSentence = (beginWithLoremIpsum = false) => {
        const { min, max } = this.settings.sentence;
        let wordsCount = this.settings.maxWords
            ? Math.min(this.getRandomInt(min, max), this.settings.maxWords)
            : this.getRandomInt(min, max);
        let sentence = beginWithLoremIpsum ? 'Lorem ipsum ' : '';

        for (let i = 0; i < wordsCount; i++) {
            sentence += this.getWord();
            if (i === wordsCount - 1) {
                sentence += '.';
            } else if (this.getRandomInt(0, this.settings.commaRate) === 0) {
                sentence += ', ';
            } else {
                sentence += ' ';
            }
        }

        sentence = this.capitalizeFirstLetter(sentence);

        if (this.settings.injectStyling) {
            sentence = this.injectFormatting(sentence);
        }

        return sentence;
    };

    /**
     * Generates a random paragraph.
     * @param {boolean} [beginWithLoremIpsum=false] - Whether to start the paragraph with "Lorem ipsum".
     * @param {string} [wrapWith=""] - Optional HTML tag to wrap the paragraph.
     * @returns {string} The generated paragraph.
     */
    getParagraph = (beginWithLoremIpsum = false, wrapWith = '') => {
        const { min, max } = this.settings.paragraph;
        const n = this.getRandomInt(min, max);
        let paragraph = '';

        for (let i = 0; i < n; i++) {
            paragraph += this.getSentence(beginWithLoremIpsum);
            beginWithLoremIpsum = false;
            if (i < n - 1) {
                paragraph += ' ';
            }
        }

        return wrapWith ? `<${wrapWith}>${paragraph}</${wrapWith}>` : paragraph;
    };

    /**
     * Generates text output in the specified format and limit.
     * @param {string} [format='string'] - The format of the output ('string', 'array', 'hash').
     * @param {number} [limit=10] - The maximum number of words or sentences to output.
     * @returns {string|Array|Object} The generated output in the specified format.
     */
    getOutput = (format = 'string', limit = 10) => {
        this.settings.maxWords = limit;
        let output;
        switch (format) {
            case 'array':
                output = limit === 0 ? this.wordList : this.wordList.slice(0, limit);
                break;
            case 'hash':
                output =
                    limit === 0
                        ? this.wordList.reduce((acc, word, index) => {
                              acc[index] = word;
                              return acc;
                          }, {})
                        : this.wordList.slice(0, limit).reduce((acc, word, index) => {
                              acc[index] = word;
                              return acc;
                          }, {});
                break;
            case 'markdown':
                this.settings.injectStyling = true;
                output = this.getParagraph()
                    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                    .replace(/<em>(.*?)<\/em>/g, '*$1*')
                    .replace(/<a href=".*?">(.*?)<\/a>/g, '[$1]()');
                break;
            case 'json':
                output = {
                    content: this.getParagraph(),
                    metadata: {
                        dialect: this.settings.wordList,
                        wordCount: this.wordCount,
                        timestamp: new Date().toISOString(),
                    },
                };
                break;
            case 'csv':
                output = this.wordList.slice(0, limit).join(',');
                break;
            case 'xml':
                output = `<content dialect="${
                    this.settings.wordList
                }">${this.getParagraph()}</content>`;
                break;
            default:
                output = this.getParagraph();
                break;
        }
        return output;
    };
}
