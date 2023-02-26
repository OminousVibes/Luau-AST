# @preprocessor typescript
@{%
	const keywords = [
		"local", "nil", "true", "false",
		"not", "and", "or",

		"break", "continue", "return",

		"function",
		"while", "do",
		"repeat", "until",
		"for", "in",
		"if", "else", "elseif",
		"end"
	];

	const _keywordSet = new Set(keywords);
	const isKeyword = (name) => _keywordSet.has(name);
%}

process -> Chunk

Identifier -> ([a-zA-Z_] [a-zA-Z0-9_]:*) {% ([data], _, reject) => {
	const name = data[0] + data[1]?.join("");
	return !isKeyword(name) ? { kind: "Identifier", name } : reject
} %}

## Sections
## Segments of code that are executed as a unit.
Chunk -> Block {% (data) => ({ ...data[0], kind: "Chunk" }) %}

Block -> Statement:? (statement_sep Statement):* {% (data) => ({
	kind: "Block",
	body: [data[0], ...data[1].map(([, s]) => s)],
}) %}

## Statements
## Segments of code that perform specific actions or operations
Statement -> (
	VariableDeclaration
	| FunctionDeclaration
	| InlineComment
	| MultilineComment
) {% ([data]) => data[0] %}

VariableDeclaration -> ("local" __):?
	((Identifier _ ((comma_sep Identifier _) {% ([data]) => data[1] %}):*) {% ([data]) => [data[0], ...data[2]] %})
	(
		"=" _ 
		((Expression _ ((comma_sep Expression _) {% ([data]) => data[1] %}):*) {% ([data]) => [data[0], ...data[2]] %})
	):?
{% (data) => ({
	kind: "VariableDeclaration",
	local: data[0] != null,
	names: [...data[1]],
	inits: data[2] ? [...data[2][2]] : [],
}) %}

FunctionDeclaration -> ("local" __):? "function" __ Identifier _ "("
	(
		(_ Identifier _ (("," _ Identifier _) {% ([data]) => data[2] %}):*) {% ([data]) => [data[1], ...data[3]] %}
		| _ {% () => [] %}
	) ")" _ "end"

BreakStatement -> "break" {% () => ({ kind: "BreakStatement" }) %}
ContinueStatement -> "continue" {% () => ({ kind: "ContinueStatement" }) %}
ReturnStatement -> "return" _ Expression {% (data) => ({ kind: "ReturnStatement", expression: data[2] }) %}

InlineComment -> "--" [^\n]:* ("\n"):? {% ([, data], _, reject) => {
	const content = data !== null ? data.join("") : "";
	return content.substring(0, 2) !== "[[" ? { kind: "InlineComment", content } : reject;
} %}
MultilineComment -> "--[[" [\S\s\n]:* "]]" {% (data) => ({ kind: "MultilineComment", value: data[1].join("") }) %}


## Expressions
## Segments of code that evaluate to a value.
Expression -> (Literals | NonLiterals) {% ([data]) => data[0] %}

Literals -> (
	NilLiteral
	| BooleanLiteral
	| NumberLiteral
	| StringLiteral
	| InterpolatedStringLiteral
	| VarArgsLiteral
) {% ([data]) => data[0] %}
NonLiterals -> (
	Identifier
	| DotPropertyAccessExpression
	| BracketPropertyAccessExpression
	| FunctionExpression
	| CallExpression
	| MethodCallExpression
	| ParenthesizedExpression
	| TernaryExpression
	| TableExpression
) {% ([data]) => data[0] %}

# literals
NilLiteral -> "nil" {% () => ({ kind: "NilLiteral", value: undefined }) %}

TrueLiteral -> "true" {% () => ({ kind: "BooleanLiteral", value: true }) %}
FalseLiteral -> "false" {% () => ({ kind: "BooleanLiteral", value: false }) %}
BooleanLiteral -> (TrueLiteral | FalseLiteral) {% ([data]) => data[0] %}

NumberLiteral -> (integer | float) {% ([[data]]) => ({ kind: "NumberLiteral", value: Number(data) }) %}

StringLiteral -> string {% ([{value, delim}]) => ({ kind: "StringLiteral", value: JSON.parse("\"" + value.substring(delim, value.length - delim) + "\"") }) %}
InterpolatedStringLiteral -> "`" _istrchar:* "`" {% (data) => {
	const values = []
	data[1].forEach((v) => {
		if (typeof v == "string") {
			const last = values.length - 1;
			if (typeof values[last] == "string") values[last] += v;
			else values.push(v);
		}
		else values.push(v);
	})
	return {
		kind: "InterpolatedStringLiteral",
		value: values,
	}
} %}

