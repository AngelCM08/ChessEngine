# TODO.md

- [X] Separar el componente Tablero: 
Que sólo tenga la parte de mostrar info, y tener en otro archivo toda la lógica de los tableros, para poder instanciar varios en un componente que será el principal.

- [ ] Implementar el tablero con los movimientos que piensa el módulo.

evaluateBoard():
- [ ] Evaluación gradual:
Es interesante variar los pesos de las funciones según la fase de juego en la que nos encontremos. Por ejemplo, queremos que nuestro rey esté alejado del centro en el medio juego. Sin embargo, como todos sabemos, es una pieza fundamental en los finales y mejor que esté en el centro. Para medir la fase de juego existente, los módulos pueden usar el nº de piezas sobre el tablero por ejemplo.

- [ ] Pareja de alfiles:
Se puede añadir un pequeño bonus por la pareja de alfiles (con la misma se cubren todas las casillas del tablero). Boolean que se ponga a true si un contador de alfiles llega a 2. Siempre suma, y dejará de sumar cuando uno de los dos bandos pierda la pareja.

- [X] Tablas de piezas y casillas:
Son una manera simple de asignar valores a piezas específicas en casillas específicas. Por ejemplo durante la apertura, los peones tendrán un pequeño bonus por ocupar casillas centrales. *El rey en la fase final no entra a evaluar su posicion a partir de la tabla.*

- [X] Seguridad del rey:
Por ejemplo se puede medir calculando la cantidad de peones que rodean al rey, o si hay una torre cerca del mismo. Sumar +0.2 si 3 peones estan maximo a dos casillas de rey. +0.2 si hay una torre a 3 casillas del rey, +0.1 por otras piezas.

- [ ] Estructura de peones:
Los peones doblados pueden dar un bonus negativo, (-0.2) o por ejemplo los peones aislados en finales, ya que son más fáciles de atacar. 

- [X] Torre en columna abierta: 
Esto suele ser positivo al igual que tener una torre en séptima.

- [X] Alfil en diagonales amplias y abiertas: 
Esto suele ser positivo.

Diseño general:
- [ ] Situar los tres bloques principales + header: 
Tablero, tablero de módulo y pestañas de información/configuración de módulo.

Diseño del tablero principal
- [ ] Highlight de los últimos movimientos: 
Aprovechar la libreria chessboard.js para añadir esta funcionalidad.