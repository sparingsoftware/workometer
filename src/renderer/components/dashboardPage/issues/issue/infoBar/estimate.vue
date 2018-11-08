<template>
  <div class="container">
    <el-tag
      v-if="timeTrackingOnJiraScreen || originalEstimate"
      size="mini"
      title="Original Time Estimate"
      class="text-uppercase estimate"
    >
      <span v-if="timeTrackingOnJiraScreen">
        <span v-if="editMode">
          <form @submit.prevent="submitEstimate">
            <input v-model="form.originalEstimate" class="input">
            <el-button class="submit"><i class="estimate__icon fa fa-save" @click="submitEstimate"/></el-button>
          </form>
        </span>
        <span v-else @click="editEstimate">
          {{ estimateLabel }}
          <i class="estimate__icon fa fa-pencil"/>
        </span>
      </span>
      <span v-else>
        {{ originalEstimate }}
      </span>
    </el-tag>
  </div>
</template>

<script>
import clone from 'lodash.clonedeep'
import { mapActions } from 'vuex'

export default {
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      editMode: false,
      form: {},
      timeTrackingOnJiraScreen: false
    }
  },
  computed: {
    estimateLabel () {
      const estimateSet = this.issue.fields.timetracking.originalEstimate
      return estimateSet || 'Set estimate'
    },
    originalEstimate () {
      return this.issue.fields.timetracking.originalEstimate
    }
  },
  methods: {
    ...mapActions({
      setIssueEstimate: 'issues/setIssueEstimate'
    }),
    editEstimate () {
      const estimateCopy = clone(this.issue.fields.timetracking)
      this.form = estimateCopy
      this.editMode = true
    },
    submitEstimate () {
      this.setIssueEstimate(
        { issue: this.issue, originalEstimate: this.form.originalEstimate }
      ).then(res => {
        this.editMode = false
      }).catch(this.handleErrors)
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    display: inline-block;
    transition: width 2s;
  }

  .estimate {
    cursor: pointer;
    margin-right: 7px;
    &__icon {
      margin-left: 4px;
    }
  }

  .input {
    outline: none;
    padding: 2px 0;
    background: 0;
    border: 0;
    width: 60px;
  }

  .submit {
    padding: 0;
    border: 0;
    background: 0;
    cursor: pointer;
  }
</style>
