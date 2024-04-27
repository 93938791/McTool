<template>
  <div class="container">
    <div class="settings">
      <a-card :onclick="add" class="card add" width="100%">
        <PlusOutlined style="font-size: 50px" />
      </a-card>
      <div class="card" v-for="item in cards.quests">
        <a-card width="100%">
          <template #title>
            <div>
              <span style="float: right">{{ item.name }}</span>
              <a-tag color="green">{{ item.taskId }}</a-tag>
            </div>
          </template>
          <template #actions>
            <CopyFilled @click="copy(item)" key="copy" />
            <edit-outlined @click="edit(item)" key="edit" />
            <DeleteFilled @click="remove(item)" key="delete" />
          </template>
          <div class="custom-card">
            <a-popover trigger="hover">
              <template #content>
                <p>{{ item.type }}</p>
              </template>
              <a-button>奖励类型</a-button>
            </a-popover>

            <a-popover trigger="hover">
              <template #content>
                <p>奖励说明:</p>
                <p v-for="lore in item.lore_addon">{{ lore }}</p>
              </template>
              <a-button>奖励说明</a-button>
            </a-popover>
            <a-popover
              :overlayStyle="{ width: 'auto' }"
              v-if="item.type == 'item'"
              trigger="hover"
            >
              <template #content>
                <a-card title="物品奖励说明">
                  <a-card-grid
                    v-for="itemInfo in item.items"
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

            <a-popover v-if="item.type == 'command'" trigger="hover">
              <template #content>
                <p>执行指令:</p>
                <p v-for="lore in item.lore_addon">{{ lore }}</p>
              </template>
              <a-button>指令奖励</a-button>
            </a-popover>
          </div>
        </a-card>
      </div>
    </div>

    <div class="preview">
      <pre><code class="language-yaml line-numbers">{{ yaml }}</code></pre>
    </div>

    <a-drawer :width="800" title="通行证奖励设置" :open="open" @close="onClose">
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
        <a-button type="primary" @click="save()">保存</a-button>
      </template>
      <a-form :model="addform">
        <a-form-item label="奖励id">
          <a-tag color="green">{{ addform.taskId }}</a-tag></a-form-item
        >
        <a-form-item label="奖励名称">
          <a-input v-model:value="addform.name" style="width: 400px; margin-left: 10px" />
        </a-form-item>

        <a-form-item label="奖励说明">
          <template v-for="(tag, index) in addform.lore_addon" :key="tag">
            <a-tooltip v-if="tag.length > 20" :title="tag">
              <a-tag :closable="index !== 0" @close="lore_handleClose(tag)">
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else closable @close="lore_handleClose(tag)">
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="lore_state.lore_inputVisible"
            ref="lore_inputRef"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            v-model:value="lore_state.lore_inputValue"
            @blur="lore_handleInputConfirm"
            @keyup.enter="lore_handleInputConfirm"
          />
          <a-tag
            v-else
            @click="lore_showInput"
            style="background: #fff; border-style: dashed"
          >
            <plus-outlined />
            新增说明
          </a-tag>
        </a-form-item>

        <a-form-item label="奖励类型">
          <a-radio-group v-model:value="addform.type" button-style="solid">
            <a-radio-button @click="switchType(1)" value="command"
              >指令奖励</a-radio-button
            >
            <a-radio-button @click="switchType(2)" value="item">物品奖励</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="addform.type == 'command'" label="指令内容：">
          <template v-for="(tag, index) in command_state.command_tags" :key="tag">
            <a-tooltip v-if="tag.length > 20" :title="tag">
              <a-tag :closable="index !== 0" @close="command_handleClose(tag)">
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else closable @close="command_handleClose(tag)">
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="command_state.command_inputVisible"
            ref="command_inputRef"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            v-model:value="command_state.command_inputValue"
            @blur="command_handleInputConfirm"
            @keyup.enter="command_handleInputConfirm"
          />
          <a-tag
            v-else
            @click="command_showInput"
            style="background: #fff; border-style: dashed"
          >
            <plus-outlined />
            新增指令
          </a-tag>
        </a-form-item>

        <a-form-item v-if="addform.type == 'item'" label="物品内容：">
          <a-button @click="addItem()" v-if="addform.items.length == 0" type="primary"
            >新增物品</a-button
          >
          <div v-if="addform.items.length > 0">
            <a-card
              v-for="item in addform.items"
              title="物品奖励配置"
              style="width: 500px; margin-top: 30px"
            >
              <template #actions>
                <AppstoreAddOutlined @click="addItem(item)" key="add" />
                <CopyFilled @click="copyItem(item)" key="copy" />
                <DeleteFilled @click="removeItem(item)" key="delete" />
              </template>
              <template #extra></template>
              <a-form-item label="展示道具(会迭代成选择框)">
                <a-input
                  v-model:value="item.material"
                  style="width: 200px; margin-left: 10px"
                />
              </a-form-item>
              <a-form-item label="道具名称">
                <a-input
                  v-model:value="item.name"
                  style="width: 200px; margin-left: 10px"
                />
              </a-form-item>
              <a-form-item label="道具数量">
                <a-input-number id="inputNumber" v-model:value="item.amount" :min="1" />
              </a-form-item>
              <a-form-item label="是否有附魔效果">
                <a-switch v-model:checked="item.glow" />
              </a-form-item>

              <a-form-item label="奖励物品说明：">
                <template v-for="(tag, index) in item.lore" :key="tag">
                  <a-tooltip v-if="tag.length > 20" :title="tag">
                    <a-tag closable @close="item_handleClose(tag, item)">
                      {{ `${tag.slice(0, 20)}...` }}
                    </a-tag>
                  </a-tooltip>
                  <a-tag v-else closable @close="item_handleClose(tag, item)">
                    {{ tag }}
                  </a-tag>
                </template>
                <a-input
                  v-if="item.item_inputVisible"
                  ref="item_inputRef"
                  type="text"
                  size="small"
                  :style="{ width: '78px' }"
                  v-model:value="item.item_inputValue"
                  @blur="item_handleInputConfirm(item)"
                  @keyup.enter="item_handleInputConfirm(item)"
                />
                <a-tag
                  v-else
                  @click="item_showInput(item)"
                  style="background: #fff; border-style: dashed"
                >
                  <plus-outlined />
                  新增奖励物品说明
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
import { useStore } from "vuex";
import RewardStore from "@/store/modules/RewardStore";

