# Unfancy file icons [![Published version on Marketplace][badge]][marketplace] [![Test status][gaBadge]][ga]

> Octicons and Codicons as file icon themes

File icon themes for Visual Studio Code. Based on [atom-unfancy-file-icons][atom-extension] package.

## Rules

- Use icons from [Octicons][octicons] and [Codicons][codicons] only
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
  (except when an icon fits the file type, like with ruby files)

## Build theme

```sh
# Install dependencies
> npm install

# Build theme
> npm run build
```

## Screenshots

<details>
  <summary>Click to view screenshots</summary>

  ![Screenshot][octicons-dark]
  *Theme: Dark (Visual Studio), Icon theme: Unfancy file icons (Octicons)*

  ![Screenshot][octicons-light]
  *Theme: Light (Visual Studio), Icon theme: Unfancy file icons (Octicons)*

  ![Screenshot][codicons-dark]
  *Theme: Dark (Visual Studio), Icon theme: Unfancy file icons (Codicons)*

  ![Screenshot][codicons-light]
  *Theme: Light (Visual Studio), Icon theme: Unfancy file icons (Codicons)*
</details>

## License

See [LICENSE][codicons-license] for Codicons. See [LICENSE][octicons-license] for Octicons.

Other files in this repository are licensed under the [MIT License](./LICENSE.md).

[octicons]: https://octicons.github.com/
[codicons]: https://microsoft.github.io/vscode-codicons/dist/codicon.html
[atom-extension]: https://github.com/abe33/atom-unfancy-file-icons
[octicons-dark]: https://raw.githubusercontent.com/alexesprit/vscode-unfancy-file-icons/master/media/screenshot-octicons-dark.png
[octicons-light]: https://raw.githubusercontent.com/alexesprit/vscode-unfancy-file-icons/master/media/screenshot-octicons-light.png
[codicons-dark]: https://raw.githubusercontent.com/alexesprit/vscode-unfancy-file-icons/master/media/screenshot-codicons-dark.png
[codicons-light]: https://raw.githubusercontent.com/alexesprit/vscode-unfancy-file-icons/master/media/screenshot-codicons-light.png
[badge]: https://img.shields.io/visual-studio-marketplace/v/alexesprit.vscode-unfancy-file-icons
[marketplace]: https://marketplace.visualstudio.com/items?itemName=alexesprit.vscode-unfancy-file-icons
[ga]: https://github.com/alexesprit/vscode-unfancy-file-icons/actions/
[gaBadge]: https://img.shields.io/github/workflow/status/alexesprit/vscode-unfancy-file-icons/Test?label=test
[codicons-license]: https://github.com/microsoft/vscode-codicons/blob/master/LICENSE
[octicons-license]: https://github.com/primer/octicons/blob/master/LICENSE
