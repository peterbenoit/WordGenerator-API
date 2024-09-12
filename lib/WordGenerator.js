import { latinWords } from '../languages/latin.js';
import { medievalWords } from '../languages/medieval.js';

export class WordGenerator {
    constructor(settings = {}) {
        const defaultSettings = {
            sentence: { min: 2, max: 15 },
            paragraph: { min: 3, max: 10 },
            commaRate: 10,
            injectStyling: false,
            maxFormattedWords: 3,
            wordList: 'medieval',
            outputFormat: 'string',
            maxWords: null // Setting to limit total words
        };

        this.settings = { ...defaultSettings, ...settings };
        this.wordList = this.chooseWordList(this.settings.wordList);
        this.wordCount = this.wordList.length;
    }

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

    getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    getWord = () => this.wordList[this.getRandomInt(0, this.wordList.length - 1)];

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

    // Updated method to get output in different formats with limiters
    getOutput = (format = 'string', limit = 10) => {
        let output;
        switch (format) {
            case 'array':
                output = limit === 0 ? this.wordList : this.wordList.slice(0, limit); // Return all if limit is 0
                break;
            case 'hash':
                output = limit === 0
                    ? this.wordList.reduce((acc, word, index) => { acc[index] = word; return acc; }, {})
                    : this.wordList.slice(0, limit).reduce((acc, word, index) => { acc[index] = word; return acc; }, {});
                break;
            default: // Default is a paragraph
                output = this.getParagraph();
                break;
        }
        return output;
    }
}
