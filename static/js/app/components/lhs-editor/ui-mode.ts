export enum UiMode {
    simple = 'ui-simple',
    mirror = 'ui-mirror'
}
export function text(ui_mode: UiMode) {
    switch (ui_mode) {
        case UiMode.mirror:
            return 'Advanced Mode'
        case UiMode.simple:
            return 'Simple Mode'
    }
}
export default UiMode;
