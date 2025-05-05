import moonSwitch from '../js/moonSwitch .js';
import sunSwitch from '../js/sunSwitch.js';

document.addEventListener('DOMContentLoaded', function () {

    const storageTheme = localStorage.getItem('theme');
    const systemColorScheme = window.matchMedia('(prefers-color-scheme:dark').matches ? 'dark' : 'light';

    const newTheme = storageTheme ?? systemColorScheme;
    document.documentElement.setAttribute('data-theme', newTheme);

    document.querySelector('.main__dark').innerHTML = moonSwitch;
    document.querySelector('.main__light').innerHTML = sunSwitch;

    const switcherTheme = document.querySelector('.main__check');
    const root = document.documentElement;


    if (root.getAttribute('data-theme') === 'dark') {
        switcherTheme.checked = true;
    }

    switcherTheme.addEventListener('click', toggleTheme);

    function toggleTheme() {
        const setTheme = switcherTheme.checked ? 'dark' : 'light';

        root.setAttribute('data-theme', setTheme);
        localStorage.setItem('theme', setTheme);
    }



    
    $('section > div div').odd().addClass('uk-card-media-left uk-cover-container');
    $('article > div div').odd().addClass('uk-flex-last@s uk-card-media-right uk-cover-container');
    
});