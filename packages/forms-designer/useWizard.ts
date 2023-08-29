import {RootState, useAppSelector} from "@formswizard/state";

export const useWizard: () => RootState = () => useAppSelector(state => state)
