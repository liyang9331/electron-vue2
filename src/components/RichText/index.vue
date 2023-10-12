<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="htmlValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  name: "RichText",
  components: { Editor, Toolbar },
  props: {
    // 初始值
    initHtml: String,
    // ........
    placeholder: {
      type: String,
      default: "请输入内容",
    },
  },
  data() {
    return {
      editor: null,
      htmlValue: "",
      toolbarConfig: {
        excludeKeys: [
          "todo",
          "ondo",
          "insertLink",
          "insertTable",
          "deleteTable",
          "insertTableRow",
          "deleteTableRow",
          "insertTableCol",
          "deleteTableCol",
          "tableHeader",
          "tableFullWidth",
          "blockquote",
          "fontFamily",
          "code",
          "codeBlock",
          "codeSelectLang",
          "numberedList",
        ],
      },
      editorConfig: { placeholder: this.placeholder, readOnly: false },
      mode: "default", // or 'simple'
    };
  },
  //   watch: {
  //     // 将外部页面赋的值传递到组件area中
  //     initHtml(value) {
  //       console.log(value);
  //       this.htmlValue = value;
  //     },
  //   },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      // 输入框内值发生变化时需要向外传值
      this.$emit("change", this.htmlValue);
    },
  },
  created() {
    this.htmlValue = this.initHtml;
  },
  mounted() {},
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style lang="scss" scoped>
</style>