# Game Of Life

### Pure Javascript implementation of Conway's Game of Life. 

It supports customization through a json object during initialization and functions to manually Start, Stop and Iterate to the next generation.
The repo contains a full-featured example (index.html) and a simple implementation with no options passed (index-simplest.html).

The default styles allow to use light mode or dark mode (body with background #FFF or #000) with no further changes required in the CSS. 

Available customizations:
  - Number of rows (json property: "rows")
  - Number of columns (json property: "columns")
  - Time interval between generation (json property: "interval")
  - Number of rows (json property: "onGenerationEndCallback")
  - Initial alive cells (json property: "initialAlive")  



##
Running game:
https://xsebas21.github.io/GameOfLife/

Game description and rules:
https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
