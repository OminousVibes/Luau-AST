import { SyntaxKind } from "ast/enums/SyntaxKind";
import { BaseNode } from "../base";

export interface Identifier extends BaseNode {
	kind: SyntaxKind;
}

export class IdentifierNode implements Identifier {
	public readonly kind = SyntaxKind.Identifier;

	public name;
	public range;
	public parent;

	constructor(name: string, range: BaseNode["range"], parent: BaseNode["parent"]) {
		this.name = name;
		this.range = range;
		this.parent = parent;
	}
}
