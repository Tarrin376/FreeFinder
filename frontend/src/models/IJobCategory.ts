import { IWorkType } from "./IWorkType"

export interface IJobCategory {
    name: string,
    workTypes: IWorkType[]
}