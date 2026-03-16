import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { ref, computed } from "vue";
import CustomersModal from "@/app/customer/CustomersModal.vue";
import type { Customer } from "@/types/customer";

vi.mock("@/stores/loading", () => ({
  useLoadingStore: () => ({
    isLoading: false,
  }),
}));

vi.mock("@/utils/dataUtils", () => ({
  capitalize: (v: string) => v.charAt(0).toUpperCase() + v.slice(1),
}));

vi.mock("@/components/ModalCard.vue", () => ({
  default: {
    name: "ModalCard",
    props: ["modelValue"],
    template: "<div><slot name='header'></slot><slot></slot><slot name='footer'></slot></div>",
  },
}));

vi.mock("@/components/BaseButton.vue", () => ({
  default: {
    name: "BaseButton",
    template: "<button @click='$emit(\"click\")'><slot /></button>",
  },
}));

vi.mock("@/app/customer/CustomersForm.vue", () => ({
  default: {
    name: "CustomersForm",
    template: "<div class='customers-form'></div>",
    data() {
      return { isValid: true };
    },
  },
}));

const createModalCrud = (
  mode: "create" | "update" | "delete",
  blocked = false
) => {
  const isOpen = ref(true);
  const isDelete = ref(mode === "delete");

  return {
    isOpen: computed(() => isOpen.value),
    isForm: computed(() => !isDelete.value),
    isDelete: computed(() => isDelete.value),
    deleteIsBlocked: ref(blocked),
    mode: ref(mode),
    entity: ref<Customer | null>({
      id: 2,
      name: "joao",
      frequency: "1x",
      start: "2024-01-01",
      plan: "Mensal",
      value: 100,
      status: "Ativo",
      notes: "Teste",
    }),
    openCreate: vi.fn(),
    openUpdate: vi.fn(),
    openDelete: vi.fn(),
    close: vi.fn(),
  };
};

// const createModalCrud = (
//   mode: "create" | "update" | "delete",
//   blocked = false
// ) => ({
//   isOpen: ref(true),
//   isForm: ref(true),
//   isDelete: ref(mode === "delete"),
//   deleteIsBlocked: ref(blocked),
//   mode: ref(mode),
//   entity: ref<Customer | null>({
//     id: 2,
//     name: "joao",
//     frequency: "1x",
//     start: "2024-01-01",
//     plan: "Mensal",
//     value: 100,
//     status: "Ativo",
//     notes: "Teste",
//   }),
//   openCreate: vi.fn(),
//   openUpdate: vi.fn(),
//   openDelete: vi.fn(),
//   close: vi.fn(),
// });

describe("CustomersModal.vue", () => {
  let wrapper: any;

  const factory = (mode: "create" | "update" | "delete", blocked = false) => {
    return mount(CustomersModal, {
      props: {
        modalCrud: createModalCrud(mode, blocked),
        customerForm: {
          name: 'joao',
          frequency: '1x',
          start: '2024-01-01',
          plan: 'Mensal',
          value: 100,
          status: 'Ativo',
          notes: 'Teste'
        },
      },
    });
  };

  it("renders create form when mode is create", () => {
    wrapper = factory("create");

    expect(wrapper.find(".customers-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Adicionar Cliente");
  });

  it("renders update form when mode is update", () => {
    wrapper = factory("update");

    expect(wrapper.find(".customers-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Atualizar Cliente");
  });

  it("renders delete confirmation message", () => {
    wrapper = factory("delete");

    expect(wrapper.text()).toContain("Tem certeza que deseja excluir o cliente");
  });

  it("renders blocked delete message", () => {
    wrapper = factory("delete", true);

    expect(wrapper.text()).toContain("Não é possível excluir o cliente");
  });

  it("emits delete-customer when confirm delete is clicked", async () => {
    wrapper = factory("delete");

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("delete-customer")).toBeTruthy();
  });

  it("emits inactive-customer when delete is blocked", async () => {
    wrapper = factory("delete", true);

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("inactive-customer")).toBeTruthy();
  });

  it("emits create-customer with formatted payload", async () => {
    wrapper = factory("create");

    wrapper.vm.formRef = { isValid: true };

    await wrapper.vm.submitForm();

    const payload = wrapper.emitted("create-customer")[0][0];

    expect(payload.name).toBe("Joao");
  });

  it("emits update-customer when mode is update", async () => {
    wrapper = factory("update");

    wrapper.vm.formRef = { isValid: true };

    await wrapper.vm.submitForm();

    expect(wrapper.emitted("update-customer")).toBeTruthy();
  });

  it("emits close-modal when cancel button is clicked", async () => {
    wrapper = factory("create");

    const buttons = wrapper.findAll("button");
    await buttons[buttons.length - 1].trigger("click");

    expect(wrapper.emitted("close-modal")).toBeTruthy();
  });
});