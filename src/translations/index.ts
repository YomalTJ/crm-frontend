import { translations as en } from './grantUtilization/en';
import { translations as si } from './grantUtilization/si';
import { translations as ta } from './grantUtilization/ta';

import { translations as samurdhiFormEn } from './samurdhiForm/en';
import { translations as samurdhiFormSi } from './samurdhiForm/si';
import { translations as samurdhiFormTa } from './samurdhiForm/ta';

import { translations as sidebarEn } from './sidebar/en';
import { translations as sidebarSi } from './sidebar/si';
import { translations as sidebarTa } from './sidebar/ta';

export const translations = {
    en: {
        ...en,
        ...samurdhiFormEn,
        ...sidebarEn
    },
    si: {
        ...si,
        ...samurdhiFormSi,
        ...sidebarSi
    },
    ta: {
        ...ta,
        ...samurdhiFormTa,
        ...sidebarTa
    }
};

export type TranslationKey = keyof typeof en;
export type NestedTranslationKey = keyof typeof en.grantUtilization | keyof typeof en.common;