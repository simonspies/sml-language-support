"use babel";


import {
    spawn,
} from "child_process";
import {
    resolve,
} from "path";

import {
    CompositeDisposable,
    Disposable,
} from "atom";

import SMLLanguageSupportView from "./sml-language-support-view";


export default {

    subscriptions: null,
    process: null,
    buffer: null,


    activate(state) {
        this.subscriptions = new CompositeDisposable(
            // Add an opener for our view.
            atom.workspace.addOpener((uri) => {
                if (uri === "atom://sml-language-support") {
                    return new SMLLanguageSupportView(state.viewState);
                }
                return null;
            }),

            // Register command that toggles this view
            atom.commands.add("atom-workspace", {
                "sml-language-support:run": () => this.run(),
                "sml-language-support:toggle": () => this.toggle(),
            }),

            // Destroy any ActiveEditorInfoViews when the package is deactivated.
            new Disposable(() => {
                atom.workspace.getPaneItems().forEach((item) => {
                    if (item instanceof SMLLanguageSupportView) {
                        item.destroy();
                    }
                });
            }),

            new Disposable(() => {
                this.terminate();
            }),

        );
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {
        return {};
    },


    interpreter() {
        const lib = resolve(atom.packages.resolvePackagePath("sml-language-support"), "preload");
        const mosml = atom.config.get("sml-language-support.mosml");
        return spawn(mosml, ["-I", lib, "-P", "full"]);
    },

    toggle() {
        atom.workspace.toggle("atom://sml-language-support");
    },

    terminate() {
        if (this.process) {
            this.process.kill("SIGTERM");
            this.process = null;
        }
    },

    run() {
        // kill old process if exists
        this.terminate();

        atom.workspace.open("atom://sml-language-support").then((view) => {
            this.process = this.interpreter();

            view.emit("clear");
            view.emit("focus");
            this.process.stdout.on("data", (data) => {
                view.emit("add", data.toString());
            });

            const deregister = view.on("interpret", (text) => {
                this.process.stdin.write(text);
                view.emit("add", text);
            });

            this.process.on("close", () => deregister.dispose());

            const active = atom.workspace.getActiveTextEditor();
            this.process.stdin.write(`${active.getText()};\n`);
        });
    },
};
