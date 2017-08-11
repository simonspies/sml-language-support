// tslint:disable object-literal-sort-keys

import { grammar as schema } from "../../schema";

export const Class = {
  alnum: `[:alnum:]`,
  alpha: `[:alpha:]`,
  ascii: `[:ascii:]`,
  blank: `[:blank:]`,
  cntrl: `[:cntrl:]`,
  digit: `[:digit:]`,
  graph: `[:graph:]`,
  lower: `[:lower:]`,
  print: `[:print:]`,
  punct: `[:punct:]`,
  space: `[:space:]`,
  upper: `[:upper:]`,
  word: `[:word:]`,
  xdigit: `[:xdigit:]`,
};

export const Keyword = {
  ABSTYPE: `abstype`,
  AND: `and`,
  ANDALSO: `andalso`,
  AS: `as`,
  CASE: `case`,
  DATATYPE: `datatype`,
  DO: `do`,
  ELSE: `else`,
  END: `end`,
  EQTYPE: `eqtype`,
  EXCEPTION: `exception`,
  FALSE: `false`,
  FN: `fn`,
  FUN: `fun`,
  FUNCTOR: `functor`,
  HANDLE: `handle`,
  IF: `if`,
  IN: `in`,
  INFIX: `infix`,
  INFIXR: `infixr`,
  INCLUDE: `include`,
  LET: `let`,
  LOCAL: `local`,
  NIL: `nil`,
  NONFIX: `nonfix`,
  OF: `of`,
  OP: `op`,
  OPEN: `open`,
  ORELSE: `orelse`,
  RAISE: `raise`,
  REC: `rec`,
  SHARING: `sharing`,
  SIG: `sig`,
  SIGNATURE: `signature`,
  STRUCT: `struct`,
  STRUCTURE: `structure`,
  THEN: `then`,
  TRUE: `true`,
  TYPE: `type`,
  VAL: `val`,
  WHERE: `where`,
  WHILE: `while`,
  WITH: `with`,
  WITHTYPE: `withtype`,
};

const decStart = [
  Keyword.ABSTYPE,
  Keyword.AND,
  Keyword.DATATYPE,
  Keyword.EXCEPTION,
  Keyword.FUN,
  Keyword.INFIX,
  Keyword.INFIXR,
  Keyword.LOCAL,
  Keyword.NONFIX,
  Keyword.OPEN,
  Keyword.TYPE,
  Keyword.VAL,
];

const decEnd = [
  ...decStart,
  Keyword.END,
  Keyword.IN,
];

const topdecStart = [
  ...decStart,
  Keyword.INCLUDE,
  Keyword.LOCAL,
  Keyword.FUNCTOR,
  Keyword.SIGNATURE,
  Keyword.STRUCTURE,
];

const topdecEnd = [
  ...topdecStart,
  Keyword.END,
  Keyword.IN,
];

export const TokSet = {
  decEnd,
  decStart,
  operator: [":", "!", "?", "'", "@", "/", "\\-", "\\*", "\\\\", "\\+", "\\|", "&", "#", "%", "`", "^", "<", "=", ">", "~", "$" ],
  topdecEnd,
  topdecStart,
};

export const alt = (...rest: string[]) => rest.join("|");
export const capture = (arg: string) => `(${arg})`;
export const complement = (...rest: string[]) => `[^${rest.join("")}]`;
export const group = (arg: string) => `(?:${arg})`;
export const lookBehind = (arg: string) => `(?<=${arg})`;
export const negativeLookBehind = (arg: string) => `(?<!${arg})`;
export function lastOps(...rest: string[]): string {
  const result: string[] = [];
  for (const token of rest) result.push(`[^${seq(...TokSet.operator)}]${token}`, `^${token}`);
  return alt(...result);
}
export function lastWords(...rest: string[]): string {
  const result: string[] = [];
  for (const token of rest) result.push(`[^[:word:]]${token}`, `^${token}`);
  return alt(...result);
}
export const many = (arg: string) => `${arg}*`;
export const manyOne = (arg: string) => `${arg}+`;
export const opt = (arg: string) => `${arg}?`;
export const words = (arg: string) => `\\b${arg}\\b`;
export const ops = (arg: string) => seq(lookBehind(complement(...TokSet.operator)), arg, lookAhead(complement(...TokSet.operator)));
export const lookAhead = (arg: string) => `(?=${arg})`;
export const negativeLookAhead = (arg: string) => `(?!=${arg})`;
export const seq = (...rest: string[]) => rest.join("");
export const set = (...rest: string[]) => `[${rest.join("")}]`;

