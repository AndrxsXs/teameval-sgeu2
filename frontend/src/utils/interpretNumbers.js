export function interpretNumbers(nums) {
    let element
    switch (nums) {
        case 1:
            element = 'student';
            break
        case 2:
            element = 'teacher';
            break
        case 3:
            element = 'admin';
            break
        default:
            return;
    }

    return element;
}