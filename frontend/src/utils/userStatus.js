export function userStatus(status) {
    let element
    switch (status) {
        case true:
            element = 'Habilitado';
            break
        case false:
            element = 'Deshabilitado';
            break
        default:
            return;
    }

    return element;
}