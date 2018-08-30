import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle, saveHistory, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/utils'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit, state}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  const randomList = shuffle(list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const inserSong = function({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]
  let fpIndex = findIndex(playList, song)
  currentIndex++
  playList.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSindex = findIndex(sequenceList, currentSong)
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSindex, 0, song)
  if (fsIndex > -1) {
    if (currentSindex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
      currentSindex--
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deletSongs = function({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}

export const saveSearchHistory = function({commit}, query) {
  let list = saveHistory(query)
  commit(types.SET_SEARCH_HISTORY, list)
}

export const deleteSearchHistory = function({commit}, query) {
  let list = deleteSearch(query)
  commit(types.SET_SEARCH_HISTORY, list)
}

export const clearSearchHistory = function({commit}) {
  let list = clearSearch()
  commit(types.SET_SEARCH_HISTORY, list)
}

export const savePlayHistory = function({commit}, song) {
  let list = savePlay(song)
  commit(types.SET_PLAY_HISTORY, list)
}

export const saveFavoriteSong = function({commit}, song) {
  let list = saveFavorite(song)
  commit(types.SET_FAVORITE_LIST, list)
}

export const deleteFavoriteSong = function({commit}, song) {
  let list = deleteFavorite(song)
  commit(types.SET_FAVORITE_LIST, list)
}