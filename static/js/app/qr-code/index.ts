export function QRCode(
    value: string, options = { type: 'svg' }
) {
    return new Promise<string>((resolve) => {
        window.QRCode.toString(value, options, (
            error: any, text: string
        ) => {
            resolve(text.replace(
                /^<svg/, '<svg style="margin:auto"'
            ));
        })
    });
};
export default QRCode;