//卡片渲染
const cards = ref({
  quests: [],
});

const store = useStore();

watch(cards, (newCards) => {
  console.log(newCards);
  store.dispatch("setCards", newCards);
});

//物品奖励

//基础数据
let yaml = ref("'1':  \n");

const addform = ref({
  taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
  type: "command",
  commands: [],
  name: "",
  lore_addon: [],
  items: [
    {
      material: "",
      name: "",
      amount: 1,
      glow: true,
      lore: [],
      item_inputVisible: false,
      item_inputValue: "",
    },
  ],
});

//物品说明
const item_inputRef = ref();

const item_state = reactive({
  item_tags: [],
  item_inputVisible: false,
  item_inputValue: "",
});

const item_handleClose = (removedTag, item) => {
  item.lore = item.lore.filter((item_tag) => item_tag !== removedTag);
};

const item_showInput = (item) => {
  item.item_inputVisible = true;
  item_inputRef.value = "";
  nextTick(() => {});
};

const item_handleInputConfirm = (item) => {
  const item_inputValue = item.item_inputValue;
  let item_tags = item.lore;
  if (item_inputValue && item_tags.indexOf(item_inputValue) === -1) {
    item_tags = [...item_tags, item_inputValue];
  }
  Object.assign(item, {
    item_tags,
    item_inputVisible: false,
    item_inputValue: "",
  });
  item.lore = item_tags;
};

//指令说明
const command_inputRef = ref();

const command_state = reactive({
  command_tags: [],
  command_inputVisible: false,
  command_inputValue: "",
});

const command_handleClose = (removedTag) => {
  const command_tags = command_state.command_tags.filter(
    (command_tag) => command_tag !== removedTag
  );
  command_state.command_tags = command_tags;
  addform.value.command_addon = command_state.command_tags;
};

