<template>
    <div class="container">
        <div class="settings">
            <a-card :onclick="add" class="card add" width="100%">
                <PlusOutlined  style="font-size: 50px;" />
            </a-card>
            <div class="card" v-for="card in cards">
                <a-card width="100%" title="Card title">
                    <template #actions>
                        <CopyFilled key="copy" />
                        <edit-outlined key="edit" />
                        <DeleteFilled key="delete" />
                    </template>

                    <p>{{ card }}</p>
                </a-card>
            </div>
        </div>
        <div class="preview">
            <pre><code class="language-yaml line-numbers">{{ highlightedYaml }}</code></pre>
        </div>
        <a-drawer :width="500" title="通行证奖励设置" :placement="right" :open="open" @close="onClose">
            <template #extra>
                <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
                <a-button type="primary" @click="onClose">保存</a-button>
            </template>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </a-drawer>
    </div>
</template>

<script setup>
import { CopyFilled, EditOutlined, DeleteFilled, PlusOutlined } from '@ant-design/icons-vue';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml.min.js'; // 需要加载 YAML 语言定义
import jsYaml from 'js-yaml';
import { onMounted, onUpdated, ref, reactive } from "vue";
import { Drawer } from 'ant-design-vue';
const open = ref(false);

const onClose = () => {
  open.value = false;
};
onUpdated(() => {
    Prism.highlightAll(); //修改内容后重新渲染
});
onMounted(() => {
    Prism.highlightAll(); //切换菜单重新渲染
})

const cards = ref([])

const add = () => {
    open.value = true;
    console.log("Add method called");
};

let highlightedYaml = ref('key: value \n key: value \n key: value \n key: value \n key: value \n');


</script>

<style scoped>
.card.add {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    color: #1890ff;
    cursor: pointer;
    border: 1px dashed #1890ff;
    border-radius: 5px;
    transition: all 0.3s;
}

.card {
    width: 27%;
    margin: 3%;
}

::v-deep .code-toolbar {
    width: 100%;
    /* right: -17.8em !important; */
}

.container {
    display: flex;
}

.settings {
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
    margin-top: 7px;
    width: 50vw;
    flex: 1;
}

.preview {
    width: 50vw;
    flex: 1;
}

pre {
    margin-top: 4%;
    overflow: hidden !important;

    code {
        display: inline-block;
        padding-bottom: 20px;
        position: relative;
        top: 20px;
    }

    &::before {
        content: "";
        position: absolute;
        background: red;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: 10px;
        left: 15px;
        transform: translate(-50%);
    }

    &::after {
        content: "";
        position: absolute;
        background: sandybrown;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        top: 10px;
        left: 30px;
        transform: translate(-50%);
    }

    code:first-child {
        &::after {
            content: "";
            position: absolute;
            background: limegreen;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            top: -26px;
            left: -15px;
            transform: translate(-50%);
        }
    }
}
</style>