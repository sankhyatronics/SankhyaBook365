import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneDropdown, PropertyPaneToggle, type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'HandbookWebPartStrings';
import { ILanguageContent, LinkTargetTypes } from '@sankhyatronics/airavat';
import { makeGraphTokenProvider } from '../../utils/spfxTokenProvider';
import { TokenProvider } from '@sankhyatronics/apiclient';
import { PropertyFieldSitePicker } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import PageCardView, { IPageCardViewProps } from './components/PageCardView';

export interface IHandbook365WebPartProps {
  parentField: string;
  parentId: number;
  linkTarget: LinkTargetTypes;
  pageSize: number;
  LeftMenuSize: number;
  showTopMenu: boolean;
  sites: IPropertyFieldSite[];
}

export default class Handbook365WebPart extends BaseClientSideWebPart<IHandbook365WebPartProps> {
  private _tokenProvider: TokenProvider;
  constructor() {
    super();
    this._tokenProvider = {} as TokenProvider;
  }

  protected async onInit(): Promise<void> {
    this._tokenProvider = makeGraphTokenProvider(this.context);
    await super.onInit();
  }

  /**
   * Renders the main React component or a loading/error state.
   */
  public async render(): Promise<void> {
    const element: React.ReactElement<IPageCardViewProps> = React.createElement(
      PageCardView,
      {
        strings: strings as unknown as ILanguageContent,
        tokenProvider: this._tokenProvider,
        spHttpClient: this.context.spHttpClient,
        LeftMenuSize: this.properties.LeftMenuSize || 250,
        pageSize: this.properties.pageSize || 20,
        linkTarget: this.properties.linkTarget || "_self",
        showTopMenu: this.properties.showTopMenu !== false,
        sites: this.properties.sites,
        parentField: 'ParentPageId'
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.Group_Source,
              groupFields: [
                PropertyFieldSitePicker('sites', {
                  label: 'Select sites',
                  initialSites: this.properties.sites,
                  context: this.context,
                  deferredValidationTime: 500,
                  multiSelect: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: 'sitesFieldId'
                }),
              ]
            },
            {
              groupName: strings.Group_Display,
              groupFields: [
                PropertyPaneToggle('showTopMenu', {
                  label: strings.ShowTopMenu
                }),
                PropertyPaneDropdown('linkTarget', {
                  label: strings.Link_Target,
                  options: [
                    {
                      key: "_self",
                      text: strings.OpenInSameTab
                    },
                    {
                      key: "_blank",
                      text: strings.OpenInNewTab
                    }]
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}