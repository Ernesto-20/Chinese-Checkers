import { useEffect, useState } from 'react'
import './App.css'

interface Item {
  playerId: string,
  color: string
}

interface Space {
  id: number
  adjacentSpaces: AdjacentSpace[],
  item: Item | null
}

interface Board {
  spaces: Space[]
  players: Player[]
}

interface Player {
  id: string
  name: string
  color: string
}

type Direction = 'nw' | 'ne' | 'sw' | 'se'

interface AdjacentSpace{
  space: Space
  direction: Direction
}

function setupGame(): Board{
  const space1: Space = {
    id: 1,
    adjacentSpaces: [],
    item: null
  }
  const space2: Space = {
    id: 2,
    adjacentSpaces: [],
    item: null
  }
  const space3: Space = {
    id: 3,
    adjacentSpaces: [],
    item: null
  }
  const space4: Space = {
    id: 4,
    adjacentSpaces: [],
    item: null
  }
  const space5: Space = {
    id: 5,
    adjacentSpaces: [],
    item: null
  }
  const space6: Space = {
    id: 6,
    adjacentSpaces: [],
    item: null
  }
  const space7: Space = {
    id: 7,
    adjacentSpaces: [],
    item: null
  }
  const space8: Space = {
    id: 8,
    adjacentSpaces: [],
    item: null
  }
  const space9: Space = {
    id: 9,
    adjacentSpaces: [],
    item: null
  }

  space1.adjacentSpaces = [{space: space2, direction: 'se'}, {space: space4, direction: 'sw'}]
  space2.adjacentSpaces = [{space: space1, direction: 'ne'}, {space: space5, direction: 'sw'}, {space: space3, direction: 'se'}]
  space3.adjacentSpaces = [{space: space2, direction: 'nw'}, {space: space6, direction: 'sw'}]
  space4.adjacentSpaces = [{space: space1, direction: 'ne'}, {space: space5, direction: 'se'}, {space: space7, direction: 'sw'}]
  space5.adjacentSpaces = [{space: space4, direction: 'nw'}, {space: space2, direction: 'ne'}, {space: space8, direction: 'sw'}, {space: space6, direction: 'se'}]
  space6.adjacentSpaces = [{space: space5, direction: 'nw'}, {space: space3, direction: 'ne'}, {space: space9, direction: 'sw'}]
  space7.adjacentSpaces = [{space: space4, direction: 'ne'}, {space: space8, direction: 'se'}]
  space8.adjacentSpaces = [{space: space7, direction: 'nw'}, {space: space5, direction: 'ne'}, {space: space9, direction: 'se'}]
  space9.adjacentSpaces = [{space: space8, direction: 'nw'}, {space: space6, direction: 'ne'}]

  const player1: Player = {
    id: 'player1',
    name: 'Player 1',
    color: 'red'
  } 

  const player2: Player = {
    id: 'player2',
    name: 'Player 2',
    color: 'blue'
  }

  const item1Player1 = {
    playerId: player1.id,
    color: player1.color
  }

  const item2Player1 = {
    playerId: player1.id,
    color: player1.color
  }

  const item3Player1 = {
    playerId: player1.id,
    color: player1.color
  }

  const item1Player2 = {
    playerId: player2.id,
    color: player2.color
  }

  const item2Player2 = {
    playerId: player2.id,
    color: player2.color
  }

  const item3Player2 = {
    playerId: player2.id,
    color: player2.color
  }

  space1.item = item1Player1
  space2.item = item2Player1
  space4.item = item3Player1

  space6.item = item1Player2
  space8.item = item2Player2
  space9.item = item3Player2

  const board: Board = {
    spaces: [space1, space2, space3, space4, space5, space6, space7, space8, space9],
    players: [player1, player2]
  }

  return board
}

function App() {
  const [board, setBoard] = useState(setupGame)
  // const [turn, setTurn] = useState(players[0].id)

  const [hoveredSpace, setHoveredSpace] = useState<Space>(board.spaces[0])
  const [adjacentsToHovered, setAdjacentsToHovered] = useState<number[]>([])
  
  const onHoverSpace = (space: Space | undefined) => {
    setHoveredSpace(space)
  }

  useEffect(() => {
    if(hoveredSpace){
      setAdjacentsToHovered(hoveredSpace.adjacentSpaces.map(_ => _.space.id))
    }
    else{
      setAdjacentsToHovered([])
    }
  }, [hoveredSpace])

  return (
    <main className={`transition-all duration-100 ${hoveredSpace ? 'bg-[rgba(0,0,0,0.6)]' : 'bg-[#eee]'}`}>
      <div className={`board `}>
          {board.spaces.map((space) => {
            const isHovered = Boolean(hoveredSpace && hoveredSpace.id === space.id)
            const isAdjacent = !isHovered && adjacentsToHovered.includes(space.id)

            return(
              <Space
                key={space.id}
                space={space}
                isHovered={isHovered}
                isAdjacent={isAdjacent}
                onHoverSpace={onHoverSpace}
                hide={hoveredSpace !== undefined && !isHovered && !isAdjacent}
              />
            )
          })}
        </div>
    </main>
  )
}

type SpaceComponentProps = {
  space: Space
  isHovered: boolean
  isAdjacent: boolean
  onHoverSpace: (space: Space | undefined) => void
  hide: boolean
}

function Space({
  space,
  isHovered,
  isAdjacent,
  onHoverSpace, 
  hide
}: SpaceComponentProps){

  const spaceStyle = space.item
    ? {
      borderColor: space.item.color,
      backgroundColor: space.item.color,
    }
    : {
      borderColor: 'black'
    }

  return (
    <div 
      style={{boxShadow: isHovered ? '2px 4px 10px #f9f9a1' : isAdjacent ? '2px 4px 10px lightblue' : ''}}
      className={`rounded-full w-fit flex ${isHovered || isAdjacent ? 'relative z-5' : ''} ${hide ? 'opacity-[0.2]' : ''}`}
      onMouseEnter={() => onHoverSpace(space)}
      onMouseLeave={() => onHoverSpace(undefined)}
    >
      {
        space.item ? (
          <span style={spaceStyle} className={`h-7 w-7 rounded-full border-2`}></span>
        ) : (
          <span style={spaceStyle} className={`h-7 w-7 rounded-full border-2`}></span>
        )
      }
    </div>
  )
}

export default App