export const Character = {
  APOSTROPHE: `'`,
  ASTERISK: `\\*`,
  COLON: `:`,
  COMMA: `,`,
  EQUALS_SIGN: `=`,
  ELLIPSIS: `\\.\\.\\.`,
  FULL_STOP: `\\.`,
  GREATER_THAN_SIGN: `>`,
  HYPHEN_MINUS: `-`,
  LEFT_CURLY_BRACKET: `\\{`,
  LEFT_PARENTHESIS: `\\(`,
  LEFT_SQUARE_BRACKET: `\\[`,
  LOW_LINE: `_`,
  NUMBER_SIGN: `#`,
  RIGHT_CURLY_BRACKET: `\\}`,
  RIGHT_PARENTHESIS: `\\)`,
  RIGHT_SQUARE_BRACKET: `\\]`,
  QUOTATION_MARK: `"`,
  SEMICOLON: `;`,
  VERTICAL_LINE: `\\|`,
};

export const Rx = {
  boundary: `\\b`,
  expEnd:
    lookAhead(
      alt(
        Character.COMMA,
        Character.RIGHT_CURLY_BRACKET,
        Character.RIGHT_PARENTHESIS,
        Character.RIGHT_SQUARE_BRACKET,
        seq(
          words(group(alt(...TokSet.topdecEnd))),
          group(
            alt(
              "$",
              set(Class.space),
              ops(
                alt(
                  Character.COMMA,
                  Character.RIGHT_CURLY_BRACKET,
                  Character.RIGHT_PARENTHESIS,
                  Character.RIGHT_SQUARE_BRACKET))))))),
topdecEndSansType:
    lookAhead(
      alt(
        Character.RIGHT_CURLY_BRACKET,
        Character.RIGHT_PARENTHESIS,
        Character.RIGHT_SQUARE_BRACKET,
        seq(
          words(group(alt(...TokSet.topdecEnd.filter((x) => x !== Keyword.TYPE) ))),
          group(
            alt(
              "$",
              set(Class.space),
              ops(
                alt(
                  Character.RIGHT_CURLY_BRACKET,
                  Character.RIGHT_PARENTHESIS,
                  Character.RIGHT_SQUARE_BRACKET))))))),
  topdecEnd:
    lookAhead(
      alt(
        Character.RIGHT_CURLY_BRACKET,
        Character.RIGHT_PARENTHESIS,
        Character.RIGHT_SQUARE_BRACKET,
        seq(
          words(group(alt(...TokSet.topdecEnd))),
          group(
            alt(
              "$",
              set(Class.space),
              ops(
                alt(
                  Character.RIGHT_CURLY_BRACKET,
                  Character.RIGHT_PARENTHESIS,
                  Character.RIGHT_SQUARE_BRACKET))))))),
};

export const operator: string =
  seq(
    set(Class.alpha),
    many(set(...TokSet.operator)),
    group(alt("\\b", lookAhead(set(Class.space)))));

export const identifier: string =
  seq(
    set(Class.alpha),
    many(set(Class.alnum, "'", "_")),
    group(alt("\\b", lookAhead(set(Class.space)))));

export const Lex = {
  operator:
    seq(
      negativeLookAhead(ops(alt(Character.VERTICAL_LINE))),
      manyOne(set(...TokSet.operator))),
  tyvar:
    seq(
      negativeLookAhead(words(group(alt(...Object.keys(Keyword).map((key) => Keyword[key]))))),
      seq(capture(Character.APOSTROPHE), capture(identifier))),
  vid:
    seq(
      negativeLookAhead(words(group(alt(...Object.keys(Keyword).map((key) => Keyword[key]))))),
      seq("\\b", identifier)),
};

export const Scope = {
  AND: `keyword`,
  APOSTROPHE: `punctuation.definition.tag`,
  CASE: `keyword.control.switch`,
  COLON: `variable.interpolation`, // TODO:
  COMMA: `punctuation.definition.tag`,
  COMMENT: `comment`,
  CONSTANT: `constant`,
  CONSTRUCTOR: `entity.name.class`,
  DELIMITER: `punctuation.definition.tag`,
  DOT: `keyword`,
  FIELD_NAME: `markup.inserted constant.language support.property-value entity.name.filename`,  // TODO:
  FIXITY: `keyword.control`,
  FUN: `storage.type`,
  FUNCTION_NAME: `entity.name.function`,
  FUNCTOR: `keyword`,
  INCLUDE: `keyword.control.include`,
  KEYWORD: `keyword`,
  LET: `keyword.control`,
  LOCAL: `keyword.control`,
  MODULE_NAME: `entity.name.class constant.numeric`,
  NUMBER: `constant.numeric`,
  OPEN: `keyword.control.open`,
  OPERATOR: `variable.interpolation`,
  PATTERN_VARIABLE: `string.other.link variable.language variable.parameter`,  // TODO:
  PUNCTUATION: `punctuation.definition.tag`,
  RAISE: `keyword.control.throwcatch`,
  REC: `keyword`,
  SIG: `keyword`,
  SIGNATURE: `keyword`,
  STRING: `string.double`,
  STRUCTURE: `keyword`,
  STRUCT: `keyword`,
  TYPE_CONSTRUCTOR: `support.type`,
  TYPE_NAME: `entity.name.type`,
  TYPE_OPERATOR: `keyword`,
  TYPE_VARIABLE: `variable.parameter string.other.link variable.language`,  // TODO:
  VAL: `storage.type`,
  VERTICAL_LINE: `keyword.control.switch`,
};

