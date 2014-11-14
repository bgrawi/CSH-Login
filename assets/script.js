
/**
 * ThemeSwitcher
 * @author Ben Grawi <bgrawi@csh.rit.edu>
 * @description A simple way to switch and store themes for the CSH-Login project
 */
(function (window) {
    'use strict';
    
    /*
     * Creates a new ThemeSwitcher object and sets up defaults
     */
    function ThemeSwitcher(availableThemes, baseURL) {
        
        // Only localStorage implimented
        if (!('localStorage' in window)) {
            return false;
        }
        
        // Make sure the correct arguments were passed
        if (!Array.isArray(availableThemes) || typeof baseURL !== 'string') {
            return false;
        }
        
        this.availableThemes = availableThemes;
        this.baseURL = baseURL;
        
        // Get the theme and set it to the default if not already set
        this.themeName = window.localStorage.getItem('ThemeSwitcher') || availableThemes[0];
        
        if(!this.isValidTheme(this.themeName)) {
            return false;
        }
        
        // Find all stylesheet links
        var linkElms = window.document.getElementsByTagName("link"), link, linkIndex;
        
        // Loop through the links looking for the theme styleSheet
        for (linkIndex = 0; linkIndex < linkElms.length; linkIndex += 1) {
            link = linkElms[linkIndex];
            if (link.getAttribute("rel").indexOf("style") !== -1 && link.getAttribute("title") === 'theme') {
                this.linkElm = link;
                break;
            }
        }
        
        // We must already have a theme present
        if (this.styleSheet === null) {
            return false;
        }
        
        this.updateTheme(this.themeName);
        
    }
    
    /**
     * Holds the list of valid available themes
     */
    ThemeSwitcher.prototype.availableThemes = null;
    
    /**
     * The base url for all of the theme stylesheets
     */
    ThemeSwitcher.prototype.baseURL = null;
    
    /**
     * The name of the currently selected theme
     */
    ThemeSwitcher.prototype.themeName = null;
    
    /**
     * The DOM object of the stylesheet we are using to update the theme
     */
    ThemeSwitcher.prototype.linkElm = null;
    
    /**
     * Updates the theme if it is valid
     */
    ThemeSwitcher.prototype.updateTheme = function (themeName) {
        if(this.isValidTheme(themeName)) {
            
            window.localStorage.setItem('ThemeSwitcher', themeName);
            this.linkElm.setAttribute('href', 
                                      this.baseURL + themeName + '.css');
        }
    };
    
    /**
     * Checks if a theme name is in the availableThemes array
     */
    ThemeSwitcher.prototype.isValidTheme = function (themeName) {
        for(var themeIndex = 0; themeIndex < this.availableThemes.length; themeIndex++) {
            if(themeName === this.availableThemes[themeIndex]) {
                return true;
            }
        }
        
        return false;
    };
        
    
    ThemeSwitcher.prototype.flushTheme = function () {
        window.localStorage.setItem('ThemeSwitcher', this.theme);
    };
    
    window.ThemeSwitcher = ThemeSwitcher;
}(window));


// Separate the ThemeSwitcher's scope from the application's scope
(function (window) {
    'use strict';
    
    // Add the name of your theme here
    var themes = ['light', 'dark', 'originalphoto', 'console'];
    
    // Like $(document).ready(...);
    window.document.addEventListener('DOMContentLoaded', function () {
        
        // Get all TS Selects
        var TSselects = window.document.querySelectorAll("[data-theme]"),
            TS = new window.ThemeSwitcher(themes, "assets/themes/");
        
        /**
         * Updates the button active states based on the theme name
         */
        function updateButtonActiveStates(themeName) {

            // Set the active class on to the current active theme now
            for(var index = 0; index < TSselects.length; index++) {
                if(themeName === TSselects[index].getAttribute('data-theme')) {
                    TSselects[index].className += ' active';
                } else {
                    TSselects[index].className = TSselects[index].className
                    .replace( /(?:^|\s)active(?!\S)/g , '' );
                }
            }
        }
        
        /**
         * The function that will bind to the buttons on theme change
         */
        function updateThemeButtonEvent() {
            var themeName = this.getAttribute('data-theme')
            if(themeName !== '') {
                TS.updateTheme(themeName);
                updateButtonActiveStates(themeName);
                
                // Focus the username field again
                document.getElementById('login_username').focus();
            }
        }
        
        // Add the event listeners for to switch the theme
        if(TSselects.length > 0) {
            for(var index = 0; index < TSselects.length; index++) {
                TSselects[index].addEventListener('click', updateThemeButtonEvent);
            }
        }
        
        setTimeout(function() {
            window.document.body.className = 
                window.document.body.className
            .replace( /(?:^|\s)ThemeSwitcher\-loading(?!\S)/g , '' );
        }, 250);
        
        // Make sure the active theme button has an active state
        updateButtonActiveStates(TS.themeName);
    });
}(window));