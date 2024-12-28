<!--
 * @Author: Anixuil
 * @Date: 2024-12-27 09:52:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-28 10:12:52
 * @Description: 首页
-->
<template>
    <div class="views-common-wrapper">
        <div class="table-container">
            <div class="table-header-menu">
                <el-button type="primary">新建项目</el-button>
            </div>
            <el-table :data="tableData" height="400" style="width: 100%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="address" label="Address" />
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">

const tableData = ref([{
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
{
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
},
])
</script>

<style scoped lang="scss">
.views-common-wrapper{
    .table-container{
        width: 100%;
        max-width: 1200px;
        min-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;
    }
}
</style>