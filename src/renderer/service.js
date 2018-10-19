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
  setIssueStatus: async (issue, status) => {
    const transitions = await Vue.jira.issue.getTransitions({ issueId: issue.id })
    const statusTransition = transitions.transitions.find(transition => transition.name === status.name)
    if (!statusTransition) return
    return Vue.jira.issue.transitionIssue({
      issueId: issue.id,
      transition: {
        id: statusTransition.id
      }
    })
  },
  getIssue: payload => {
    return Vue.jira.issue.getIssue(payload)
  }
}
