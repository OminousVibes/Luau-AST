export enum SyntaxKind {
	// Indexable Expressions
	Identifier, // e.g. x
	TemporaryIdentifier, // e.g. _ENV
	ComputedIndexExpression, // e.g. t[1]
	PropertyAccessExpression, // e.g. t.x
	CallExpression, // e.g. f(x)
	MethodCallExpression, // e.g. t:f(x)
	ParenthesizedExpression, // e.g. (x + y)

	// Expressions
	None, // e.g. no expression
	NilLiteral, // e.g. nil
	FalseLiteral, // e.g. false
	TrueLiteral, // e.g. true
	NumberLiteral, // e.g. 123 or 3.14
	StringLiteral, // e.g. "hello" or 'world'
	VarArgsLiteral, // e.g. ...
	FunctionExpression, // e.g. function (x, y) return x + y end
	BinaryExpression, // e.g. x + y
	UnaryExpression, // e.g. -x
	IfExpression, // e.g. x > 0 and y or z
	Array, // e.g. {1, 2, 3}
	Map, // e.g. {a = 1, b = 2}
	Set, // e.g. {1, 2, 3}
	MixedTable, // e.g. {1, 2, a = 3, b = 4}

	// Statements
	Assignment, // e.g. x, y = y, x
	BreakStatement, // e.g. break
	CallStatement, // e.g. print("hello")
	ContinueStatement, // e.g. continue
	DoStatement, // e.g. do x = x + 1 end
	WhileStatement, // e.g. while x < 10 do print(x) end
	RepeatStatement, // e.g. repeat x = x + 1 until x == 10
	IfStatement, // e.g. if x > 0 then print(x) end
	NumericForStatement, // e.g. for i = 1, 10 do print(i) end
	ForStatement, // e.g. for k, v in pairs(t) do print(k, v) end
	FunctionDeclaration, // e.g. function f(x, y) return x + y end
	MethodDeclaration, // e.g. function t:add(x, y) self.x = x self.y = y end
	VariableDeclaration, // e.g. local x = 1, y = 2
	ReturnStatement, // e.g. return x + y
	Comment, // e.g. -- this is a comment

	// Fields
	MapField, // e.g. a = 1

	// Used to detect what category a given kind falls into
	FirstIndexableExpression = Identifier,
	LastIndexableExpression = ParenthesizedExpression,
	FirstExpression = Identifier,
	LastExpression = Set,
	FirstStatement = Assignment,
	LastStatement = Comment,
	FirstField = MapField,
	LastField = MapField,
}
