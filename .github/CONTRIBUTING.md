# GXC-ALPHA Contributing Guide
Hi! It's our pleasure that you are interested in contributing to this project.Before submitting your contribution, please read the following guidelines.

## First Of All
Fork this project, and checkout a new branch, and write codes following the guidelines below.
Then pull request, wating for code review from team members.

## Contribute Contract Template

### 1.build a template folder
Build a folder under src -> renderer -> template.

`meta.js` is required to describe the template.

If you want to customize the template, you could add a `bg.png`, and customize style in `meta.js`. If no `bg.png`, we will give a default style for the template.

Then add your template ejs file which can receive two params: `title` and `entry`.

`title` is the title when you add project on the runtime.

`entry` is defined in meta.js.

### 2.import in import.js
Export const name must be the same with your folder name.

### 3.customize your meta.js
`description`, `entry`, `score` is required.

`entry` use to point out the entry file of your project, which would be use when compile.

`description` use to describe your project, which will be displayed on the template select modal when you choose the template.

`score` is sort indicator, bigger will rank more front.

There are some other opts you may use:

`title` will be the template name and default project name when add project by template. Default is template folder name.

`bdStyle` and `bgStyle` use to define relative style.

### 4.taste your template
After finish your template, you could `npm run dev` to taste your template, enjoy it :D