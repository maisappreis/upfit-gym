<template>
  <div class="filter-area">
    <select
      class="form-select font month"
      id="month"
      name="month"
      v-model="month"
      @change="$emit('get-month', this.month)"
      required
    >
      <option v-for="(month, index) in months" :key="index" :value="month">
        {{ month }}
      </option>
    </select>
    <select
      class="form-select font year"
      id="year"
      name="year"
      v-model="year"
      @change="$emit('get-year', this.year)"
      required
    >
      <option v-for="(year, index) in years" :key="index" :value="year">
        {{ year }}
      </option>
    </select>
    <select
      class="form-select font status"
      id="status"
      name="status"
      v-model="paymentStatus"
      @change="$emit('get-status', this.paymentStatus)"
      required
    >
      <option disabled selected value="Todos">Status:</option>
      <option v-for="(status, index) in statusList" :key="index" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script>
import { globalVariablesMixin } from '../../utils/variables.js'

export default {
  name: 'MonthFilter',
  mixins: [globalVariablesMixin],

  props: {
    statusList: Array
  },

  data() {
    return {
      month: '',
      year: 0,
      paymentStatus: ''
    }
  },

  methods: {
    getDate() {
      let currentDate = new Date()
      let currentMonth = currentDate.getMonth()
      this.year = currentDate.getFullYear()
      this.month = this.months[currentMonth]

      this.$emit('get-month', this.month)
      this.$emit('get-year', this.year)
    },

    getStatus() {
      this.paymentStatus = 'Todos'

      this.$emit('get-status', this.paymentStatus)
    }
  },

  mounted() {
    this.getDate()
    this.getStatus()
  }
}
</script>

<style scoped>
.filter-area {
  display: flex;
  margin-top: 15px;
  font-size: 20px;
}

.font {
  font-size: 16px;
  margin-left: 15px;
}

.month {
  min-width: 100px;
}

.year {
  max-width: 80px;
}

.status {
  min-width: 140px;
}

@media only screen and (max-width: 1000px) {
  .filter-area {
    margin-top: 10px;
  }

  .font {
    font-size: 14px;
    margin-left: 5px;
  }

  .month {
    min-width: 80px;
  }

  .year {
    max-width: 80px;
  }

  .status {
    min-width: 80px;
  }
}
</style>