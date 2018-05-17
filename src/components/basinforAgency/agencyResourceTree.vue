<template>
  <div class="table-style">
    <div class="el-tree-out">
      <div class="clear"></div>
      <keep-alive>
        <el-tree
          :data="examTreeData"
          :props="defaultProps"
          accordion
          highlight-current
          :expand-on-click-node="false"
          ></el-tree>
      </keep-alive>
    </div>
  </div>

</template>


<script>

  import { ApiGet } from 'api/recommand'
  import { URL_GET, TIKA_RBAC, TIKA_SYSTEM} from 'api/config'
  export default {
    data() {
      return {
        examTreeData: [],
        defaultProps: {
          children: 'child',
          label: 'industryName'
        }
      }
    },
    mounted() {
      this._getExamTreeData()
    },

    methods: {
      _getExamTreeData(){
        let getData = {
          // url: `/v1/privilege/resource/agencyresourcearray?agencyCode=${sessionStorage.getItem("agencyCode")}&roleId=${sessionStorage.getItem("roleId")}`,
          url: `/v1/privilege/resource/agencyroleresource?agencyCode=${sessionStorage.getItem("agencyCode")}&roleId=${sessionStorage.getItem("roleId")}`,
          value: TIKA_RBAC
        }
        ApiGet(getData, URL_GET).then((res)=>{
          if(res.status === 200){
            let getData1 = {
              // url: `/v1/itembank/itembankIndustryInfo/itembank/rootTree/source?agencyCode=${sessionStorage.getItem("agencyCode")}&sourceStr=${res.result}`,

              url: `/v1/systemctl/treeIndustryInfo/tree/rootTree/source?agencyCode=${sessionStorage.getItem("agencyCode")}&sourceStr=${res.result}`,
              value: TIKA_SYSTEM
            }
            ApiGet(getData1, URL_GET).then((res1)=>{
              if(res1.status === 200){
                if(!res1.result.length){
                  alert("机构未为您分配数据资源权限！！")
                  return
                }
                let resTemp = res1.result
                this.examTreeData=resTemp
              }else if(res1.status !== 401){
                console.log('机构人员考试树获取数据错误：'+res1.message)
                return
              }
            })
          }else if(res.status !== 401){
            console.log('考试树获权限数据出现错误：'+res.message)
            return
          }
        })
      }
    }
  }
</script>

<style>
  .search .el-input{
    width: 18%;
    display: inline-block;
  }
  .formRight .el-upload-dragger {
    height: 100%;
    width: 100%
  }
  .formRight .el-select {
    width: 100%
  }
  .formRight .el-form-item__label{
    width: 100px
  }
  .formRight .el-form-item__content{
    margin-left: 100px;
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color:#afe1f9;
  }

</style>