const command_showInput = () => {
  command_state.command_inputVisible = true;
  nextTick(() => {
    command_inputRef.value.focus();
  });
};

const command_handleInputConfirm = () => {
  const command_inputValue = command_state.command_inputValue;
  let command_tags = command_state.command_tags;
  if (command_inputValue && command_tags.indexOf(command_inputValue) === -1) {
    command_tags = [...command_tags, command_inputValue];
  }
  Object.assign(command_state, {
    command_tags,
    command_inputVisible: false,
    command_inputValue: "",
  });
  addform.value.commands = command_tags;
};

//奖励说明
const lore_inputRef = ref();

const lore_state = reactive({
  lore_tags: [],
  lore_inputVisible: false,
  lore_inputValue: "",
});

const lore_handleClose = (removedTag) => {
  const lore_tags = lore_state.lore_tags.filter((lore_tag) => lore_tag !== removedTag);
  lore_state.lore_tags = lore_tags;
  addform.value.lore_addon = lore_state.lore_tags;
};

const lore_showInput = () => {
  lore_state.lore_inputVisible = true;
  nextTick(() => {
    lore_inputRef.value.focus();
  });
};

const lore_handleInputConfirm = () => {
  const lore_inputValue = lore_state.lore_inputValue;
  console.log(lore_inputValue);
  let lore_tags = lore_state.lore_tags;
  if (lore_inputValue && lore_tags.indexOf(lore_inputValue) === -1) {
    lore_tags = [...lore_tags, lore_inputValue];
  }
  Object.assign(lore_state, {
    lore_tags,
    lore_inputVisible: false,
    lore_inputValue: "",
  });
  addform.value.lore_addon = lore_tags;
};

const radioStyle = reactive({
  display: "block",
  height: "30px",
  lineHeight: "30px",
});

//卡片功能
const removeItem = (item) => {
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
  addform.value.lore_addon = lore_state.lore_tags;
  lore_state.lore_tags = item.lore_addon;
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
    addform.value.items = [];
  } else if (value == 2) {
    addform.value.commands = [];
    command_state.command_tags = [];
  }
};

//抽屉开关
const open = ref(false);

//打开抽屉
const add = () => {
  addform.value.taskId =
    cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1;
  addform.value.commands = [];
  command_state.command_tags = [];
  open.value = true;
};
//保存内容
const save = () => {
  if (cards.value.quests[addform.value.taskId - 1] !== undefined) {
    cards.value.quests[addform.value.taskId - 1] = addform.value;
  } else {
    cards.value.quests.push(addform.value);
  }

  lore_state.lore_tags = [];
  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    type: "command",
    commands: [],
    name: "",
    lore_addon: [],
    items: [
      {
        material: "",
        name: "",
        amount: 1,
        glow: true,
        lore: [],
        item_inputVisible: false,
        item_inputValue: "",
      },
    ],
  };

  handleYml();
  open.value = false;
};
//抽屉开关方法
const onClose = () => {
  lore_state.lore_tags = [];
  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    type: "command",
    commands: [],
    name: "",
    lore_addon: [],
    items: [
      {
        material: "",
        name: "",
        amount: 1,
        glow: true,
        lore: [],
        item_inputVisible: false,
        item_inputValue: "",
      },
    ],
  };
  open.value = false;
};

//代码预览
const handleYml = () => {
  //处理yml
  let quests = {};

  for (let v = 0; v < cards.value.quests.length; v++) {
    let quest = cards.value.quests[v];
    let items = {};

    for (let i = 0; i < quest.items.length; i++) {
      let item = quest.items[i];
      items[i + 1] = {
        material: item.material,
        amount: item.amount,
        name: item.name,
        lore: item.lore,
        glow: item.glow,
      };
    }

    quests[quest.taskId] = {
      type: quest.type,
      lore_addon: quest.lore_addon,
      items: items,
    };
  }

  let yamlString = jsYaml.dump(quests, { noRefs: true });
  yaml.value = yamlString.replace("|", "").replace(/^\s+|\s+$/g, "");
};

//监听内容更新
onUpdated(() => {
  store.dispatch("RewardStore/setCards", cards.value);
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
