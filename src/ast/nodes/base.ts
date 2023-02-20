import { SyntaxKind } from "ast/enums/SyntaxKind";

export class BaseNode {
	public readonly kind: SyntaxKind = SyntaxKind.None;
	range?: [number, number];
	parent?: BaseNode;
}
