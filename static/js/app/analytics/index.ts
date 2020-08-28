export class Analytics {
    public static get me(): Analytics {
        if (window.ANALYTICS === undefined) {
            window.ANALYTICS = new Analytics();
        }
        return window.ANALYTICS;
    }
    public event(
        category: string, action: string, label?: string, value?: number
    ) {
        if (window.ga !== undefined) window.ga(
            'send', 'event', category, action, label, value
        );
    }
};
export default Analytics;
