import { ref, computed, shallowRef } from "vue";

export type CrudMode = "create" | "update" | "delete" | null;

export function useCrudModal<T>() {
  const mode = ref<CrudMode>(null);
  const entity = shallowRef<T | null>(null);
  const deleteBlocked = ref<boolean>(false);

  const isOpen = computed(() => mode.value !== null);
  const isForm = computed(() => mode.value === 'create' || mode.value === 'update');
  const isDelete = computed(() => mode.value === 'delete');
  
  const openCreate = () => {
    mode.value = 'create';
    entity.value = null;
  };

  const openUpdate = (data: T) => {
    mode.value = 'update';
    entity.value = data;
  };

  const openDelete = (data: T, blocked: boolean) => {
    mode.value = 'delete';
    entity.value = data;
    deleteBlocked.value = blocked;
  };

  const close = () => {
    mode.value = null;
    entity.value = null;
    deleteBlocked.value = false;
  };

  return {
    mode,
    entity,
    deleteBlocked,
    isOpen,
    isForm,
    isDelete,
    openCreate,
    openUpdate,
    openDelete,
    close
  };
};
