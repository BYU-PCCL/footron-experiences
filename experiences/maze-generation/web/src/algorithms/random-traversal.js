import Maze from "./maze.js"

export default class RandomTraversalMaze extends Maze {
  constructor(...args) {
    super(...args)

    this.id = "traversal"
    this.visitedCells = [0]

    this.parents = {} // the parent of each cell
    this.possibleNextCells = []

    this.updateFrontier(0)
  }

  getNextCell() {
    // get a random path from the frontier

    let nextCell =
      this.possibleNextCells[
        Math.floor(Math.random() * this.possibleNextCells.length)
      ]
    let nextCellParent =
      this.parents[nextCell][
        Math.floor(Math.random() * this.parents[nextCell].length)
      ]

    return [nextCellParent, nextCell]
  }

  updateFrontier(cellJustVisited) {
    /* Remove invalid paths from the frontier */

    let i
    while ((i = this.possibleNextCells.indexOf(cellJustVisited)) !== -1) {
      this.possibleNextCells.splice(i, 1)
    }

    delete this.parents[cellJustVisited] // may not be necessary depending on how GC handles this

    /* Add neighbors to the frontier */
    let neighbors = this.getAdjacentSquares(cellJustVisited)

    for (var j = 0; j < neighbors.length; j++) {
      let neighbor = neighbors[j]

      this.possibleNextCells.push(neighbor)

      if (!this.parents[neighbor]) {
        this.parents[neighbor] = []
      }

      this.parents[neighbor].push(cellJustVisited)
    }
  }

  async nextStep() {
    await this.delay()
    let [nextCellParent, nextCell] = this.getNextCell()

    // add the cell to the tree
    this.addPath(nextCellParent, nextCell)

    // add the cell to the visited cells array
    this.visitedCells.push(nextCell)

    // update the frontier
    this.updateFrontier(nextCell)
  }
}
