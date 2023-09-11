/**
 * @packageDocumentation Basic toolbox for algorithm.
 * Author scanet\@libreducc (Sébastien Canet)
 */
/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/**
 * The above type represents the configuration of a toolbox in TypeScript, which includes
 * various kinds of blocks and their properties.
 * @param kind - The "kind" property in the ToolboxConfiguration type represents the
 * type or category of the toolbox item. It can be a string value that describes the kind of
 * item, such as "category", "block", or "separator".
 * @param contents - The `contents` property is an array that contains objects with the
 * following properties:
 */
export type ToolboxConfiguration = {
    kind: string;
    contents: Array<{
        kind: string;
        name?: string;
        categorystyle?: string;
        custom?: string;
        contents?: Array<{
            kind: string;
            type: string;
            fields?: {
                [key: string]: number | string;
            };
            inputs?: {
                [key: string]: {
                    shadow?: {
                        type?: string;
                        fields?: {
                            [key: string]: number | string;
                        };
                    };
                    block?: {
                        type: string;
                    };
                };
            };
        }>;
        blockxml?: string;
    }>;
};
export declare const basic_toolbox: ToolboxConfiguration;
//# sourceMappingURL=toolbox.d.ts.map