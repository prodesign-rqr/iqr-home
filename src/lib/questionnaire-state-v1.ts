export type QuestionnaireMeta = {
  lastSavedAt: string;
};
 
export type PropertyBasicsState = {
  parcelApn: string;
  streetAddress: string;
  propertyType: string;
  occupancyType: string;
};
 
export type PeopleRolesState = {
  clientOwner: string;
  propertyManager: string;
  tisOwner: string;
  servicePreference: string;
};
 
export type AvitState = {
  mainRackPresent: boolean;
  managedGateway: boolean;
  poeSwitching: boolean;
  wifiAccessPoints: boolean;
  controlProcessor: boolean;
  upsConditionedPower: boolean;
  rackLocation: string;
  networkNotes: string;
};
 
export type MajorSystemsState = {
  hvac: boolean;
  waterHeater: boolean;
  electrical: boolean;
  plumbing: boolean;
  roof: boolean;
  refrigerationIceMaker: boolean;
};
 
export type WaterRiskState = {
  dishwasherProtected: boolean;
  toiletsProtected: boolean;
  clothesWasherProtected: boolean;
  refrigeratorProtected: boolean;
  waterHeaterPanProtected: boolean;
  sinkCabinetProtected: boolean;
  localShutoffInScope: boolean;
};
 
export type QuestionnaireStateV1 = {
  _meta: QuestionnaireMeta;
  propertyBasics: PropertyBasicsState;
  peopleRoles: PeopleRolesState;
  avit: AvitState;
  majorSystems: MajorSystemsState;
  waterRisk: WaterRiskState;
};
 
const STORAGE_KEY = "iqr-questionnaire-state-v1";
 
export const defaultQuestionnaireStateV1: QuestionnaireStateV1 = {
  _meta: {
    lastSavedAt: "",
  },
  propertyBasics: {
    parcelApn: "",
    streetAddress: "",
    propertyType: "",
    occupancyType: "",
  },
  peopleRoles: {
    clientOwner: "",
    propertyManager: "",
    tisOwner: "",
    servicePreference: "",
  },
  avit: {
    mainRackPresent: false,
    managedGateway: false,
    poeSwitching: false,
    wifiAccessPoints: false,
    controlProcessor: false,
    upsConditionedPower: false,
    rackLocation: "",
    networkNotes: "",
  },
  majorSystems: {
    hvac: false,
    waterHeater: false,
    electrical: false,
    plumbing: false,
    roof: false,
    refrigerationIceMaker: false,
  },
  waterRisk: {
    dishwasherProtected: false,
    toiletsProtected: false,
    clothesWasherProtected: false,
    refrigeratorProtected: false,
    waterHeaterPanProtected: false,
    sinkCabinetProtected: false,
    localShutoffInScope: false,
  },
};
 
function mergeState(
  base: QuestionnaireStateV1,
  incoming: Partial<QuestionnaireStateV1> | null | undefined
): QuestionnaireStateV1 {
  const next = incoming ?? {};
 
  return {
    _meta: {
      ...base._meta,
      ...(next._meta ?? {}),
    },
    propertyBasics: {
      ...base.propertyBasics,
      ...(next.propertyBasics ?? {}),
    },
    peopleRoles: {
      ...base.peopleRoles,
      ...(next.peopleRoles ?? {}),
    },
    avit: {
      ...base.avit,
      ...(next.avit ?? {}),
    },
    majorSystems: {
      ...base.majorSystems,
      ...(next.majorSystems ?? {}),
    },
    waterRisk: {
      ...base.waterRisk,
      ...(next.waterRisk ?? {}),
    },
  };
}
 
export function loadQuestionnaireStateV1(): QuestionnaireStateV1 {
  if (typeof window === "undefined") {
    return defaultQuestionnaireStateV1;
  }
 
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
 
    if (!raw) {
      return defaultQuestionnaireStateV1;
    }
 
    return mergeState(
      defaultQuestionnaireStateV1,
      JSON.parse(raw) as Partial<QuestionnaireStateV1>
    );
  } catch {
    return defaultQuestionnaireStateV1;
  }
}
 
export function saveQuestionnaireStateV1(
  state: QuestionnaireStateV1
): QuestionnaireStateV1 {
  const savedState: QuestionnaireStateV1 = {
    ...state,
    _meta: {
      ...state._meta,
      lastSavedAt: new Date().toISOString(),
    },
  };
 
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
  }
 
  return savedState;
}
 
export function clearQuestionnaireStateV1(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
 
export function hasSavedQuestionnaireDraft(
  state: QuestionnaireStateV1
): boolean {
  return Boolean(state._meta.lastSavedAt);
}
