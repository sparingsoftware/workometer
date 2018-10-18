import Vue from 'vue'

const unfoldJiraRequest = ({ request, payload, flatMapKey }) => {
  const fetchItems = (items = [], startAt = 0) => {
    return request({ ...payload, startAt }).then(res => {
      const startAt = res.startAt + res.maxResults
      const isLast = res.isLast || startAt >= res.total
      const newItems = [...items, ...res[flatMapKey]]
      return isLast ? newItems : fetchItems(newItems, startAt)
    })
  }

  return fetchItems()
}

export default {
  getAllBoards: config => unfoldJiraRequest({
    request: payload => Vue.jira.board.getAllBoards(payload),
    payload: config,
    flatMapKey: 'values'
  }),
  getSprintsForBoard: boardId => unfoldJiraRequest({
    request: payload => Vue.jira.board.getSprintsForBoard(payload),
    payload: { boardId },
    flatMapKey: 'values'
  }),
  getIssuesForSprint: sprintId => unfoldJiraRequest({
    request: payload => Vue.jira.sprint.getSprintIssues(payload),
    payload: { maxResults: 500, sprintId },
    flatMapKey: 'issues'
  }),
  getIssuesForBacklog: boardId => unfoldJiraRequest({
    request: payload => Vue.jira.board.getIssuesForBacklog(payload),
    payload: { maxResults: 500, boardId },
    flatMapKey: 'issues'
  }),
  login: creds => Vue.jira.auth.login(creds).then(res => {
    Vue.jira.basic_auth = creds
  })
}
