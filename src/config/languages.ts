export interface Language {
    code: string;
    name: string;
}

export const languages: Language[] = [
    { code: 'en', name: 'English'},
    { code: 'si', name: 'සිංහල'},
    { code: 'ta', name: 'தமிழ்'}
];

export const defaultLanguage = 'en';