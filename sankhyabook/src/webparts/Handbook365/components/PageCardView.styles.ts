export const styles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    } as React.CSSProperties,
    errorContainer: {
        padding: 20
    } as React.CSSProperties,
    retryButtonContainer: {
        marginTop: 20,
        textAlign: 'center'
    } as React.CSSProperties,
    retryButton: {
        padding: '10px 20px',
        backgroundColor: '#0078d4',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer'
    } as React.CSSProperties,
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40vh',
        padding: 20
    } as React.CSSProperties,
    emptyTitle: {
        fontSize: 18,
        marginBottom: 10
    } as React.CSSProperties,
    emptySubtitle: {
        color: '#666',
        marginBottom: 20
    } as React.CSSProperties
};
