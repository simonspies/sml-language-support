#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "out", "src", "language", "sml", "grammar");
const dst = path.resolve(__dirname, "..", "..", "grammars", "sml.json");
fs.writeFileSync(dst, JSON.stringify(require(src).default, null, 2));
