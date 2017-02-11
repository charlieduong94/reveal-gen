# reveal-gen

A simple cli tool for generating quick [Reveal.js](https://github.com/hakimel/reveal.js) presentations using [Marko](https://github.com/marko-js/marko) and [Lasso](https://github.com/lasso-js/lasso).

### Dependencies
This project requires a node version that supports `async/await`.

### Installation

```
npm install -g reveal-gen
```

##E Usage

```
$ reveal-gen help
Usage:
    reveal-gen <action>
Actions:
   build - Compiles the template and outputs the minified js and css
   init - Initializes the template
   list-themes - Lists the available themes
   serve - Serves up the presentation in the browser
   switch-theme - Switches to another reveal.js theme
   help - Prints out this help message
```

Run `reveal-gen init` to create a template that you can edit. Follow the prompts.

```
$ reveal-gen init
Presentation Name: reveal-gen
Description: Quick and Pretty Presentations
Author: Charlie
Available Themes: beige, black, blood, league, moon, night, serif, simple, sky, solarized, white
Theme: black
Generating index.marko
Done!
```

A `config.json` file containing the paths to all dependencies and a `index.marko` file will be created for you.
````
<!DOCTYPE html>
html lang="en"
    head
        title -- {{name}}
        <!-- do not remove -->
        link rel="stylesheet" href="{{{lassoHead}}}"
    body
        marko-compiler-options preserve-whitespace
        div.reveal
            div.slides
                markdown
                    ---
                    ## reveal-gen

                    #### Quick and Pretty Presentations

                    By Charlie
                    ---
                markdown
                    ---
                    ### Code
                    ```javascript
                        console.log('Hello world');
                    ```
                    ---
        <!-- do not remove -->
        script type="text/javascript" src="{{{lassoBody}}}"
        script type="text/javascript"
            ---
                Reveal.initialize();
                hljs.initHighlightingOnLoad();
            ---
````

Make whatever changes you like to this file. Then run `reveal-gen serve` to launch your presentation.

Don't like the theme? Run `reveal-gen list-themes` to list the available themes that comes with `reveal.js`.
Run `reveal-gen switch-theme <insert-theme-here>` to change the theme. If you have a custom theme you want to use,
replace the path in the `theme` field in the `config.json` file.
