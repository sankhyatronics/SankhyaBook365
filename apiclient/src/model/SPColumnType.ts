import { LocaleCode } from "./locale-labels";
import type { ItemStatus } from "./Organization";

export type ColumnType =
    | 'boolean'
    | 'choice'
    | 'currency'
    | 'dateTime'
    | 'hyperlinkOrPicture'
    | 'number'
    | 'personOrGroup'
    | 'term'
    | 'text'
    | 'lookup';

export interface ColumnDefinitionBase {
    status: ItemStatus;
    id: string;
    name: string;
    displayName: string;
    description?: string;
    enforceUniqueValues?: boolean;
    hidden?: boolean;
    indexed?: boolean;
    type: ColumnType;
    isDeletable?: boolean;
    isSealed?: boolean;
    propagateChanges?: boolean;
    readOnly?: boolean;
    required?: boolean;
    columnGroup?: string;
    defaultValue?: any;
    validation?: {
        formula: string;
        message: string;
    };
}

export interface BooleanColumnDefinition extends ColumnDefinitionBase {
    type: 'boolean';
    boolean: {}
}
export interface CurrencyColumnDefinition extends ColumnDefinitionBase {
    type: 'currency';
    currency: {
        locale: LocaleCode;
    }
}
export interface TextColumnDefinition extends ColumnDefinitionBase {
    type: 'text';
    text: {
        allowMultipleLines: boolean,
        appendChangesToExistingText: boolean,
        linesForEditing: number,
        maxLength: number,
        textType: "plain" | "richText"
    };
}
export interface NumberColumnDefinition extends ColumnDefinitionBase {
    type: 'number';
    number: {
        decimalPlaces?: "automatic" | "none" | "one" | "two" | "three" | "four" | "five";
        displayAs?: "number" | "percentage",
        maximum?: number;
        minimum?: number;
    };
}
export interface ChoiceColumnDefinition extends ColumnDefinitionBase {
    type: 'choice';
    choice: {
        allowTextEntry: boolean,
        choices: string[],
        displayAs: "checkBoxes" | "dropDownMenu" | "radioButtons"
    };
}
export interface DateTimeColumnDefinition extends ColumnDefinitionBase {
    type: 'dateTime';
    dateTime: {
        displayAs: 'dateOnly' | 'dateTime';
        format: 'standard' | 'friendly';
    };
}
export interface LookupColumnDefinition extends ColumnDefinitionBase {
    type: 'lookup';
    lookup: {
        listId: string;
        columnName: string;
        primaryLookupColumnId: string;
        allowMultipleValues?: boolean;
    };
}
export interface HyperlinkOrPictureColumnDefinition extends ColumnDefinitionBase {
    type: 'hyperlinkOrPicture';
    hyperlinkOrPicture: {
        isPicture: boolean
    }
}
export interface PersonOrGroupColumnDefinition extends ColumnDefinitionBase {
    type: 'personOrGroup';
    personOrGroup: {
        allowMultipleSelection: boolean,
        displayAs: "account" | "department" | "firstName" | "id" | "lastName" | "mobilePhone" | "name" | "nameWithPictureAndDetails" | "nameWithPresence" | "office" | "pictureOnly36x36" | "pictureOnly48x48" | "pictureOnly72x72" | "sipAddress" | "title" | "userName" | "workEmail" | "workPhone",
        chooseFromType: "peopleAndGroups" | "peopleOnly"
    }
}
export interface TermColumnDefinition extends ColumnDefinitionBase {
    type: 'term';
    term: {
        allowMultipleValues: boolean,
        showFullyQualifiedName: boolean,
    }
}

export type SiteColumnDefinition =
    | BooleanColumnDefinition
    | TextColumnDefinition
    | NumberColumnDefinition
    | ChoiceColumnDefinition
    | DateTimeColumnDefinition
    | LookupColumnDefinition
    | HyperlinkOrPictureColumnDefinition
    | PersonOrGroupColumnDefinition
    | CurrencyColumnDefinition
    | TermColumnDefinition;