import Vue from 'vue'

const unfoldJiraRequest = (service, itemsKey = 'values') => async payload => {
  let isLast = false
  const items = []
  let startAt
  do {
    const response = await service({
      startAt,
      ...payload
    })
    items.push(...response[itemsKey])
    startAt = response.startAt + response.maxResults
    isLast = response.isLast !== undefined
      ? response.isLast
      : response.startAt + response.resultsMax >= response.total
  } while (!isLast)
  return items
}

export default {
  getAllBoards: unfoldJiraRequest(payload => Vue.jira.board.getAllBoards(payload)),
  getSprintsForBoard: unfoldJiraRequest(payload => Vue.jira.board.getSprintsForBoard(payload))
}
