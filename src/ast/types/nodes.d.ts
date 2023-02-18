export interface BaseNode {
	type: string;
	range: [number, number];
}

interface BaseLiteral extends BaseNode {
	type: "Literal";
	value: string | number | boolean | undefined;
	raw: string;
}

interface BinaryExpression extends BaseNode {
	type: "BinaryExpression";
	left: BaseNode;
	right: BaseNode;
	operator: string;
}
