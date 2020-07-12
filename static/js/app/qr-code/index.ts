declare const require: Function;

export function QRCode(
    value: string, options = { type: 'svg' }
) {
    return new Promise<string>((resolve) => {
        require(['@npm/qrcode'], (QRCode: any) => {
            QRCode.toString(value, options, (
                error: any, text: string
            ) => {
                resolve(text);
            })
        });
    })
};
export default QRCode;
