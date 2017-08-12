"use babel";


/**
 * Example for an Auto Completion Provider, still needs a lot of refinement
 * TODO: Improve Me :D
 */
export default class SMLAutoCompletionProvider {
    selector = '.source.sml'
    inclusionPriority = 1
    // excludeLowerPriority = true
    disableForSelector = '.comment, .string'

    suggestionPriority = 2
    constructor() {

    }

    getSuggestions({
        editor,
        bufferPosition,
        scopeDescriptor,
        _prefix
    }) {
        const prefix = this.getPrefix(editor, bufferPosition);

        return new Promise((resolve) => {
            const pretext = editor.buffer.getTextInRange([[0, 0], bufferPosition]);
            const functions = pretext.match(/fun\s([A-Za-z0-9_']+)/g).map((s) => s.substr(3).trim())
            
            if (pretext.charAt(pretext.length - 1) === "|" && functions.length > 0) {
                const func = functions[functions.length - 1];
                const suggestion = {
                    text: func,
                    snippet: ' ' + func + " $0",
                    displayText: func,
                    replacementPrefix: "",
                    type: 'function'
                }
                resolve([suggestion]);
                return;


            }

            resolve([])
        });


    }

    getPrefix(editor, bufferPosition) {
        const regex = /[\w0-9_']+$/;

        const line = editor.getTextInRange([
            [bufferPosition.row, 0], bufferPosition
        ]);

        return (line.match(regex) || [""])[0];
    }
}