import { translations as en } from './en';
import { translations as si } from './si';
import { translations as ta } from './ta';

export const translations = {
    en,
    si,
    ta
};

export type TranslationKey = keyof typeof en;
export type NestedTranslationKey = keyof typeof en.grantUtilization | keyof typeof en.common;