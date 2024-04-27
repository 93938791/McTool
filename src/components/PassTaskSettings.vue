<template>
  <div class="container">
    <div class="settings">
      <a-card :onclick="add" class="card add" width="100%">
        <PlusOutlined style="font-size: 50px" />
      </a-card>
      <div class="card" v-for="item in cards.quests">
        <a-card width="100%">
          <template #title>
            <div style="display: flex">
              <div>任务排序：</div>
              <a-tag color="green">{{ item.taskId }}</a-tag>
            </div>
          </template>
          <template #actions>
            <CopyFilled @click="copy(item)" key="copy" />
            <edit-outlined @click="edit(item)" key="edit" />
            <DeleteFilled @click="remove(item)" key="delete" />
          </template>
          <div class="custom-card">
            <a-popover :overlayStyle="{ width: 'auto' }" trigger="hover">
              <template #content>
                <a-card title="奖励展示">
                  <a-card-grid
                    v-for="itemInfo in item.rewards"
                    style="width: 100%; text-align: left"
                  >
                    <p>道具名称: {{ itemInfo.name }}</p>
                    <p>展示道具: {{ itemInfo.material }}</p>
                    <p>道具数量: {{ itemInfo.amount }}</p>
                    <p>物品是否发光: {{ itemInfo.glow }}</p>
                    <p>道具说明:</p>
                    <p v-for="lore in itemInfo.lore_addon">{{ lore }}</p>
                  </a-card-grid>
                </a-card>
              </template>
              <a-button>物品奖励</a-button>
            </a-popover>

            <a-popover trigger="hover">
              <template #content>
                <p>{{ item.required_points }}</p>
              </template>
              <a-button>所需积分</a-button>
            </a-popover>

            <a-popover
              v-if="item.locked_tier_item.material != ''"
              :overlayStyle="{ width: 'auto' }"
              trigger="hover"
            >
              <template #content>
                <a-card title="自定义展示">
                  <a-card-grid style="width: 100%; text-align: left">
                    <p>道具名称: {{ item.locked_tier_item.name }}</p>
                    <p>展示道具: {{ item.locked_tier_item.material }}</p>
                    <p>道具说明:</p>
                    <p v-for="lore in item.locked_tier_item.lore">{{ lore }}</p>
                  </a-card-grid>
                </a-card>
              </template>
              <a-button>自定义展示</a-button>
            </a-popover>
          </div>
        </a-card>
      </div>
    </div>

    <div class="preview">
      <pre><code class="language-yaml line-numbers">{{ yaml }}</code></pre>
    </div>

    <a-drawer :width="800" title="通行证任务设置" :open="open" @close="onClose">
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
        <a-button type="primary" @click="save()">保存</a-button>
      </template>
      <a-form :model="addform">
        <a-form-item label="任务排序">
          <a-tag color="green">{{ addform.taskId }}</a-tag></a-form-item
        >
        <a-form-item label="奖励选择：">
          <a-transfer
            v-model:target-keys="targetKeys"
            :locale="{
              itemUnit: '个',
              itemsUnit: '个',
              searchPlaceholder: '请输入搜索内容',
            }"
            :data-source="rewardsSetect"
            :titles="['奖励', '奖励']"
            :render="(item) => item.title"
            @change="handleChange"
          />
        </a-form-item>

        <a-form-item label="所需积分：">
          <a-input-number
            id="inputNumber"
            v-model:value="addform.required_points"
            :min="1"
          />
        </a-form-item>

        <a-form-item label="展示类型">
          <a-radio-group v-model:value="addform.type" button-style="solid">
            <a-radio-button @click="switchType(1)" value="none">默认展示</a-radio-button>
            <a-radio-button @click="switchType(2)" value="diy">自定义展示</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="addform.type == 'diy'" label="物品内容：">
          <div>
            <a-card title="物品奖励配置" style="width: 500px; margin-top: 30px">
              <a-form-item label="展示道具(会迭代成选择框)">
                <a-input
                  v-model:value="addform.locked_tier_item.material"
                  style="width: 200px; margin-left: 10px"
                />
              </a-form-item>
              <a-form-item label="道具名称">
                <a-input
                  v-model:value="addform.locked_tier_item.name"
                  style="width: 200px; margin-left: 10px"
                />
              </a-form-item>

              <a-form-item label="任务说明：">
                <template
                  v-for="(tag, index) in addform.locked_tier_item.lore"
                  :key="tag"
                >
                  <a-tooltip v-if="tag.length > 20" :title="tag">
                    <a-tag closable @close="item_handleClose(tag)">
                      {{ `${tag.slice(0, 20)}...` }}
                    </a-tag>
                  </a-tooltip>
                  <a-tag v-else closable @close="item_handleClose(tag)">
                    {{ tag }}
                  </a-tag>
                </template>
                <a-input
                  v-if="addform.locked_tier_item.item_inputVisible"
                  ref="item_inputRef"
                  type="text"
                  size="small"
                  :style="{ width: '78px' }"
                  v-model:value="addform.locked_tier_item.item_inputValue"
                  @blur="item_handleInputConfirm()"
                  @keyup.enter="item_handleInputConfirm()"
                />
                <a-tag
                  v-else
                  @click="item_showInput()"
                  style="background: #fff; border-style: dashed"
                >
                  <plus-outlined />
                  新增任务说明
                </a-tag>
              </a-form-item>
            </a-card>
          </div>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup>
