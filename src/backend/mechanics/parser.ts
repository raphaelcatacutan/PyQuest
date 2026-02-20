declare var Sk: any;

import { parser } from "@lezer/python";

export function runPython(code: string): Promise<string> {
    return new Promise((resolve) => {
        let output = "";

        Sk.configure({
            output: (text: string) => {
                output += text;
            },
            read: (x: string) => { 
                throw "file access not allowed"; 
            }
        });

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code))
            .then(() => {
                resolve(output);
            })
            .catch((e: any) => {
                output += "Error: " + e.toString();
                resolve(output);
            });
    });
}

export function validatePythonCode(code: string): boolean {
    const tree = parser.parse(code);

    let allowed = true;

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            allowed = false;
            return false; 
        }
    });

    return allowed;
}
