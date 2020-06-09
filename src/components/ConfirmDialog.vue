<template>
  <q-dialog v-model="open" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ title }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('common.ok')"
          color="negative"
          @click="
            callBack();
            open = false;
          "
        />
        <q-btn
          flat
          :label="$t('common.cancel')"
          color="primary"
          @click="open = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    dialogOpen: Boolean,
    title: String,
    callBack: Function,
  },
  computed: {
    open: {
      get() {
        return this.dialogOpen;
      },
      set(state) {
        this.$emit("update:dialogOpen", state);
      },
    },
  },
};
</script>

<style scoped></style>