export const appexp: schema.Rule = {
  patterns: [
    { include: `#atexp` },
  ],
};

export const atexp: schema.Rule = {
  patterns: [
    { include: `#comment` },
    { include: `#Scopen` },
    { include: `#constant` },
    {
      // FIXME: end
      begin: ops(Character.NUMBER_SIGN),
      end: alt(capture(Lex.vid), lookBehind(set(Class.digit, Character.QUOTATION_MARK))),
      beginCaptures: {
        0: { name: Scope.OPERATOR },
      },
      endCaptures: {
        1: { name: Scope.FIELD_NAME },
      },
      patterns: [
        { include: `#constantNumber` },
        { include: `#constantString` },
      ],
    },
    {
      begin: words(Keyword.LET),
      end: lookBehind(lastWords(Keyword.END)),
      captures: {
        0: { name: Scope.LET },
      },
      patterns: [
        {
          begin: lookBehind(lastWords(Keyword.LET)),
          end: words(Keyword.IN),
          endCaptures: {
            0: { name: Scope.LET },
          },
          patterns: [
            { include: `#dec` },
          ],
        },
        {
          begin: lookBehind(lastWords(Keyword.IN)),
          end: words(Keyword.END),
          endCaptures: {
            0: { name: Scope.LET },
          },
          patterns: [
            { include: `#exp` },
          ],
        },
      ],
    },
    {
      begin: Character.LEFT_CURLY_BRACKET,
      end: Character.RIGHT_CURLY_BRACKET,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
    {
      begin: seq(Character.LEFT_PARENTHESIS, negativeLookAhead(Character.RIGHT_PARENTHESIS)),
      end: Character.RIGHT_PARENTHESIS,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        {
          begin: ops(Character.COLON),
          end: lookAhead(Character.RIGHT_PARENTHESIS),
          beginCaptures: {
            0: { name: Scope.COLON },
          },
          patterns: [
            { include: `#ty` },
          ],
        },
        { include: `#exp` },
      ],
    },
  ],
};

export const atpat: schema.Rule = {
  patterns: [],
};

export const comment: schema.Rule = {
  begin: seq(Character.LEFT_PARENTHESIS, Character.ASTERISK),
  end: seq(Character.ASTERISK, Character.RIGHT_PARENTHESIS),
  name: Scope.COMMENT,
  patterns: [
    { include: `#comment` },
  ],
};

export const conbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(alt(lastWords(Keyword.EXCEPTION), lastOps(Character.EQUALS_SIGN, Character.VERTICAL_LINE))),
      end:
        alt(
          capture(words(Keyword.OF)),
          capture(ops(Character.VERTICAL_LINE)),
          Rx.topdecEnd),
      endCaptures: {
        1: { name: Scope.CASE },
        2: { name: Scope.VERTICAL_LINE },
      },
      patterns: [
        { include: `#comment` },
        {
          match: alt(Lex.operator, Lex.vid),
          name: Scope.CONSTRUCTOR,
        },
      ],
    },
    {
      begin: lookBehind(lastWords(Keyword.OF)),
      end: alt(ops(Character.VERTICAL_LINE), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.VERTICAL_LINE },
      },
      patterns: [
        { include: `#comment` },
        { include: `#ty` },
      ],
    },
  ],
};

export const condesc: schema.Rule = {
  patterns: [],
};

