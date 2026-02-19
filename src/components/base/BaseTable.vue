<template>
  <div class="table-wrapper">
    <div class="table-overflow">
      <table class="table-area">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="column.thClass"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in data"
            :key="getRowKey(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.tdClass"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :index="rowIndex"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
export interface BaseTableColumn<T> {
  key: Extract<keyof T, string> | string;
  label: string;
  thClass?: string;
  tdClass?: string;
}

const props = defineProps<{
  data: T[];
  columns: BaseTableColumn<T>[];
  rowKey?: string;
}>();

const getRowKey = (row: Record<string, any>, index: number) => {
  if (props.rowKey && row[props.rowKey] !== undefined) {
    return row[props.rowKey];
  }
  return index;
};
</script>

<style scoped>
.table-wrapper {
  width: 100%;
}

.table-overflow {
  overflow: auto;
  max-height: 58vh;
}

.table-area {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
}

th {
  background-color: var(--gray-medium);
  color: black;
  text-align: center;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #eeeded;
}

tr:hover {
  background-color: var(--tertiary-color);
}

.table-icon {
  font-size: 20px;
  margin: 0 10px;
  cursor: pointer;
}

@media only screen and (max-width: 1300px) {
  th,
  td {
    padding: 6px;
    font-size: 15px;
  }
}

@media only screen and (max-width: 1000px) {
  .table-overflow {
    max-height: 54vh;
  }

  th,
  td {
    padding: 5px;
    font-size: 13px;
  }

  .table-icon {
    font-size: 15px;
    margin: 0 5px;
  }
}
</style>