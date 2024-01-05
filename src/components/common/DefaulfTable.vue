<template>
    <table class="table-area">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in data" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
            </tr>
        </tbody>
    </table>    
</template>

<script>
export default {
  name: 'DefaulfTable',
  props: {
    data: Array
  }
}
</script>

<style scoped>
.table-area {
    width: 97%;
    border-collapse: collapse;
    margin: 20px;
}

th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: var(--gray-color);
    color: white;
}

tr:nth-child(even) {
    background-color: #eeeded;
}

tr:hover {
    background-color: #cdc8f3;
}
</style>