export const constant: schema.Rule = {
  patterns: [ 
    { include: `#constantNumber` },
    { include: `#constantString` },
    {
      match: words(alt(Keyword.FALSE, Keyword.TRUE, Keyword.NIL)),
      name: Scope.CONSTANT,
    },
    { include: `#qualifiedConstant` },
    {
      match: seq(Character.LEFT_PARENTHESIS, Character.RIGHT_PARENTHESIS),
      name: Scope.CONSTANT,
    },
    {
      match: seq(Character.LEFT_SQUARE_BRACKET, Character.RIGHT_SQUARE_BRACKET),
      name: Scope.CONSTANT,
    },
    {
      begin: Character.LEFT_CURLY_BRACKET,
      end: Character.RIGHT_CURLY_BRACKET,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#row` },
      ],
    },
    {
      begin: Character.LEFT_SQUARE_BRACKET,
      end: Character.RIGHT_SQUARE_BRACKET,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
  ],
};

export const constantNumber: schema.Rule = {
  match:
  seq(
    negativeLookBehind(set(Class.alpha)),
    seq(
      set(Class.digit),
      many(set(Class.digit))),
    opt(
      capture(
        seq(
          Character.FULL_STOP,
          set(Class.digit),
          many(set(Class.digit)))))),
  name: Scope.NUMBER,
};

export const constantString: schema.Rule = {
  begin: `"`,
  end: `"`,
  name: Scope.STRING,
  patterns: [
    { match: `\\\\"` },
  ],
};

export const datbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(lastWords(Keyword.ABSTYPE, Keyword.AND, Keyword.DATATYPE)),
      end: ops(Character.EQUALS_SIGN),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        {
          match: Lex.vid,
          name: Scope.TYPE_NAME,
        },
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(words(Keyword.AND), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.AND },
      },
      patterns: [
        { include: `#conbind` },
      ],
    },
  ],
};

export const datdesc: schema.Rule = {
  patterns: [],
};

export const dec: schema.Rule = {
  patterns: [
    {
      begin: words(Keyword.ABSTYPE),
      end: words(Keyword.END),
      captures: {
        0: { name: Scope.KEYWORD },
      },
    },
    { include: `#decDatatype` },
    { include: `#decException` },
    {
      begin: words(Keyword.FUN),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.FUN },
      },
      patterns: [
        { include: `#fvalbind` },
      ],
    },
    {
      begin: words(group(alt(Keyword.INFIX, Keyword.INFIXR, Keyword.NONFIX))),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.FIXITY },
      },
      patterns: [
        {
          // FIXME
          match: Lex.operator,
          name: Scope.OPERATOR,
        },
      ],
    },
    {
      begin: words(Keyword.OPEN),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.OPEN },
      },
      patterns: [
        { include: `#qualifiedModule` },
      ],
    },
    { include: `#decType` },
    { include: `#decVal` },
  ],
};

export const decDatatype: schema.Rule = {
  patterns: [
    {
      begin: words(Keyword.DATATYPE),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#datbind` },
      ],
    },
  ],
};

export const decException: schema.Rule = {
  patterns: [
    {
      begin: words(Keyword.EXCEPTION),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#comment` },
        { include: `#conbind` },
      ],
    },
  ],
};

export const decType: schema.Rule = {
  patterns: [
    {
      begin: words(Keyword.TYPE),
      end: alt(Rx.topdecEnd, lookAhead(alt(words(Keyword.WHERE), Character.EQUALS_SIGN))),
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#typbind` },
      ],
    },
  ],
};

export const decVal: schema.Rule = {
  begin: words(Keyword.VAL),
  end: Rx.topdecEnd,
  beginCaptures: {
    0: { name: Scope.VAL },
  },
  patterns: [
    { include: `#valbind` },
  ],
};

export const exbind: schema.Rule = {
  patterns: [],
};

export const exdesc: schema.Rule = {
  patterns: [],
};

export const exp: schema.Rule = {
  patterns: [
    { include: `#atexp` },
    {
      // FIXME
      match: alt(capture(ops(Character.COMMA)), capture(alt(Character.SEMICOLON, Lex.operator)), capture(words(Keyword.AS))),
      captures: {
        1: { name: Scope.COMMA },
        2: { name: Scope.OPERATOR },
        3: { name: Scope.KEYWORD },
      },
    },
    {
      begin: words(Keyword.HANDLE),
      end: Rx.expEnd,
      beginCaptures: {
        0: { name: Scope.RAISE },
      },
      patterns: [
        { include: `#match` },
      ],
    },
    {
      match: words(Keyword.RAISE),
      name: Scope.RAISE,
    },
    {
      begin: words(Keyword.FN),
      end: Rx.expEnd,
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#match` },
      ],
    },
    {
      patterns: [
        {
          begin: words(Keyword.CASE),
          end: words(Keyword.OF),
          captures: {
            0: { name: Scope.CASE },
          },
          patterns: [
            { include: `#exp` },
          ],
        },
        {
          begin: lookBehind(lastWords(Keyword.OF)),
          end: Rx.expEnd,
          endCaptures: {
            0: { name: Scope.OPERATOR },
          },
          patterns: [
            { include: `#match` },
          ],
        },
      ],
    },
    {
      match: words(group(alt(Keyword.IF, Keyword.THEN, Keyword.ELSE))),
      name: Scope.KEYWORD,
    },
    {
      match: words(Keyword.ORELSE),
      name: Scope.OPERATOR,
    },
    {
      match: words(Keyword.ANDALSO),
      name: Scope.OPERATOR,
    },
    {
      match: words(group(alt(Keyword.WHILE, Keyword.DO))),
      name: Scope.KEYWORD,
    },
  ],
};

