import { translations as en } from './grantUtilization/en';
import { translations as si } from './grantUtilization/si';
import { translations as ta } from './grantUtilization/ta';

import { translations as samurdhiFormEn } from './samurdhiForm/en';
import { translations as samurdhiFormSi } from './samurdhiForm/si';
import { translations as samurdhiFormTa } from './samurdhiForm/ta';

import { translations as sidebarEn } from './sidebar/en';
import { translations as sidebarSi } from './sidebar/si';
import { translations as sidebarTa } from './sidebar/ta';

import { translations as businessEmpowerEn } from './businessEmpowerment/en';
import { translations as businessEmpowerSi } from './businessEmpowerment/si';
import { translations as businessEmpowerTa } from './businessEmpowerment/ta';

export const translations = {
    en: {
        ...en,
        ...samurdhiFormEn,
        ...sidebarEn,
        ...businessEmpowerEn
    },
    si: {
        ...si,
        ...samurdhiFormSi,
        ...sidebarSi,
        ...businessEmpowerSi
    },
    ta: {
        ...ta,
        ...samurdhiFormTa,
        ...sidebarTa,
        ...businessEmpowerTa
    }
};

export type TranslationKey =
    | keyof typeof en
    | keyof typeof en.grantUtilization
    | keyof typeof en.common
    | keyof typeof businessEmpowerEn.businessEmpower;

export type NestedTranslationKey =
    | keyof typeof en.grantUtilization
    | keyof typeof en.common
    | keyof typeof businessEmpowerEn.businessEmpower;