import {
  CopyFilled,
  EditOutlined,
  DeleteFilled,
  PlusOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons-vue";
import Prism from "prismjs";
import "prismjs/components/prism-yaml.min.js"; // 需要加载 YAML 语言定义
import jsYaml from "js-yaml";
import {
  onMounted,
  onUpdated,
  ref,
  reactive,
  watch,
  defineComponent,
  toRefs,
  nextTick,
} from "vue";
import { Drawer, Tag, TreeSelect, Radio } from "ant-design-vue";
import {
  SELECTION_ALL,
  SELECTION_INVERT,
} from "ant-design-vue/es/table/hooks/useSelection";

import { useStore } from "vuex";
const store = useStore();
const rewards = store.state.RewardStore.cards;
//物品奖励

//卡片渲染
const cards = ref({
  quests: [],
});
//基础数据
let yaml = ref("tiers: \n");

const addform = ref({
  taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
  rewards: [],
  type: "none",
  required_points: 1,
  locked_tier_item: {
    material: "",
    name: "",
    lore: [],
    item_inputVisible: false,
    item_inputValue: "",
  },
});

//奖励选择
const rewardsSetect = [];

if (rewards != undefined && rewards.quests != undefined) {
  for (let i = 0; i < rewards.quests.length; i++) {
    rewardsSetect.push({
      key: rewards.quests[i].taskId.toString(),
      title: rewards.quests[i].name,
    });
  }
}

const oriTargetKeys = rewardsSetect
  .filter((item) => +item.key % 3 > 1)
  .map((item) => item.key);
const disabled = ref(false);
const targetKeys = ref(oriTargetKeys);
const selectedKeys = ref([]);
const handleChange = (nextTargetKeys, direction, moveKeys) => {
  addform.value.rewards = targetKeys.value;
};

//物品说明
const item_inputRef = ref();

const item_state = reactive({
  item_tags: [],
  item_inputVisible: false,
  item_inputValue: "",
});

const item_handleClose = (removedTag) => {
  addform.value.locked_tier_item.lore = addform.value.locked_tier_item.lore.filter(
    (item_tag) => item_tag !== removedTag
  );
};

const item_showInput = () => {
  addform.value.locked_tier_item.item_inputVisible = true;
  item_inputRef.value = "";
};

const item_handleInputConfirm = () => {
  const item_inputValue = addform.value.locked_tier_item.item_inputValue;
  let item_tags = addform.value.locked_tier_item.lore;
  if (item_inputValue && item_tags.indexOf(item_inputValue) === -1) {
    item_tags = [...item_tags, item_inputValue];
  }
  Object.assign(addform.value.locked_tier_item, {
    item_tags,
    item_inputVisible: false,
    item_inputValue: "",
  });
  addform.value.locked_tier_item.lore = item_tags;
};

const radioStyle = reactive({
  display: "block",
  height: "30px",
  lineHeight: "30px",
});

//卡片功能
const removeItem = () => {
  let index = addform.value.items.indexOf(item);
  if (index > -1 && index < addform.value.items.length) {
    addform.value.items.splice(index, 1);
  }
};

const addItem = () => {
  let item = {
    material: "",
    name: "",
    amount: 1,
    glow: true,
    lore: [],
  };
  addform.value.items.push(item);
};

const copyItem = (item) => {
  let newItem = { ...item }; // 创建一个新的对象并复制原始对象的属性
  newItem.taskId = cards.value.quests.length + 1;
  addform.value.items.push(newItem);
};

//抽屉功能

//卡片功能
const remove = (item) => {
  let index = item.taskId - 1;
  if (index > -1 && index < cards.value.quests.length) {
    cards.value.quests.splice(index, 1);
  }
  for (let i = 0; i < cards.value.quests.length; i++) {
    cards.value.quests[i].taskId = i + 1;
  }
  handleYml();
};

const edit = (item) => {
  addform.value = item;
  open.value = true;
};

const copy = (item) => {
  let newItem = JSON.parse(JSON.stringify(item)); // 创建一个新的对象并复制原始对象的属性
  newItem.taskId = cards.value.quests.length + 1;
  cards.value.quests.push(newItem);
  handleYml();
};

//选择类型
const switchType = (value) => {
  if (value == 1) {
    addform.value.type = "none";
    addform.value = {
      taskId: addform.value.taskId,
      rewards: addform.value.rewards,
      type: "none",
      required_points: addform.value.required_points,
      locked_tier_item: {
        material: "",
        name: "",
        lore: [],
        item_inputVisible: false,
        item_inputValue: "",
      },
    };
  } else if (value == 2) {
    addform.value.type = "diy";
  }
};

//抽屉开关
const open = ref(false);

//打开抽屉
const add = () => {
  addform.value.taskId =
    cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1;
  targetKeys.value = [];
  open.value = true;
};
//保存内容
const save = () => {
  if (cards.value.quests[addform.value.taskId - 1] !== undefined) {
    cards.value.quests[addform.value.taskId - 1] = addform.value;
  } else {
    cards.value.quests.push(addform.value);
  }

  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    rewards: [],
    type: "none",
    required_points: 1,
    locked_tier_item: {
      material: "",
      name: "",
      lore: [],
      item_inputVisible: false,
      item_inputValue: "",
    },
  };

  handleYml();
  open.value = false;
};
//抽屉开关方法
const onClose = () => {
  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    rewards: [],
    type: "none",
    required_points: 1,
    locked_tier_item: {
      material: "",
      name: "",
      lore: [],
      item_inputVisible: false,
      item_inputValue: "",
    },
  };
  open.value = false;
};