export const funbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(lastWords(Keyword.FUNCTOR, Keyword.AND)),
      end: ops(alt(capture(Character.COLON), capture(Character.EQUALS_SIGN))),
      endCaptures: {
        1: { name: Scope.COLON },
        2: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        { include: `#qualifiedModule` },
        {
          begin: Character.LEFT_PARENTHESIS,
          end: Character.RIGHT_PARENTHESIS,
          captures: {
            0: { name: Scope.DELIMITER },
          },
          patterns: [
            { include: `#spec` },
            {
              begin: Lex.vid,
              end: ops(Character.COLON),
              beginCaptures: {
                0: { name: Scope.MODULE_NAME },
              },
              endCaptures: {
                0: { name: Scope.COLON },
              },
            },
            {
              begin: lookBehind(lastOps(Character.COLON)),
              end: lookAhead(Character.RIGHT_PARENTHESIS),
              patterns: [
                { include: `#sigexp` },
              ],
            },
          ],
        },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON)),
      end: ops(Character.EQUALS_SIGN),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#sigexp` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: Rx.topdecEnd,
      endCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#strexp` },
      ],
    },
    {
      begin: lookBehind(lastWords(Keyword.AND)),
      end: Rx.topdecEnd,
      endCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#funbind` },
      ],
    },
  ],
};

export const fundec: schema.Rule = {
  patterns: [
    { include: `#comment` },
    {
      begin: words(Keyword.FUNCTOR),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.FUNCTOR },
      },
      patterns: [
        { include: `#funbind` },
      ],
    },
  ],
};

export const fvalbind: schema.Rule = {
  patterns: [
    {
      begin:
        lookBehind(
          alt(
            lastOps(Character.VERTICAL_LINE),
            lastWords(Keyword.AND, Keyword.FUN))),
      end: ops(alt(capture(Character.COLON), capture(Character.EQUALS_SIGN))),
      endCaptures: {
        1: { name: Scope.COLON },
        2: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        {
          begin:
            lookBehind(
              alt(
                lastOps(Character.VERTICAL_LINE),
                lastWords(Keyword.AND, Keyword.FUN))),
          end: alt(Lex.operator, Lex.vid, lookAhead(complement(Class.space, Class.alpha))),
          endCaptures: {
            0: { name: Scope.FUNCTION_NAME },
          },
        },
        { include: `#pat` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON)),
      end: alt(ops(Character.EQUALS_SIGN), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(capture(ops(Character.VERTICAL_LINE)), capture(words(Keyword.AND)), Rx.topdecEnd),
      endCaptures: {
        1: { name: Scope.VERTICAL_LINE },
        2: { name: Scope.AND },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
  ],
};

export const infexp: schema.Rule = {
  patterns: [
    { include: `#appexp` },
  ],
};

export const match: schema.Rule = {
  patterns: [
    {
      begin:
        lookBehind(
          alt(
            lastWords(Keyword.FN, Keyword.HANDLE, Keyword.OF),
            lastOps(Character.VERTICAL_LINE))),
      end: ops(seq(Character.EQUALS_SIGN, Character.GREATER_THAN_SIGN)),
      endCaptures: {
        0: { name: Scope.CASE },
      },
      patterns: [
        { include: `#comment` },
        { include: `#pat` },
      ],
    },
    {
      begin: lookBehind(lastOps(seq(Character.EQUALS_SIGN, Character.GREATER_THAN_SIGN))),
      end: alt(ops(Character.VERTICAL_LINE), Rx.expEnd),
      endCaptures: {
        0: { name: Scope.VERTICAL_LINE },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
  ],
};

export const pat: schema.Rule = {
  patterns: [
    {
      begin: Character.LEFT_CURLY_BRACKET,
      end: Character.RIGHT_CURLY_BRACKET,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#patrow` },
      ],
    },
    {
      begin: Character.LEFT_SQUARE_BRACKET,
      end: Character.RIGHT_SQUARE_BRACKET,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#pat` },
      ],
    },
    { include: `#constant` },
    {
      // FIXME
      match: alt(capture(ops(Character.COMMA)), capture(Lex.operator), capture(words(Keyword.AS))),
      captures: {
        1: { name: Scope.COMMA },
        2: { name: Scope.OPERATOR },
        3: { name: Scope.KEYWORD },
      },
    },
    {
      // FIXME: pattern variable
      match: alt(capture(ops(Character.LOW_LINE)), capture(seq(lookAhead(set(Class.lower)), Lex.vid))),
      captures: {
        1: { name: `${Scope.COMMENT} ${Scope.DELIMITER}` },
        2: { name: Scope.PATTERN_VARIABLE },
      },
    },
    {
      // FIXME
      begin: Character.LEFT_PARENTHESIS,
      end: Character.RIGHT_PARENTHESIS,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#comment` },
        {
          begin: ops(Character.COLON),
          end: lookAhead(Character.RIGHT_PARENTHESIS),
          beginCaptures: {
            0: { name: Scope.COLON },
          },
          patterns: [
            { include: `#ty` },
          ],
        },
        { include: `#pat` },
      ],
    },
  ],
};

export const patrow: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(alt(Character.LEFT_CURLY_BRACKET, Character.COMMA)),
      end: alt(ops(alt(capture(Character.COMMA), capture(Character.COLON), capture(Character.EQUALS_SIGN))), lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        1: { name: Scope.COMMA },
        2: { name: Scope.COLON },
        3: { name: Scope.COLON },
      },
      patterns: [
        {
          match: Lex.vid,
          name: Scope.FIELD_NAME,
        },
        {
          match: ops(Character.ELLIPSIS),
          name: Scope.CONSTRUCTOR,
        },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON)),
      end: alt(Character.COMMA, lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        0: { name: Scope.PUNCTUATION },
      },
      patterns: [
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(Character.COMMA, lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        0: { name: Scope.COMMA },
      },
      patterns: [
        { include: `#pat` },
      ],
    },
  ],
};

