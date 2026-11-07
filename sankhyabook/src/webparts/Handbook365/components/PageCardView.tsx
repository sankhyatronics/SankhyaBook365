import { Handbook365, ILanguageContent, LinkTargetTypes } from "@sankhyatronics/airavat";
import { TokenProvider, ISiteInfo } from "@sankhyatronics/apiclient";
import React from "react";
import { HandbookViewHelpers } from "../../../utils/HandbookViewHelpers";
import { styles } from "./PageCardView.styles";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { Spinner, SpinnerSize, MessageBar, MessageBarType } from "@fluentui/react";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IPageCardViewProps {
    strings: ILanguageContent;
    tokenProvider: TokenProvider;
    spHttpClient: SPHttpClient;
    LeftMenuSize: number;
    pageSize: number;
    linkTarget: LinkTargetTypes;
    showTopMenu: boolean;
    sites: IPropertyFieldSite[];
    parentField: string;
}

interface IPageCardViewState {
    sources: Array<ISiteInfo>;
    loading: boolean;
    error: string | undefined;
}

class PageCardView extends React.Component<IPageCardViewProps, IPageCardViewState> {
    constructor(props: IPageCardViewProps) {
        super(props);
        this.state = {
            sources: [],
            loading: true,
            error: undefined
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.loadViewsAsync();
    }

    public async componentDidUpdate(prevProps: IPageCardViewProps): Promise<void> {
        // Reload if sites prop changes
        if (prevProps.sites !== this.props.sites || prevProps.parentField !== this.props.parentField) {
            await this.loadViewsAsync();
        }
    }

    private async loadViewsAsync(): Promise<void> {
        try {
            this.setState({ loading: true, error: undefined });

            const viewData: ISiteInfo[] = await HandbookViewHelpers.loadSiteInfo({
                spHttpClient: this.props.spHttpClient,
                sites: this.props.sites,
                defaultParentField: this.props.parentField || 'ParentPageId'
            });

            this.setState({
                sources: viewData || [],
                loading: false
            });
        } catch (error) {
            console.error("Failed to load site info:", error);
            this.setState({
                sources: [],
                loading: false,
                error: error instanceof Error ? error.message : "Failed to load data"
            });
        }
    }

    private handleReload = async (): Promise<void> => {
        await this.loadViewsAsync();
    }

    public render(): React.ReactElement<IPageCardViewProps> {
        const { loading, error, sources } = this.state;
        const { strings, tokenProvider, LeftMenuSize, pageSize, linkTarget, showTopMenu } = this.props;

        // Show loading state
        if (loading) {
            return (
                <div style={styles.loadingContainer}>
                    <Spinner
                        size={SpinnerSize.large}
                        label="Loading handbook data..."
                    />
                </div>
            );
        }

        // Show error state
        if (error) {
            return (
                <div style={styles.errorContainer}>
                    <MessageBar
                        messageBarType={MessageBarType.error}
                        isMultiline={false}
                        onDismiss={() => this.setState({ error: undefined })}
                        dismissButtonAriaLabel="Close"
                    >
                        {error}
                    </MessageBar>
                    <div style={styles.retryButtonContainer}>
                        <button
                            onClick={this.handleReload}
                            style={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        // Show empty state
        if (!sources || sources.length === 0) {
            return (
                <div style={styles.emptyContainer}>
                    <div style={styles.emptyTitle}>
                        No sites configured
                    </div>
                    <div style={styles.emptySubtitle}>
                        Please configure at least one site in the web part properties
                    </div>
                </div>
            );
        }

        // Render the actual handbook
        return (
            <Handbook365
                strings={strings}
                tokenProvider={tokenProvider}
                LeftMenuSize={LeftMenuSize}
                pageSize={pageSize}
                sources={sources}
                linkTarget={linkTarget}
                showTopMenu={showTopMenu}
            />
        );
    }
}


export default PageCardView;