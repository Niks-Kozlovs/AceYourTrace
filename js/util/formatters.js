function preventNonNumericInput(event) {
    const key = event.keyCode;
    if (key < 48 || key > 57) {
        event.preventDefault();
    }
}

function clampNumber(object) {
    const intValue = parseInt(object.value);

    const minValue = parseInt(object.min);
    if (minValue && intValue < minValue) {
        object.value = object.min;
    }

    const maxValue = parseInt(object.max);
    if (maxValue && intValue > maxValue) {
        object.value = object.max;
    }
}