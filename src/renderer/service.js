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
  setIssueStatus: async (issueId, statusName) => {
    const { transitions } = await Vue.jira.issue.getTransitions({ issueId })
    const statusTransition = transitions.find(transition => transition.name === statusName)
    if (!statusTransition) return
    return Vue.jira.issue.transitionIssue({
      transition: { id: statusTransition.id },
      issueId
    })
  },
  setIssueEstimate: async ({issueId, originalEstimate}) => {
    return Vue.jira.issue.editIssue({
      issueId,
      issue: { fields: { timetracking: { originalEstimate } } }
    })
  },
  setIssueAssign: async ({ issueId, assignee }) => {
    return Vue.jira.issue.assignIssue({
      issueId,
      assignee
    })
  },
  moveIssueToSprint: ({ issueKey, sprintId }) => {
    return Vue.jira.sprint.moveSprintIssues({
      issues: [issueKey],
      sprintId
    })
  },
  addWorkLog: (trackedIssueId, trackingStartTime, timeSpentSeconds, comment = '') => {
    return Vue.jira.issue.addWorkLog({
      issueId: trackedIssueId,
      worklog: {
        started: trackingStartTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        timeSpentSeconds: timeSpentSeconds,
        comment
      }
    })
  },
  getIssue: payload => {
    return Vue.jira.issue.getIssue(payload)
  },
  getStatuses: projectIdOrKey => {
    return Vue.jira.project.getStatuses({ projectIdOrKey })
  },
  login: creds => Vue.jira.auth.login(creds),
  logout: () => {
    Vue.jira.basic_auth = null
    Vue.jira.auth.logout()
  },
  userDetails: () => {
    return Vue.jira.myself.getMyself()
  },
  createIssue: ({ projectKey, form }) => {
    return Vue.jira.issue.createIssue({
      fields: {
        ...form,
        project: {
          key: projectKey
        }
      }
    })
  },
  editIssue: ({ form, issueId }) => {
    return Vue.jira.issue.editIssue({
      issue: {
        fields: {
          ...form
        }
      },
      issueId
    })
  },
  getAutocompletion ({ url }) {
    const options = {
      uri: url,
      method: 'GET',
      json: true,
      followAllRedirects: true
    }
    return Vue.jira.makeRequest(options)
  }
}
