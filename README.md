# Unfancy file icons [![Published version on Marketplace][badge]][marketplace] [![Test status][gaBadge]][ga]

A file icon theme for Visual Studio code.
Based on [atom-unfancy-file-icons][atom-extension] package.

## Rules

- Use a simple color code (with a few exceptions when it make more sense,
  like for ruby files) which works as follow:
  - green for source files
  - yellow for template and stylesheet files
  - violet for data files (`json`, `yml`, `csv`, etc)
  - orange for executable files (`sh`, `bat`, `cmd`, etc)
  - cyan for documentation files (`md`, `tex`, `pdf`, etc)
  - blue for media files (images, videos, art software files, etc)
  - magenta for configuration files (`.gitignore`, `.ruby-version`, etc)
  - gray for other files and directories
- Use generic icons rather than trying to find one for each file extension
  (except when an icon in Octicons fit the file, like with ruby files)

## Build theme

```sh
# Install dependencies
> npm install

# Build theme
> npm run build

# Create package using `vsce` tool
> npm run dist
```

## Screenshot

![Screenshot][screenshot]

[atom-extension]: https://github.com/abe33/atom-unfancy-file-icons
[screenshot]: https://raw.githubusercontent.com/alexesprit/vscode-unfancy-file-icons/master/media/screenshot.png
[badge]: https://img.shields.io/visual-studio-marketplace/v/alexesprit.vscode-unfancy-file-icons
[marketplace]: https://marketplace.visualstudio.com/items?itemName=alexesprit.vscode-unfancy-file-icons
[ga]: https://github.com/alexesprit/vscode-unfancy-file-icons/actions/
[gaBadge]: https://img.shields.io/github/workflow/status/alexesprit/vscode-unfancy-file-icons/Test?label=test
