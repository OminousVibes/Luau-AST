// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
	return d[0];
}

interface NearleyToken {
	value: any;
	[key: string]: any;
}

interface NearleyLexer {
	reset: (chunk: string, info: any) => void;
	next: () => NearleyToken | undefined;
	save: () => any;
	formatError: (token: never) => string;
	has: (tokenType: string) => boolean;
}

interface NearleyRule {
	name: string;
	symbols: NearleySymbol[];
	postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
	Lexer: NearleyLexer | undefined;
	ParserRules: NearleyRule[];
	ParserStart: string;
}

const grammar: Grammar = {
	Lexer: undefined,
	ParserRules: [
		{ name: "process", symbols: ["Expression"] },
		{ name: "Expression$subexpression$1", symbols: ["Literals"] },
		{ name: "Expression$subexpression$1", symbols: ["NonLiterals"] },
		{ name: "Expression", symbols: ["Expression$subexpression$1"], postprocess: ([data]) => data[0] },
		{ name: "Literals$subexpression$1", symbols: ["NilLiteral"] },
		{ name: "Literals$subexpression$1", symbols: ["BooleanLiteral"] },
		{ name: "Literals$subexpression$1", symbols: ["NumberLiteral"] },
		{ name: "Literals$subexpression$1", symbols: ["StringLiteral"] },
		{ name: "Literals$subexpression$1", symbols: ["InterpolatedStringLiteral"] },
		{ name: "Literals", symbols: ["Literals$subexpression$1"], postprocess: ([data]) => data[0] },
		{ name: "NonLiterals$subexpression$1", symbols: ["Identifier"] },
		{ name: "NonLiterals$subexpression$1", symbols: ["DotPropertyAccessExpression"] },
		{ name: "NonLiterals$subexpression$1", symbols: ["BracketPropertyAccessExpression"] },
		{ name: "NonLiterals", symbols: ["NonLiterals$subexpression$1"], postprocess: ([data]) => data[0] },
		{
			name: "NilLiteral$string$1",
			symbols: [{ literal: "n" }, { literal: "i" }, { literal: "l" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "NilLiteral",
			symbols: ["NilLiteral$string$1"],
			postprocess: () => ({ kind: "NilLiteral", value: undefined }),
		},
		{
			name: "TrueLiteral$string$1",
			symbols: [{ literal: "t" }, { literal: "r" }, { literal: "u" }, { literal: "e" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "TrueLiteral",
			symbols: ["TrueLiteral$string$1"],
			postprocess: () => ({ kind: "BooleanLiteral", value: true }),
		},
		{
			name: "FalseLiteral$string$1",
			symbols: [{ literal: "f" }, { literal: "a" }, { literal: "l" }, { literal: "s" }, { literal: "e" }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "FalseLiteral",
			symbols: ["FalseLiteral$string$1"],
			postprocess: () => ({ kind: "BooleanLiteral", value: false }),
		},
		{ name: "BooleanLiteral$subexpression$1", symbols: ["TrueLiteral"] },
		{ name: "BooleanLiteral$subexpression$1", symbols: ["FalseLiteral"] },
		{ name: "BooleanLiteral", symbols: ["BooleanLiteral$subexpression$1"], postprocess: ([data]) => data[0] },
		{ name: "NumberLiteral$subexpression$1", symbols: ["integer"] },
		{ name: "NumberLiteral$subexpression$1", symbols: ["float"] },
		{
			name: "NumberLiteral",
			symbols: ["NumberLiteral$subexpression$1"],
			postprocess: ([[data]]) => ({ kind: "NumberLiteral", value: Number(data) }),
		},
		{
			name: "StringLiteral",
			symbols: ["string"],
			postprocess: ([[data]]) => ({
				kind: "StringLiteral",
				value: JSON.parse('"' + data.substring(1, data.length - 1) + '"'),
				raw: data,
			}),
		},
		{ name: "InterpolatedStringLiteral$ebnf$1", symbols: [] },
		{
			name: "InterpolatedStringLiteral$ebnf$1",
			symbols: ["InterpolatedStringLiteral$ebnf$1", "_istrchar"],
			postprocess: (d) => d[0].concat([d[1]]),
		},
		{
			name: "InterpolatedStringLiteral",
			symbols: [{ literal: "`" }, "InterpolatedStringLiteral$ebnf$1", { literal: "`" }],
			postprocess: (data) => {
				const values = [];
				data[1].forEach((v) => {
					if (typeof v == "string") {
						const last = values.length - 1;
						if (typeof values[last] == "string") values[last] += v;
						else values.push(v);
					} else values.push(v);
				});
				return {
					kind: "InterpolatedStringLiteral",
					value: values,
				};
			},
		},
		{
			name: "VarArgsLiteral$string$1",
			symbols: [{ literal: "." }, { literal: "." }, { literal: "." }],
			postprocess: (d) => d.join(""),
		},
		{
			name: "VarArgsLiteral",
			symbols: ["VarArgsLiteral$string$1"],
			postprocess: () => ({ kind: "VarArgsLiteral" }),
		},
		{ name: "Identifier$subexpression$1$ebnf$1", symbols: [] },
		{
			name: "Identifier$subexpression$1$ebnf$1",
			symbols: ["Identifier$subexpression$1$ebnf$1", /[a-zA-Z0-9_]/],
			postprocess: (d) => d[0].concat([d[1]]),
		},
		{ name: "Identifier$subexpression$1", symbols: [/[a-zA-Z_]/, "Identifier$subexpression$1$ebnf$1"] },
		{
			name: "Identifier",
			symbols: ["Identifier$subexpression$1"],
			postprocess: ([data], _, reject) => ({
				kind: "Identifier",
				name: data[0] + data[1]?.join(""),
			}),
		},
		{
			name: "DotPropertyAccessExpression",
			symbols: ["Expression", { literal: "." }, "Identifier"],
			postprocess: (data) => ({
				kind: "DotPropertyAccessExpression",
				expression: data[0],
				index: data[2],
			}),
		},
		{
			name: "BracketPropertyAccessExpression",
			symbols: ["Expression", { literal: "[" }, "Expression", { literal: "]" }],
			postprocess: (data) => ({
				kind: "BracketPropertyAccessExpression",
				expression: data[0],
				index: data[2],
			}),
		},
		{ name: "integer$ebnf$1", symbols: [/[0-9]/] },
		{ name: "integer$ebnf$1", symbols: ["integer$ebnf$1", /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
		{ name: "integer", symbols: ["integer$ebnf$1"], postprocess: ([data]) => data.join("") },
		{ name: "float$ebnf$1", symbols: [] },
		{ name: "float$ebnf$1", symbols: ["float$ebnf$1", /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
		{ name: "float$ebnf$2", symbols: [/[0-9]/] },
		{ name: "float$ebnf$2", symbols: ["float$ebnf$2", /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
		{
			name: "float",
			symbols: ["float$ebnf$1", { literal: "." }, "float$ebnf$2"],
			postprocess: (data) => data[0].join("") + "." + data[2].join(""),
		},
		{ name: "string$subexpression$1", symbols: ["_dqstring"] },
		{ name: "string$subexpression$1", symbols: ["_sqstring"] },
		{ name: "string", symbols: ["string$subexpression$1"], postprocess: id },
		{ name: "_dqstring$ebnf$1", symbols: [] },
		{
			name: "_dqstring$ebnf$1",
			symbols: ["_dqstring$ebnf$1", "_dstrchar"],
			postprocess: (d) => d[0].concat([d[1]]),
		},
		{
			name: "_dqstring",
			symbols: [{ literal: '"' }, "_dqstring$ebnf$1", { literal: '"' }],
			postprocess: (data) => data[0] + data[1].join("") + data[2],
		},
		{ name: "_sqstring$ebnf$1", symbols: [] },
		{
			name: "_sqstring$ebnf$1",
			symbols: ["_sqstring$ebnf$1", "_sstrchar"],
			postprocess: (d) => d[0].concat([d[1]]),
		},
		{
			name: "_sqstring",
			symbols: [{ literal: "'" }, "_sqstring$ebnf$1", { literal: "'" }],
			postprocess: (data) => data[0] + data[1].join("") + data[2],
		},
		{ name: "_dstrchar", symbols: [/[^\\"\n]/], postprocess: id },
		{ name: "_dstrchar", symbols: [{ literal: "\\" }, "_strescape"], postprocess: (data) => data.join("") },
		{ name: "_sstrchar", symbols: [/[^\\'\n]/], postprocess: id },
		{ name: "_sstrchar", symbols: [{ literal: "\\" }, "_strescape"], postprocess: (data) => data.join("") },
		{ name: "_sstrchar$string$1", symbols: [{ literal: "\\" }, { literal: "'" }], postprocess: (d) => d.join("") },
		{ name: "_sstrchar", symbols: ["_sstrchar$string$1"], postprocess: () => "'" },
		{ name: "_istrchar", symbols: [/[^{\\`\n]/], postprocess: id },
		{
			name: "_istrchar",
			symbols: [{ literal: "{" }, "Expression", { literal: "}" }],
			postprocess: (data) => data[1],
		},
		{ name: "_istrchar", symbols: [{ literal: "\\" }, "_strescape"], postprocess: (data) => data.join("") },
		{ name: "_istrchar$string$1", symbols: [{ literal: "\\" }, { literal: "`" }], postprocess: (d) => d.join("") },
		{ name: "_istrchar", symbols: ["_istrchar$string$1"], postprocess: () => "`" },
		{ name: "_strescape", symbols: [/["\\/bfnrt]/], postprocess: id },
		{
			name: "_strescape",
			symbols: [{ literal: "u" }, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/],
			postprocess: (data) => data.join(""),
		},
		{ name: "_$ebnf$1", symbols: [] },
		{ name: "_$ebnf$1", symbols: ["_$ebnf$1", "_wschar"], postprocess: (d) => d[0].concat([d[1]]) },
		{ name: "_", symbols: ["_$ebnf$1"], postprocess: () => null },
		{ name: "__$ebnf$1", symbols: ["_wschar"] },
		{ name: "__$ebnf$1", symbols: ["__$ebnf$1", "_wschar"], postprocess: (d) => d[0].concat([d[1]]) },
		{ name: "__", symbols: ["__$ebnf$1"], postprocess: () => null },
		{ name: "_wschar", symbols: [/[ \t\n\v\f]/], postprocess: id },
	],
	ParserStart: "process",
};

export default grammar;
