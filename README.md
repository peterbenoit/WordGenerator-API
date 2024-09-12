# Word Generator API

This project provides a simple API to generate random text based on different word lists, such as Latin and Medieval words. The API is built using Node.js and deployed on Vercel, utilizing the `WordGenerator` class to handle various text generation functionalities.

## API Overview

### Base URL

The base URL for the API is:

```
https://your-vercel-project.vercel.app/api/generate
```

Replace `your-vercel-project` with your actual Vercel project name.

### Endpoints

#### `GET /api/generate`

Generates random text based on the specified word list and format.

-   **Parameters:**

    -   `wordList` (string): The word list to use (`latin`, `medieval`, `both`). Default is `latin`.
    -   `format` (string): The output format (`string`, `array`, `hash`). Default is `string`.
    -   `limit` (number): The maximum number of words or sentences to generate. Use `0` to return all available words. Default is `10`.

-   **Example Request:**
    ```
    https://your-vercel-project.vercel.app/api/generate?wordList=latin&format=array&limit=5
    ```

## WordGenerator Class

The `WordGenerator` class is responsible for generating random text based on predefined word lists. The class allows customization of output, including formatting, limiting word counts, and choosing different word sources.

### Constructor

```javascript
new WordGenerator((settings = {}));
```

-   **settings** (object): Configuration object with the following optional properties:
    -   `sentence` (object): Defines minimum and maximum sentence length.
    -   `paragraph` (object): Defines minimum and maximum paragraph length.
    -   `commaRate` (number): Determines the frequency of commas in the generated text.
    -   `injectStyling` (boolean): Enables random styling for the text.
    -   `maxFormattedWords` (number): Limits the number of words with random formatting.
    -   `wordList` (string): Specifies the word list to use (`latin`, `medieval`, `both`).
    -   `outputFormat` (string): Defines the output format (`string`, `array`, `hash`).
    -   `maxWords` (number): Sets a limit on the total number of words.

### Methods

-   **`getOutput(format = 'string', limit = 10)`**: Returns generated text in the specified format and limit.

-   **`getSentence(beginWithLoremIpsum = false)`**: Generates a single sentence with optional "Lorem ipsum" start.

-   **`getParagraph(beginWithLoremIpsum = false, wrapWith = "")`**: Generates a paragraph with customizable wrapping tags.

## CodePen Project

You can find a live demonstration of the `WordGenerator` class and various use cases on CodePen:

[CodePen Project - Word Generator](https://codepen.io/peterbenoit/project/editor/DNYyGr)

## Getting Started

### Prerequisites

-   **Node.js**: Ensure you have Node.js installed on your local machine.
-   **Vercel CLI**: Install the Vercel CLI tool for deployment.

### Running Locally

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/word-generator-api.git
    ```
2. Navigate to the project directory:
    ```
    cd word-generator-api
    ```
3. Run the Vercel development server:
    ```
    vercel dev
    ```

### Deploying to Vercel

To deploy this project to Vercel, run:

```
vercel --prod
```

Follow the prompts to complete the deployment process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues or pull requests for new features, bug fixes, or improvements!

```

```
