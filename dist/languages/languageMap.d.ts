/**
 * @packageDocumentation Define type and table of translated definition
 * Author scanet\@libreducc (Sébastien Canet)
 */
export interface LanguageMap {
    [key: string]: LanguageItem;
}
export declare const languagesMap: LanguageMap;
type LanguageMapBlockly = {
    [key: string]: {
        [key: string]: string;
    };
};
export declare const languagesMapBlockly: LanguageMapBlockly;
export interface LanguageItem {
    HOME: string;
    ABOUT: string;
    CONTACT: string;
    CAT_LOGIC: string;
    CAT_LOOPS: string;
    CAT_MATHS: string;
    CAT_TEXT: string;
    CAT_LISTS: string;
    CAT_COLOR: string;
    CAT_VARIABLES: string;
    CAT_FUNCTIONS: string;
}
export {};
//# sourceMappingURL=languageMap.d.ts.map