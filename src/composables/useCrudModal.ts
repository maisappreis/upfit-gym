import { ref, computed, shallowRef, type Ref, type ComputedRef } from "vue";

export type CrudMode = "create" | "update" | "delete" | null;

export type CrudModal<T> = {
  mode: Ref<CrudMode>;
  entity: Ref<T | null>;
  deleteIsBlocked: Ref<boolean>;
  isOpen: ComputedRef<boolean>;
  isForm: ComputedRef<boolean>;
  isDelete: ComputedRef<boolean>;
  openCreate: () => void;
  openUpdate: (data: T) => void;
  openDelete: (data: T, blocked?: boolean) => void;
  close: () => void;
};

export function useCrudModal<T>() {
  const mode = ref<CrudMode>(null);
  const entity = shallowRef<T | null>(null);
  const deleteIsBlocked = ref<boolean>(false);

  const isOpen = computed(() => mode.value !== null);
  const isForm = computed(() => mode.value === "create" || mode.value === "update");
  const isDelete = computed(() => mode.value === "delete");
  
  const openCreate = () => {
    mode.value = "create";
    entity.value = null;
  };

  const openUpdate = (data: T) => {
    mode.value = "update";
    entity.value = data;
  };

  const openDelete = (data: T, blocked: boolean = false) => {
    mode.value = "delete";
    entity.value = data;
    deleteIsBlocked.value = blocked;
  };

  const close = () => {
    mode.value = null;
    entity.value = null;
    deleteIsBlocked.value = false;
  };

  return {
    mode,
    entity,
    deleteIsBlocked,
    isOpen,
    isForm,
    isDelete,
    openCreate,
    openUpdate,
    openDelete,
    close
  };
};
