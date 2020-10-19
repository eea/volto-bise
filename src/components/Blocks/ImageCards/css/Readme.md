We've recently done a bit of exploratory work to see what it would take to have less files in Volto addons. I'll write some ideas here.

First, thinking of the future of Volto addons. Ideally, at one point, there will be addons packaged as proper npm packages, maybe even transpiled, (for a better controlled deployment process for them, tracking dependencies, version numbers, etc). So, the question is: should a Volto addon ship with a CSS or a LESS file? Keep in mind that Volto itself uses less files from another library (semantic-ui-less), so shipping Volto addons with less instead of compiled CSS is actually quite "native" to Volto.

Next thing: how to integrate those less files? Load them from the frontend (Volto) theme, or allow addons to include their files?

The way we've done it is to have a file, inside the Volto addon, called ``globals.less``. The content of this file is something like:

```less
/* Expose default fallback variables */
@pageFont: 'Arial';

/* Needed by semantic.less */
@type: 'extra';
@element: 'custom';

@import (multiple, reference, optional) '~@package/../theme/theme.config';

/* Enables customization of addons */
.loadAddonOverrides() {
  @import (optional) "@{siteFolder}/@{addon}/@{addontype}s/@{addonelement}.overrides";
}

/* Helper to load variables */
.loadAddonVariables() {
  @import (optional) "@{addonelement}.variables";
  @import (optional) "@{siteFolder}/@{addon}/@{addontype}s/@{addonelement}.variables";
}
```

I'm proposing that, in case the package authors want to compile the less files to css, they declare the fallbacks for Volto/SemanticUI variables that they use. This way, the package can packaged even without the presence of theme.config.

Notice the two mixins. An addon less file would look like:

```less
@import "globals.less";

@addon: 'volto-addons';
@addontype: 'imagecard';
@addonelement: 'carousel';

.loadAddonVariables();

.title { font-size: @fonSize }

.loadAddonOverrides();
```

``loadAddonVariables`` and ``loadAddonOverrides`` could be moved in one of Pastanaga's overrides, maybe ``site.overrides``, or an explicit file that is loaded from overrides (I'm concerned that theme authors will invent new themes and forget to also declare those two mixins).

I have a few suggestions: in ``volto-starter-kit``, inside the ``theme`` folder, ship with a copy of [semantic-ui-less/_site](https://github.com/Semantic-Org/Semantic-UI/tree/master/src/_site), in a folder called ``site``. So, in a Volto project, the structure could be:
```
`- theme
    `- site
         `- collections
         `- elements
         `- ...
    `- addons
         `- volto-addons
              `- imagecards
                    `- carousel.variables
                    `- carousel.overrides
```

The "site" folder keeps the theme (and it's more aligned to semantic-ui terminology, because it is not an individual theme, rather it's overrides to the theme specified in theme.config), while the "addons" folder has overrides for addons used by that project.

