"use babel";

import {
    TextEditor,
    CompositeDisposable,
    Disposable,
    Emitter,
} from "atom";


export default class SMLLanguageSupportView extends Emitter {
    search = /\B('a|'b|'c|'d|'e|'f|'g|'h|'i|'j)\b/g
    mapping = {
        "'a": "\uD835\uDEFC",
        "'b": "\uD835\uDEFD",
        "'c": "\uD835\uDEFE",
        "'d": "\uD835\uDEFF",
        "'e": "\uD835\uDF00",
        "'f": "\uD835\uDF01",
        "'g": "\uD835\uDF02",
        "'h": "\uD835\uDF03",
        "'i": "\uD835\uDF04",
        "'j": "\uD835\uDF05",
    }

    disposable = null
    keyevents = null
    history = []
    historypos = 0

    constructor() {
        // Create root element
        super();
        this.disposable = new CompositeDisposable();
        this.element = this.content();

        this.on("clear", () => {
            this.output.innerHTML = "";
        });
        this.on("add", (data) => {
            this.output.innerHTML += data.replace(this.search, match => this.mapping[match]);
            this.output.scrollTop = this.output.scrollHeight;
        });

        this.on("focus", () => atom.views.getView(this.input).focus());
        this.keyevents = {
            Enter: (event) => {
                if (this.input.getText().length === 0) {
                    return;
                }

                if (event.shiftKey) {
                    this.input.setText(`${this.input.getText()}\n`);
                    return;
                }

                this.emit("interpret", `${this.input.getText()}\n`);
                this.history.push(this.input.getText());
                this.input.setText("");
                // higher than valid because decreased first
                this.historypos = this.history.length;
            },
            ArrowUp: () => {
                if (this.history.length === 0) {
                    return;
                }

                this.historypos = Math.max(this.historypos - 1, 0);
                this.input.setText(this.history[this.historypos]);
            },
            ArrowDown: () => {
                if (this.history.length === 0) {
                    return;
                }

                this.historypos = Math.min(this.historypos + 1, this.history.length - 1);
                this.input.setText(this.history[this.historypos]);
            },
        };


        // will be removed when view is removed
        atom.views.getView(this.input).addEventListener("keydown", (event) => {
            const handler = this.keyevents[event.key];
            if (handler) {
                handler(event);
            }
        });
    }


    content() {
        const element = document.createElement("div");
        element.classList.add("sml-language-support");

        this.output = document.createElement("pre");
        this.output.classList.add("output", "native-key-bindings");
        this.output.setAttribute("tabindex", -1);

        this.input = new TextEditor({
            mini: true,
        });
        this.input.setGrammar(atom.grammars.grammarForScopeName("source.sml"));
        this.input.setPlaceholderText("> have fun");

        element.appendChild(this.output);
        element.appendChild(atom.views.getView(this.input));

        this.disposable.add(new Disposable(() => element.remove()));

        return element;
    }

    getDefaultLocation() {
        // This location will be used if the user hasn't overridden it
        // by dragging the item elsewhere.
        // Valid values are "left", "right", "bottom", and "center" (the default).
        return "right";
    }

    getAllowedLocations() {
        // The locations into which the item can be moved.
        return ["left", "right", "bottom"];
    }

    getTitle() {
        return "Standard ML";
    }

    // Tear down any state and detach
    destroy() {
        this.disposable.dispose();
    }

    getElement() {
        return this.element;
    }

    getURI() {
        // Used by Atom to identify the view when toggling.
        return "atom://sml-language-support";
    }
}
