export default function InterpretRole(nums) {
    let element
    switch (nums) {
        case 1:
            element = 'ESTUDIANTE';
            break
        case 2:
            element = 'PROFESOR';
            break
        case 3:
            element = 'ADMIN';
            break
        default:
            return;
    }

    return element;
}