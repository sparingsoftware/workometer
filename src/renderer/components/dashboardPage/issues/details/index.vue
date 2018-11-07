<template>
  <div>
    <el-dialog :title="`${issue.key} - ${issue.fields.summary}`" fullscreen :visible.sync="dialogVisible">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <div class="details">
            <p class="detail">
              <span class="detail__name">type</span>
              <span class="detail__value">
                <img class="detail__icon" :src="issue.fields.issuetype.iconUrl">
                {{ issue.fields.issuetype.name }}
              </span>
            </p>
            <p class="detail">
              <span class="detail__name">priority</span>
              <span class="detail__value">
                <img class="detail__icon" :src="issue.fields.priority.iconUrl">
                {{ issue.fields.priority.name }}
              </span>
            </p>
            <p v-if="issue.fields.versions.length" class="detail">
              <span class="detail__name">affects versions</span>
              <span class="detail__value">
                {{ formatArray(issue.fields.versions) }}
              </span>
            </p>
            <p class="detail">
              <span class="detail__name">components</span>
              <span class="detail__value">
                {{ formatArray(issue.fields.components) }}
              </span>
            </p>
            <p class="detail">
              <span class="detail__name">labels</span>
              <span class="detail__value">
                {{ formatArray(issue.fields.labels) }}
              </span>
            </p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div>
            <p class="detail">
              <span class="detail__name">status</span>
              <el-tag size="mini" class="detail__value" :class="issue.fields.status.statusCategory.colorName">
                <img class="detail__icon" :src="issue.fields.status.iconUrl">
                {{ issue.fields.status.name }}
              </el-tag>
            </p>
            <p class="detail">
              <span class="detail__name">fix versions</span>
              <span class="detail__value">a</span>
            </p>
            <p class="detail">
              <span class="detail__name">epic</span>
              <span class="detail__value">a</span>
            </p>
            <p class="detail">
              <span class="detail__name">reporter</span>
              <span class="detail__value">a</span>
            </p>
          </div>
        </el-col>
        <el-col :xs="24">
          <div class="description">
            <p class="description__label">
              Description
            </p>
          </div>
        </el-col>
      </el-row>
      {{ issue }}
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      issue: null
    }
  },
  methods: {
    openDialog (issue) {
      this.issue = issue
      this.dialogVisible = true
    },
    closeDialog () {
      this.issue = null
      this.dialogVisible = false
    },
    formatArray (arr, field = 'name') {
      return arr.map(item => item[field]).join(', ')
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail {
    &__name {
      text-transform: uppercase;
      color: #8a8a8a;
      font-size: 13px;
    }
    &__icon {
      vertical-align: middle;
      max-height: 16px;
      position: relative;
      bottom: 1px;
    }
  }

  .description {
    margin-top: 20px;

    &__label {
      text-transform: uppercase;
      font-size: 13px;
      color: #8a8a8a;
      font-weight: 700;
    }
  }

  .blue-gray {
    background: #5E6C84;
    color: #fff;
  }

  .medium-gray {
    background: #8993A4;
    color: #fff;
  }

  .green {
    background: rgba(103, 194, 58, .1);
    color: #67c23a;
  }

  .yellow {
    background: #FFC400;
    color: #6b460e;
  }

  .warm-red {
    background: #FF5630;
    color: #fff;
  }
</style>