export const qualifiedConstant: schema.Rule = {
  patterns: [
    { include: `#qualifiedPrefix` },
    {
      match: seq(lookAhead(set(Class.upper)), Lex.vid),
      name: Scope.CONSTRUCTOR,
    },
  ],
};

export const qualifiedModule: schema.Rule = {
  patterns: [
    { include: `#qualifiedPrefix` },
    {
      match: seq(lookAhead(set(Class.upper)), Lex.vid),
      name: Scope.MODULE_NAME,
    },
  ],
};

export const qualifiedPrefix: schema.Rule = {
  begin: seq(lookAhead(set(Class.upper)), Lex.vid, lookAhead(seq(many(set(Class.space)), Character.FULL_STOP))),
  end: Character.FULL_STOP,
  beginCaptures: {
    0: { name: Scope.MODULE_NAME },
  },
  endCaptures: {
    0: { name: Scope.DOT },
  },
};

export const qualifiedType: schema.Rule = {
  patterns: [
    { include: `#qualifiedPrefix` },
    {
      match: Lex.vid,
      name: Scope.TYPE_CONSTRUCTOR,
    },
  ],
};

export const row: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(alt(Character.LEFT_CURLY_BRACKET, Character.COMMA)),
      end: alt(ops(alt(capture(Character.COMMA), capture(Character.COLON), capture(Character.EQUALS_SIGN))), lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        1: { name: Scope.COMMA },
        2: { name: Scope.COLON },
        3: { name: Scope.COLON },
      },
      patterns: [
        {
          match: Lex.vid,
          name: Scope.FIELD_NAME,
        },
        {
          match: ops(Character.ELLIPSIS),
          name: Scope.CONSTRUCTOR,
        },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON)),
      end: alt(Character.COMMA, lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        0: { name: Scope.PUNCTUATION },
      },
      patterns: [
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(Character.COMMA, lookAhead(Character.RIGHT_CURLY_BRACKET)),
      endCaptures: {
        0: { name: Scope.COMMA },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
  ],
};

export const Scopen: schema.Rule = {
  patterns: [],
};

export const sigbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(lastWords(Keyword.SIGNATURE, Keyword.AND)),
      end: ops(Character.EQUALS_SIGN),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        { include: `#qualifiedModule` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(words(Keyword.AND), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.AND },
      },
      patterns: [
        { include: `#sigexp` },
      ],
    },
    {
      begin: lookBehind(lastWords(Keyword.AND)),
      end: alt(words(Keyword.AND), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.AND },
      },
      patterns: [
        { include: `#sigbind` },
      ],
    },
  ],
};

