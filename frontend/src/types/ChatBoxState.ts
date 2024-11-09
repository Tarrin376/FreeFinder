import { IMessage } from "../models/IMessage";
import { FailedUpload } from "./FailedUpload";
import { MatchedMembers } from "./MatchedMembers";

export type ChatBoxState = {
    sendingMessage: boolean,
    toggleEmojiPicker: boolean,
    toggleAttachFiles: boolean,
    toggleTagSuggestions: boolean,
    tag: string,
    newMessages: IMessage[],
    uploadedFiles: File[],
    failedUploads: FailedUpload[],
    matchedMembers: MatchedMembers
}