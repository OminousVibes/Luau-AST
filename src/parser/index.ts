import { Grammar, Parser } from "nearley";
import grammar from "parser/grammar/language";

// Create a Parser object from our grammar.
const parser = new Parser(Grammar.fromCompiled(grammar));

// Parse something!
parser.feed("local abc;");

// parser.results is an array of possible parsings.
console.log(JSON.stringify(parser.results)); // [[[[["foo"],"\n"]]]]
