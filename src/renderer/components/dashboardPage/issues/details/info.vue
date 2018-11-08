<template>
  <div>
    <el-row v-if="issue" :gutter="160">
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
              {{ issue.fields.priority && issue.fields.priority.name }}
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
              {{ issue.fields.labels.join(', ') }}
            </span>
          </p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="details">
          <p class="detail">
            <span class="detail__name">status</span>
            <el-tag size="mini" class="detail__value" :class="issue.fields.status.statusCategory.colorName">
              <img class="detail__icon" :src="issue.fields.status.iconUrl">
              {{ issue.fields.status.name }}
            </el-tag>
          </p>
          <p class="detail">
            <span class="detail__name">fix versions</span>
            <span class="detail__value">
              {{ formatArray(issue.fields.fixVersions) }}
            </span>
          </p>
          <p v-if="issue.fields.epic" class="detail">
            <span class="detail__name">epic</span>
            <el-tag size="mini" class="detail__value">
              {{ issue.fields.epic.summary }}
            </el-tag>
          </p>
          <p class="detail">
            <span class="detail__name">reporter</span>
            <span class="detail__value">
              <img class="detail__icon detail__icon--circle" :src="issue.fields.reporter.avatarUrls['16x16']" alt="">
              {{ issue.fields.reporter.displayName }}
            </span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="issue">
      <el-col :xs="24">
        <div class="description">
          <p class="description__label">
            Description
          </p>
          <p class="description__value">
            {{ issue.fields.description }}
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    issue: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatArray (arr, field = 'name') {
      return arr.map(item => item[field]).join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 2px;

    &__name {
      text-transform: uppercase;
      color: #8a8a8a;
      font-size: 13px;
    }
    &__value {
      text-align: right;
    }
    &__icon {
      vertical-align: middle;
      max-height: 16px;
      max-width: 16px;
      position: relative;
      bottom: 1px;
      &--circle {
        border-radius: 50%;
      }
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
    &__value {
      white-space: pre;
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