export const sigdec: schema.Rule = {
  patterns: [
    { include: `#comment` },
    {
      begin: words(Keyword.SIGNATURE),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#sigbind` },
      ],
    },
  ],
};

export const sigexp: schema.Rule = {
  patterns: [
    { include: `#comment` },
    {
      begin: words(Keyword.SIG),
      end: words(Keyword.END),
      patterns: [
        { include: `#spec` },
      ],
      captures: {
        0: { name: Scope.SIG },
      },
    },
    {
      begin: alt(lookBehind(lastWords(Keyword.WHERE)), words(Keyword.WHERE)),
      end:
        alt(
          capture(words(Keyword.WHERE)),
          lookAhead(
            alt(
              ops(Character.EQUALS_SIGN),
              Rx.topdecEndSansType))),
      beginCaptures: {
        0: { name: Scope.KEYWORD },
      },
      endCaptures: {
        1: { name: Scope.KEYWORD },
      },
      patterns: [
        { include: `#decType` },
      ],
    },
    { include: `#qualifiedModule` },
  ],
};

export const spec: schema.Rule = {
  patterns: [
    { include: `#comment` },
    { include: `#decVal` },
    { include: `#decType` },
    { include: `#decDatatype` },
    { include: `#decException` },
    { include: `#strdecStructure` },
    {
      begin: words(Keyword.INCLUDE),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.INCLUDE },
      },
      patterns: [
        { include: `#sigexp` },
      ],
    },
  ],
};

export const strbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(lastWords(Keyword.STRUCTURE, Keyword.AND)),
      end: ops(alt(capture(seq(Character.COLON, opt(Character.GREATER_THAN_SIGN))), capture(Character.EQUALS_SIGN))),
      endCaptures: {
        1: { name: Scope.COLON },
        2: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        { include: `#qualifiedModule` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON, seq(Character.COLON, Character.GREATER_THAN_SIGN))),
      end: alt(ops(Character.EQUALS_SIGN), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#sigexp` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(words(Keyword.AND), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.AND },
      },
      patterns: [
        { include: `#strexp` },
      ],
    },
  ],
};

export const strdec: schema.Rule = {
  patterns: [
    { include: `#comment` },
    { include: `#dec` },
    { include: `#strdecStructure` },
    {
      begin: words(Keyword.LOCAL),
      end: lookBehind(lastWords(Keyword.END)),
      beginCaptures: {
        0: { name: Scope.LOCAL },
      },
      patterns: [
        {
          begin: lookBehind(lastWords(Keyword.LOCAL)),
          end: words(Keyword.IN),
          endCaptures: {
            0: { name: Scope.LOCAL },
          },
          patterns: [
            { include: `#dec` },
            { include: `#strdec` },
          ],
        },
        {
          begin: lookBehind(lastWords(Keyword.IN)),
          end: words(Keyword.END),
          endCaptures: {
            0: { name: Scope.LOCAL },
          },
          patterns: [
            { include: `#dec` },
            { include: `#strdec` },
          ],
        },
      ],
    },
  ],
};

export const strdecStructure: schema.Rule = {
  patterns: [
    {
      begin: words(Keyword.STRUCTURE),
      end: Rx.topdecEnd,
      beginCaptures: {
        0: { name: Scope.STRUCTURE },
      },
      patterns: [
        { include: `#strbind` },
      ],
    },
  ],
};

export const strdesc: schema.Rule = {
  patterns: [],
};

export const strexp: schema.Rule = {
  patterns: [
    { include: `#comment` },
    {
      begin: words(Keyword.STRUCT),
      end: words(Keyword.END),
      patterns: [
        { include: `#strdec` },
      ],
      beginCaptures: {
        0: { name: Scope.STRUCT },
      },
      endCaptures: {
        0: { name: Scope.STRUCT },
      },
    },
    { include: `#qualifiedModule` },
  ],
};

export const topdec: schema.Rule = {
  patterns: [
    { include: `#strdec` },
    { include: `#sigdec` },
    { include: `#fundec` },
  ],
};

