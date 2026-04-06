import { defineStore } from "pinia";
import { ref } from "vue";

export type AlertType = "success" | "error" | "info" | "warning";

export const useAlertStore = defineStore("alert", () => {
  const message = ref<string | null>(null);
  const type = ref<AlertType>("success");
  const visible = ref(false);

  const show = (newMessage: string, newType: AlertType = "success") => {
    message.value = newMessage;
    type.value = newType;
    visible.value = true;
  };

  const success = (msg: string) => show(msg, "success");

  const error = (msg: string, err?: unknown) => {
    show(msg, "error");
    if (err) console.error(err);
  };

  const clear = () => {
    message.value = null;
    visible.value = false;
  };

  return {
    message,
    type,
    visible,
    success,
    error,
    clear
  };
});