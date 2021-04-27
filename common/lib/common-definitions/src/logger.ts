/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// Examples of known categories, however category can be any string for extensibility
export type TelemetryEventCategory = "generic" | "error" | "performance";

// Logging entire objects is considered extremely dangerous from a telemetry point of view because people
// can easily add fields to objects that shouldn't be logged and not realize it's going to be logged.
// General best practice is to explicitly log the fields you care about from objects
export type TelemetryEventPropertyType = string | number | boolean | undefined;

export interface ITelemetryProperties {
    [index: string]: TelemetryEventPropertyType;
}

/**
 * Base interface for logging telemetry statements.
 * Can contain any number of properties that get serialized as json payload.
 * @param category - category of the event, like "error", "performance", "generic", etc.
 * @param eventName - name of the event.
 */
export interface ITelemetryBaseEvent extends ITelemetryProperties {
    category: string;
    eventName: string;
}

/**
 * Interface to output telemetry events.
 * Implemented by hosting app / loader
 */
export interface ITelemetryBaseLogger {
    send(event: ITelemetryBaseEvent): void;
}

/**
 * Informational (non-error) telemetry event
 * Maps to category = "generic"
 */
export interface ITelemetryGenericEvent extends ITelemetryProperties {
    eventName: string;
    category?: TelemetryEventCategory;
}

/**
 * Error telemetry event.
 * Maps to category = "error"
 */
 export interface ITelemetryErrorEvent extends ITelemetryProperties {
    eventName: string;
}

/**
 * Performance telemetry event.
 * Maps to category = "performance"
 */
export interface ITelemetryPerformanceEvent extends ITelemetryGenericEvent {
    duration?: number; // Duration of event (optional)
}

/**
 * Broad classifications to be applied to individual properties as they're prepared to be logged to telemetry.
 * Please do not modify existing entries for backwards compatibility.
 */
 export enum TelemetryDataTag {
    /** Data containing terms from code packages that may have been dynamically loaded */
    PackageData = "PackageData",
    /** Personal data of a variety of classifications that pertains to the user */
    UserData = "UserData",
}

/**
 * A property to be logged to telemetry containing both the value and the tag
 */
export interface ITaggedTelemetryPropertyType {
    value: TelemetryEventPropertyType,
    tag: TelemetryDataTag
}

/**
 * Property bag containing a mix of value literals and wrapped values along with a tag
 */
export interface ITaggableTelemetryProperties {
    [name: string]: TelemetryEventPropertyType | ITaggedTelemetryPropertyType;
}

/**
 * Type guard to identify if a particular value (loosely) appears to be a tagged telemetry property
 */
export function isTaggedTelemetryPropertyValue(x: any): x is ITaggedTelemetryPropertyType {
    return (typeof(x?.value) !== "object" && typeof(x?.tag) === "string");
}

/**
 * An error object that supports exporting its properties to be logged to telemetry
 */
export interface ILoggingError extends Error {
    /** Return all properties from this object that should be logged to telemetry */
    getTelemetryProperties(): ITaggableTelemetryProperties;
}

/**
 * ITelemetryLogger interface contains various helper telemetry methods,
 * encoding in one place schemas for various types of Fluid telemetry events.
 * Creates sub-logger that appends properties to all events
 */
export interface ITelemetryLogger extends ITelemetryBaseLogger {
    /**
     * Actual implementation that sends telemetry event
     * Implemented by derived classes
     * @param event - Telemetry event to send over
     */
    send(event: ITelemetryBaseEvent): void;

    /**
     * Send information telemetry event
     * @param event - Event to send
     * @param error - optional error object to log
     */
    sendTelemetryEvent(event: ITelemetryGenericEvent, error?: any): void;

    /**
     * Send error telemetry event
     * @param event - Event to send
     */
    sendErrorEvent(event: ITelemetryErrorEvent, error?: any): void;

    /**
     * Send performance telemetry event
     * @param event - Event to send
     */
    sendPerformanceEvent(event: ITelemetryPerformanceEvent, error?: any): void;
}
