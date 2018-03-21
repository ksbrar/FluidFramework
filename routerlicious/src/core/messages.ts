import * as api from "../api-core";
import { IAuthenticatedUser } from "../core-utils";

// String identifying the raw operation message
export const RawOperationType: string = "RawOperation";

// String identifying the sequenced operation message
export const SequencedOperationType: string = "SequencedOperation";

export const SystemType: string = "System";

/**
 * Base class for messages placed on the distributed log
 */
export interface IMessage {
    // The type of the message
    type: string;
}

export enum SystemOperations {
    // Service joining the cluster
    Join,

    // Service leaving the cluster
    Leave,
}

export interface ISystemMessage extends IMessage {
    // Id of the service sending the message
    id: string;

    // Group that the service belongs to
    group: string;

    // System operation being performed
    operation: any;
}

/**
 * Message relating to an object
 */
export interface IObjectMessage extends IMessage {
    // The user who submitted the message
    user: IAuthenticatedUser;

    // The object the message is intended for
    documentId: string;

    // The client who submitted the message
    clientId: string;

    // The time the server received the message, in milliseconds elapsed since
    // 1 January 1970 00:00:00 UTC, with leap seconds ignored.
    timestamp: number;
}

/**
 * Message sent when a client is updating their sequence number directly
 */
export interface IUpdateReferenceSequenceNumberMessage extends IObjectMessage {
    // The sequence number that is being updated
    sequenceNumber: number;
}

/**
 * Raw message inserted into the event hub queue
 */
export interface IRawOperationMessage extends IObjectMessage {
    // The message that was submitted
    operation: api.IDocumentMessage;
}

export interface ITicketedMessage extends IMessage {
    // The object the message is intended for
    documentId: string;
}

/**
 * A sequenced operation
 */
export interface ISequencedOperationMessage extends ITicketedMessage {
    // The sequenced operation
    operation: api.ISequencedDocumentMessage;
}

export interface IForkOperation {
    // The minimum sequence number for the fork
    minSequenceNumber: number;

    // The name of the target branch
    name: string;

    // The ID of messages after which we want to integrate
    sequenceNumber: number;
}
