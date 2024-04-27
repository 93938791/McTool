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
              <a-button>任务类型</a-button>
            </a-popover>
            <a-popover trigger="hover">
              <template #content>
                <p>{{ item.variable }}</p>
              </template>
              <a-button>验证条件</a-button>
            </a-popover>
            <a-popover trigger="hover">
              <template #content>
                <p>{{ item.required_progress }}</p>
              </template>
              <a-button>需要进度</a-button>
            </a-popover>
            <a-popover trigger="hover">
              <template #content>
                <p>{{ item.points }}</p>
              </template>
              <a-button>奖励进度点</a-button>
            </a-popover>
            <a-popover trigger="hover">
              <template #content>
                <p>展示道具: {{ item.item.material }}</p>
                <p>道具名称: {{ item.item.name }}</p>
                <p>道具说明:</p>
                <p v-for="lore in item.item.lore">{{ lore }}</p>
              </template>
              <a-button>任务展示配置</a-button>
            </a-popover>
          </div>
        </a-card>
      </div>
    </div>

    <div class="preview">
      <pre><code class="language-yaml line-numbers">{{ yaml }}</code></pre>
    </div>
    <a-drawer :width="800" title="每周任务设置" :open="open" @close="onClose">
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
        <a-button type="primary" @click="save()">保存</a-button>
      </template>
      <a-form :model="addform">
        <a-form-item label="任务id">
          <a-tag color="green">{{ addform.taskId }}</a-tag></a-form-item
        >
        <a-form-item label="任务类型">
          <a-tree-select
            allowClear
            v-model:value="addform.type"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择"
            tree-default-expand-all
          >
            <template v-slot="{ key, value }">
              <span style="color: #08c">{{ value }}</span>
            </template>
          </a-tree-select>
        </a-form-item>
        <a-form-item label="验证条件">
          <a-radio-group defaultValue v-model:value="variableValue">
            <a-radio :style="radioStyle" :value="1">无需验证</a-radio>
            <a-radio :style="radioStyle" :value="4">
              自定义
              <a-input
                v-model:value="addform.variable"
                v-if="variableValue === 4"
                style="width: 400px; margin-left: 10px"
              />
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="任务名称">
          <a-input v-model:value="addform.name" style="width: 400px; margin-left: 10px" />
        </a-form-item>

        <a-form-item label="需要进度">
          <a-input-number
            id="required_progress"
            v-model:value="addform.required_progress"
            :min="1"
          />
        </a-form-item>

        <a-form-item label="奖励进度点">
          <a-input-number id="points" v-model:value="addform.points" :min="1" />
        </a-form-item>

        <a-card title="任务展示配置" style="width: 500px">
          <template #extra></template>
          <a-form-item label="展示道具(会迭代成选择框)">
            <a-input
              v-model:value="addform.item.material"
              style="width: 200px; margin-left: 10px"
            />
          </a-form-item>
          <a-form-item label="道具名称">
            <a-input
              v-model:value="addform.item.name"
              style="width: 200px; margin-left: 10px"
            />
          </a-form-item>
          <a-form-item label="道具说明">
            <template v-for="(tag, index) in state.tags" :key="tag">
              <a-tooltip v-if="tag.length > 20" :title="tag">
                <a-tag :closable="index !== 0" @close="handleClose(tag)">
                  {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
              </a-tooltip>
              <a-tag v-else closable @close="handleClose(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <a-input
              v-if="state.inputVisible"
              ref="inputRef"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              v-model:value="state.inputValue"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            />
            <a-tag
              v-else
              @click="showInput"
              style="background: #fff; border-style: dashed"
            >
              <plus-outlined />
              新增说明
            </a-tag>
          </a-form-item>
        </a-card>
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
  state.tags = item.item.lore;
  addform.value = item;
  open.value = true;
};

const copy = (item) => {
  let newItem = { ...item }; // 创建一个新的对象并复制原始对象的属性
  newItem.taskId = cards.value.quests.length + 1;
  cards.value.quests.push(newItem);
  handleYml();
};