export const ty: schema.Rule = {
  patterns: [
    { include: `#comment` },
    {
      match: Lex.tyvar,
      captures: {
        1: { name: Scope.APOSTROPHE },
        2: { name: Scope.TYPE_VARIABLE },
      },
    },
    {
      begin: Character.LEFT_CURLY_BRACKET,
      end: Character.RIGHT_CURLY_BRACKET,
      captures: {
        0: { name: Scope.CONSTRUCTOR },
      },
      patterns: [
        { include: `#row` },
      ],
    },
    {
      match:
        ops(
          alt(
            seq(Character.HYPHEN_MINUS, Character.GREATER_THAN_SIGN),
            Character.ASTERISK)),
      name: Scope.TYPE_OPERATOR,
    },
    {
      match: words(manyOne(set(alt(Class.word, Character.APOSTROPHE)))),
      name: Scope.TYPE_NAME,
    },
    {
      begin: Character.LEFT_PARENTHESIS,
      end: Character.RIGHT_PARENTHESIS,
      captures: {
        0: { name: Scope.DELIMITER },
      },
      patterns: [
        { include: `#ty` },
        {
          match: Character.COMMA,
          name: Scope.COMMA,
        },
      ],
    },
    {
      patterns: [
        { include: `#qualifiedType` },
      ],
    },
  ],
};

export const typbind: schema.Rule = {
  patterns: [
    {
      begin: lookBehind(lastWords(Keyword.TYPE)),
      end: alt(Rx.topdecEnd, capture(ops(Character.EQUALS_SIGN))),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#comment` },
        {
          match: Lex.vid,
          name: Scope.TYPE_NAME,
        },
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(Rx.topdecEnd, lookAhead(alt(words(Keyword.WHERE), Character.EQUALS_SIGN))),
      patterns: [
        { include: `#comment` },
        { include: `#ty` },
      ],
    },
  ],
};

export const typdesc: schema.Rule = {
  patterns: [],
};

export const valbind: schema.Rule = {
  patterns: [
    {
      begin:
        lookBehind(
          alt(
            lastOps(Character.VERTICAL_LINE),
            lastWords(Keyword.AND, Keyword.VAL))),
      end: alt(ops(alt(capture(Character.COLON), capture(Character.EQUALS_SIGN))), Rx.topdecEnd),
      endCaptures: {
        1: { name: Scope.COLON },
        2: { name: Scope.COLON },
      },
      patterns: [
        {
          begin:
            lookBehind(
              alt(
                lastOps(Character.VERTICAL_LINE),
                lastWords(Keyword.AND, Keyword.VAL))),
          end: alt(capture(words(Keyword.REC)), capture(seq(lookAhead(set(Class.lower)), Lex.vid)), lookAhead(complement(Class.space, Class.alpha))),
          endCaptures: {
            1: { name: Scope.REC },
            2: { name: Scope.FUNCTION_NAME },
          },
          patterns: [
            { include: `#pat` },
          ],
        },
        {
          begin: lookBehind(lastWords(Keyword.REC)),
          end: alt(capture(seq(lookAhead(set(Class.lower)), Lex.vid)), lookAhead(complement(Class.space, Class.alpha))),
          endCaptures: {
            0: { name: Scope.FUNCTION_NAME },
          },
        },
        { include: `#pat` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.COLON)),
      end: alt(ops(Character.EQUALS_SIGN), Rx.topdecEnd),
      endCaptures: {
        0: { name: Scope.COLON },
      },
      patterns: [
        { include: `#ty` },
      ],
    },
    {
      begin: lookBehind(lastOps(Character.EQUALS_SIGN)),
      end: alt(capture(ops(Character.VERTICAL_LINE)), capture(words(Keyword.AND)), Rx.topdecEnd),
      endCaptures: {
        1: { name: Scope.VERTICAL_LINE },
        2: { name: Scope.AND },
      },
      patterns: [
        { include: `#exp` },
      ],
    },
  ],
};

export const valdesc: schema.Rule = {
  patterns: [],
};

const grammar: schema.IGrammar = {
  name: `Standard ML`,
  scopeName: `source.sml`,
  fileTypes: [`.sml`, `.ml`],
  patterns: [
    { include: `#topdec` },
  ],
  repository: {
    appexp,
    atexp,
    atpat,
    comment,
    conbind,
    condesc,
    constant,
    constantNumber,
    constantString,
    datbind,
    datdesc,
    dec,
    decDatatype,
    decException,
    decType,
    decVal,
    exbind,
    exdesc,
    exp,
    funbind,
    fundec,
    fvalbind,
    infexp,
    match,
    pat,
    patrow,
    qualifiedConstant,
    qualifiedModule,
    qualifiedPrefix,
    qualifiedType,
    row,
    Scopen,
    sigbind,
    sigdec,
    sigexp,
    spec,
    strbind,
    strdec,
    strdecStructure,
    strdesc,
    strexp,
    topdec,
    ty,
    typbind,
    typdesc,
    valbind,
    valdesc,
  },
};

export default grammar;
