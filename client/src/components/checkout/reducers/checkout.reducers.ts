import type { BuyerState, AltState } from "../types/checkout.client";

export function buyerReducer(
  state: BuyerState,
  action: { key: keyof BuyerState; value: BuyerState[keyof BuyerState] }
): BuyerState {
  return { ...state, [action.key]: action.value } as BuyerState;
}

export function altReducer(
  state: AltState,
  action: { key: keyof AltState; value: AltState[keyof AltState] }
): AltState {
  return { ...state, [action.key]: action.value } as AltState;
}
