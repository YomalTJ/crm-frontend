import { translations as en } from './grantUtilization/en';
import { translations as si } from './grantUtilization/si';
import { translations as ta } from './grantUtilization/ta';
import { translations as samurdhiFormEn } from './samurdhiForm/en';
import { translations as samurdhiFormSi } from './samurdhiForm/si';
import { translations as samurdhiFormTa } from './samurdhiForm/ta';

export const translations = {
    en: {
        ...en,
        ...samurdhiFormEn
    },
    si: {
        ...si,
        ...samurdhiFormSi
    },
    ta: {
        ...ta,
        ...samurdhiFormTa
    }
};

export type TranslationKey = keyof typeof en;
export type NestedTranslationKey = keyof typeof en.grantUtilization | keyof typeof en.common;