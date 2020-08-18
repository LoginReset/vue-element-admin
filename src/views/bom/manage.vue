<template>
    <div class="container">
        <div class="main">
            <el-form :model="temp" :rules="rules">
                <el-form-item>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        drag
                        action="#"
                        :file-list="modeList"
                        :http-request="modeUpload"
                        :on-change="fileChange"
                        :on-preview="handlePreview"
                        accept=".xls,.xlsx"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="text-align:center;">上传成功后会自动下载</div>
                        </el-upload>
                </el-form-item>
                <el-form-item label-position="left" label="价格上浮比例(%)" prop="comeUp">
                    <el-select v-model="temp.comeUp" 
                        filterable 
                        default-first-option 
                        allow-create 
                        placeholder="价格上浮比例"
                        @change="change"
                        @blur="blur">
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                
            </el-form>
        </div>
        
    </div>
</template>

<script>
import {postUpBom} from '@/api/ele'

export default {
    name:'bom-manage',
    data(){
        var checkComeUp = (rule,value,callback)=>{
            if(typeof value ==='string'){
                value = Number(value)
                if(!/^\+?[1-9][0-9]*$/.test(value)||value>500){
                    this.flag = false
                    callback(new Error('请输入[0,500]的正整数'))
                }
            }
            callback()
        }
        return{
            url:'',
            modeList:[],
            options:[0,5,10,15,20,25,50,75],
            temp:{
                comeUp:0    
            },
            flag: true,
            rules:{
                comeUp:[{ validator: checkComeUp, trigger: 'change' }]
            }
        }
    },
    methods:{
        modeUpload(item) {
            this.mode = item.file
            let fd = new FormData()// FormData 对象
            console.log(typeof this.temp.comeUp)
            fd.append('file', this.mode)// 文件对象
            fd.append('comeUp', this.temp.comeUp)// 文件对象
            console.log(fd.get('comeUp'))
            postUpBom(fd).then(response=>{
                this.url = response.respObj
                this.handlePreview(item.file)
            })
        },
        fileChange(file, fileList) {
            console.log(file)
            // console.log(file.raw)
            this.modeList = []
            this.modeList.push(file)
            this.submitUpload()
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview(file) {
            var a = document.createElement('a');
            var event = new MouseEvent('click');
            a.download = file.name;
            a.href = this.url;
            a.dispatchEvent(event);
        },
        change(){
            let comeUp = this.temp.comeUp
            if(typeof comeUp ==='string'&&comeUp>0 && comeUp<=500){
                this.temp.comeUp = this.temp.comeUp.replace(/\b(0+)/gi,"")
            }
        },
        blur(){
            if(!this.flag){
                this.temp.comeUp = 0
                this.flag = true
            }
        }
    }
    
}
</script>
<style scoped>
    .container{
        /* position: relative; */
    }
    .main{
        /* position:absolute; */
        display: flex;
        justify-content: center;
        padding-top: 50px;
        /* top:50px; */
        /* left: 50%; */
        /* transform: translate(-50%,0); */
    }
    .el-upload-dragger{
        width: 560px;
    }

</style>