VarArgsLiteral -> "..." {% () => ({ kind: "VarArgsLiteral" }) %}

# non-literals
DotPropertyAccessExpression -> Expression _ "." _ Identifier {% (data) => ({
	kind: "DotPropertyAccessExpression",
	expression: data[0],
	index: data[4]
}) %}
BracketPropertyAccessExpression -> Expression _ "[" _ Expression _ "]" {% (data) => ({
	kind: "BracketPropertyAccessExpression",
	expression: data[0],
	index: data[4]
}) %}

FunctionExpression -> "function"
CallExpression -> Expression _ "("
	(
		(_ Expression _ (("," _ Expression _) {% ([data]) => data[2] %}):*) {% ([data]) => [data[1], ...data[3]] %}
		| _ {% () => [] %}
	)
	")" {% (data) => ({
	kind: "CallExpression",
	base: data[0],
	args: [...data[3]],
}) %}
MethodCallExpression -> Expression _ ":" _ Identifier _ "("
	(
		(_ Expression _ (("," _ Expression _) {% ([data]) => data[2] %}):*) {% ([data]) => [data[1], ...data[3]] %}
		| _ {% () => [] %}
	)
	")" {% (data) => ({
	kind: "MethodCallExpression",
	base: data[0],
	method: data[4],
	args: [...data[7]],
}) %}

ParenthesizedExpression -> "(" _ Expression _ ")" {% (data) => ({ kind: "ParenthesizedExpression", expression: data[2] }) %}

TernaryExpression -> "if" _ Expression _ "then" _ Expression _ "else" _ Expression {% (data) => ({
	kind: "TernaryExpression",
	condition: data[2],
	consequent: data[6],
	alternate: data[10],
}) %}

TableExpression -> "{" TableValues "}" {% (data) => ({ kind: "TableExpression", fields: [...data[1]] })
%}


## Constants
## Rules that define constants.

# Primitives
integer -> [0-9]:+ {% ([data]) => data.join("") %}
float -> [0-9]:* "." [0-9]:+ {% (data) => data[0].join("") + "." + data[2].join("") %}
string -> (_dqstring | _sqstring) {% ([[data]]) => ({ value: data, delim: 1 }) %}
		| _dbstring {% ([data]) => ({ value: data, delim: 2 }) %}

# Others
TableValue -> Expression {% (data) => ({ kind: "TableValue", value: data[0] }) %}
TableField -> Identifier _ "=" _ Expression {% (data) => ({ kind: "TableField", key: data[0], value: data[4] }) %}
		| "[" _ Expression _ "]" _ "=" _ Expression {% (data) => ({ kind: "TableField", key: data[2], value: data[8] }) %}
TableValues -> (
	(_ (TableField | TableValue) _ ((table_sep (TableField | TableValue) _) {% ([data]) => data[1][0] %}):*)
		{% ([data]) => [data[1][0], ...data[3]] %}
	| _ {% () => [] %}
) {% id %}


_dqstring -> "\"" _dstrchar:* "\"" {% (data) => data[0] + data[1].join("") + data[2] %}
_sqstring -> "'"  _sstrchar:* "'"  {% (data) => data[0] + data[1].join("") + data[2] %}
_dbstring -> "[["  _dbbchar:* "]]"  {% (data) => data[0] + data[1].join("") + data[2] %}
_dstrchar ->
	[^\\"\n] {% id %}
    | "\\" _strescape {% (data) => data.join("") %}
_sstrchar ->
	[^\\'\n] {% id %}
    | "\\" _strescape {% (data) => data.join("") %}
    | "\\'" {% () => "'" %}
_dbbchar ->
    [^\\] {% id %}
    | "\\]" {% () => "'" %}
_istrchar ->
	[^{\\`\n] {% id %}
	| "{" _ Expression _ "}" {% (data) => data[2] %} 
    | "\\" _strescape {% (data) => data.join("") %}
    | "\\`" {% () => "`" %}
_strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {% (data) => data.join("") %}

## Seperators
## Rules that define seperators.
_ -> _wschar:* {% () => null %}
__ -> _wschar:+ {% () => null %}
_wschar -> [ \t\n\v\f] {% id %}

statement_sep -> (";" _ | __) {% () => null %}
comma_sep -> "," _ {% () => null %}
semicolon_sep -> ";" _ {% () => null %}
table_sep -> (semicolon_sep | comma_sep) {% () => null %}