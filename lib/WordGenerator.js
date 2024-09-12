/**
 * WordGenerator Class
 * ---------------------
 * This class generates random text based on predefined word lists, such as Latin or Medieval words.
 * It supports various customization options for output formatting, word limits, and random styling.
 *
 * @version 1.0.0
 * @license MIT
 *
 * (c) 2024 Peter Benoit. All rights reserved.
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
import { latinWords } from '../languages/latin.js';
import { medievalWords } from '../languages/medieval.js';

export class WordGenerator {
    /**
     * Constructor initializes the WordGenerator class with user-defined or default settings.
     * @param {Object} settings - Optional settings to customize the text generation.
     */
    constructor(settings = {}) {
        const defaultSettings = {
            sentence: { min: 2, max: 15 },       // Minimum and maximum number of words in a sentence
            paragraph: { min: 3, max: 10 },      // Minimum and maximum number of sentences in a paragraph
            commaRate: 10,                       // Chance of placing a comma in a sentence
            injectStyling: false,                // Whether to randomly style words
            maxFormattedWords: 3,                // Maximum number of words to format
            wordList: 'medieval',                // Default word list ('latin', 'medieval', 'both')
            outputFormat: 'string',              // Default output format ('string', 'array', 'hash')
            maxWords: null                       // Maximum number of words to generate
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
        switch(type) {
            case 'latin':
                return latinWords;
            case 'medieval':
                return medievalWords;
            case 'both':
                return [...latinWords, ...medievalWords];
            default:
                return medievalWords;
        }
    }

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
        let wordsCount = this.settings.maxWords ? Math.min(this.getRandomInt(min, max), this.settings.maxWords) : this.getRandomInt(min, max);
        let sentence = beginWithLoremIpsum ? "Lorem ipsum " : "";

        for (let i = 0; i < wordsCount; i++) {
            sentence += this.getWord();
            if (i === wordsCount - 1) {
                sentence += ".";
            } else if (this.getRandomInt(0, this.settings.commaRate) === 0) {
                sentence += ", ";
            } else {
                sentence += " ";
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
    getParagraph = (beginWithLoremIpsum = false, wrapWith = "") => {
        const { min, max } = this.settings.paragraph;
        const n = this.getRandomInt(min, max);
        let paragraph = "";

        for (let i = 0; i < n; i++) {
            paragraph += this.getSentence(beginWithLoremIpsum);
            beginWithLoremIpsum = false;
            if (i < n - 1) {
                paragraph += " ";
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
        let output;
        switch (format) {
            case 'array':
                output = limit === 0 ? this.wordList : this.wordList.slice(0, limit);
                break;
            case 'hash':
                output = limit === 0
                    ? this.wordList.reduce((acc, word, index) => { acc[index] = word; return acc; }, {})
                    : this.wordList.slice(0, limit).reduce((acc, word, index) => { acc[index] = word; return acc; }, {});
                break;
            default:
                output = this.getParagraph();
                break;
        }
        return output;
    }
}
