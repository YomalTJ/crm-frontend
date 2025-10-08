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

import { translations as dashboardEn } from './dashboard/en';
import { translations as dashboardSi } from './dashboard/si';
import { translations as dashboardTa } from './dashboard/ta';

export const translations = {
    en: {
        ...en,
        ...samurdhiFormEn,
        ...sidebarEn,
        ...businessEmpowerEn,
        ...dashboardEn
    },
    si: {
        ...si,
        ...samurdhiFormSi,
        ...sidebarSi,
        ...businessEmpowerSi,
        ...dashboardSi
    },
    ta: {
        ...ta,
        ...samurdhiFormTa,
        ...sidebarTa,
        ...businessEmpowerTa,
        ...dashboardTa
    }
};

export type TranslationKey =
    | keyof typeof en
    | keyof typeof en.grantUtilization
    | keyof typeof en.common
    | keyof typeof businessEmpowerEn.businessEmpower
    | keyof typeof dashboardEn.dashboard;

export type NestedTranslationKey =
    | keyof typeof en.grantUtilization
    | keyof typeof en.common
    | keyof typeof businessEmpowerEn.businessEmpower
    | keyof typeof dashboardEn.dashboard;