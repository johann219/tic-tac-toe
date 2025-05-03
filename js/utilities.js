const Utilities = (() => {
    const disableElement = (element) => element.setAttribute('disabled', '');
    const enableElement = (element) => element.removeAttribute('disabled');

    const showElement = (element) => element.classList.remove('hidden');
    const hideElement = (element) => element.classList.add('hidden');

    const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    
    return { disableElement, enableElement, showElement, hideElement, randomIntFromInterval };
})();

export { Utilities };