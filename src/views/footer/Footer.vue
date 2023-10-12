<template>
  <div class="footer">
    <div class="copyright">版权所有 © 首创环保集团</div>
  </div>
</template>

<script>
export default {
  name: "LayoutFooter",
};
</script>

<style   scoped>
.links {
  margin-bottom: 8px;
}

.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  padding-left: 20px;
}
</style>
