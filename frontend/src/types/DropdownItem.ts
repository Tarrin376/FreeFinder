import { NavElement } from "./NavElement";

export type DropdownItem = [string, (e?: React.MouseEvent<NavElement>) => void] | undefined;