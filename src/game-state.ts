// let emitCellUpdate = async (
//   gameId: string,
//   socket: unknown,
//   selection: CellRef,
//   value: string
// ) => {
//   value = value.toUpperCase()
//   let cell = selection
//   let color = 'hsl(83,40%,69%)'
//   let pencil = false
//   let id = USER_ID
//   let timestamp = {
//     '.sv': 'timestamp',
//   }

//   let payload = {
//     event: {
//       timestamp,
//       type: 'updateCell',
//       params: {
//         cell,
//         value,
//         color,
//         pencil,
//         id,
//       },
//     },
//     gid: gameId,
//   }

//   emit(socket, 'game_event', payload)
// }

// export let updateGameInput = (
//   gameId: string,
//   socket: unknown,
//   game: Game,
//   key: Key
// ): Game => {
//   let selection: CellRef

//   switch (key) {
//     case 'delete':
//       emitCellUpdate(gameId, socket, game.selection, '')
//       return game
//     case 'next':
//       selection = findNextSelection(game)
//       return {
//         ...game,
//         selection,
//       }
//     case 'prev':
//       selection = findPrevSelection(game)
//       return {
//         ...game,
//         selection,
//       }
//     default:
//       emitCellUpdate(gameId, socket, game.selection, key.key)
//       return game
//   }
// }
