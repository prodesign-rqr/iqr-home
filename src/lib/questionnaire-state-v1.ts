export type QuestionnaireStateV1 = {
  _meta: {
    lastSavedAt: string | null;
  };
  propertyBasics: {
    parcelApn: string;
    streetAddress: string;
    propertyType: string;
    occupancyType: string;
  };
  peopleRoles: {
    clientOwner: string;
    propertyManager: string;
    tisOwner: string;
    servicePreference: string;
  };
  avit: {
    mainRackPresent: boolean;
    managedGateway: boolean;
    poeSwitching: boolean;
    wifiAccessPoints: boolean;
    controlProcessor: boolean;
    upsConditionedPower: boolean;
    rackLocation: string;
    networkNotes: string;
  };
  majorSystems: {
    hvac: boolean;
    waterHeater: boolean;
    electrical: boolean;
    plumbing: boolean;
    roof: boolean;
    refrigerationIceMaker: boolean;
  };
  waterRisk: {
    dishwasherProtected: boolean;
    toiletsProtected: boolean;
    clothesWasherProtected: boolean;
    refrigeratorProtected: boolean;
    waterHeaterProtected: boolean;
    sinkCabinetProtected: boolean;
    localShutoffScope: boolean;
  };
  environmental: {
    rackTemperature: boolean;
    garageFreezer: boolean;
    wineRoom: boolean;
    artCollectionRoom: boolean;
    mechanicalRoom: boolean;
    pantryFoodStorage: boolean;
  };
  counterCard: {
    mode: string;
    guestNetworkName: string;
  };
  stewardship: {
    yearlyUpdate: string;
    startupPriority: string;
    onboardingNotes: string;
  };
};

export const QUESTIONNAIRE_V1_STORAGE_KEY = "iqr-questionnaire-v1";

export const defaultQuestionnaireStateV1: QuestionnaireStateV1 = {
  _meta: {
    lastSavedAt: null,
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
    waterHeaterProtected: false,
    sinkCabinetProtected: false,
    localShutoffScope: false,
  },
  environmental: {
    rackTemperature: false,
    garageFreezer: false,
    wineRoom: false,
    artCollectionRoom: false,
    mechanicalRoom: false,
    pantryFoodStorage: false,
  },
  counterCard: {
    mode: "",
    guestNetworkName: "",
  },
  stewardship: {
    yearlyUpdate: "",
    startupPriority: "",
    onboardingNotes: "",
  },
};

function cloneDefaultState(): QuestionnaireStateV1 {
  return JSON.parse(JSON.stringify(defaultQuestionnaireStateV1));
}

export function mergeQuestionnaireStateV1(
  source: Partial<QuestionnaireStateV1> | null | undefined
): QuestionnaireStateV1 {
  const base = cloneDefaultState();

  if (!source) return base;

  return {
    ...base,
    ...source,
    _meta: {
      ...base._meta,
      ...(source._meta ?? {}),
    },
    propertyBasics: {
      ...base.propertyBasics,
      ...(source.propertyBasics ?? {}),
    },
    peopleRoles: {
      ...base.peopleRoles,
      ...(source.peopleRoles ?? {}),
    },
    avit: {
      ...base.avit,
      ...(source.avit ?? {}),
    },
    majorSystems: {
      ...base.majorSystems,
      ...(source.majorSystems ?? {}),
    },
    waterRisk: {
      ...base.waterRisk,
      ...(source.waterRisk ?? {}),
    },
    environmental: {
      ...base.environmental,
      ...(source.environmental ?? {}),
    },
    counterCard: {
      ...base.counterCard,
      ...(source.counterCard ?? {}),
    },
    stewardship: {
      ...base.stewardship,
      ...(source.stewardship ?? {}),
    },
  };
}

export function loadQuestionnaireStateV1(): QuestionnaireStateV1 {
  if (typeof window === "undefined") return cloneDefaultState();

  const raw = window.localStorage.getItem(QUESTIONNAIRE_V1_STORAGE_KEY);
  if (!raw) return cloneDefaultState();

  try {
    return mergeQuestionnaireStateV1(JSON.parse(raw));
  } catch {
    return cloneDefaultState();
  }
}

export function saveQuestionnaireStateV1(state: QuestionnaireStateV1): QuestionnaireStateV1 {
  const nextState: QuestionnaireStateV1 = {
    ...state,
    _meta: {
      ...state._meta,
      lastSavedAt: new Date().toISOString(),
    },
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(QUESTIONNAIRE_V1_STORAGE_KEY, JSON.stringify(nextState));
  }

  return nextState;
}

export function clearQuestionnaireStateV1() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(QUESTIONNAIRE_V1_STORAGE_KEY);
  }
}

export function hasSavedQuestionnaireDraft(state: QuestionnaireStateV1) {
  return Boolean(state._meta.lastSavedAt);
}