const inputRef = ref();
const state = reactive({
  tags: [],
  inputVisible: false,
  inputValue: "",
});

const handleClose = (removedTag) => {
  const tags = state.tags.filter((tag) => tag !== removedTag);
  state.tags = tags;
  addform.value.item.lore = state.tags;
};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: "",
  });
  addform.value.item.lore = tags;
};

const variableValue = ref(1);
const radioStyle = reactive({
  display: "block",
  height: "30px",
  lineHeight: "30px",
});
//任务类型树
const treeData = [
  {
    title: "插件自带任务",
    value: "0-0",
    key: "0-0",
    selectable: false,
    children: [
      {
        title: "破坏方块",
        value: "block-break",
        key: "block-break",
      },
      {
        title: "放置方块",
        value: "block-place",
        key: "block-place",
      },
      {
        title: "放置水桶",
        value: "bucket-place",
        key: "bucket-place",
      },
      {
        title: "在聊天中说些什么",
        value: "chat",
        key: "chat",
      },
      {
        title: "在聊天中说些什么，但去掉了颜色代码（自 v3.0.6 起）",
        value: "chat-stripped",
        key: "chat-stripped",
      },
      {
        title: "右键单击任何内容",
        value: "right-click",
        key: "right-click",
      },
      {
        title: "左键单击任何内容",
        value: "left-click",
        key: "left-click",
      },
      {
        title: "右键单击一个方块",
        value: "right-click-block",
        key: "right-click-block",
      },
      {
        title: "左键单击一个方块块",
        value: "left-click-block",
        key: "left-click-block",
      },
      {
        title: "消耗消耗品",
        value: "consume",
        key: "consume",
      },
      {
        title: "制作物品",
        value: "craft",
        key: "craft",
      },
      {
        title: " 对玩家造成伤害",
        value: "damage-player",
        key: "damage-player",
      },
      {
        title: "使用附魔台为物品附魔",
        value: "enchant",
        key: "enchant",
      },
      {
        title: "使用铁砧为物品附魔（自 v3.10 起）",
        value: "enchant-anvil",
        key: "enchant-anvil",
      },
      {
        title: "使用附魔台或铁砧为物品附魔（自 v3.10 起）",
        value: "enchant-all",
        key: "enchant-all",
      },
      {
        title: "在聊天中执行命令",
        value: "execute-command",
        key: "execute-command",
      },
      {
        title: "钓鱼",
        value: "fish",
        key: "fish",
      },
      {
        title: "积累经验",
        value: "gain-experience ",
        key: "gain-experience ",
      },
      {
        title: "损坏物品，例如镐、剑",
        value: "item-break",
        key: "item-break",
      },
      {
        title: "飞翔",
        value: "fly",
        key: "fly",
      },
      {
        title: "滑翔",
        value: "glide",
        key: "glide",
      },
      {
        title: "潜行",
        value: "sneak",
        key: "sneak",
      },
      {
        title: "奔跑",
        value: "sprint",
        key: "sprint",
      },
      {
        title: "游泳",
        value: "swim",
        key: "swim",
      },
      {
        title: "玩家移动（方块）",
        value: "move",
        key: "move",
      },
      {
        title: " 杀死怪物（对AdvancedSpawners小怪使用advancedspawners_kill）",
        value: "kill-mob ",
        key: "kill-mob ",
      },
      {
        title: "杀死玩家",
        value: "kill-player",
        key: "kill-player",
      },
      {
        title: "登录游戏",
        value: "login",
        key: "login",
      },
      {
        title: "挤牛奶",
        value: "milk",
        key: "milk",
      },
      {
        title: "游玩时间（时间以秒为单位。 必须在 settings.yml 中启用（自 v3.10 起））",
        value: "playtime",
        key: "playtime",
      },
      {
        title: "当玩家投掷任何射弹（鸡蛋、雪球等）时。（自 v3.10 起）",
        value: "throw-projectile",
        key: "throw-projectile",
      },
      {
        title: "恢复生命值",
        value: "regenerate",
        key: "regenerate",
      },
      {
        title: "骑乘动物",
        value: "ride-mob",
        key: "ride-mob",
      },
      {
        title: "剪羊毛",
        value: "shear",
        key: "shear",
      },
      {
        title: "冶炼矿石",
        value: "smelt",
        key: "smelt",
      },
      {
        title: "驯服宠物（豹猫/狼）",
        value: "tame",
        key: "tame",
      },
      {
        title: "提取蜂蜜",
        value: "honey-extract",
        key: "honey-extract",
      },
      {
        title: "用剪刀获取蜜脾",
        value: "honey-comb-extract",
        key: "honey-comb-extract",
      },
      {
        title: "繁殖",
        value: "breed",
        key: "breed",
      },
      {
        title: "酿造药水",
        value: "brew",
        key: "brew",
      },
    ],
  },
  {
    title: "其他插件支持在后面添加",
    selectable: false,
    value: "0-1",
    key: "0-1",
  },
];
//抽屉开关
const open = ref(false);