//代码预览
const handleYml = () => {
  //处理yml
  let yamlString = "";
  for (let i = 0; i < cards.value.quests.length; i++) {
    let quests = {};

    let item = cards.value.quests[i];
    let rewards = "**********";
    if (item.locked_tier_item.material != "") {
      let locked_tier_item = {
        material: item.locked_tier_item.material,
        name: item.locked_tier_item.name,
        lore: item.locked_tier_item.lore,
      };
      quests[item.taskId] = {
        rewards: rewards,
        required_points: item.required_points,
        locked_tier_item: locked_tier_item,
      };
    } else {
      quests[item.taskId] = {
        rewards: rewards,
        required_points: item.required_points,
      };
    }

    let yamlStr = jsYaml.dump(quests, { noRefs: true });

    yamlString += yamlStr.replace("'**********'", "['" + item.rewards.join("','") + "']");
    console.log(1111);
  }
  yamlString = yamlString
    .replace("|", "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/^/gm, "  ");
  yaml.value = "tiers: \n" + yamlString;
  yamlString = "";
};

//监听内容更新
onUpdated(() => {
  Prism.highlightAll(); //修改内容后重新渲染
});
onMounted(() => {
  Prism.highlightAll(); //切换菜单重新渲染
});
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
  height: 180px;
}

.custom-card {
  display: flex;
  justify-content: left;
  align-items: left;
  flex-wrap: wrap;
}

.card {
  width: 250px;
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
  width: 60vw;
}

.preview {
  width: 650px;
}

pre {
  margin-top: 7%;
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