const handleYml = () => {
  //处理yml

  let yamlString = "quests: \n";

  for (let v = 0; v < cards.value.quests.length; v++) {
    yamlString += "  " + cards.value.quests[v].taskId + ":\n";
    yamlString += "    type: " + cards.value.quests[v].type + "\n";
    yamlString += "    variable: " + cards.value.quests[v].variable + "\n";
    yamlString += "    name: " + cards.value.quests[v].name + "\n";
    yamlString +=
      "    required-progress: " + cards.value.quests[v].requiredProgress + "\n";
    yamlString += "    points: " + cards.value.quests[v].points + "\n";
    yamlString += "    item:\n";
    yamlString += "      material: " + cards.value.quests[v].item.material + "\n";
    yamlString += "      name: " + cards.value.quests[v].item.name + "\n";
    yamlString += "      lore:\n";
    for (let i = 0; i < cards.value.quests[v].item.lore.length; i++) {
      yamlString += "      - " + cards.value.quests[v].item.lore[i] + "\n";
    }
  }
  yaml.value = jsYaml
    .dump(yamlString, { noRefs: true })
    .replace("|", "")
    .replace(/^\s+|\s+$/g, "");
};

const save = () => {
  if (cards.value.quests[addform.value.taskId - 1] !== undefined) {
    cards.value.quests[addform.value.taskId - 1] = addform.value;
  } else {
    let task = {
      taskId: addform.value.taskId,
      type: addform.value.type,
      variable: addform.value.variable,
      name: addform.value.name,
      required_progress: addform.value.required_progress,
      points: addform.value.points,
      item: {
        material: addform.value.item.material,
        name: addform.value.item.name,
        lore: addform.value.item.lore,
      },
    };

    cards.value.quests.push(task);
  }

  state.tags = [];
  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    type: "",
    variable: "none",
    name: "",
    required_progress: "",
    points: "",
    item: {
      material: "",
      name: "",
      lore: [],
    },
  };

  handleYml();
  open.value = false;
};
//抽屉开关方法
const onClose = () => {
  state.tags = [];
  addform.value = {
    taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
    type: "",
    variable: "none",
    name: "",
    required_progress: "",
    points: "",
    item: {
      material: "",
      name: "",
      lore: [],
    },
  };
  open.value = false;
};
const value = ref();
watch(value, () => {});
//监听内容更新
onUpdated(() => {
  Prism.highlightAll(); //修改内容后重新渲染
});
onMounted(() => {
  Prism.highlightAll(); //切换菜单重新渲染
});
//卡片渲染
const cards = ref({
  quests: [],
});
//打开抽屉
const add = () => {
  addform.value.taskId =
    cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1;
  open.value = true;
};
//yaml内容
let yaml = ref("quests:  \n");

const addform = ref({
  taskId: cards.value.quests.length == 0 ? 1 : cards.value.quests.length + 1,
  type: "",
  variable: "none",
  name: "",
  required_progress: "",
  points: "",
  item: {
    material: "",
    name: "",
    lore: [],
  },
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
